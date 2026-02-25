import { IconButton, Tooltip } from "@mui/material";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";

export default function NewFolderButton({ onCreateFolder }) {
  return (
    <Tooltip title="New Folder" placement="bottom">
      <IconButton onClick={onCreateFolder} size="small">
        <CreateNewFolderOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
}
