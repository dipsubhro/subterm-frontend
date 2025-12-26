import React, { useEffect, useState } from "react";

const FolderIcon = ({ isOpen }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DCDCAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {isOpen ? (
      <>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        <line x1="9" y1="14" x2="15" y2="14"></line>
      </>
    ) : (
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    )}
  </svg>
);

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CDCFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const FileNode = ({ name, children, depth = 0, path, onFileClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = children !== null;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      const fullPath = [path, name].filter(Boolean).join("/");
      console.log(`Clicked file: ${fullPath}`);
      onFileClick(fullPath);
    }
  };

  return (
    <div
      style={{
        paddingLeft: `${depth * 16}px`,
        cursor: isFolder ? "pointer" : "default",
      }}
    >
      <div
        onClick={handleClick}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4px 0",
          borderRadius: "4px",
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2A2A2A")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <span style={{ marginRight: "8px", display: "flex", alignItems: "center" }}>
          {isFolder ? <FolderIcon isOpen={isOpen} /> : <FileIcon />}
        </span>
        <span style={{ color: "#D4D4D4", fontSize: "14px" }}>{name}</span>
      </div>

      {isOpen && isFolder && (
        <div>
          {Object.entries(children).map(([childName, grandChildren]) => (
            <FileNode
              key={childName}
              name={childName}
              children={grandChildren}
              depth={depth + 1}
              path={[path, name].filter(Boolean).join("/")}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree = ({ onFileClick }) => {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/files`)
      .then((res) => res.json())
      .then((data) => setTreeData(data.tree))
      .catch((err) => console.error("Error fetching file tree:", err));
  }, []);

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        padding: "10px",
        background: "#1E1E1E",
        color: "#D4D4D4",
        borderRight: "1px solid #2A2A2A",
      }}
    >
      <h2 style={{ color: "#007ACC", marginBottom: "10px", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Explorer</h2>
      {treeData ? (
        Object.entries(treeData).map(([name, children]) => (
          <FileNode
            key={name}
            name={name}
            children={children}
            depth={0}
            path=""
            onFileClick={onFileClick}
          />
        ))
      ) : (
        <p style={{ color: "#858585" }}>Loading...</p>
      )}
    </div>
  );
};

export default FileTree;

