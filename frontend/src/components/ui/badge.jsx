import React from "react";

export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full bg-gray-200 text-gray-700 ${className}`}
    >
      {children}
    </span>
  );
}
