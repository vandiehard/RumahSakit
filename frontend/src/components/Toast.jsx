import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle className="h-6 w-6 text-emerald-400" />,
  error:   <XCircle    className="h-6 w-6 text-red-400"     />,
  warning: <AlertTriangle className="h-6 w-6 text-amber-400" />,
  info:    <Info       className="h-6 w-6 text-blue-400"    />,
};

const BARS = {
  success: 'bg-emerald-400',
  error:   'bg-red-400',
  warning: 'bg-amber-400',
  info:    'bg-blue-400',
};

const BORDERS = {
  success: 'border-emerald-500/30',
  error:   'border-red-500/30',
  warning: 'border-amber-500/30',
  info:    'border-blue-500/30',
};

/**
 * Toast – standalone popup notification.
 *
 * Props:
 *  message  : string   – text to display
 *  type     : 'success' | 'error' | 'warning' | 'info'
 *  duration : number   – ms before auto-close  (default 3500)
 *  onClose  : () => void
 */
const Toast = ({ message, type = 'info', duration = 3500, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10);

    // Progress bar countdown
    const step = 50;
    const decrement = (step / duration) * 100;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev - decrement;
        return next < 0 ? 0 : next;
      });
    }, step);

    // Auto close
    const closeTimer = setTimeout(() => handleClose(), duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
      clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 400);
  };

  return (
    <div
      className={`
        relative overflow-hidden flex items-start gap-4 w-full max-w-sm
        bg-slate-800/90 dark:bg-slate-900/95 backdrop-blur-md
        border ${BORDERS[type]}
        rounded-2xl shadow-2xl px-5 py-4
        transition-all duration-400 ease-in-out
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}
      `}
    >
      {/* Icon */}
      <div className="mt-0.5 shrink-0">{ICONS[type]}</div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-snug">{message}</p>
      </div>

      {/* Close */}
      <button
        onClick={handleClose}
        className="shrink-0 text-slate-400 hover:text-white transition mt-0.5"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${BARS[type]} transition-all`}
        style={{ width: `${progress}%`, transitionDuration: '50ms' }}
      />
    </div>
  );
};

/**
 * ToastContainer – renders the queue of toasts.
 * Place once at the root of your app.
 *
 * Props:
 *  toasts  : Array<{ id, message, type, duration }>
 *  remove  : (id) => void
 */
export const ToastContainer = ({ toasts, remove }) => (
  <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 pointer-events-none">
    {toasts.map(t => (
      <div key={t.id} className="pointer-events-auto">
        <Toast
          message={t.message}
          type={t.type}
          duration={t.duration}
          onClose={() => remove(t.id)}
        />
      </div>
    ))}
  </div>
);

/**
 * useToast – hook to manage the toast queue.
 *
 * Returns { toasts, toast }
 *   toast.success(msg), toast.error(msg), toast.warning(msg), toast.info(msg)
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const add = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const toast = {
    success: (msg, dur) => add(msg, 'success', dur),
    error:   (msg, dur) => add(msg, 'error',   dur),
    warning: (msg, dur) => add(msg, 'warning', dur),
    info:    (msg, dur) => add(msg, 'info',    dur),
  };

  return { toasts, toast, remove };
};

export default Toast;
