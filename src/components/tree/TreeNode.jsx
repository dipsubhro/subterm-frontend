// Single tree row — chevron, icon, name, git badge, hover actions

import { useState, useRef } from "react";
import { ChevronIcon, FolderIcon, FileIcon, PlusIcon, DotsIcon, menuIcons } from "./icons";
import { ActionDropdown, InlineInput } from "./actions";

const GIT_CLASS = {
  modified: "git-modified",
  added: "git-added",
  deleted: "git-deleted",
  untracked: "git-untracked",
  renamed: "git-renamed",
  conflicted: "git-conflicted",
};

export default function TreeNode({
  node,
  depth,
  expandedSet,
  onToggle,
  onFileClick,
  selectedId,
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
}) {
  const isFolder = node.kind === "folder";
  const isOpen = expandedSet.has(node.id);
  const isSelected = selectedId === node.id;
  const isRenaming = renamingId === node.id;
  const isDeleting = deletingId === node.id;
  const gitClass = node.git ? GIT_CLASS[node.git.status] : null;

  const showCreateMenu = activeMenu?.nodeId === node.id && activeMenu?.type === "create";
  const showMoreMenu = activeMenu?.nodeId === node.id && activeMenu?.type === "more";

  const [hovered, setHovered] = useState(false);

  const createItems = [
    { label: "New File", icon: menuIcons.newFile, action: () => onAction(node.id, "newFile") },
    { label: "New Folder", icon: menuIcons.newFolder, action: () => onAction(node.id, "newFolder") },
  ];

  const moreItems = [
    { label: "Rename", icon: menuIcons.rename, action: () => onAction(node.id, "rename") },
    { label: "Delete", icon: menuIcons.delete, action: () => onAction(node.id, "delete") },
  ];

  const rowClass = `tree-node${isSelected ? " selected" : ""}`;

  return (
    <div
      role="treeitem"
      aria-expanded={isFolder ? isOpen : undefined}
      className={rowClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        if (isRenaming || isDeleting) return;
        e.stopPropagation();
        if (isFolder) onToggle(node.id);
        else onFileClick(node.id);
      }}
      style={{ paddingLeft: depth * 16 }}
    >
      {/* Chevron */}
      <span className="tree-chevron">
        {isFolder && node.hasChildren && <ChevronIcon isOpen={isOpen} />}
      </span>

      {/* Icon */}
      <span className="tree-icon">
        {isFolder ? <FolderIcon isOpen={isOpen} /> : <FileIcon />}
      </span>

      {/* Name / Rename / Delete */}
      {isRenaming ? (
        <InlineInput
          defaultValue={node.name}
          onSubmit={(newName) => onRenameSubmit(node, newName)}
          onCancel={onRenameCancel}
        />
      ) : isDeleting ? (
        <>
          <span className="tree-name-deleted">{node.name}</span>
          <div className="tree-delete-bar" onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: 11 }}>Delete?</span>
            <button className="confirm" onClick={() => onDeleteConfirm(node)}>Yes</button>
            <button className="cancel" onClick={onDeleteCancel}>No</button>
          </div>
        </>
      ) : (
        <>
          <span className={`tree-name${gitClass ? ` ${gitClass}` : ""}`}>
            {node.name}
          </span>

          {/* Git badge */}
          {node.git && (
            <span className={`tree-git-badge${gitClass ? ` ${gitClass}` : ""}`}>
              {node.git.status[0]}
            </span>
          )}

          {/* Hover actions */}
          <div
            className={`tree-action-bar${hovered || showCreateMenu || showMoreMenu ? " visible" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {isFolder && (
              <div style={{ position: "relative" }}>
                <button
                  className="tree-action-btn"
                  title="Create"
                  onClick={() => onMenuOpen(node.id, "create")}
                >
                  <PlusIcon />
                </button>
                {showCreateMenu && <ActionDropdown items={createItems} onClose={onMenuClose} />}
              </div>
            )}

            <div style={{ position: "relative" }}>
              <button
                className="tree-action-btn"
                title="More"
                onClick={() => onMenuOpen(node.id, "more")}
              >
                <DotsIcon />
              </button>
              {showMoreMenu && <ActionDropdown items={moreItems} onClose={onMenuClose} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
