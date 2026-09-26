import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS, ANSWER_KEY } from '../data/questions';
import useTabSwitchProctoring from '../hooks/useTabSwitchProctoring';
import FooterLogos from '../components/FooterLogos';
import ThemeToggle from '../components/ThemeToggle';

const EXAM_DURATION_SEC = 60 * 60; // 60 minutes

// ── Subject ordering ──
const SUBJECT_PRIORITY = { Mathematics: 1, Aptitude: 2, English: 3, 'C Basics': 4 };
const organizeQuestions = (qs) => [...qs].sort((a, b) => (SUBJECT_PRIORITY[a.subject] || 5) - (SUBJECT_PRIORITY[b.subject] || 5));
const normalizeOptionKey = (key) => typeof key === 'string' ? key.trim().toUpperCase() : key;

// ── 5-State Question Status ──
const getQuestionStatus = (qId, answers, marks, visited) => {
    const isAnswered = Boolean(answers[qId]);
    const isMarked = Boolean(marks[qId]);
    const isVisited = visited.has(qId);
    if (isAnswered && isMarked) return 'answered_marked';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    if (isVisited) return 'not_answered';
    return 'not_visited';
};

const getStatusTileClasses = (status, isCurrent) => {
    let classes = '';
    if (status === 'answered_marked') classes = 'bg-[#7e22ce] text-white border-[#c084fc] font-bold shadow-sm';
    else if (status === 'marked') classes = 'bg-[#7e22ce] text-white border-[#a855f7]/60 font-bold shadow-sm';
    else if (status === 'answered') classes = 'bg-[#15803d] text-white border-[#22c55e]/50 font-bold shadow-sm';
    else if (status === 'not_answered') classes = 'bg-[#b91c1c] text-white border-[#ef4444]/60 font-bold shadow-sm';
    else classes = 'bg-[#162932]/80 text-[#9CB6BF] border-[rgba(42,157,143,0.2)] hover:bg-[#264653] hover:text-white font-medium';
    if (isCurrent) classes += ' ring-2 ring-[#F4A261] ring-offset-2 ring-offset-[#122027] font-black scale-[1.04] z-10';
    return classes;
};

