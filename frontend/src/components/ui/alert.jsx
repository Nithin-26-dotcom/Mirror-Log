"use client";

import * as React from "react";

export function Alert({ children, className }) {
  return (
    <div
      className={`rounded-md border border-yellow-400 bg-yellow-50 p-4 text-yellow-800 ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}

export function AlertDescription({ children }) {
  return <p className="text-sm">{children}</p>;
}
