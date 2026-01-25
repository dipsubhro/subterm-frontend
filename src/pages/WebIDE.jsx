import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";

import { useState, useRef, useEffect } from "react";
import Terminal from "../components/Terminal";
import FileTree from "../components/Tree";
import Editor from "@monaco-editor/react";
import SaveButton from "../components/SaveButton";
import NewFolderButton from "../components/NewFolderButton";
import NewFileButton from "../components/NewFileButton";
import GitHubImportModal from "../components/GitHubImportModal";
import "../App.css";

// Helper function to determine Monaco language from file path
const getLanguageFromPath = (filePath) => {
  if (!filePath) return "plaintext";
  
  const ext = filePath.split(".").pop()?.toLowerCase();
  const languageMap = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    html: "html",
    css: "css",
    scss: "scss",
    less: "less",
    json: "json",
    md: "markdown",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    go: "go",
    rs: "rust",
    java: "java",
    c: "c",
    cpp: "cpp",
    h: "c",
    hpp: "cpp",
    php: "php",
    rb: "ruby",
    swift: "swift",
    kt: "kotlin",
    scala: "scala",
    r: "r",
    lua: "lua",
    dockerfile: "dockerfile",
    graphql: "graphql",
    vue: "vue",
    svelte: "svelte",
  };
  
  return languageMap[ext] || "plaintext";
};

