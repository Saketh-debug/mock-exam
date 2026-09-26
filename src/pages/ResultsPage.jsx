import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QUESTIONS, ANSWER_KEY } from '../data/questions';
import FooterLogos from '../components/FooterLogos';

const SUBJECT_PRIORITY = { Mathematics: 1, Aptitude: 2, English: 3, 'C Basics': 4 };
const organizeQuestions = (qs) => [...qs].sort((a, b) => (SUBJECT_PRIORITY[a.subject] || 5) - (SUBJECT_PRIORITY[b.subject] || 5));

const SUBJECT_COLORS = {
    Mathematics: { text: 'text-[#E76F51]', bg: 'bg-[#E76F51]/15', border: 'border-[#E76F51]/30' },
    Aptitude: { text: 'text-[#2A9D8F]', bg: 'bg-[#2A9D8F]/15', border: 'border-[#2A9D8F]/30' },
    English: { text: 'text-[#E9C46A]', bg: 'bg-[#E9C46A]/15', border: 'border-[#E9C46A]/30' },
    'C Basics': { text: 'text-[#F4A261]', bg: 'bg-[#F4A261]/15', border: 'border-[#F4A261]/30' },
};

function getScoreColor(score, total) {
    const pct = (score / total) * 100;
    if (pct >= 80) return { ring: '#2A9D8F', glow: 'rgba(42,157,143,0.3)', label: 'Excellent!', labelColor: '#2A9D8F' };
    if (pct >= 60) return { ring: '#E9C46A', glow: 'rgba(233,196,106,0.3)', label: 'Good Job!', labelColor: '#E9C46A' };
    if (pct >= 40) return { ring: '#F4A261', glow: 'rgba(244,162,97,0.3)', label: 'Keep Practicing', labelColor: '#F4A261' };
    return { ring: '#E76F51', glow: 'rgba(231,111,81,0.3)', label: 'Keep Trying!', labelColor: '#E76F51' };
}

