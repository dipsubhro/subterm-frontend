import React, { useEffect, useState } from "react";

const FileNode = ({ name, children, depth = 0, path, onFileClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = children !== null;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      const fullPath = `${path}/${name}`;
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
      <div onClick={handleClick}>
        {isFolder ? (isOpen ? "📂" : "📁") : "📄"} {name}
      </div>
      {isOpen && isFolder && (
        <div>
          {Object.entries(children).map(([childName, grandChildren]) => (
            <FileNode
              key={childName}
              name={childName}
              children={grandChildren}
              depth={depth + 1}
              path={`${path}/${name}`}
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
    fetch("http://localhost:3334/files")
      .then((res) => res.json())
      .then((data) => setTreeData(data.tree))
      .catch((err) => console.error("Error fetching file tree:", err));
  }, []);

  return (
    <div
      style={{
        fontFamily: "monospace",
        padding: "10px",
        background: "#1e1e2f",
        color: "#f8f8f2",
        height: "100%",
        borderRight: "1px solid #444",
        overflowY: "auto",
      }}
    >
      <h3 style={{ color: "#bd93f9", marginBottom: "10px" }}>
        📂 Project File Explorer
      </h3>
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
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FileTree;
