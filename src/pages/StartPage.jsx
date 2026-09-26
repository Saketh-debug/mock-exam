import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import FooterLogos from '../components/FooterLogos';
import ThemeToggle from '../components/ThemeToggle';

const examRules = [
    { num: '01', title: 'Stay in fullscreen', desc: 'Keep the exam in fullscreen mode. Do not minimize or resize the browser.', type: 'required' },
    { num: '02', title: 'Stay on the exam', desc: 'Do not switch tabs, windows, or applications during the exam.', type: 'required' },
    { num: '03', title: 'Submission is final', desc: 'Once submitted, your answers cannot be changed.', type: 'required' },
    { num: '04', title: 'Navigate freely', desc: 'You can move between questions and change your answers at any time.', type: 'note' },
    { num: '05', title: 'Submit when finished', desc: 'Submit your exam once you have answered all the questions you want to attempt.', type: 'note' },
    { num: '06', title: 'Auto-submit on timeout', desc: 'Your exam will be submitted automatically when the timer reaches zero.', type: 'note' },
    { num: '07', title: 'No negative marking', desc: 'Unanswered questions simply score zero. There is no penalty for incorrect answers — attempt every question!', type: 'note' },
];

const badgeConfig = {
    required: { badgeClass: 'student-badge-coral', borderColor: 'var(--s-accent-coral)' },
    note: { badgeClass: 'student-badge-orange', borderColor: 'var(--s-accent-orange)' },
};

