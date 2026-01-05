import { useState } from "react";

export default function NewFolderButton({ onCreateFolder }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onCreateFolder}
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
      title="New Folder"
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
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        <line x1="12" y1="11" x2="12" y2="17"></line>
        <line x1="9" y1="14" x2="15" y2="14"></line>
      </svg>
    </button>
  );
}


