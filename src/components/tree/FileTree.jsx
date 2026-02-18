// Root FileTree component — state management, data fetching, socket integration

import { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/axios";
import socket from "../../socket";
import TreeNode from "./TreeNode";
import { InlineCreateRow } from "./actions";

// ── Fetch helper ─────────────────────────────────────────────

const fetchChildren = async (dirPath) => {
  const { data } = await api.get("/api/fs", { params: { path: dirPath } });
  return data.children;
};

// ── FolderChildren (lazy per-folder query) ───────────────────

function FolderChildren({ parentId, depth, expandedSet, onToggle, onFileClick, selectedId, nodeActions }) {
  const { data: children = [], isLoading } = useQuery({
    queryKey: ["fs", parentId],
    queryFn: () => fetchChildren(parentId),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="tree-folder-loading" style={{ paddingLeft: (depth + 1) * 16 + 14 }}>
        loading…
      </div>
    );
  }

  return (
    <>
      {nodeActions.creatingIn?.parentId === parentId && (
        <InlineCreateRow
          depth={depth}
          kind={nodeActions.creatingIn.kind}
          onSubmit={(name) => nodeActions.onCreateSubmit(parentId, nodeActions.creatingIn.kind, name)}
          onCancel={nodeActions.onCreateCancel}
        />
      )}
      {children.map((child) => (
        <TreeNodeWithChildren
          key={child.id}
          node={child}
          depth={depth + 1}
          expandedSet={expandedSet}
          onToggle={onToggle}
          onFileClick={onFileClick}
          selectedId={selectedId}
          nodeActions={nodeActions}
        />
      ))}
    </>
  );
}

// ── TreeNodeWithChildren (recursive wrapper) ─────────────────

function TreeNodeWithChildren({ node, depth, expandedSet, onToggle, onFileClick, selectedId, nodeActions }) {
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
        onAction={nodeActions.onAction}
        renamingId={nodeActions.renamingId}
        deletingId={nodeActions.deletingId}
        onRenameSubmit={nodeActions.onRenameSubmit}
        onRenameCancel={nodeActions.onRenameCancel}
        onDeleteConfirm={nodeActions.onDeleteConfirm}
        onDeleteCancel={nodeActions.onDeleteCancel}
        activeMenu={nodeActions.activeMenu}
        onMenuOpen={nodeActions.onMenuOpen}
        onMenuClose={nodeActions.onMenuClose}
      />
      {isFolder && isOpen && (
        <FolderChildren
          parentId={node.id}
          depth={depth}
          expandedSet={expandedSet}
          onToggle={onToggle}
          onFileClick={onFileClick}
          selectedId={selectedId}
          nodeActions={nodeActions}
        />
      )}
    </>
  );
}

// ── FileTree ─────────────────────────────────────────────────

const FileTree = ({ onFileClick }) => {
  const queryClient = useQueryClient();
  const [expandedSet, setExpandedSet] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);

  // Action state
  const [activeMenu, setActiveMenu] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [creatingIn, setCreatingIn] = useState(null);

  const handleToggle = useCallback((folderId) => {
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  }, []);

  const handleFileClick = useCallback(
    (fileId) => {
      setSelectedId(fileId);
      const relativePath = fileId.startsWith("/") ? fileId.slice(1) : fileId;
      onFileClick(relativePath);
    },
    [onFileClick]
  );

  const onMenuOpen = useCallback((nodeId, type) => {
    setActiveMenu((prev) => (prev?.nodeId === nodeId && prev?.type === type ? null : { nodeId, type }));
  }, []);

  const onMenuClose = useCallback(() => setActiveMenu(null), []);

  const onAction = useCallback((nodeId, action) => {
    setActiveMenu(null);
    switch (action) {
      case "rename":
        setDeletingId(null);
        setRenamingId(nodeId);
        break;
      case "delete":
        setRenamingId(null);
        setDeletingId(nodeId);
        break;
      case "newFile":
        setCreatingIn({ parentId: nodeId, kind: "file" });
        setExpandedSet((prev) => new Set(prev).add(nodeId));
        break;
      case "newFolder":
        setCreatingIn({ parentId: nodeId, kind: "folder" });
        setExpandedSet((prev) => new Set(prev).add(nodeId));
        break;
    }
  }, []);

  const onRenameSubmit = useCallback(
    async (node, newName) => {
      setRenamingId(null);
      if (newName === node.name) return;
      const parentPath = node.parentId;
      const newPath = parentPath === "/" ? `/${newName}` : `${parentPath}/${newName}`;
      try {
        await api.post("/api/fs/rename", { oldPath: node.id, newPath });
        queryClient.invalidateQueries({ queryKey: ["fs", parentPath] });
      } catch (e) {
        console.error("[rename]", e);
      }
    },
    [queryClient]
  );

  const onRenameCancel = useCallback(() => setRenamingId(null), []);

  const onDeleteConfirm = useCallback(
    async (node) => {
      setDeletingId(null);
      try {
        await api.post("/api/fs/delete", { path: node.id });
        queryClient.invalidateQueries({ queryKey: ["fs", node.parentId] });
      } catch (e) {
        console.error("[delete]", e);
      }
    },
    [queryClient]
  );

  const onDeleteCancel = useCallback(() => setDeletingId(null), []);

  const onCreateSubmit = useCallback(
    async (parentId, kind, name) => {
      setCreatingIn(null);
      const newPath = parentId === "/" ? `/${name}` : `${parentId}/${name}`;
      try {
        if (kind === "folder") {
          await api.post("/file", { path: `${newPath.slice(1)}/.gitkeep`, content: "" });
        } else {
          await api.post("/file", { path: newPath.slice(1), content: "" });
        }
        queryClient.invalidateQueries({ queryKey: ["fs", parentId] });
      } catch (e) {
        console.error("[create]", e);
      }
    },
    [queryClient]
  );

  const onCreateCancel = useCallback(() => setCreatingIn(null), []);

  // Socket-driven cache invalidation
  useEffect(() => {
    const handleFsEvent = (events) => {
      console.log("[fs-event] Received:", events);
      queryClient.invalidateQueries({ queryKey: ["fs"] });
    };
    socket.on("fs-event", handleFsEvent);
    return () => socket.off("fs-event", handleFsEvent);
  }, [queryClient]);

  // Root query
  const { data: rootChildren = [], isLoading } = useQuery({
    queryKey: ["fs", "/"],
    queryFn: () => fetchChildren("/"),
    staleTime: 30_000,
  });

  const nodeActions = {
    onAction,
    renamingId,
    deletingId,
    onRenameSubmit,
    onRenameCancel,
    onDeleteConfirm,
    onDeleteCancel,
    activeMenu,
    onMenuOpen,
    onMenuClose,
    creatingIn,
    onCreateSubmit,
    onCreateCancel,
  };

  if (isLoading) {
    return <div className="tree-loading">Loading…</div>;
  }

  return (
    <div role="tree" className="tree-root">
      {creatingIn?.parentId === "/" && (
        <InlineCreateRow
          depth={-1}
          kind={creatingIn.kind}
          onSubmit={(name) => onCreateSubmit("/", creatingIn.kind, name)}
          onCancel={onCreateCancel}
        />
      )}
      {rootChildren.map((node) => (
        <TreeNodeWithChildren
          key={node.id}
          node={node}
          depth={0}
          expandedSet={expandedSet}
          onToggle={handleToggle}
          onFileClick={handleFileClick}
          selectedId={selectedId}
          nodeActions={nodeActions}
        />
      ))}
    </div>
  );
};

export default FileTree;
