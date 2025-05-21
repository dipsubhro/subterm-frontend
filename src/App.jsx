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
import Terminal from "./components/Terminal";
import FileTree from "./components/Tree";
import AceEditor from "react-ace";
import SaveButton from "./components/SaveButton";
import NewFolderButton from "./components/NewFolderButton";
import NewFileButton from "./components/NewFileButton";
import "./App.css";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-dracula";

function App() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) return <RedirectToSignIn />;

  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [reloadTree, setReloadTree] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!selectedFilePath) return;
    fetch(
      `http://localhost:3334/file?path=${encodeURIComponent(selectedFilePath)}`
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
      const response = await fetch("http://localhost:3334/file", {
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
    const response = await fetch("http://localhost:3334/file", {
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
    const response = await fetch("http://localhost:3334/file", {
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
              paddingBottom: "8px",
            }}
          >
            <strong style={{ color: selectedFilePath ? "#fff" : "#888" }}>
              {selectedFilePath || "No file selected"}
            </strong>
            <div style={{ display: "flex", gap: "8px" }}>
              <NewFolderButton onCreateFolder={createFolder} />
              <NewFileButton onCreateFile={createFile} />
            </div>
          </div>
          <FileTree onFileClick={setSelectedFilePath} key={reloadTree} />
        </div>

        <div className="editor">
          <div
            style={{
              background: "linear-gradient(to right, #1f004d,  #3e0f91)",
              height: "45px",
              padding: "0 20px",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "18px",
              fontWeight: "600",
              fontFamily: "'Fira Code', 'Courier New', monospace",
              borderBottom: "2px solid #3b0764",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              letterSpacing: "0.5px",
            }}
          >
            <img src="/terminal.png" alt="Logo" style={{ height: "32px" }} />
            <span
              style={{
                background: "linear-gradient(to right, #a78bfa, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Fira Code', monospace",
                fontSize: "22px",
                fontWeight: "bold",
              }}
            >
              SubTerm
            </span>
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

export default App;
