"use client";

import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`modal-box ${wide ? "max-w-2xl" : ""}`}>
        <h3 className="font-display text-2xl font-bold">{title}</h3>
        <div className="mt-5">{children}</div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
