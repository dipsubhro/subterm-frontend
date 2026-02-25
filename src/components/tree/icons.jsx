// MUI icon components used across the file tree
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

export const ChevronIcon = ({ isOpen }) => (
  <ChevronRightIcon
    sx={{
      fontSize: 14,
      color: "#858585",
      flexShrink: 0,
      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
      transition: "transform 0.15s ease",
    }}
  />
);

export const FolderIcon = ({ isOpen }) =>
  isOpen ? (
    <FolderOpenRoundedIcon
      sx={{ fontSize: 16, color: "#DCDCAA", flexShrink: 0 }}
    />
  ) : (
    <FolderRoundedIcon sx={{ fontSize: 16, color: "#DCDCAA", flexShrink: 0 }} />
  );

export const FileIcon = () => (
  <InsertDriveFileOutlinedIcon
    sx={{ fontSize: 16, color: "#9CDCFE", flexShrink: 0 }}
  />
);

export const PlusIcon = () => <AddIcon sx={{ fontSize: 14 }} />;

export const DotsIcon = () => <MoreVertIcon sx={{ fontSize: 14 }} />;

// Inline icons used inside dropdown menu items
export const menuIcons = {
  newFile: <NoteAddOutlinedIcon sx={{ fontSize: 14, color: "#9CDCFE" }} />,
  newFolder: (
    <CreateNewFolderOutlinedIcon sx={{ fontSize: 14, color: "#DCDCAA" }} />
  ),
  rename: <DriveFileRenameOutlineIcon sx={{ fontSize: 14 }} />,
  delete: <DeleteOutlineIcon sx={{ fontSize: 14, color: "#C74E39" }} />,
  folderSmall: <FolderOutlinedIcon sx={{ fontSize: 14, color: "#DCDCAA" }} />,
  fileSmall: (
    <InsertDriveFileOutlinedIcon sx={{ fontSize: 14, color: "#9CDCFE" }} />
  ),
};