export default function ResultsPage() {
    const navigate = useNavigate();

    const result = useMemo(() => {
        try {
            return JSON.parse(sessionStorage.getItem('mockExamResult') || 'null');
        } catch { return null; }
    }, []);

    const questions = useMemo(() => organizeQuestions(QUESTIONS), []);

    if (!result) {
        return (
            <div className="min-h-screen bg-[#122027] flex items-center justify-center font-sans text-white">
                <div className="text-center space-y-4">
                    <div className="text-4xl">🔒</div>
                    <div className="text-xl font-bold">No exam result found.</div>
                    <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#E76F51] rounded-xl font-bold text-white cursor-pointer">
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const { answers, score, total } = result;
    const scoreInfo = getScoreColor(score, total);
    const pct = Math.round((score / total) * 100);

    // Subject-wise breakdown
    const subjectBreakdown = useMemo(() => {
        const map = {};
        questions.forEach(q => {
            if (!map[q.subject]) map[q.subject] = { total: 0, correct: 0, attempted: 0 };
            map[q.subject].total++;
            if (answers[q.id]) map[q.subject].attempted++;
            if (answers[q.id] === ANSWER_KEY[q.id]) map[q.subject].correct++;
        });
        return Object.entries(map).sort((a, b) => (SUBJECT_PRIORITY[a[0]] || 5) - (SUBJECT_PRIORITY[b[0]] || 5));
    }, [questions, answers]);

    return (
        <div className="min-h-screen bg-[#122027] text-white font-sans selection:bg-[#E76F51] selection:text-white bg-tech-grid student-page">

            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#2A9D8F]/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#E76F51]/15 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">

                {/* ── Score Hero Card ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="bg-[#1B313B] border border-[rgba(42,157,143,0.35)] rounded-2xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2A9D8F] via-[#E9C46A] to-[#E76F51]" />

                    {/* Checkmark */}
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                        style={{ background: `${scoreInfo.ring}20`, border: `2px solid ${scoreInfo.ring}40`, boxShadow: `0 0 30px ${scoreInfo.glow}` }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke={scoreInfo.ring} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3 border"
                        style={{ background: `${scoreInfo.ring}15`, color: scoreInfo.ring, borderColor: `${scoreInfo.ring}30` }}>
                        MOCK EXAM COMPLETE
                    </span>

                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">Your Results</h1>
                    <p className="text-[#9CB6BF] text-sm mb-8">AAC Entrance Test — Mock Demo • 2026</p>

                    {/* Score Display */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="text-7xl sm:text-8xl font-extrabold font-mono leading-none" style={{ color: scoreInfo.ring }}>
                            {score}
                        </div>
                        <div className="text-2xl font-bold text-[#9CB6BF] mt-1">/ {total}</div>
                        <div className="mt-3 text-lg font-bold" style={{ color: scoreInfo.labelColor }}>{scoreInfo.label}</div>
                        <div className="mt-1 text-sm text-[#9CB6BF]">{pct}% Score</div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
                        <div className="p-3 bg-[#15803d]/20 border border-[#22c55e]/30 rounded-xl text-center">
                            <div className="text-xl font-extrabold text-emerald-400">{score}</div>
                            <div className="text-[10px] text-emerald-300 font-mono uppercase mt-0.5">Correct</div>
                        </div>
                        <div className="p-3 bg-[#b91c1c]/15 border border-[#ef4444]/30 rounded-xl text-center">
                            <div className="text-xl font-extrabold text-red-400">{Object.keys(answers).filter(k => answers[k] && answers[k] !== ANSWER_KEY[parseInt(k)]).length}</div>
                            <div className="text-[10px] text-red-300 font-mono uppercase mt-0.5">Wrong</div>
                        </div>
                        <div className="p-3 bg-[#162932] border border-[rgba(42,157,143,0.25)] rounded-xl text-center">
                            <div className="text-xl font-extrabold text-[#9CB6BF]">{total - Object.keys(answers).filter(k => answers[k]).length}</div>
                            <div className="text-[10px] text-[#9CB6BF] font-mono uppercase mt-0.5">Skipped</div>
                        </div>
                    </div>

                    {/* Subject Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                        {subjectBreakdown.map(([subj, data]) => {
                            const cols = SUBJECT_COLORS[subj] || SUBJECT_COLORS.Mathematics;
                            return (
                                <div key={subj} className={`p-3 rounded-xl border ${cols.bg} ${cols.border} text-center`}>
                                    <div className={`text-xs font-mono font-bold uppercase mb-1 ${cols.text}`}>{subj}</div>
                                    <div className={`text-xl font-extrabold ${cols.text}`}>{data.correct}/{data.total}</div>
                                    <div className="text-[10px] text-[#9CB6BF] mt-0.5">{Math.round((data.correct / data.total) * 100)}%</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button onClick={() => navigate('/')}
                            className="px-8 py-3.5 bg-[#162932] hover:bg-[#264653] border border-[rgba(42,157,143,0.3)] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors duration-150 cursor-pointer">
                            ← Back to Home
                        </button>
                        <button onClick={() => {
                            sessionStorage.removeItem('mockExamResult');
                            sessionStorage.removeItem('mockExamSession');
                            sessionStorage.removeItem('mock_exam_violations');
                            navigate('/start');
                        }}
                            className="px-8 py-3.5 bg-[#E76F51] hover:bg-[#F4A261] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors duration-150 cursor-pointer shadow-[0_0_20px_rgba(231,111,81,0.35)]">
                            Retake Mock Exam →
                        </button>
                    </div>
                </motion.div>

                {/* ── Answer Key Table ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-[#1B313B] border border-[rgba(42,157,143,0.35)] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="px-6 sm:px-8 py-5 border-b border-[rgba(42,157,143,0.25)] flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white uppercase tracking-wide font-mono">Question-wise Answer Key</h2>
                            <p className="text-xs text-[#9CB6BF] mt-1">Review each question, your answer, and the correct answer</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold border text-[#2A9D8F] bg-[#2A9D8F]/10 border-[#2A9D8F]/30">
                            {total} Questions
                        </span>
                    </div>

                    <div className="divide-y divide-[rgba(42,157,143,0.15)]">
                        {questions.map((q, idx) => {
                            const userAns = answers[q.id];
                            const correctAns = ANSWER_KEY[q.id];
                            const isCorrect = userAns === correctAns;
                            const isSkipped = !userAns;
                            const cols = SUBJECT_COLORS[q.subject] || SUBJECT_COLORS.Mathematics;

                            return (
                                <div key={q.id} className={`px-5 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-start gap-4 transition-colors duration-150 ${isCorrect ? 'hover:bg-[#15803d]/5' : isSkipped ? 'hover:bg-[#162932]/50' : 'hover:bg-[#b91c1c]/5'}`}>
                                    {/* Q number + status icon */}
                                    <div className="flex items-center gap-3 sm:w-24 shrink-0">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${isCorrect ? 'bg-[#15803d] text-white' : isSkipped ? 'bg-[#162932] border border-[rgba(42,157,143,0.3)] text-[#9CB6BF]' : 'bg-[#b91c1c] text-white'}`}>
                                            {isCorrect ? '✓' : isSkipped ? '—' : '✗'}
                                        </div>
                                        <span className="text-sm font-bold text-[#9CB6BF] font-mono">Q{idx + 1}</span>
                                    </div>

                                    {/* Question text (truncated) */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold mb-2 ${cols.bg} ${cols.text} border ${cols.border}`}>
                                            {q.subject}
                                        </div>
                                        <p className="text-sm text-[#9CB6BF] leading-relaxed line-clamp-2 whitespace-pre-wrap">
                                            {q.text.replace(/```[\s\S]*?```/g, '[code]').split('\n')[0]}
                                        </p>
                                    </div>

                                    {/* Answer comparison */}
                                    <div className="flex items-center gap-3 sm:w-48 shrink-0">
                                        {/* Your answer */}
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] font-mono text-[#9CB6BF] uppercase mb-1">Your Ans</span>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-extrabold text-base border-2 ${userAns
                                                ? isCorrect
                                                    ? 'bg-[#15803d] border-[#22c55e] text-white'
                                                    : 'bg-[#b91c1c] border-[#ef4444] text-white'
                                                : 'bg-[#162932] border-[rgba(42,157,143,0.2)] text-[#9CB6BF]'
                                            }`}>
                                                {userAns || '—'}
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <span className="text-[#9CB6BF] font-mono text-sm">→</span>

                                        {/* Correct answer */}
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] font-mono text-emerald-400 uppercase mb-1">Correct</span>
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-extrabold text-base border-2 bg-[#15803d] border-[#22c55e] text-white shadow-[0_0_10px_rgba(21,128,61,0.4)]">
                                                {correctAns}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Result tag */}
                                    <div className="sm:w-20 shrink-0 flex sm:flex-col items-center justify-end">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase ${isCorrect ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30' : isSkipped ? 'bg-[#162932] text-[#9CB6BF] border border-[rgba(42,157,143,0.2)]' : 'bg-red-900/50 text-red-400 border border-red-500/30'}`}>
                                            {isCorrect ? '+1' : isSkipped ? '0' : '0'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Summary */}
                    <div className="px-6 sm:px-8 py-5 border-t border-[rgba(42,157,143,0.25)] bg-[#122027]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm font-mono text-[#9CB6BF]">
                            Total Score: <strong className="text-white text-base">{score} / {total}</strong>
                            <span className="ml-2 text-xs">({pct}%)</span>
                        </div>
                        <FooterLogos />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
