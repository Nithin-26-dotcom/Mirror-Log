// src/components/ui/checkbox.jsx
import React from "react";

export function Checkbox({ checked, onChange, label, className = "" }) {
    return (
        <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange && onChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
            />
            {label && <span>{label}</span>}
        </label>
    );
}
