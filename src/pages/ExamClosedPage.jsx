import React from 'react';
import { useNavigate } from 'react-router-dom';
import FooterLogos from '../components/FooterLogos';

export default function ExamClosedPage() {
    return (
        <div className="min-h-screen bg-[#0E1A20] text-white flex flex-col items-center justify-center font-sans p-6 bg-tech-grid">
            {/* Ambient glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#264653]/25 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#E76F51]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-md w-full bg-[#1B313B] border border-[rgba(42,157,143,0.3)] rounded-2xl p-10 shadow-2xl text-center space-y-6">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#2A9D8F] via-[#E9C46A] to-[#E76F51]" />

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-[#E76F51]/15 border border-[#E76F51]/30 flex items-center justify-center mx-auto text-4xl shadow-[0_0_25px_rgba(231,111,81,0.2)]">
                    🔒
                </div>

                <div className="space-y-2">
                    <span className="inline-block px-4 py-1.5 bg-[#E76F51]/15 text-[#E76F51] border border-[#E76F51]/30 rounded-full text-xs font-mono font-bold tracking-[0.2em] uppercase">
                        EXAM CLOSED
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight">Demo Unavailable</h1>
                    <p className="text-sm text-[#9CB6BF] leading-relaxed">
                        The AAC Entrance Test mock demo is no longer available. The examination window has closed.
                    </p>
                </div>

                <div className="py-4 px-5 bg-[#122027]/80 border border-[rgba(42,157,143,0.25)] rounded-xl text-sm font-mono text-[#9CB6BF]">
                    <div className="font-bold text-white mb-1">AAC Entrance Examination · 2026</div>
                    <div>For queries, contact your exam invigilator or the Advanced Academic Center.</div>
                </div>

                <div className="text-xs font-mono text-[#9CB6BF] flex items-center justify-center gap-2">
                    <FooterLogos size="small" />
                    <span>Advanced Academic Center • GRIET</span>
                </div>
            </div>
        </div>
    );
}
