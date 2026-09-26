import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import FooterLogos from '../components/FooterLogos';
import ThemeToggle from '../components/ThemeToggle';

// ── Animation Variants ──
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
};
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: (i = 0) => ({
        opacity: 1, scale: 1,
        transition: { delay: i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
};

function AnimatedCounter({ target, duration = 1.2, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const increment = target / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else { setCount(Math.floor(start)); }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [isInView, target, duration]);
    return <span ref={ref}>{count}{suffix}</span>;
}

function FloatingShapes() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute w-[32rem] h-[32rem] rounded-full blur-3xl transition-all duration-700"
                style={{ background: 'var(--s-orb-1)', opacity: 'var(--s-orb-opacity-1)', top: '-10%', left: '15%' }} />
            <div className="absolute w-[28rem] h-[28rem] rounded-full blur-3xl transition-all duration-700"
                style={{ background: 'var(--s-orb-2)', opacity: 'var(--s-orb-opacity-2)', bottom: '10%', left: '-5%' }} />
            <div className="absolute w-[30rem] h-[30rem] rounded-full blur-3xl transition-all duration-700"
                style={{ background: 'var(--s-orb-3)', opacity: 'var(--s-orb-opacity-3)', top: '35%', right: '-8%' }} />
            <div className="absolute w-72 h-72 rounded-full blur-3xl transition-all duration-700"
                style={{ background: 'var(--s-orb-4)', opacity: 'var(--s-orb-opacity-4)', bottom: '30%', right: '25%' }} />
        </div>
    );
}

const subjects = [
    { name: 'Mathematics', questions: 15, icon: '∑' },
    { name: 'Aptitude', questions: 10, icon: '◈' },
    { name: 'English', questions: 5, icon: 'Aa' },
    { name: 'C Basics', questions: 3, icon: '</>' },  // updated count from question paper
];
// Note: 15 Math is split across Q4–Q15 (12) + Q1–Q3 (3 C Basics) +  Q16–Q25 (10 Apt) + Q26–Q30 (5 Eng) = 30 total

const subjectStyles = [
    { colorVar: '--s-accent-coral', bgClass: 'student-badge-coral' },
    { colorVar: '--s-accent-teal', bgClass: 'student-badge-teal' },
    { colorVar: '--s-accent-gold', bgClass: 'student-badge-gold' },
    { colorVar: '--s-accent-orange', bgClass: 'student-badge-orange' },
];

