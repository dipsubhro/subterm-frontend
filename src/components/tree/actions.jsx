// Action UI primitives: dropdown menu, inline input, inline create row

import { useState, useEffect, useRef } from "react";
import { menuIcons } from "./icons";

// ── ActionDropdown ───────────────────────────────────────────

export function ActionDropdown({ items, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="tree-dropdown">
      {items.map((item) => (
        <button
          key={item.label}
          className="tree-dropdown-item"
          onClick={(e) => {
            e.stopPropagation();
            item.action();
            onClose();
          }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ── InlineInput ──────────────────────────────────────────────

export function InlineInput({ defaultValue = "", icon, placeholder, onSubmit, onCancel }) {
  const inputRef = useRef(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== defaultValue) {
      onSubmit(trimmed);
    } else {
      onCancel();
    }
  };

  return (
    <div className="tree-inline-row">
      {icon && <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>}
      <input
        ref={inputRef}
        type="text"
        value={value}
        className="tree-inline-input"
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") onCancel();
        }}
        onBlur={() => setTimeout(onCancel, 120)}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ── InlineCreateRow ──────────────────────────────────────────

export function InlineCreateRow({ depth, kind, onSubmit, onCancel }) {
  const icon = kind === "folder" ? menuIcons.folderSmall : menuIcons.fileSmall;

  return (
    <div className="tree-create-row" style={{ paddingLeft: (depth + 1) * 16 + 16 }}>
      <InlineInput
        icon={icon}
        placeholder={kind === "folder" ? "folder name…" : "filename.ext…"}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
