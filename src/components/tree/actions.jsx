// Action UI primitives: dropdown menu, inline input, inline create row
import { useRef, useState, useEffect } from "react";
import {
  Paper,
  MenuList,
  MenuItem,
  TextField,
  Box,
  Typography,
} from "@mui/material";
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
    <Paper
      ref={ref}
      elevation={6}
      sx={{
        position: "absolute",
        zIndex: 100,
        top: "100%",
        left: 0,
        minWidth: 130,
        bgcolor: "#252526",
        border: "1px solid #3a3a3a",
        borderRadius: "4px",
        py: "2px",
      }}
    >
      <MenuList dense disablePadding>
        {items.map((item) => (
          <MenuItem
            key={item.label}
            onClick={(e) => {
              e.stopPropagation();
              item.action();
              onClose();
            }}
            sx={{ gap: 1, fontSize: 12, minHeight: 28 }}
          >
            {item.icon}
            <Typography sx={{ fontSize: 12 }}>{item.label}</Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
}

// ── InlineInput ──────────────────────────────────────────────

export function InlineInput({
  defaultValue = "",
  icon,
  placeholder,
  onSubmit,
  onCancel,
}) {
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
    <Box sx={{ display: "flex", alignItems: "center", flex: 1, gap: 0.5 }}>
      {icon && (
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {icon}
        </Box>
      )}
      <TextField
        inputRef={inputRef}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") onCancel();
        }}
        onBlur={() => setTimeout(onCancel, 120)}
        onClick={(e) => e.stopPropagation()}
        sx={{ flex: 1 }}
      />
    </Box>
  );
}

// ── InlineCreateRow ──────────────────────────────────────────

export function InlineCreateRow({ depth, kind, onSubmit, onCancel }) {
  const icon = kind === "folder" ? menuIcons.folderSmall : menuIcons.fileSmall;

  return (
    <div
      className="tree-create-row"
      style={{ paddingLeft: (depth + 1) * 16 + 16 }}
    >
      <InlineInput
        icon={icon}
        placeholder={kind === "folder" ? "folder name…" : "filename.ext…"}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