const examDetails = [
    { num: '01', title: 'Format', desc: 'Multiple-choice questions with one correct answer.' },
    { num: '02', title: 'Duration', desc: 'You have 60 minutes to complete the exam.' },
    { num: '03', title: 'Navigation', desc: 'Move freely between all questions and change your answers at any time.' },
    { num: '04', title: 'Marking', desc: '1 mark for each correct answer. No negative marking.' },
    { num: '05', title: 'Submission', desc: 'Submit when you are finished. The exam will be submitted automatically when time runs out.' },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const structureRef = useRef(null);
    const detailsRef = useRef(null);
    const structureInView = useInView(structureRef, { once: true, margin: '-80px' });
    const detailsInView = useInView(detailsRef, { once: true, margin: '-80px' });

    return (
        <div className="min-h-screen student-page flex flex-col font-sans relative overflow-x-hidden student-grid">
            <FloatingShapes />

            {/* ═══ Sticky Header ═══ */}
            <header className="w-full border-b student-header sticky top-0 z-30 px-6 sm:px-12 py-3.5 shadow-lg"
                    style={{ borderColor: 'var(--s-border)', backgroundColor: 'var(--s-bg-header)' }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="font-mono text-[11px] font-bold tracking-widest px-3 py-1.5 bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white rounded-md flex items-center gap-2"
                              style={{ boxShadow: 'var(--s-shadow-glow-coral)' }}>
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            <span>AAC</span>
                        </span>
                        <span className="hidden sm:inline-block text-[11px] font-mono tracking-wider uppercase font-semibold student-text-secondary">
                            Entrance Test Portal
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="text-[11px] font-mono tracking-widest uppercase flex items-center space-x-3 font-medium student-text-secondary">
                            <span className="student-text-heading font-bold">First Year</span>
                            <span style={{ color: 'var(--s-border)' }}>•</span>
                            <span className="px-2.5 py-0.5 font-bold rounded-md border student-badge-teal">2026</span>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* ═══ Main Content ═══ */}
            <main className="max-w-6xl mx-auto w-full px-6 sm:px-12 py-12 sm:py-20 flex-1 flex flex-col relative z-10">

                {/* ── Demo Notice Banner ── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 px-5 py-3 rounded-xl border flex items-center gap-3 student-badge-gold"
                >
                    <span className="text-lg">🎯</span>
                    <div className="text-sm font-medium student-text-heading">
                        <span className="font-bold">Mock Demo</span>
                        <span className="student-text-secondary font-normal"> — Practice the exam interface before your actual test. Your answers here won't be recorded.</span>
                    </div>
                </motion.div>

                {/* ── Hero Section ── */}
                <motion.div className="text-center mb-20" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={fadeUp} custom={0} className="mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono font-bold tracking-[0.15em] uppercase shadow-md student-card"
                              style={{ color: 'var(--s-accent-gold)' }}>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--s-accent-teal)' }} />
                            FIRST YEAR EXAMINATION · 2026
                        </span>
                    </motion.div>

                    <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-extrabold tracking-tight leading-[1.05] mb-2 student-text-heading">
                        Welcome to
                    </motion.h1>
                    <motion.h1 variants={fadeUp} custom={2} className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-extrabold tracking-tight leading-[1.05] mb-6">
                        <span style={{ color: 'var(--s-accent-coral)' }}>AAC</span>{' '}
                        <span className="student-text-heading">Entrance Test</span>
                    </motion.h1>

                    <motion.div variants={fadeUp} custom={3} className="flex justify-center mb-8">
                        <div className="h-[3px] w-28 rounded-full"
                             style={{ background: `linear-gradient(to right, var(--s-accent-coral), var(--s-accent-orange), var(--s-accent-teal))` }} />
                    </motion.div>

                    <motion.p variants={fadeUp} custom={4} className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-normal student-text-secondary">
                        Your entrance assessment for the First Year programme. Please review the exam details before you begin.
                    </motion.p>

                    {/* Stat Pills */}
                    <motion.div variants={fadeUp} custom={5} className="flex flex-wrap justify-center items-center gap-4 mt-10">
                        {[
                            { label: 'Questions', value: 30, colorVar: '--s-accent-coral' },
                            { label: 'Minutes', value: 60, colorVar: '--s-accent-teal' },
                            { label: 'Neg. Marking', value: null, display: 'No', colorVar: '--s-accent-gold' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex items-center space-x-3 px-5 py-3 rounded-lg shadow-md student-card">
                                <span className="text-2xl font-editorial font-extrabold" style={{ color: `var(${stat.colorVar})` }}>
                                    {stat.value !== null ? <AnimatedCounter target={stat.value} /> : stat.display}
                                </span>
                                <span className="text-xs font-mono font-bold uppercase tracking-wider student-text-secondary">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Hero CTA */}
                    <motion.div variants={fadeUp} custom={6} className="mt-10 flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => navigate('/start')}
                            className="px-8 py-4 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors duration-150 cursor-pointer flex items-center space-x-3 select-none student-btn-primary"
                        >
                            <span>ENTER EXAMINATION</span>
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-white/20 rounded text-sm">→</span>
                        </button>
                        <button
                            onClick={() => { document.getElementById('exam-structure')?.scrollIntoView({ behavior: 'smooth' }); }}
                            className="px-7 py-4 font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-colors duration-150 cursor-pointer select-none student-btn-secondary"
                        >
                            View Exam Details
                        </button>
                    </motion.div>
                </motion.div>

                {/* ── Exam Structure Section ── */}
                <section id="exam-structure" ref={structureRef} className="mb-20">
                    <motion.div initial="hidden" animate={structureInView ? 'visible' : 'hidden'} variants={staggerContainer}>
                        <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
                            <span className="inline-block px-3 py-1 border text-[10px] font-mono font-bold rounded-full tracking-[0.2em] uppercase mb-3 student-badge-coral">
                                EXAM BLUEPRINT
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-editorial font-extrabold tracking-tight student-text-heading">Exam Structure</h2>
                            <p className="text-sm mt-2 max-w-md mx-auto student-text-secondary">30 questions spread across 4 subjects — all MCQ, single correct answer.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {subjects.map((subj, idx) => {
                                const style = subjectStyles[idx];
                                return (
                                    <motion.div key={subj.name} variants={scaleIn} custom={idx}
                                        className="relative rounded-xl p-6 shadow-md transition-colors duration-200 overflow-hidden cursor-default student-card">
                                        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: `var(${style.colorVar})` }} />
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-mono font-bold mb-4 border ${style.bgClass}`}>
                                            {subj.icon}
                                        </div>
                                        <h3 className="font-editorial font-bold text-base mb-1 student-text-heading">{subj.name}</h3>
                                        <div className="flex items-baseline space-x-1">
                                            <span className="text-2xl font-editorial font-extrabold" style={{ color: `var(${style.colorVar})` }}>{subj.questions}</span>
                                            <span className="text-xs font-mono uppercase tracking-wider student-text-secondary">questions</span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </section>

                {/* ── Exam Details Timeline ── */}
                <section id="exam-details" ref={detailsRef} className="mb-16">
                    <motion.div initial="hidden" animate={detailsInView ? 'visible' : 'hidden'} variants={staggerContainer}>
                        <motion.div variants={fadeUp} custom={0} className="text-center sm:text-left mb-10">
                            <h2 className="text-3xl sm:text-4xl font-editorial font-extrabold tracking-tight student-text-heading">Exam Pattern</h2>
                        </motion.div>
                        <div className="relative">
                            <div className="absolute left-[19px] sm:left-[23px] top-0 bottom-0 w-[2px] rounded-full"
                                 style={{ background: `linear-gradient(to bottom, var(--s-accent-coral), var(--s-accent-orange), var(--s-accent-teal))` }} />
                            <div className="space-y-4">
                                {examDetails.map((item, idx) => (
                                    <motion.div key={item.num} variants={fadeUp} custom={idx + 1} className="flex items-start gap-5 sm:gap-6">
                                        <div className="relative z-10 shrink-0">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-md flex items-center justify-center font-mono font-bold text-xs student-card"
                                                 style={{ color: 'var(--s-accent-gold)' }}>
                                                {item.num}
                                            </div>
                                        </div>
                                        <div className="flex-1 rounded-xl p-5 shadow-md student-card">
                                            <h3 className="font-editorial font-bold text-sm uppercase tracking-wide mb-1 student-text-heading">{item.title}</h3>
                                            <p className="text-sm leading-relaxed student-text-secondary">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ── Enter Exam CTA ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.5 }} className="text-center py-10">
                    <button
                        onClick={() => navigate('/start')}
                        className="px-10 py-5 text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-colors duration-150 cursor-pointer inline-flex items-center space-x-3 select-none student-btn-primary"
                    >
                        <span>CONTINUE TO EXAM</span>
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-white/20 rounded-md text-sm font-mono">→</span>
                    </button>
                    <p className="text-xs mt-3 font-mono student-text-secondary">
                        This is a mock demo — your answers won't be saved or graded externally.
                    </p>
                </motion.div>
            </main>

            {/* ═══ Footer ═══ */}
            <footer className="w-full border-t px-6 sm:px-12 py-5 student-footer">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                    <div className="flex items-center space-x-3">
                        <span className="font-bold student-text-heading">AAC ENTRANCE TEST</span>
                        <span style={{ color: 'var(--s-border)' }}>•</span>
                        <span>Mock Demo</span>
                        <span style={{ color: 'var(--s-border)' }}>•</span>
                        <span>© 2026</span>
                    </div>
                    <div className="flex items-center space-x-3"><FooterLogos /></div>
                </div>
            </footer>
        </div>
    );
}
