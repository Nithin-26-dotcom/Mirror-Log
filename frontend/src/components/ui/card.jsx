import React from "react";

export function Card({ children, className = "" }) {
  return <div className={`p-4 shadow-md rounded-xl bg-white ${className}`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="font-bold text-lg mb-2">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="text-gray-700">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-xl font-semibold">{children}</h3>;
}

export function CardDescription({ children }) {
  return <p className="text-sm text-gray-500">{children}</p>;
}