function WebIDE() {
  const { isSignedIn, isLoaded } = useUser();
  
  // All hooks must be called unconditionally (React rules of hooks)
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [reloadTree, setReloadTree] = useState(false);
  const editorRef = useRef(null);

  // Mobile state management
  const [mobileFilesVisible, setMobileFilesVisible] = useState(false);
  const [mobileTerminalVisible, setMobileTerminalVisible] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    if (!selectedFilePath) return;
    fetch(
      `${import.meta.env.VITE_API}/file?path=${encodeURIComponent(
        selectedFilePath
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) console.error("Server error:", data.error);
        else setSelectedFileContent(data.content);
      })
      .catch((err) => console.error("Failed to load file:", err));
  }, [selectedFilePath]);

  // Show loading while Clerk determines auth state
  if (!isLoaded) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isSignedIn) return <RedirectToSignIn />;

  // Inline input state for creating files/folders
  const [isCreating, setIsCreating] = useState(null); // 'file' | 'folder' | null
  const [newItemName, setNewItemName] = useState("");
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus input when creating
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuOpen && !e.target.closest('.more-menu') && !e.target.closest('.more-menu-trigger')) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [moreMenuOpen]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: selectedFilePath,
          content: selectedFileContent,
        }),
      });

      const result = await response.json();
      if (result.error) showToast("Error: " + result.error, 'error');
      else {
        showToast("File saved successfully!");
        setReloadTree(!reloadTree);
      }
    } catch (error) {
      console.error("Save failed:", error);
      showToast("Save failed!", 'error');
    }
    setMoreMenuOpen(false);
  };

  const startCreatingFolder = () => {
    setIsCreating('folder');
    setNewItemName("");
    setMoreMenuOpen(false);
  };

  const startCreatingFile = () => {
    setIsCreating('file');
    setNewItemName("");
    setMoreMenuOpen(false);
  };

  const cancelCreating = () => {
    setIsCreating(null);
    setNewItemName("");
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      cancelCreating();
      return;
    }

    const itemName = newItemName.trim();
    const isFolder = isCreating === 'folder';

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/file`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: isFolder ? `${itemName}/.keep` : itemName,
          content: "",
        }),
      });
      const result = await response.json();
      if (result.error) {
        showToast("Error: " + result.error, 'error');
      } else {
        showToast(`${isFolder ? 'Folder' : 'File'} "${itemName}" created!`);
        setReloadTree(!reloadTree);
      }
    } catch (error) {
      console.error("Create failed:", error);
      showToast("Failed to create " + (isFolder ? 'folder' : 'file'), 'error');
    }

    cancelCreating();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      cancelCreating();
    }
  };

  // Mobile panel toggle handlers
  const toggleMobileFiles = () => {
    setMobileFilesVisible(!mobileFilesVisible);
    setMobileTerminalVisible(false);
    setMoreMenuOpen(false);
  };

  const toggleMobileTerminal = () => {
    setMobileTerminalVisible(!mobileTerminalVisible);
    setMobileFilesVisible(false);
    setMoreMenuOpen(false);
  };

  const closeMobilePanels = () => {
    setMobileFilesVisible(false);
    setMobileTerminalVisible(false);
    setMoreMenuOpen(false);
  };

  const handleMobileFileClick = (path) => {
    setSelectedFilePath(path);
    setMobileFilesVisible(false);
  };

  const handleGitHubImport = () => {
    setIsGitHubModalOpen(true);
    setMoreMenuOpen(false);
  };

  return (
    <div className="playground">
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileFilesVisible || mobileTerminalVisible || moreMenuOpen ? 'active' : ''}`}
        onClick={closeMobilePanels}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type === 'error' ? 'error' : ''}`}>
          <span className="icon">
            {toast.type === 'error' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
          </span>
          {toast.message}
        </div>
      )}

      <div className="subterm-topbar">
        <div className="logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <span className="logo-text">SubTerm</span>
        </div>
        {/* Desktop buttons - visible only on larger screens */}
        <div className="desktop-only actions">
          {/* GitHub Import Button */}
          <button
            className="github-button"
            onClick={() => setIsGitHubModalOpen(true)}
            title="Import from GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Import
          </button>
          <SaveButton onSave={handleSave} />
          <UserButton />
        </div>
        {/* Mobile - only show UserButton in topbar */}
        <div className="mobile-only">
          <UserButton />
        </div>
      </div>

      <div className="container">
        <div className={`files ${mobileFilesVisible ? 'mobile-visible' : ''}`}>
          {/* Mobile close button */}
          <button 
            className="panel-close-btn"
            onClick={() => setMobileFilesVisible(false)}
            aria-label="Close file explorer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="selected-file-label">
            <span className={`file-name ${!selectedFilePath ? 'empty' : ''}`}>
              {selectedFilePath || "No file selected"}
            </span>
            <div className="file-actions">
              <NewFolderButton onCreateFolder={startCreatingFolder} />
              <NewFileButton onCreateFile={startCreatingFile} />
            </div>
          </div>

          {/* Inline Create Input */}
          {isCreating && (
            <form className="inline-create-form" onSubmit={handleCreateSubmit}>
              <span className="icon">
                {isCreating === 'folder' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-folder)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-file)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                )}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onBlur={() => {
                  setTimeout(() => {
                    if (!newItemName.trim()) cancelCreating();
                  }, 100);
                }}
                placeholder={isCreating === 'folder' ? "folder name..." : "filename.ext"}
              />
              <button type="submit" className="icon-button" title="Create">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button type="button" className="icon-button" onClick={cancelCreating} title="Cancel (Esc)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </form>
          )}

          <FileTree 
            onFileClick={handleMobileFileClick} 
            key={reloadTree} 
          />
        </div>

        <div className="editor">
          <Editor
            value={selectedFileContent}
            onChange={(newValue) => setSelectedFileContent(newValue || "")}
            language={getLanguageFromPath(selectedFilePath)}
            theme="vs-dark"
            options={{
              fontSize: 14,
              lineHeight: 22,
              minimap: { enabled: window.innerWidth > 768 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              // IntelliSense settings
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true,
              },
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: "on",
              tabCompletion: "on",
              wordBasedSuggestions: "allDocuments",
              parameterHints: { enabled: true },
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showClasses: true,
                showFunctions: true,
                showVariables: true,
                showWords: true,
                showProperties: true,
                showMethods: true,
                showReferences: true,
                insertMode: "insert",
              },
              // Additional editor features
              formatOnPaste: true,
              formatOnType: true,
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
              autoSurround: "languageDefined",
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true,
              },
              folding: true,
              foldingHighlight: true,
              showFoldingControls: "mouseover",
              renderLineHighlight: "all",
              lineNumbers: "on",
            }}
          />
        </div>
      </div>

      <div className={`terminal ${mobileTerminalVisible ? 'mobile-visible' : ''}`}>
        {/* Mobile terminal header */}
        <div className="terminal-mobile-header">
          <span className="title">Terminal</span>
          <button 
            className="icon-button"
            onClick={() => setMobileTerminalVisible(false)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <Terminal />
      </div>

      {/* Mobile Bottom Toolbar */}
      <div className="mobile-toolbar">
        {/* Files Toggle */}
        <button 
          className={`mobile-toolbar-btn ${mobileFilesVisible ? 'active' : ''}`}
          onClick={toggleMobileFiles}
          aria-label="Toggle file explorer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Files</span>
        </button>

        {/* Editor (always focused visually) */}
        <button 
          className={`mobile-toolbar-btn ${!mobileFilesVisible && !mobileTerminalVisible ? 'active' : ''}`}
          onClick={closeMobilePanels}
          aria-label="Focus editor"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          <span>Editor</span>
        </button>

        {/* Terminal Toggle */}
        <button 
          className={`mobile-toolbar-btn ${mobileTerminalVisible ? 'active' : ''}`}
          onClick={toggleMobileTerminal}
          aria-label="Toggle terminal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <span>Terminal</span>
        </button>

        {/* Save Button */}
        <button 
          className="mobile-toolbar-btn"
          onClick={handleSave}
          aria-label="Save file"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>Save</span>
        </button>

        {/* More Menu Trigger */}
        <button 
          className={`mobile-toolbar-btn more-menu-trigger ${moreMenuOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setMoreMenuOpen(!moreMenuOpen);
          }}
          aria-label="More options"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
          <span>More</span>
        </button>
      </div>

      {/* More Menu Dropdown */}
      <div className={`more-menu ${moreMenuOpen ? 'active' : ''}`}>
        <button className="more-menu-item" onClick={handleGitHubImport}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Import from GitHub
        </button>
        <div className="more-menu-divider"></div>
        <button className="more-menu-item" onClick={startCreatingFile}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          New File
        </button>
        <button className="more-menu-item" onClick={startCreatingFolder}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            <line x1="12" y1="11" x2="12" y2="17"></line>
            <line x1="9" y1="14" x2="15" y2="14"></line>
          </svg>
          New Folder
        </button>
      </div>

      {/* GitHub Import Modal */}
      <GitHubImportModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onImportSuccess={(message) => {
          showToast(message);
          setReloadTree(!reloadTree);
        }}
      />

      {/* Mobile styles are now in App.css */}
    </div>
  );
}

export default WebIDE;
