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
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#1E1E1E",
        color: "#D4D4D4",
        fontFamily: "'JetBrains Mono', monospace",
      }}>
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
  };

  const startCreatingFolder = () => {
    setIsCreating('folder');
    setNewItemName("");
  };

  const startCreatingFile = () => {
    setIsCreating('file');
    setNewItemName("");
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

  return (
    <div className="playground">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            padding: "12px 20px",
            borderRadius: "8px",
            background: toast.type === 'error' ? "#F44336" : "#4CAF50",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1000,
            animation: "slideIn 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
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
          {toast.message}
        </div>
      )}

      <div className="container">
        <div className="files">
          <div
            className="selected-file-label"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: selectedFilePath ? "#D4D4D4" : "#858585",
                fontSize: "13px",
                fontWeight: "500",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {selectedFilePath || "No file selected"}
            </span>
            <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
              <NewFolderButton onCreateFolder={startCreatingFolder} />
              <NewFileButton onCreateFile={startCreatingFile} />
            </div>
          </div>

          {/* Inline Create Input */}
          {isCreating && (
            <form
              onSubmit={handleCreateSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px 12px",
                gap: "8px",
                background: "#252526",
                borderBottom: "1px solid #2A2A2A",
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                {isCreating === 'folder' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DCDCAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CDCFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  // Small delay to allow form submit to fire first
                  setTimeout(() => {
                    if (!newItemName.trim()) cancelCreating();
                  }, 100);
                }}
                placeholder={isCreating === 'folder' ? "folder name..." : "filename.ext"}
                style={{
                  flex: 1,
                  background: "#3C3C3C",
                  border: "1px solid #007ACC",
                  borderRadius: "3px",
                  padding: "4px 8px",
                  color: "#D4D4D4",
                  fontSize: "13px",
                  fontFamily: "'JetBrains Mono', monospace",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#007ACC",
                  border: "none",
                  borderRadius: "3px",
                  padding: "4px 8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Create"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button
                type="button"
                onClick={cancelCreating}
                style={{
                  background: "transparent",
                  border: "none",
                  borderRadius: "3px",
                  padding: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Cancel (Esc)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#858585" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </form>
          )}

          <FileTree onFileClick={setSelectedFilePath} key={reloadTree} />
        </div>

        <div className="editor">
          <div
            style={{
              background: "#1E1E1E",
              height: "40px",
              padding: "0 16px",
              color: "#D4D4D4",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              borderBottom: "1px solid #2A2A2A",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007ACC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
              <span
                style={{
                  color: "#007ACC",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                SubTerm
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <SaveButton onSave={handleSave} />
              <UserButton />
            </div>
          </div>

          <Editor
            value={selectedFileContent}
            onChange={(newValue) => setSelectedFileContent(newValue || "")}
            language={getLanguageFromPath(selectedFilePath)}
            theme="vs-dark"
            options={{
              fontSize: 16,
              lineHeight: 24,
              minimap: { enabled: true },
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

      <div className="terminal">
        <Terminal />
      </div>
    </div>
  );
}

export default WebIDE;
