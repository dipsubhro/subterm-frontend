import { useState } from "react";

export default function NewFileButton({ onCreateFile }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onCreateFile}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        transition: "all 0.15s ease",
        backgroundColor: isHovered ? "#3A3A3A" : "transparent",
      }}
      title="New File"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isHovered ? "#2899F5" : "#D4D4D4"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "stroke 0.15s ease" }}
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </svg>
    </button>
  );
}


