"use client";

import * as React from "react";

export function Dialog({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        {children}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function DialogContent({ children }) {
  return <div className="mt-2">{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return (
    <h2 className="text-lg font-semibold leading-6 text-gray-900">
      {children}
    </h2>
  );
}
