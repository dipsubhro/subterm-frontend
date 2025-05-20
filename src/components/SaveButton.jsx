export default function SaveButton({ onSave }) {
  return (
    <button
      onClick={onSave}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
      onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
    >
      <img
        src="/diskette.png"
        alt="Save"
        style={{ width: "32px", height: "32px" }}
      />
    </button>
  );
}
