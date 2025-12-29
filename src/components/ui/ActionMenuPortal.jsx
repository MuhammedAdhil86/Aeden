"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function ActionMenuPortal({ children, position, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[99999] bg-white shadow-xl border border-gray-200 rounded-xl p-1"
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>,
    document.body
  );
}