export default function StartPage() {
    const navigate = useNavigate();

    async function handleStartExam() {
        // Request fullscreen
        try {
            if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
        } catch (fsErr) {
            console.warn('Fullscreen request skipped or blocked:', fsErr);
        }
        // Initialize exam session
        sessionStorage.setItem('mockExamSession', JSON.stringify({
            startedAt: Date.now(),
            answers: {},
            marks: {},
        }));
        navigate('/exam');
    }

    return (
        <div className="min-h-screen student-page flex flex-col font-sans relative overflow-x-hidden student-grid">

            {/* ═══ Ambient Background Glow ═══ */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-32 left-1/4 w-[30rem] h-[30rem] rounded-full blur-3xl transition-all duration-700"
                    style={{ background: 'var(--s-orb-1)', opacity: 'var(--s-orb-opacity-1)' }} />
                <div className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] rounded-full blur-3xl transition-all duration-700"
                    style={{ background: 'var(--s-orb-3)', opacity: 'var(--s-orb-opacity-3)' }} />
                <div className="absolute -bottom-32 left-10 w-96 h-96 rounded-full blur-3xl transition-all duration-700"
                    style={{ background: 'var(--s-orb-2)', opacity: 'var(--s-orb-opacity-2)' }} />
            </div>

            {/* ═══ Header ═══ */}
            <header className="w-full border-b px-6 sm:px-12 py-4 sticky top-0 z-30 shadow-lg student-header"
                style={{ borderColor: 'var(--s-border)', backgroundColor: 'var(--s-bg-header)' }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-bold tracking-widest px-3 py-2 bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white rounded-lg flex items-center gap-2"
                            style={{ boxShadow: 'var(--s-shadow-glow-coral)' }}>
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            <span>AAC</span>
                        </span>
                        <div className="hidden sm:block">
                            <div className="text-sm font-bold tracking-wide student-text-heading">Entrance Examination</div>
                            <div className="text-[11px] font-mono uppercase tracking-wider student-text-secondary">Mock Demo • 2026</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <ThemeToggle />
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 student-btn-secondary">
                            <span>←</span><span>Back to Home</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ═══ Title Section ═══ */}
            <div className="max-w-6xl mx-auto w-full px-6 sm:px-12 pt-8 pb-4 relative z-10">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight student-text-heading">Before you begin</h1>
                    <p className="text-sm sm:text-base mt-2.5 max-w-xl mx-auto leading-relaxed student-text-secondary">
                        Please review the examination rules below, then click <strong className="student-text-heading">Start Exam</strong> to begin.
                    </p>
                </div>
            </div>

            {/* ═══ Main Content ═══ */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-6 pb-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

                    {/* ── Left Column: Rules List ── */}
                    <div className="lg:col-span-6 space-y-3.5">
                        <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--s-border)' }}>
                            <h2 className="text-lg font-bold uppercase tracking-wider font-mono flex items-center gap-2.5 student-text-heading">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--s-accent-gold)', boxShadow: '0 0 10px var(--s-accent-gold)' }} />
                                <span>Examination Rules ({examRules.length})</span>
                            </h2>
                        </div>

                        {examRules.map((rule) => {
                            const cfg = badgeConfig[rule.type] || badgeConfig.note;
                            return (
                                <div key={rule.num}
                                    className={`flex items-start gap-4 p-4 sm:p-5 rounded-xl border-l-4 shadow-md transition-colors duration-150 student-card`}
                                    style={{ borderLeftColor: cfg.borderColor }}>
                                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-mono font-extrabold text-base shrink-0 select-none ${cfg.badgeClass}`}>
                                        {rule.num}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-bold leading-snug mb-1 student-text-heading">{rule.title}</h3>
                                            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border student-badge-teal">{rule.type}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed student-text-secondary">{rule.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Right Column: Start Exam Card ── */}
                    <div className="lg:col-span-6 lg:self-center flex flex-col items-center justify-center w-full">
                        <div className="rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden student-card w-full max-w-[480px] mx-auto"
                            style={{ border: `1px solid var(--s-border-hover)` }}>
                            {/* Top decorative gradient bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5"
                                style={{ background: `linear-gradient(to right, var(--s-accent-coral), var(--s-accent-orange), var(--s-accent-teal))` }} />

                            <div className="text-center mb-7">
                                <span className="inline-block px-4 py-1 rounded-full text-xs font-mono font-bold tracking-[0.2em] uppercase mb-3 border student-badge-teal">
                                    MOCK DEMO
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight student-text-heading">Ready to Begin?</h2>
                                <p className="text-sm mt-1.5 student-text-secondary">
                                    Click the button below to enter fullscreen and start the mock exam.
                                </p>
                            </div>

                            {/* Info card */}
                            <div className="mb-6 p-4 rounded-2xl student-card">
                                <div className="grid grid-cols-3 gap-4 text-center text-xs font-mono">
                                    <div>
                                        <div className="text-2xl font-extrabold" style={{ color: 'var(--s-accent-coral)' }}>30</div>
                                        <div className="student-text-secondary mt-0.5">Questions</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-extrabold" style={{ color: 'var(--s-accent-teal)' }}>60</div>
                                        <div className="student-text-secondary mt-0.5">Minutes</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-extrabold" style={{ color: 'var(--s-accent-gold)' }}>0</div>
                                        <div className="student-text-secondary mt-0.5">Neg. Marks</div>
                                    </div>
                                </div>
                            </div>

                            {/* Rules Agreement Note */}
                            <div className="p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 student-card student-text-secondary mb-6">
                                <span className="font-bold text-base" style={{ color: 'var(--s-accent-gold)' }}>ℹ</span>
                                <span>
                                    By clicking <strong className="student-text-heading">Start Exam</strong>, you agree to the examination rules and proctoring requirements.
                                </span>
                            </div>

                            {/* ── START EXAM BUTTON ── */}
                            <button
                                onClick={handleStartExam}
                                id="start-exam-btn"
                                className="w-full py-4 text-white font-bold text-base sm:text-lg uppercase tracking-widest rounded-xl transition-colors duration-150 flex items-center justify-center space-x-3 cursor-pointer select-none student-btn-primary shadow-lg"
                            >
                                <span>Start Exam</span>
                                <span className="inline-flex items-center justify-center w-7 h-7 bg-white/20 rounded-md text-sm font-mono">→</span>
                            </button>

                            <div className="mt-6 pt-4 border-t text-center text-xs space-y-1 student-text-secondary" style={{ borderColor: 'var(--s-border)' }}>
                                <div>Fullscreen mode is required for this exam.</div>
                                <div className="font-mono text-[10px]">Advanced Academic Center • GRIET</div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* ═══ Footer ═══ */}
            <footer className="w-full border-t px-6 py-4 relative z-10 student-footer">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                    <div>AAC First Year Examination Portal • Mock Demo • 2026</div>
                    <FooterLogos />
                </div>
            </footer>
        </div>
    );
}
