import { useState } from "react";

export default function SaveButton({ onSave }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onSave}
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
      title="Save File"
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
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
      </svg>
    </button>
  );
}


