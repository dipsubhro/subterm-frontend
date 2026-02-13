import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";

import { useRef, useEffect } from "react";
import Terminal from "../components/Terminal";
import FileTree from "../components/Tree";
import Editor from "@monaco-editor/react";
import SaveButton from "../components/SaveButton";
import NewFolderButton from "../components/NewFolderButton";
import NewFileButton from "../components/NewFileButton";

import GitHubSidebar from "../components/GitHubSidebar";
import "../App.css";

import { useFileStore, useUIStore, useFileCreationStore } from "../store";

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
  
  // ── Zustand stores ──
  const selectedFilePath = useFileStore((s) => s.selectedFilePath);
  const selectedFileContent = useFileStore((s) => s.selectedFileContent);
  const setSelectedFileContent = useFileStore((s) => s.setSelectedFileContent);
  const reloadTree = useFileStore((s) => s.reloadTree);
  const triggerReloadTree = useFileStore((s) => s.triggerReloadTree);
  const fetchFileContent = useFileStore((s) => s.fetchFileContent);
  const selectFile = useFileStore((s) => s.selectFile);
  const saveFile = useFileStore((s) => s.saveFile);

  const mobileFilesVisible = useUIStore((s) => s.mobileFilesVisible);
  const mobileTerminalVisible = useUIStore((s) => s.mobileTerminalVisible);
  const mobileGitHubVisible = useUIStore((s) => s.mobileGitHubVisible);
  const moreMenuOpen = useUIStore((s) => s.moreMenuOpen);
  const toggleMobileFiles = useUIStore((s) => s.toggleMobileFiles);
  const toggleMobileTerminal = useUIStore((s) => s.toggleMobileTerminal);
  const toggleMobileGitHub = useUIStore((s) => s.toggleMobileGitHub);
  const closeMobilePanels = useUIStore((s) => s.closeMobilePanels);
  const setMobileFilesVisible = useUIStore((s) => s.setMobileFilesVisible);
  const setMobileTerminalVisible = useUIStore((s) => s.setMobileTerminalVisible);
  const toggleMoreMenu = useUIStore((s) => s.toggleMoreMenu);
  const setMoreMenuOpen = useUIStore((s) => s.setMoreMenuOpen);
  const toast = useUIStore((s) => s.toast);
  const showToast = useUIStore((s) => s.showToast);
  const clearToast = useUIStore((s) => s.clearToast);

  const isCreating = useFileCreationStore((s) => s.isCreating);
  const newItemName = useFileCreationStore((s) => s.newItemName);
  const startCreatingFolder = useFileCreationStore((s) => s.startCreatingFolder);
  const startCreatingFile = useFileCreationStore((s) => s.startCreatingFile);
  const cancelCreating = useFileCreationStore((s) => s.cancelCreating);
  const setNewItemName = useFileCreationStore((s) => s.setNewItemName);
  const submitCreation = useFileCreationStore((s) => s.submitCreation);

  const editorRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch file content when selectedFilePath changes
  useEffect(() => {
    fetchFileContent(selectedFilePath);
  }, [selectedFilePath, fetchFileContent]);

  // Auto-focus input when creating
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => clearToast(), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuOpen && !e.target.closest('.more-menu') && !e.target.closest('.more-menu-trigger')) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [moreMenuOpen, setMoreMenuOpen]);

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

  const handleSave = async () => {
    const result = await saveFile();
    showToast(result.message, result.success ? "success" : "error");
    setMoreMenuOpen(false);
  };

  const handleStartCreatingFolder = () => {
    startCreatingFolder();
    setMoreMenuOpen(false);
  };

  const handleStartCreatingFile = () => {
    startCreatingFile();
    setMoreMenuOpen(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const result = await submitCreation();
    if (result) {
      showToast(result.message, result.success ? "success" : "error");
      if (result.success) {
        triggerReloadTree();
      }
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      cancelCreating();
    }
  };

  const handleMobileFileClick = (path) => {
    selectFile(path);
    setMobileFilesVisible(false);
  };

  return (
    <div className="playground">
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileFilesVisible || mobileTerminalVisible || mobileGitHubVisible || moreMenuOpen ? 'active' : ''}`}
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
          <SaveButton onSave={handleSave} />
          <UserButton />
        </div>
        {/* Mobile - only show UserButton in topbar */}
        <div className="mobile-only">
          <UserButton />
        </div>
      </div>

      <div className="container">
        {/* Left Sidebar: File Manager */}
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
              <NewFolderButton onCreateFolder={handleStartCreatingFolder} />
              <NewFileButton onCreateFile={handleStartCreatingFile} />
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

        {/* Middle Section: Editor & Terminal */}
        <div className="middle-section">
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
        </div>

        {/* Right Sidebar: GitHub Repos */}
        <GitHubSidebar 
          className={mobileGitHubVisible ? 'mobile-visible' : ''}
        />

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

        {/* GitHub Toggle */}
        <button 
          className={`mobile-toolbar-btn ${mobileGitHubVisible ? 'active' : ''}`}
          onClick={toggleMobileGitHub}
          aria-label="Toggle GitHub"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>GitHub</span>
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
            toggleMoreMenu();
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
        <button className="more-menu-item" onClick={handleStartCreatingFile}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          New File
        </button>
        <button className="more-menu-item" onClick={handleStartCreatingFolder}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            <line x1="12" y1="11" x2="12" y2="17"></line>
            <line x1="9" y1="14" x2="15" y2="14"></line>
          </svg>
          New Folder
        </button>
      </div>

      {/* Mobile styles are now in App.css */}
    </div>
  );
}

export default WebIDE;
