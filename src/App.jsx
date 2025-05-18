import { useState, useRef } from "react";
import Terminal from "./components/Terminal";
import FileTree from "./components/Tree";
import AceEditor from "react-ace";
import "./App.css";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-dracula";

const defaultCode = `console.log("Hello from team techtitans");
console.log("Welcome Online Compiler!");`;

function App() {
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const editorRef = useRef(null);

  return (
    <div className="playground">
      <div className="container">
        <div className="files">
          {selectedFilePath && (
            <div className="selected-file-label">
              <strong>📄 {selectedFilePath}</strong>
            </div>
          )}
          <FileTree onFileClick={setSelectedFilePath} />
        </div>
        <div className="editor">
          <AceEditor
            defaultValue={defaultCode}
            mode="javascript"
            theme="dracula"
            name="UNIQUE_ID_OF_DIV"
            width="100%"
            fontSize={16}
            enableBasicAutocompletion
            enableLiveAutocompletion
            enableSnippets
            ref={editorRef}
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