function QuestionStatusLegend({ summary }) {
    return (
        <div className="pt-3.5 mt-3 border-t border-[rgba(42,157,143,0.3)] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white">
                <span className="font-extrabold text-[#E9C46A]">Status Breakdown</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    {summary.evaluated} / {summary.total} Evaluated
                </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="flex items-center space-x-2.5 bg-[#122027]/90 p-2.5 rounded-xl border border-[rgba(42,157,143,0.3)] shadow-sm">
                    <span className="w-7 h-7 rounded-lg bg-[#15803d] border border-[#22c55e]/60 text-white font-black flex items-center justify-center text-xs shrink-0">{summary.answered}</span>
                    <span className="text-white text-xs font-bold">Answered</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-[#122027]/90 p-2.5 rounded-xl border border-[rgba(42,157,143,0.3)] shadow-sm">
                    <span className="w-7 h-7 rounded-lg bg-[#b91c1c] border border-[#ef4444]/70 text-white font-black flex items-center justify-center text-xs shrink-0">{summary.notAnswered}</span>
                    <span className="text-white text-xs font-bold">Not Answered</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-[#122027]/90 p-2.5 rounded-xl border border-[rgba(42,157,143,0.3)] shadow-sm">
                    <span className="w-7 h-7 rounded-lg bg-[#7e22ce] border border-[#a855f7]/70 text-white font-black flex items-center justify-center text-xs shrink-0">{summary.marked}</span>
                    <span className="text-white text-xs font-bold">Marked</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-[#122027]/90 p-2.5 rounded-xl border border-[rgba(42,157,143,0.3)] shadow-sm">
                    <span className="w-7 h-7 rounded-lg bg-[#7e22ce] border border-[#c084fc] text-white font-black flex items-center justify-center text-xs shrink-0 relative">
                        {summary.answeredMarked}
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-white font-black border border-[#122027]">✓</span>
                    </span>
                    <span className="text-white text-xs font-bold">Ans & Marked</span>
                </div>
                <div className="col-span-2 flex items-center space-x-2.5 bg-[#122027]/90 p-2.5 rounded-xl border border-[rgba(42,157,143,0.3)] shadow-sm">
                    <span className="w-7 h-7 rounded-lg bg-[#162932] border border-[rgba(42,157,143,0.3)] text-[#9CB6BF] font-mono flex items-center justify-center text-xs font-black shrink-0">{summary.notVisited}</span>
                    <span className="text-white text-xs font-bold">Not Visited</span>
                </div>
            </div>
        </div>
    );
}

// Render question text with simple formatting (newlines, code blocks)
function QuestionText({ text }) {
    if (!text) return null;
    // Convert code blocks
    const parts = text.split(/```[\w]*\n?([\s\S]*?)```/g);
    return (
        <div className="text-lg sm:text-[20px] text-white font-normal leading-[1.7] mb-8 whitespace-pre-wrap">
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <pre key={i} className="bg-[#0E1A20] border border-[rgba(42,157,143,0.3)] rounded-xl p-4 my-4 font-mono text-sm text-[#2A9D8F] overflow-x-auto whitespace-pre">
                        {part}
                    </pre>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </div>
    );
}

export default function ExamPage() {
    const navigate = useNavigate();

    // Guard: must have a session
    useEffect(() => {
        const session = sessionStorage.getItem('mockExamSession');
        if (!session) {
            navigate('/start');
        }
    }, [navigate]);

    const questions = useMemo(() => organizeQuestions(QUESTIONS), []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [marks, setMarks] = useState({});
    const [visited, setVisited] = useState(() => new Set([questions[0]?.id]));
    const [timeRemaining, setTimeRemaining] = useState(() => {
        try {
            const s = JSON.parse(sessionStorage.getItem('mockExamSession') || '{}');
            if (s.startedAt) {
                const elapsed = Math.floor((Date.now() - s.startedAt) / 1000);
                return Math.max(0, EXAM_DURATION_SEC - elapsed);
            }
        } catch { }
        return EXAM_DURATION_SEC;
    });
    const [showMobileDrawer, setShowMobileDrawer] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const timerRef = useRef(null);
    const isExpiredRef = useRef(false);

    const currentQ = questions[currentIndex];

    // Track visited
    useEffect(() => {
        if (currentQ?.id) {
            setVisited(prev => {
                if (prev.has(currentQ.id)) return prev;
                const next = new Set(prev);
                next.add(currentQ.id);
                return next;
            });
        }
    }, [currentIndex, currentQ?.id]);

    // Timer countdown
    useEffect(() => {
        if (isSubmitted) return;
        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    if (!isExpiredRef.current) {
                        isExpiredRef.current = true;
                        handleFinalSubmit();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [isSubmitted]);

    const timerDisplay = useMemo(() => {
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, [timeRemaining]);

    const isWarning = timeRemaining <= 600 && timeRemaining > 300;
    const isCritical = timeRemaining <= 300;

    const summary = useMemo(() => {
        let answered = 0, notAnswered = 0, marked = 0, answeredMarked = 0, notVisited = 0;
        questions.forEach(q => {
            const status = getQuestionStatus(q.id, answers, marks, visited);
            if (status === 'answered') answered++;
            else if (status === 'not_answered') notAnswered++;
            else if (status === 'marked') marked++;
            else if (status === 'answered_marked') answeredMarked++;
            else notVisited++;
        });
        return { answered, notAnswered, marked, answeredMarked, notVisited, total: questions.length, evaluated: answered + answeredMarked, unanswered: notAnswered + marked + notVisited };
    }, [questions, answers, marks, visited]);

    function handleSelectOption(optKey) {
        if (isSubmitted || !currentQ) return;
        const normalizedOptionKey = normalizeOptionKey(optKey);
        const current = answers[currentQ.id];
        setAnswers(prev => ({ ...prev, [currentQ.id]: current === normalizedOptionKey ? null : normalizedOptionKey }));
    }

    function handleToggleMark() {
        if (isSubmitted || !currentQ) return;
        setMarks(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
    }

    function handleFinalSubmit() {
        if (isSubmitted) return;
        clearInterval(timerRef.current);
        cleanupProctoring();
        // Compute score
        let score = 0;
        questions.forEach(q => {
            if (answers[q.id] && normalizeOptionKey(answers[q.id]) === normalizeOptionKey(ANSWER_KEY[q.id])) score++;
        });
        sessionStorage.setItem('mockExamResult', JSON.stringify({ answers, score, total: questions.length }));
        setIsSubmitted(true);
        setShowSubmitModal(false);
        // Exit fullscreen
        try { if (document.fullscreenElement) document.exitFullscreen(); } catch (_) { }
        setTimeout(() => navigate('/results'), 500);
    }

    // Keyboard navigation
    useEffect(() => {
        if (isSubmitted || showSubmitModal) return;
        function handleKeyDown(e) {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
            const key = e.key.toUpperCase();
            if (currentQ?.options && Object.keys(currentQ.options).includes(key)) {
                e.preventDefault();
                handleSelectOption(key);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setCurrentIndex(prev => Math.max(0, prev - 1));
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
            } else if (key === 'M') {
                e.preventDefault();
                handleToggleMark();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSubmitted, showSubmitModal, currentQ, answers, marks, questions.length]);

    // Proctoring
    const {
        showWarning, warningTitle, warningMessage, warningButtonText,
        warningAction, violationCount, maxViolations, isViolation, cleanupProctoring,
    } = useTabSwitchProctoring({
        examEnded: isSubmitted,
        // No onDisqualify — this is a mock demo. Students ALWAYS keep their progress.
        // Tab switches show a warning overlay but never redirect or clear the exam.
    });

    return (
        <div className="min-h-screen bg-[#122027] text-white flex flex-col font-sans selection:bg-[#E76F51] selection:text-white select-none relative bg-tech-grid student-page">

            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 left-1/4 w-[30rem] h-[30rem] bg-[#264653]/35 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-20 w-[28rem] h-[28rem] bg-[#E76F51]/12 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-[#2A9D8F]/20 rounded-full blur-3xl" />
            </div>

            {/* ── Proctoring Warning Overlay ── */}
            <AnimatePresence>
                {showWarning && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
                        <div className={`bg-[#1B313B] border-2 rounded-2xl max-w-md w-full p-8 shadow-2xl text-center space-y-5 relative overflow-hidden ${isViolation ? 'border-[#E76F51]' : 'border-[#E9C46A]'}`}>
                            <div className={`absolute top-0 left-0 right-0 h-1 ${isViolation ? 'bg-[#E76F51]' : 'bg-[#E9C46A]'}`} />
                            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-mono font-bold text-2xl ${isViolation ? 'bg-[#E76F51]/20 text-[#E76F51]' : 'bg-[#E9C46A]/20 text-[#E9C46A]'}`}>⚠</div>
                            <h2 className="text-2xl font-bold text-white">{warningTitle}</h2>
                            <p className="text-sm text-[#9CB6BF] leading-relaxed">{warningMessage}</p>
                            {isViolation && violationCount > 0 && (
                                <div className="inline-block px-4 py-2 bg-[#E76F51]/15 border border-[#E76F51]/30 rounded-lg text-sm font-mono text-[#E76F51] font-bold">
                                    Violations: {violationCount}
                                </div>
                            )}
                            <button onClick={warningAction}
                                className="w-full py-4 bg-[#E76F51] hover:bg-[#F4A261] text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-colors duration-150 cursor-pointer shadow-lg">
                                {warningButtonText}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Sticky Header ── */}
            <header className="sticky top-0 z-30 bg-[#162932] border-b border-[rgba(42,157,143,0.25)] px-4 sm:px-8 py-2.5 sm:py-3 shadow-lg">
                {/* Desktop */}
                <div className="hidden sm:flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                        <img src="/aac.webp" alt="AAC" className="h-9 w-9 rounded-full object-contain bg-white p-0.5 shadow-sm ring-1 ring-white/20 shrink-0" />
                        <div className="hidden md:block">
                            <div className="text-xs font-bold text-white tracking-wide uppercase font-mono">AAC Mock Demo</div>
                            <div className="text-[10px] text-[#9CB6BF] font-mono">First Year Entrance • 2026</div>
                        </div>
                        <ThemeToggle className="hidden md:flex" />
                    </div>
                    <div className="font-mono text-xs font-bold tracking-wider text-white uppercase px-3 py-1.5 bg-[#1B313B] rounded-lg border border-[rgba(42,157,143,0.3)]">
                        Question <span className="text-[#E9C46A] font-extrabold">{currentIndex + 1}</span> <span className="text-[#9CB6BF] font-normal">of {summary.total}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className={`flex flex-col items-end px-4 py-1.5 rounded-lg border transition-colors duration-300 ${isCritical ? 'bg-[#E76F51]/20 border-[#E76F51]/50 text-[#E76F51] animate-pulse-critical' : isWarning ? 'bg-[#E9C46A]/20 border-[#E9C46A]/50 text-[#E9C46A]' : 'bg-[#1B313B] border-[rgba(42,157,143,0.3)] text-white'}`}>
                            <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-[#9CB6BF]">Time Left</span>
                            <span className="font-mono font-extrabold text-base sm:text-lg leading-tight">{timerDisplay}</span>
                        </div>
                        <button onClick={() => setShowMobileDrawer(!showMobileDrawer)}
                            className="xl:hidden px-3 py-2 rounded-lg bg-[#1B313B] border border-[rgba(42,157,143,0.3)] text-white text-xs font-mono font-bold hover:bg-[#264653] transition cursor-pointer">
                            Grid
                        </button>
                        <button onClick={() => setShowSubmitModal(true)}
                            className="hidden sm:inline-flex px-5 py-2 bg-[#E76F51] hover:bg-[#F4A261] text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-colors duration-150 cursor-pointer">
                            Submit Exam
                        </button>
                    </div>
                </div>

                {/* Mobile */}
                <div className="sm:hidden flex flex-col space-y-2.5 w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                            <img src="/aac.webp" alt="AAC" className="h-8 w-8 rounded-full object-contain bg-white p-0.5 ring-1 ring-white/20 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-xs font-mono font-bold text-white uppercase">AAC Mock Demo</span>
                                <span className="text-[10px] text-[#9CB6BF] font-mono">First Year • 2026</span>
                            </div>
                        </div>
                        <button onClick={() => setShowMobileDrawer(!showMobileDrawer)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#1B313B] border border-[rgba(42,157,143,0.35)] text-white text-xs font-mono font-bold transition cursor-pointer flex items-center space-x-1.5">
                            <span>▦</span><span>Grid</span>
                        </button>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-[rgba(42,157,143,0.15)]">
                        <div className="font-mono text-xs font-bold tracking-wider text-white uppercase px-2.5 py-1 bg-[#1B313B] rounded-lg border border-[rgba(42,157,143,0.3)]">
                            Q <span className="text-[#E9C46A]">{currentIndex + 1}</span> / {summary.total}
                        </div>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg border transition-colors duration-300 ${isCritical ? 'bg-[#E76F51]/20 border-[#E76F51]/50 text-[#E76F51]' : isWarning ? 'bg-[#E9C46A]/20 border-[#E9C46A]/50 text-[#E9C46A]' : 'bg-[#1B313B] border-[rgba(42,157,143,0.3)] text-white'}`}>
                            <span className="text-[9px] font-mono font-bold text-[#9CB6BF]">Time:</span>
                            <span className="font-mono font-extrabold text-sm">{timerDisplay}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Exam Grid ── */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 pb-10 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start relative z-10">

                {/* ── Left: Question Card ── */}
                <main className="xl:col-span-8 flex flex-col space-y-4">
                    <AnimatePresence mode="wait">
                        {currentQ ? (
                            <div key={currentQ.id}
                                className="bg-[#1B313B] border border-[rgba(42,157,143,0.3)] rounded-2xl p-6 sm:p-9 shadow-2xl flex flex-col justify-between min-h-[500px]">
                                <div>
                                    {/* Question Header */}
                                    <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 mb-6 border-b border-[rgba(42,157,143,0.25)]">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl sm:text-2xl font-extrabold text-white">Q{currentIndex + 1}</span>
                                            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border"
                                                style={{ background: 'rgba(42,157,143,0.1)', color: '#2A9D8F', borderColor: 'rgba(42,157,143,0.35)' }}>
                                                {currentQ.subject}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-xs font-mono">
                                            <span className="px-2.5 py-1 bg-[#162932] border border-[rgba(42,157,143,0.25)] rounded-md text-[#9CB6BF] font-semibold">
                                                +1 / 0
                                            </span>
                                            {marks[currentQ.id] && (
                                                <span className="px-2.5 py-1 rounded-md bg-[#E9C46A]/20 text-[#E9C46A] border border-[#E9C46A]/50 font-bold">
                                                    ★ Marked
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Question Body */}
                                    <QuestionText text={currentQ.text} />

                                    {currentQ.imageUrl && (
                                        <figure className="mb-8 overflow-hidden rounded-xl border border-[rgba(42,157,143,0.35)] bg-white p-2">
                                            <img
                                                src={currentQ.imageUrl}
                                                alt={currentQ.imageAlt || `Diagram for question ${currentIndex + 1}`}
                                                className="mx-auto max-h-[420px] w-auto max-w-full rounded-lg object-contain"
                                            />
                                        </figure>
                                    )}

                                    {/* MCQ Options */}
                                    <div className="space-y-3">
                                        {Object.entries(currentQ.options).map(([optKey, optText]) => {
                                            const isSelected = answers[currentQ.id] === optKey;
                                            return (
                                                <button key={optKey} type="button"
                                                    onClick={() => handleSelectOption(optKey)}
                                                    className={`w-full min-h-[58px] p-4 rounded-xl border-2 transition-colors duration-150 flex items-start space-x-3.5 cursor-pointer text-left ${isSelected
                                                        ? 'bg-[#2A9D8F]/20 border-[#2A9D8F] text-white shadow-[0_0_15px_rgba(42,157,143,0.25)]'
                                                        : 'bg-[#122027]/70 border-[rgba(42,157,143,0.2)] text-[#9CB6BF] hover:bg-[#162932] hover:border-[rgba(42,157,143,0.4)]'}`}>
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5 border-2 transition-colors duration-150 ${isSelected ? 'bg-[#2A9D8F] text-white border-[#2A9D8F]' : 'border-[rgba(42,157,143,0.3)] bg-[#1B313B] text-[#9CB6BF]'}`}>
                                                        {optKey}
                                                    </div>
                                                    <div className="flex-1 text-base leading-relaxed text-white whitespace-pre-wrap">{optText}</div>
                                                    {isSelected && (
                                                        <span className="w-6 h-6 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center font-bold text-xs font-mono mt-0.5 shrink-0">✓</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Desktop Nav Buttons */}
                                    <div className="hidden sm:flex mt-6 pt-5 border-t border-[rgba(42,157,143,0.25)] flex-wrap items-center justify-between gap-3">
                                        <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0}
                                            id="exam-prev-btn"
                                            className="px-5 py-2.5 rounded-xl border border-[rgba(42,157,143,0.3)] bg-[#122027] hover:bg-[#264653] text-sm font-bold text-white uppercase tracking-wider transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2 select-none">
                                            <span>←</span><span>Previous</span>
                                        </button>
                                        <button onClick={handleToggleMark} id="exam-mark-btn"
                                            className={`px-4 sm:px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer flex items-center space-x-2 select-none ${marks[currentQ?.id] ? 'bg-[#7e22ce]/30 text-[#c084fc] border-[#a855f7]/70 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'bg-[#122027] border-[rgba(42,157,143,0.3)] text-[#9CB6BF] hover:bg-[#264653] hover:text-white'}`}>
                                            <span>{marks[currentQ?.id] ? '★ Marked' : '☆ Mark for Review'}</span>
                                        </button>
                                        <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentIndex === questions.length - 1}
                                            id="exam-next-btn"
                                            className="px-6 sm:px-7 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#F4A261] text-white text-sm font-bold uppercase tracking-wider transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2 shadow-[0_0_20px_rgba(231,111,81,0.35)] select-none">
                                            <span>Next</span><span>→</span>
                                        </button>
                                    </div>

                                    {/* Mobile: Mark + Clear */}
                                    <div className="sm:hidden mt-5 pt-4 border-t border-[rgba(42,157,143,0.25)] flex items-center justify-between gap-2">
                                        <button onClick={handleToggleMark} id="mobile-mark-btn"
                                            className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer flex items-center justify-center space-x-1.5 select-none ${marks[currentQ?.id] ? 'bg-[#7e22ce]/30 text-[#c084fc] border-[#a855f7]/70' : 'bg-[#122027] border-[rgba(42,157,143,0.3)] text-[#9CB6BF]'}`}>
                                            <span>{marks[currentQ?.id] ? '★ Marked' : '☆ Mark for Review'}</span>
                                        </button>
                                        {answers[currentQ?.id] && (
                                            <button onClick={() => handleSelectOption(answers[currentQ?.id])}
                                                className="py-2.5 px-3 rounded-xl border border-red-500/30 bg-red-950/30 text-red-300 text-xs font-mono font-bold cursor-pointer">
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </AnimatePresence>

                    {/* Mobile Primary Nav */}
                    <div className="sm:hidden flex flex-col gap-2.5 mt-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0}
                                id="mobile-prev-btn"
                                className="py-3.5 px-4 rounded-xl border border-[rgba(42,157,143,0.35)] bg-[#1B313B] active:bg-[#264653] text-white text-base font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg disabled:opacity-30 cursor-pointer">
                                <span>←</span><span>Previous</span>
                            </button>
                            <button onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentIndex === questions.length - 1}
                                id="mobile-next-btn"
                                className="py-3.5 px-4 rounded-xl bg-[#E76F51] active:bg-[#F4A261] text-white text-base font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(231,111,81,0.35)] disabled:opacity-30 cursor-pointer">
                                <span>Next</span><span>→</span>
                            </button>
                        </div>
                        <button onClick={() => setShowSubmitModal(true)}
                            id="mobile-submit-btn"
                            className="w-full py-2.5 px-4 rounded-xl bg-[#E76F51] active:bg-[#d65a3c] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 shadow-md transition-colors duration-150 cursor-pointer">
                            <span>Submit Examination</span>
                        </button>
                    </div>
                </main>

                {/* ── Right: Question Navigator Sidebar ── */}
                <aside className="hidden xl:flex xl:col-span-4 flex-col space-y-4">
                    <div className="bg-[#1B313B] border border-[rgba(42,157,143,0.3)] rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-baseline justify-between pb-3 mb-4 border-b border-[rgba(42,157,143,0.25)]">
                                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-widest">Navigator</h2>
                                <span className="text-sm font-mono text-[#E9C46A] font-bold">{summary.evaluated} / {summary.total} Evaluated</span>
                            </div>
                            <div className="max-h-[42vh] overflow-y-auto pr-1">
                                <div className="grid grid-cols-5 gap-2">
                                    {questions.map((q, index) => {
                                        const status = getQuestionStatus(q.id, answers, marks, visited);
                                        const isCurrent = index === currentIndex;
                                        return (
                                            <button key={q.id} onClick={() => setCurrentIndex(index)}
                                                className={`relative h-10 rounded-lg border text-xs sm:text-sm flex items-center justify-center font-mono transition-all duration-150 cursor-pointer ${getStatusTileClasses(status, isCurrent)}`}>
                                                <span>{(index + 1).toString().padStart(2, '0')}</span>
                                                {status === 'answered_marked' && (
                                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#15803d] text-white rounded-full flex items-center justify-center text-[9px] font-black border border-[#122027] pointer-events-none">✓</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <QuestionStatusLegend summary={summary} />
                        </div>
                        <div className="pt-4 mt-4 border-t border-[rgba(42,157,143,0.25)]">
                            <button onClick={() => setShowSubmitModal(true)}
                                className="w-full py-3.5 bg-[#E76F51] hover:bg-[#F4A261] text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-lg transition-colors duration-150 cursor-pointer flex items-center justify-center space-x-2">
                                <span>Submit Examination</span>
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Footer */}
            <footer className="w-full border-t border-[rgba(42,157,143,0.2)] bg-[#0E1A20] px-6 sm:px-12 py-4 relative z-10 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#9CB6BF]">
                    <div className="flex items-center space-x-3">
                        <span className="font-bold text-white">AAC ENTRANCE TEST</span>
                        <span className="text-[rgba(42,157,143,0.4)]">•</span>
                        <span>Mock Demo</span>
                        <span className="text-[rgba(42,157,143,0.4)]">•</span>
                        <span>© 2026</span>
                    </div>
                    <FooterLogos />
                </div>
            </footer>

            {/* ── Mobile Drawer ── */}
            <AnimatePresence>
                {showMobileDrawer && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="xl:hidden fixed inset-0 z-50 bg-black/90 flex flex-col justify-end">
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-[#1B313B] border-t border-[rgba(42,157,143,0.3)] rounded-t-2xl max-h-[88vh] flex flex-col p-5 sm:p-6 shadow-2xl">
                            <div className="flex items-center justify-between pb-3 border-b border-[rgba(42,157,143,0.25)]">
                                <div>
                                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Question Navigator</h3>
                                    <div className="text-xs font-mono text-[#E9C46A] mt-0.5">{summary.evaluated} / {summary.total} Evaluated</div>
                                </div>
                                <button onClick={() => setShowMobileDrawer(false)}
                                    className="px-3 py-1.5 text-xs font-mono border border-[rgba(42,157,143,0.3)] rounded-lg text-white font-bold hover:bg-[#264653] transition cursor-pointer">
                                    Close
                                </button>
                            </div>
                            <div className="overflow-y-auto py-3 max-h-[42vh] pr-1">
                                <div className="grid grid-cols-5 gap-2">
                                    {questions.map((q, index) => {
                                        const status = getQuestionStatus(q.id, answers, marks, visited);
                                        const isCurrent = index === currentIndex;
                                        return (
                                            <button key={q.id} onClick={() => { setCurrentIndex(index); setShowMobileDrawer(false); }}
                                                className={`relative h-11 rounded-lg border text-sm flex items-center justify-center font-mono transition-colors duration-150 cursor-pointer ${getStatusTileClasses(status, isCurrent)}`}>
                                                <span>{(index + 1).toString().padStart(2, '0')}</span>
                                                {status === 'answered_marked' && (
                                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#15803d] text-white rounded-full flex items-center justify-center text-[9px] font-black border border-[#122027] pointer-events-none">✓</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <QuestionStatusLegend summary={summary} />
                            <div className="pt-3 mt-1 border-t border-[rgba(42,157,143,0.25)]">
                                <button onClick={() => { setShowMobileDrawer(false); setShowSubmitModal(true); }}
                                    id="mobile-drawer-submit-btn"
                                    className="w-full py-3.5 bg-[#E76F51] hover:bg-[#F4A261] text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-lg transition-all duration-150 cursor-pointer flex items-center justify-center">
                                    Submit Examination
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Submit Confirmation Modal ── */}
            <AnimatePresence>
                {showSubmitModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#1B313B] border border-[rgba(42,157,143,0.35)] rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2A9D8F] via-[#E9C46A] to-[#E76F51]" />

                            <div>
                                <div className="inline-block px-3.5 py-1 bg-[#E76F51]/15 text-[#E76F51] border border-[#E76F51]/30 rounded-full text-xs font-mono font-bold tracking-[0.2em] uppercase mb-2">
                                    Final Confirmation
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Ready to Submit?</h3>
                            </div>

                            <div className="text-sm text-[#9CB6BF] leading-relaxed">
                                {summary.unanswered > 0 ? (
                                    <div>
                                        You have evaluated responses for <strong className="text-emerald-400">{summary.evaluated}</strong> of{' '}
                                        <strong className="text-white">{summary.total}</strong> questions.
                                        <div className="mt-1 text-[#E76F51] font-semibold font-mono text-xs">
                                            {summary.unanswered} questions will NOT be evaluated.
                                        </div>
                                    </div>
                                ) : (
                                    <div><strong className="text-emerald-400">{summary.total} / {summary.total}</strong> questions answered! All questions will be evaluated.</div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                                <div className="p-3 bg-[#15803d]/20 border border-[#22c55e]/40 rounded-xl">
                                    <span className="text-[10px] text-emerald-300 font-bold uppercase block">Answered</span>
                                    <div className="text-2xl font-extrabold text-emerald-400 mt-1">{summary.answered}</div>
                                </div>
                                <div className="p-3 bg-[#b91c1c]/15 border border-[#ef4444]/35 rounded-xl">
                                    <span className="text-[10px] text-red-300 font-bold uppercase block">Not Answered</span>
                                    <div className="text-2xl font-extrabold text-red-400 mt-1">{summary.notAnswered + summary.notVisited}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-2">
                                <button onClick={() => setShowSubmitModal(false)}
                                    className="px-5 py-2.5 bg-[#162932] hover:bg-[#264653] border border-[rgba(42,157,143,0.3)] text-sm font-bold uppercase tracking-wider text-[#9CB6BF] hover:text-white rounded-xl transition-colors duration-150 cursor-pointer">
                                    Go Back
                                </button>
                                <button onClick={handleFinalSubmit}
                                    className="px-6 py-2.5 bg-[#E76F51] hover:bg-[#F4A261] text-white text-sm font-bold uppercase tracking-widest rounded-xl shadow-lg transition-colors duration-150 cursor-pointer">
                                    Submit Exam
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
