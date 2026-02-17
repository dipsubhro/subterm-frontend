import { useEffect, useRef } from "react";
import { Tree } from "react-arborist";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import socket from "../socket";

const ChevronIcon = ({ isOpen }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#858585"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
      transition: "transform 0.15s ease",
    }}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const FolderIcon = ({ isOpen }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DCDCAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CDCFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

// Custom Node component for react-arborist
function Node({ node, style, dragHandle }) {
  const isFolder = node.children && node.children.length >= 0;

  return (
    <div
      ref={dragHandle}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        paddingTop: "2px",
        paddingBottom: "2px",
        paddingRight: "4px",
        cursor: "pointer",
        borderRadius: "4px",
        backgroundColor: node.isSelected ? "#2A2A2A" : "transparent",
      }}
      onClick={() => {
        if (isFolder) {
          node.toggle();
        } else {
          node.select();
        }
      }}
      onMouseEnter={(e) => {
        if (!node.isSelected) {
          e.currentTarget.style.backgroundColor = "#2A2A2A";
        }
      }}
      onMouseLeave={(e) => {
        if (!node.isSelected) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {/* Chevron for folders */}
      <span style={{ width: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isFolder && <ChevronIcon isOpen={node.isOpen} />}
      </span>
      <span style={{ marginRight: "6px", marginLeft: "2px", display: "flex", alignItems: "center" }}>
        {isFolder ? <FolderIcon isOpen={node.isOpen} /> : <FileIcon />}
      </span>
      <span style={{ color: "#D4D4D4", fontSize: "13px" }}>{node.data.name}</span>
    </div>
  );
}

const FileTree = ({ onFileClick }) => {
  const treeRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch tree using TanStack Query + axios
  const { data: treeData = [], isLoading: loading } = useQuery({
    queryKey: ["fileTree"],
    queryFn: () => api.get("/api/get-tree").then((res) => res.data),
  });

  useEffect(() => {
    // Listen for fs-event to invalidate the tree cache
    const handleFsEvent = (events) => {
      console.log("[fs-event] Received:", events);
      queryClient.invalidateQueries({ queryKey: ["fileTree"] });
    };

    socket.on("fs-event", handleFsEvent);

    return () => {
      socket.off("fs-event", handleFsEvent);
    };
  }, [queryClient]);

  // Handle node selection
  const handleSelect = (nodes) => {
    if (nodes.length > 0) {
      const node = nodes[0];
      // Only trigger onFileClick for files (no children array)
      if (!node.children || node.children.length === undefined) {
        onFileClick(node.data.id);
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          padding: "10px",
          background: "#1E1E1E",
          color: "#858585",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        background: "#1E1E1E",
        color: "#D4D4D4",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Tree
        ref={treeRef}
        data={treeData}
        openByDefault={false}
        width="100%"
        height={600}
        indent={16}
        rowHeight={26}
        overscanCount={5}
        onSelect={handleSelect}
        disableDrag
        disableDrop
      >
        {Node}
      </Tree>
    </div>
  );
};

export default FileTree;
