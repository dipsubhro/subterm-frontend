import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SHORTCUTS = {
  others: [
    { key: ["Ctrl", "S"], description: "Save file" },
    { key: ["Ctrl", "Shift", "S"], description: "Save all" },
    { key: ["Ctrl", "P"], description: "File search" },
    { key: ["Ctrl", "Shift", "P"], description: "Command palette" },
    { key: ["Ctrl", "`"], description: "Toggle terminal" },
    { key: ["Ctrl", "B"], description: "Toggle sidebar" },
  ],
  editing: [
    { key: ["Ctrl", "/"], description: "Toggle comment" },
    { key: ["Alt", "↑/↓"], description: "Move line" },
    { key: ["Shift", "Alt", "↑/↓"], description: "Duplicate line" },
    { key: ["Shift", "Alt", "F"], description: "Format document" },
    { key: ["Shift", "Alt", "V"], description: "Toggle validation" },
  ],
  navigation: [
    { key: ["Ctrl", "G"], description: "Go to line" },
    { key: ["Ctrl", "F"], description: "Find" },
    { key: ["Ctrl", "H"], description: "Replace" },
  ],
};

const KbdKey = ({ label }) => (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      px: "6px",
      py: "2px",
      bgcolor: "#3a3a3a",
      color: "#d4d4d4",
      border: "1px solid #555",
      borderRadius: "4px",
      fontSize: 11,
      fontFamily: "inherit",
      lineHeight: 1.5,
    }}
  >
    {label}
  </Box>
);

const ShortcutGroup = ({ title, items }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="overline"
      sx={{
        color: "#858585",
        fontSize: 10,
        letterSpacing: "0.1em",
        display: "block",
        mb: 1,
      }}
    >
      {title}
    </Typography>
    {items.map((item, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: "5px",
          borderBottom: "1px solid #2a2a2a",
          "&:last-child": { borderBottom: "none" },
        }}
      >
        <Typography sx={{ fontSize: 12, color: "#d4d4d4" }}>
          {item.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          {item.key.map((k, i) => (
            <React.Fragment key={i}>
              <KbdKey label={k} />
              {i < item.key.length - 1 && (
                <Typography
                  component="span"
                  sx={{ color: "#858585", fontSize: 11 }}
                >
                  +
                </Typography>
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    ))}
  </Box>
);

const ShortcutsModal = ({ isOpen, onClose }) => (
  <Dialog
    open={isOpen}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{ sx: { bgcolor: "#252526", color: "#d4d4d4" } }}
  >
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pb: 1,
        fontFamily: "inherit",
        fontSize: 14,
        borderBottom: "1px solid #3a3a3a",
      }}
    >
      Keyboard Shortcuts
      <IconButton onClick={onClose} size="small" aria-label="Close">
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ pt: 2 }}>
      <ShortcutGroup title="Core" items={SHORTCUTS.others} />
      <ShortcutGroup title="Editing" items={SHORTCUTS.editing} />
      <ShortcutGroup title="Navigation" items={SHORTCUTS.navigation} />
    </DialogContent>
  </Dialog>
);

export default ShortcutsModal;
