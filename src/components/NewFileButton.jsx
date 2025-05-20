export default function NewFileButton({ onCreateFile }) {
  return (
    <button
      onClick={onCreateFile}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        src="/add.png"
        alt="Add File"
        style={{ width: "30px", height: "30px" }}
      />
    </button>
  );
}
