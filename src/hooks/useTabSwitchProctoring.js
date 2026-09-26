import { useEffect, useState, useRef, useCallback } from "react";

/**
 * useTabSwitchProctoring — frontend-only proctoring hook for the mock demo.
 * No backend logging. Violations tracked in sessionStorage only.
 *
 * Features:
 * 1. Fullscreen enforcement (warning on exit, dismissable)
 * 2. Tab-switch / blur / out-of-focus detection (warning immediately on focus loss)
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

    const violationCountRef = useRef(
        parseInt(sessionStorage.getItem(STORAGE_KEY) || "0", 10)
    );
    const [violationCount, setViolationCount] = useState(violationCountRef.current);

    const hasEnteredFullscreenRef = useRef(
        Boolean(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        )
    );
    const isShowingWarningRef = useRef(false);
    const isEnteringFullscreenRef = useRef(false);
    const wasOutOfFocusRef = useRef(false);
    const examEndedRef = useRef(examEnded);

    useEffect(() => {
        examEndedRef.current = examEnded;
        if (examEnded) {
            setShowWarning(false);
            isShowingWarningRef.current = false;
        }
    }, [examEnded]);

    const warningAction = useCallback(() => {
        if (warningActionRef.current) warningActionRef.current();
    }, []);

    const cleanupProctoring = useCallback(() => {
        examEndedRef.current = true;
        setShowWarning(false);
        isShowingWarningRef.current = false;
    }, []);

    const recordViolation = useCallback(() => {
        violationCountRef.current += 1;
        sessionStorage.setItem(STORAGE_KEY, String(violationCountRef.current));
        setViolationCount(violationCountRef.current);
        return violationCountRef.current;
    }, []);

    const dismissWarning = useCallback(() => {
        setShowWarning(false);
        isShowingWarningRef.current = false;
        wasOutOfFocusRef.current = false;
    }, []);

    // This function is intentionally called directly by the warning button's
    // click handler. Fullscreen APIs require that direct user activation.
    const enterFullscreen = useCallback(async () => {
        const isCurrentFs = Boolean(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        if (isCurrentFs) {
            hasEnteredFullscreenRef.current = true;
            return true;
        }

        const el = document.documentElement;
        const requestMethod =
            el.requestFullscreen ||
            el.webkitRequestFullscreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen;

        if (!requestMethod) {
            hasEnteredFullscreenRef.current = true;
            return true;
        }

        try {
            isEnteringFullscreenRef.current = true;
            await requestMethod.call(el);
            hasEnteredFullscreenRef.current = Boolean(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
            return hasEnteredFullscreenRef.current;
        } catch (_) {
            setWarningMessage("Fullscreen could not be enabled. Please allow fullscreen for this site and click the button again.");
            return false;
        } finally {
            setTimeout(() => {
                isEnteringFullscreenRef.current = false;
            }, 300);
        }
    }, []);

    const triggerWarning = useCallback(
        ({ title, message, buttonText, isViol = true, action }) => {
            if (examEndedRef.current || isShowingWarningRef.current) return false;
            isShowingWarningRef.current = true;
            setWarningTitle(title);
            setWarningMessage(message);
            setWarningButtonText(buttonText);
            setIsViolation(isViol);
            warningActionRef.current = action;
            setShowWarning(true);
            return true;
        },
        []
    );

    // ─── Fullscreen enforcement ───
    useEffect(() => {
        if (examEndedRef.current) return;

        function handleFullscreenChange() {
            if (examEndedRef.current) return;

            const isFs = Boolean(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );

            if (isFs) {
                hasEnteredFullscreenRef.current = true;
                return;
            }

            if (!hasEnteredFullscreenRef.current) return;
            if (isShowingWarningRef.current || isEnteringFullscreenRef.current) return;

            // Exited fullscreen — violation
            const newCount = recordViolation();
            triggerWarning({
                title: "Fullscreen Exited — Violation",
                message: `You exited fullscreen mode. This is a proctoring violation. Please return to fullscreen to continue your exam. Warning ${newCount}.`,
                buttonText: "Return to Fullscreen",
                isViol: true,
                action: async () => {
                    if (await enterFullscreen()) dismissWarning();
                },
            });
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
        };
    }, [triggerWarning, dismissWarning, recordViolation, enterFullscreen]);

    // ─── Initial fullscreen gate ───
    useEffect(() => {
        if (examEndedRef.current) return;
        const isFs = Boolean(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        if (isFs) {
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

    // ─── Out-of-focus & tab-switch detection ───
    useEffect(() => {
        if (examEndedRef.current) return;

        function handleOutOfFocus() {
            if (examEndedRef.current) return;
            if (isShowingWarningRef.current || isEnteringFullscreenRef.current) return;

            // Only enforce if fullscreen was already established or is currently active
            const isFs = Boolean(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
            if (!hasEnteredFullscreenRef.current && !isFs) return;

            wasOutOfFocusRef.current = true;
            const newCount = recordViolation();
            triggerWarning({
                title: "Tab Out of Focus — Violation",
                message: `You navigated away or the exam tab went out of focus. This is a proctoring violation. Please return to the exam tab in fullscreen mode to continue. Warning ${newCount}.`,
                buttonText: "Return to Fullscreen",
                isViol: true,
                action: async () => {
                    const currentFs = Boolean(
                        document.fullscreenElement ||
                        document.webkitFullscreenElement ||
                        document.mozFullScreenElement ||
                        document.msFullscreenElement
                    );
                    if (!currentFs) {
                        if (await enterFullscreen()) dismissWarning();
                    } else {
                        dismissWarning();
                    }
                },
            });
        }

        function handleBlur(e) {
            // Ignore blur events that originated on specific elements within the page
            if (e.target && e.target !== window && e.target !== document) return;
            handleOutOfFocus();
        }

        function handleVisibilityChange() {
            if (document.hidden) {
                handleOutOfFocus();
            } else if (wasOutOfFocusRef.current && !isShowingWarningRef.current) {
                // If the background tab throttled updates, ensure warning triggers immediately upon return
                handleOutOfFocus();
            }
        }

        function handleFocus() {
            if (wasOutOfFocusRef.current && !isShowingWarningRef.current) {
                handleOutOfFocus();
            }
        }

        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [triggerWarning, dismissWarning, recordViolation, enterFullscreen]);

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
                (ctrl && shift && ["I", "J", "C", "K"].includes(key?.toUpperCase())) ||
                (ctrl && key?.toUpperCase() === "U")
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
