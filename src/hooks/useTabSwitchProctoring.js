import { useEffect, useState, useRef, useCallback } from "react";

/**
 * useTabSwitchProctoring — frontend-only proctoring hook for the mock demo.
 * No backend logging. Violations tracked in sessionStorage only.
 *
 * Features:
 * 1. Fullscreen enforcement (warning on exit, dismissable)
 * 2. Tab-switch / minimize detection (warning on return, always dismissable)
 * 3. Keyboard shortcut blocking (F12, Ctrl+Shift+I/J/C/K, Ctrl+U)
 * 4. Right-click context menu disabled
 * 5. NEVER redirects or disqualifies — student keeps their progress always.
 *    This is a demo; violations are counted for display only.
 */

const MAX_VIOLATIONS = 5; // Never auto-disqualify in mock demo
const STORAGE_KEY = "mock_exam_violations";

export default function useTabSwitchProctoring({ examEnded = false } = {}) {
    const [showWarning, setShowWarning] = useState(false);
    const [warningTitle, setWarningTitle] = useState("");
    const [warningMessage, setWarningMessage] = useState("");
    const [warningButtonText, setWarningButtonText] = useState("");
    const [isViolation, setIsViolation] = useState(true);
    const warningActionRef = useRef(null);

    const [violationCount, setViolationCount] = useState(() => {
        return parseInt(sessionStorage.getItem(STORAGE_KEY) || "0", 10);
    });

    const hasEnteredFullscreenRef = useRef(Boolean(document.fullscreenElement));
    const wasHiddenRef = useRef(false);
    const isShowingWarningRef = useRef(false);
    const examEndedRef = useRef(examEnded);

    useEffect(() => {
        examEndedRef.current = examEnded;
    }, [examEnded]);

    const warningAction = useCallback(() => {
        if (warningActionRef.current) warningActionRef.current();
    }, []);

    const cleanupProctoring = useCallback(() => {
        examEndedRef.current = true;
        setShowWarning(false);
    }, []);

    const triggerWarning = useCallback(
        ({ title, message, buttonText, isViol = true, action }) => {
            if (examEndedRef.current || isShowingWarningRef.current) return;
            isShowingWarningRef.current = true;
            setWarningTitle(title);
            setWarningMessage(message);
            setWarningButtonText(buttonText);
            setIsViolation(isViol);
            warningActionRef.current = action;
            setShowWarning(true);
        },
        []
    );

    const dismissWarning = useCallback(() => {
        setShowWarning(false);
        isShowingWarningRef.current = false;
    }, []);

    const recordViolation = useCallback(() => {
        setViolationCount((prev) => {
            const next = prev + 1;
            // Persist count so it survives across renders (but not page reloads)
            sessionStorage.setItem(STORAGE_KEY, String(next));
            return next;
        });
    }, []);

    // This function is intentionally called directly by the warning button's
    // click handler. Fullscreen APIs require that direct user activation.
    const enterFullscreen = useCallback(async () => {
        if (document.fullscreenElement) return true;

        try {
            await document.documentElement.requestFullscreen();
            hasEnteredFullscreenRef.current = Boolean(document.fullscreenElement);
            return hasEnteredFullscreenRef.current;
        } catch (_) {
            setWarningMessage("Fullscreen could not be enabled. Please allow fullscreen for this site and click the button again.");
            return false;
        }
    }, []);

    // ─── Fullscreen enforcement ───
    useEffect(() => {
        if (examEndedRef.current) return;

        function handleFullscreenChange() {
            if (examEndedRef.current) return;

            if (document.fullscreenElement) {
                hasEnteredFullscreenRef.current = true;
                return;
            }

            if (!hasEnteredFullscreenRef.current) return;

            // Exited fullscreen — violation
            recordViolation();
            triggerWarning({
                title: "Fullscreen Exited — Violation",
                message: `You exited fullscreen mode. This is a proctoring violation. Please return to fullscreen to continue your exam. Warning ${violationCount + 1}.`,
                buttonText: "Return to Fullscreen",
                isViol: true,
                action: async () => {
                    if (await enterFullscreen()) dismissWarning();
                },
            });
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, [triggerWarning, dismissWarning, recordViolation, violationCount, enterFullscreen]);

    // ─── Initial fullscreen gate ───
    useEffect(() => {
        if (examEndedRef.current) return;
        if (document.fullscreenElement) {
            hasEnteredFullscreenRef.current = true;
            return;
        }
        // Show non-violation prompt to enter fullscreen
        triggerWarning({
            title: "Fullscreen Required",
            message: "This exam must be taken in fullscreen mode. Click the button below to enter fullscreen and begin.",
            buttonText: "Enter Fullscreen",
            isViol: false,
            action: async () => {
                if (await enterFullscreen()) dismissWarning();
            },
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ─── Tab-switch / visibility detection ───
    useEffect(() => {
        if (examEndedRef.current) return;

        function handleVisibilityChange() {
            if (examEndedRef.current) return;
            if (document.hidden) {
                wasHiddenRef.current = true;
            } else if (wasHiddenRef.current) {
                wasHiddenRef.current = false;
                recordViolation();
                triggerWarning({
                    title: "Tab Switch Detected",
                    message: `Tab switching was detected while your exam was in progress. Please stay on this tab for the duration of your exam. Your progress has been saved — you can continue from where you left off.`,
                    buttonText: "I Understand — Continue Exam",
                    isViol: true,
                    action: dismissWarning,
                });
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [triggerWarning, dismissWarning, recordViolation, violationCount]);

    // ─── Keyboard shortcut blocking ───
    useEffect(() => {
        if (examEndedRef.current) return;

        function handleKeyDown(e) {
            if (examEndedRef.current) return;
            const key = e.key;
            const ctrl = e.ctrlKey || e.metaKey;
            const shift = e.shiftKey;

            if (
                key === "F12" ||
                (ctrl && shift && ["I", "J", "C", "K"].includes(key.toUpperCase())) ||
                (ctrl && key.toUpperCase() === "U")
            ) {
                e.preventDefault();
                e.stopPropagation();
            }
        }

        window.addEventListener("keydown", handleKeyDown, { capture: true });
        return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
    }, []);

    // ─── Right-click block ───
    useEffect(() => {
        if (examEndedRef.current) return;
        function block(e) { e.preventDefault(); }
        document.addEventListener("contextmenu", block);
        return () => document.removeEventListener("contextmenu", block);
    }, []);

    return {
        showWarning,
        warningTitle,
        warningMessage,
        warningButtonText,
        warningAction,
        violationCount,
        maxViolations: MAX_VIOLATIONS,
        isViolation,
        cleanupProctoring,
    };
}
