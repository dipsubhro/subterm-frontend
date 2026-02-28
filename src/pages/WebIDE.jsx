import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import {
  Box,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Button as MuiButton,
} from "@mui/material";
import KeyboardIcon from "@mui/icons-material/Keyboard";

import { useRef, useEffect, useCallback, useState } from "react";
import Terminal from "../components/Terminal";
import FileTree from "../components/tree/FileTree";
import Editor from "@monaco-editor/react";
import ShortcutsModal from "../components/ShortcutsModal";
import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
  usePanelRef,
} from "react-resizable-panels";

import GitHubSidebar from "../components/GitHubSidebar";
import UserProfileMenu from "../components/UserProfileMenu";
import "../App.css";

import { useFileStore, useUIStore } from "../store";
import useIsPortraitMobile from "../hooks/useIsPortraitMobile";
import socket, { connectToSession } from "../socket";
import { setSessionBaseURL } from "../lib/axios";

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
  const isPortraitMobile = useIsPortraitMobile();
  // const isPortraitMobile = false;

  // ── Zustand stores ──
  const selectedFilePath = useFileStore((s) => s.selectedFilePath);
  const selectedFileContent = useFileStore((s) => s.selectedFileContent);
  const setSelectedFileContent = useFileStore((s) => s.setSelectedFileContent);
  const reloadTree = useFileStore((s) => s.reloadTree);
  const fetchFileContent = useFileStore((s) => s.fetchFileContent);
  const selectFile = useFileStore((s) => s.selectFile);
  const saveFile = useFileStore((s) => s.saveFile);

  const showToast = useUIStore((s) => s.showToast);
  const clearToast = useUIStore((s) => s.clearToast);
  const toast = useUIStore((s) => s.toast);

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [validationEnabled, setValidationEnabled] = useState(true);
  const [vmReady, setVmReady] = useState(socket.connected);
  const [vmCapFull, setVmCapFull] = useState(false);

  // Provision a container from the gateway on mount
  useEffect(() => {
    const GATEWAY = import.meta.env.VITE_GATEWAY_URL || "http://localhost:4500";
    fetch(`${GATEWAY}/api/container`, { method: "POST" })
      .then((res) => {
        if (res.status === 503) {
          setVmCapFull(true);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data?.sessionId) return;
        // Wire axios and socket through the router workspace path
        setSessionBaseURL(data.sessionId);
        connectToSession(data.sessionId);
      })
      .catch(() => {
        // Gateway unreachable in pure dev mode — ignore
      });

    // Update vmReady based on socket connection state
    const onConnect = () => setVmReady(true);
    const onDisconnect = () => setVmReady(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const editorRef = useRef(null);

  // ── Panel refs for toggle buttons ──
  const explorerPanelRef = usePanelRef();
  const terminalPanelRef = usePanelRef();
  const githubPanelRef = usePanelRef();

  const toggleExplorer = useCallback(() => {
    if (explorerPanelRef.current?.isCollapsed()) {
      explorerPanelRef.current.expand();
    } else {
      explorerPanelRef.current?.collapse();
    }
  }, [explorerPanelRef]);

  const toggleTerminal = useCallback(() => {
    if (terminalPanelRef.current?.isCollapsed()) {
      terminalPanelRef.current.expand();
    } else {
      terminalPanelRef.current?.collapse();
    }
  }, [terminalPanelRef]);

  const toggleGitHub = useCallback(() => {
    if (githubPanelRef.current?.isCollapsed()) {
      githubPanelRef.current.expand();
    } else {
      githubPanelRef.current?.collapse();
    }
  }, [githubPanelRef]);

  // Fetch file content when selectedFilePath changes
  useEffect(() => {
    fetchFileContent(selectedFilePath);
  }, [selectedFilePath, fetchFileContent]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => clearToast(), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveFile().then((result) => {
          showToast(result.message, result.success ? "success" : "error");
        });
      }

      // Toggle validation: Shift + Alt + V
      if (e.shiftKey && e.altKey && e.code === "KeyV") {
        e.preventDefault();
        setValidationEnabled((prev) => !prev);
        showToast(
          `Validation ${!validationEnabled ? "enabled" : "disabled"}`,
          "info",
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveFile, showToast, validationEnabled]);

  // Show loading while Clerk determines auth state
  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#1e1e1e",
        }}
      >
        <CircularProgress size={18} sx={{ color: "#007acc", mr: 1.5 }} />
        <Typography
          sx={{ color: "#d4d4d4", fontFamily: "inherit", fontSize: 13 }}
        >
          Loading...
        </Typography>
      </Box>
    );
  }

  // No VM slots available
  if (vmCapFull) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#1e1e1e",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f44336"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <Typography
            sx={{
              color: "#f44336",
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            No VM available
          </Typography>
          <Typography
            sx={{
              color: "#858585",
              fontFamily: "inherit",
              fontSize: 12,
              textAlign: "center",
              maxWidth: 320,
            }}
          >
            All sandbox slots are currently in use. Please try again in a few
            minutes.
          </Typography>
          <MuiButton
            variant="contained"
            color="primary"
            size="small"
            sx={{ textTransform: "none", fontFamily: "inherit" }}
            onClick={() => window.location.reload()}
          >
            Retry
          </MuiButton>
        </Box>
      </Box>
    );
  }

  // Show VM boot screen while socket connects
  if (!vmReady) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#1e1e1e",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={28} sx={{ color: "#007acc" }} />
          <Typography
            sx={{ color: "#d4d4d4", fontFamily: "inherit", fontSize: 13 }}
          >
            Booting up VM<span className="vm-boot-dots"></span>
          </Typography>
        </Box>
      </Box>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isSignedIn) return <RedirectToSignIn />;

  const handleSave = async () => {
    const result = await saveFile();
    showToast(result.message, result.success ? "success" : "error");
  };

  return (
    <div className="playground">
      {/* Portrait Mobile Overlay */}
      {isPortraitMobile && (
        <div className="portrait-overlay">
          <div className="portrait-message">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
              <path d="M12 4v16"></path>
            </svg>
            <h2>Please rotate your device</h2>
            <p>WebIDE works best in landscape mode.</p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toast)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={
            toast?.type === "error"
              ? "error"
              : toast?.type === "info"
                ? "info"
                : "success"
          }
          variant="filled"
          sx={{ fontFamily: "inherit", fontSize: 12 }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>

      <div className="subterm-topbar">
        <div className="logo">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <span className="logo-text">SubTerm</span>
        </div>

        <div className="actions">
          <Tooltip title="Keyboard Shortcuts" placement="bottom">
            <IconButton
              size="small"
              onClick={() => setShowShortcuts(true)}
              aria-label="Keyboard Shortcuts"
            >
              <KeyboardIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          {/* Panel toggle buttons */}
          <div className="panel-toggles">
            <Tooltip title="Toggle Explorer" placement="bottom">
              <IconButton
                size="small"
                className="panel-toggle-btn"
                onClick={toggleExplorer}
                aria-label="Toggle Explorer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle Terminal" placement="bottom">
              <IconButton
                size="small"
                className="panel-toggle-btn"
                onClick={toggleTerminal}
                aria-label="Toggle Terminal"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                </svg>
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle GitHub" placement="bottom">
              <IconButton
                size="small"
                className="panel-toggle-btn"
                onClick={toggleGitHub}
                aria-label="Toggle GitHub"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                </svg>
              </IconButton>
            </Tooltip>
          </div>

          <UserProfileMenu />
        </div>
      </div>

      <PanelGroup
        orientation="horizontal"
        autoSaveId="ide-layout"
        className="container"
      >
        {/* Left Sidebar: File Manager */}
        <Panel
          panelRef={explorerPanelRef}
          id="explorer-panel"
          defaultSize={20}
          minSize={10}
          collapsible={true}
          collapsedSize={0}
          className="files"
        >
          <div className="selected-file-label">
            <span className={`file-name ${!selectedFilePath ? "empty" : ""}`}>
              {selectedFilePath || "No file selected"}
            </span>
          </div>

          <FileTree onFileClick={(path) => selectFile(path)} key={reloadTree} />
        </Panel>

        <PanelResizeHandle className="resize-handle-horizontal" />

        {/* Middle Section: Editor & Terminal */}
        <Panel defaultSize={55} minSize={30}>
          <PanelGroup
            orientation="vertical"
            autoSaveId="center-layout"
            className="middle-section"
          >
            <Panel defaultSize={65} minSize={20} className="editor">
              <Editor
                value={selectedFileContent}
                onChange={(newValue) => setSelectedFileContent(newValue || "")}
                language={getLanguageFromPath(selectedFilePath)}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  lineHeight: 22,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  smoothScrolling: true,
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
                  renderValidationDecorations: validationEnabled ? "on" : "off",
                }}
              />
            </Panel>

            <PanelResizeHandle className="resize-handle-vertical" />

            <Panel
              panelRef={terminalPanelRef}
              id="terminal-panel"
              defaultSize={35}
              minSize={10}
              collapsible={true}
              collapsedSize={0}
              className="terminal"
            >
              <Terminal />
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="resize-handle-horizontal" />

        {/* Right Sidebar: GitHub Repos */}
        <Panel
          panelRef={githubPanelRef}
          id="github-panel"
          defaultSize={25}
          minSize={15}
          collapsible={true}
          collapsedSize={0}
        >
          <GitHubSidebar />
        </Panel>
      </PanelGroup>

      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}

export default WebIDE;
