"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

export function Select({ children, ...props }) {
  return (
    <div className="relative inline-block w-[200px]" {...props}>
      {children}
    </div>
  );
}

export function SelectTrigger({ children, ...props }) {
  return (
    <button
      className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      {...props}
    >
      {children}
      <ChevronDown className="ml-2 h-4 w-4" />
    </button>
  );
}

export function SelectContent({ children }) {
  return (
    <div className="absolute mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg z-50">
      <ul className="max-h-60 overflow-auto py-1">{children}</ul>
    </div>
  );
}

export function SelectItem({ children, onClick }) {
  return (
    <li
      className="cursor-pointer select-none px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </li>
  );
}

export function SelectValue({ placeholder }) {
  return <span className="text-gray-600">{placeholder}</span>;
}
