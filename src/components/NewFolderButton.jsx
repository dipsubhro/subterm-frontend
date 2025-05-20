export default function NewFolderButton({ onCreateFolder }) {
  return (
    <button
      onClick={onCreateFolder}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      <img src="/new-folder.png" alt="New Folder" style={{ width: "30px", height: "30px" }} />
    </button>
  );
}
