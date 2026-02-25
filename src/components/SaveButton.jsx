import { IconButton, Tooltip } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

export default function SaveButton({ onSave }) {
  return (
    <Tooltip title="Save File" placement="bottom">
      <IconButton onClick={onSave} size="small">
        <SaveOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
}
