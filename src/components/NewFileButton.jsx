import { IconButton, Tooltip } from "@mui/material";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";

export default function NewFileButton({ onCreateFile }) {
  return (
    <Tooltip title="New File" placement="bottom">
      <IconButton onClick={onCreateFile} size="small">
        <NoteAddOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
}
