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
import AceEditor from "react-ace";
import SaveButton from "../components/SaveButton";
import NewFolderButton from "../components/NewFolderButton";
import NewFileButton from "../components/NewFileButton";
import "../App.css";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-dracula";

function WebIDE() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return <RedirectToSignIn />;

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
      if (result.error) alert("Error: " + result.error);
      else {
        alert("File saved!");
        setReloadTree(!reloadTree);
      }
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const createFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (!folderName) return;
    const response = await fetch(`${import.meta.env.VITE_API}/file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: `${folderName}/.keep`,
        content: "",
      }),
    });
    const result = await response.json();
    if (result.error) alert("Error: " + result.error);
    else {
      alert("Folder created");
      setReloadTree(!reloadTree);
    }
  };

  const createFile = async () => {
    const fileName = prompt("Enter file name:");
    if (!fileName) return;
    const response = await fetch(`${import.meta.env.VITE_API}/file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: fileName,
        content: "",
      }),
    });
    const result = await response.json();
    if (result.error) alert("Error: " + result.error);
    else {
      alert("File created");
      setReloadTree(!reloadTree);
    }
  };
  return (
    <div className="playground">
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
              <NewFolderButton onCreateFolder={createFolder} />
              <NewFileButton onCreateFile={createFile} />
            </div>
          </div>
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

          <AceEditor
            value={selectedFileContent}
            onChange={(newValue) => setSelectedFileContent(newValue)}
            mode="javascript"
            theme="dracula"
            name="editor"
            width="100%"
            height="100%"
            fontSize={16}
            enableBasicAutocompletion
            enableLiveAutocompletion
            enableSnippets
            lineHeight={19}
            showPrintMargin
            showGutter
            highlightActiveLine
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
              cursorStyle: "ace",
              $blockScrolling: true,
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
