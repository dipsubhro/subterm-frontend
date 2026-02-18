import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import socket from "../socket";

// ── Fetch helper ─────────────────────────────────────────────

const fetchChildren = async (dirPath) => {
  const { data } = await api.get("/api/fs", { params: { path: dirPath } });
  return data.children; // Array of node objects
};

// ── Icons ────────────────────────────────────────────────────

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
      flexShrink: 0,
    }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const FolderIcon = ({ isOpen }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#DCDCAA"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    {isOpen ? (
      <>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </>
    ) : (
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    )}
  </svg>
);

const FileIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9CDCFE"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// ── Git status colors ────────────────────────────────────────

const GIT_COLORS = {
  modified: "#E2C08D",
  added: "#73C991",
  deleted: "#C74E39",
  untracked: "#73C991",
  renamed: "#73B8D4",
  conflicted: "#E45454",
};

// ── TreeNode ─────────────────────────────────────────────────

function TreeNode({ node, depth, expandedSet, onToggle, onFileClick, selectedId }) {
  const isFolder = node.kind === "folder";
  const isOpen = expandedSet.has(node.id);
  const isSelected = selectedId === node.id;
  const gitColor = node.git ? GIT_COLORS[node.git.status] : null;

  return (
    <div
      role="treeitem"
      aria-expanded={isFolder ? isOpen : undefined}
      onClick={() => {
        if (isFolder) {
          onToggle(node.id);
        } else {
          onFileClick(node.id);
        }
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = "#2A2A2A";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
      }}
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: 2,
        paddingBottom: 2,
        paddingRight: 4,
        paddingLeft: depth * 16,
        cursor: "pointer",
        borderRadius: 4,
        backgroundColor: isSelected ? "#2A2A2A" : "transparent",
        userSelect: "none",
      }}
    >
      {/* Chevron */}
      <span
        style={{
          width: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isFolder && node.hasChildren && <ChevronIcon isOpen={isOpen} />}
      </span>

      {/* Icon */}
      <span
        style={{
          marginRight: 6,
          marginLeft: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        {isFolder ? <FolderIcon isOpen={isOpen} /> : <FileIcon />}
      </span>

      {/* Name */}
      <span
        style={{
          color: gitColor || "#D4D4D4",
          fontSize: 13,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {node.name}
      </span>

      {/* Git badge */}
      {node.git && (
        <span
          style={{
            marginLeft: "auto",
            paddingLeft: 8,
            fontSize: 10,
            color: gitColor,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            flexShrink: 0,
          }}
        >
          {node.git.status[0]}
        </span>
      )}
    </div>
  );
}

// ── FolderChildren (lazy-loaded via TanStack Query) ──────────

function FolderChildren({ parentId, depth, expandedSet, onToggle, onFileClick, selectedId }) {
  const { data: children = [], isLoading } = useQuery({
    queryKey: ["fs", parentId],
    queryFn: () => fetchChildren(parentId),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div
        style={{
          paddingLeft: (depth + 1) * 16 + 14,
          fontSize: 12,
          color: "#858585",
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        loading…
      </div>
    );
  }

  return (
    <>
      {children.map((child) => (
        <TreeNodeWithChildren
          key={child.id}
          node={child}
          depth={depth + 1}
          expandedSet={expandedSet}
          onToggle={onToggle}
          onFileClick={onFileClick}
          selectedId={selectedId}
        />
      ))}
    </>
  );
}

// ── TreeNodeWithChildren (recursive wrapper) ─────────────────

function TreeNodeWithChildren({ node, depth, expandedSet, onToggle, onFileClick, selectedId }) {
  const isFolder = node.kind === "folder";
  const isOpen = expandedSet.has(node.id);

  return (
    <>
      <TreeNode
        node={node}
        depth={depth}
        expandedSet={expandedSet}
        onToggle={onToggle}
        onFileClick={onFileClick}
        selectedId={selectedId}
      />
      {isFolder && isOpen && (
        <FolderChildren
          parentId={node.id}
          depth={depth}
          expandedSet={expandedSet}
          onToggle={onToggle}
          onFileClick={onFileClick}
          selectedId={selectedId}
        />
      )}
    </>
  );
}

// ── FileTree (root component) ────────────────────────────────

const FileTree = ({ onFileClick }) => {
  const queryClient = useQueryClient();
  const [expandedSet, setExpandedSet] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);
  const containerRef = useRef(null);

  // Toggle folder expand/collapse
  const handleToggle = useCallback((folderId) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  // Handle file click — select + notify parent
  const handleFileClick = useCallback(
    (fileId) => {
      setSelectedId(fileId);
      // Strip leading slash to match the old behavior (relative paths)
      const relativePath = fileId.startsWith("/") ? fileId.slice(1) : fileId;
      onFileClick(relativePath);
    },
    [onFileClick]
  );

  // Invalidate all fs queries when FS changes on server
  useEffect(() => {
    const handleFsEvent = (events) => {
      console.log("[fs-event] Received:", events);
      queryClient.invalidateQueries({ queryKey: ["fs"] });
    };
    socket.on("fs-event", handleFsEvent);
    return () => socket.off("fs-event", handleFsEvent);
  }, [queryClient]);

  // Root query — fetch children of "/"
  const { data: rootChildren = [], isLoading } = useQuery({
    queryKey: ["fs", "/"],
    queryFn: () => fetchChildren("/"),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          padding: 10,
          background: "#1E1E1E",
          color: "#858585",
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="tree"
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        background: "#1E1E1E",
        color: "#D4D4D4",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {rootChildren.map((node) => (
        <TreeNodeWithChildren
          key={node.id}
          node={node}
          depth={0}
          expandedSet={expandedSet}
          onToggle={handleToggle}
          onFileClick={handleFileClick}
          selectedId={selectedId}
        />
      ))}
    </div>
  );
};

export default FileTree;
