import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import StartPage from './pages/StartPage';
import ExamPage from './pages/ExamPage';
import ResultsPage from './pages/ResultsPage';
import ExamClosedPage from './pages/ExamClosedPage';

// ── Exam Availability Gate ──
// The exam is open on VITE_EXAM_DATES (comma-separated, e.g. "2026-09-26,2026-09-27")
// OR if VITE_EXAM_CLOSED is "true" it's always closed regardless.
// Date format: YYYY-MM-DD in IST (UTC+5:30)
const EXAM_CLOSED_FLAG = import.meta.env.VITE_EXAM_CLOSED === 'true';
const EXAM_DATES_RAW = import.meta.env.VITE_EXAM_DATES || '2026-09-26,2026-09-27';

function isExamOpen() {
    if (EXAM_CLOSED_FLAG) return false;

    const allowedDates = EXAM_DATES_RAW.split(',').map(d => d.trim());

    // Get current date in IST (UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);
    const todayIST = istNow.toISOString().slice(0, 10); // YYYY-MM-DD

    return allowedDates.includes(todayIST);
}

function AppRoutes() {
    const examOpen = isExamOpen();

    if (!examOpen) {
        // Exam is closed — show closed page for all routes
        return (
            <Routes>
                <Route path="*" element={<ExamClosedPage />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/start" element={<StartPage />} />
            <Route path="/exam" element={<ExamPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ThemeProvider>
    );
}
