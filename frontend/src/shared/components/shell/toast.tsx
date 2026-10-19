"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { springs } from "@/lib/motion";

type ToastMessage = { id: number; title: string; description?: string };
const ToastContext = createContext<(title: string, description?: string) => void>(() => {});

/** Minimal confirmation toast (replaces sonner on the public site to keep the bundle lean). */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const timer = useRef<number | null>(null);

  const notify = useCallback((title: string, description?: string) => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    setMessage({ id: Date.now(), title, description });
    timer.current = window.setTimeout(() => setMessage(null), 2400);
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        <AnimatePresence>
          {message ? (
            <motion.div
              key={message.id}
              className="toast"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={springs.snappy}
            >
              <span className="toast__icon" aria-hidden="true"><Check /></span>
              <span>
                <strong>{message.title}</strong>
                {message.description ? <small>{message.description}</small> : null}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
