import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { FaGithub } from "react-icons/fa";

const paperSx = {
  mt: 1.5,
  minWidth: 260,
  bgcolor: "var(--bg-secondary)",
  border: "1px solid var(--border-color-light)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-lg)",
  "& .MuiMenuItem-root": {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "var(--text-primary)",
    py: 0.8,
    "&:hover": { bgcolor: "var(--bg-hover)" },
  },
  "& .MuiListItemIcon-root": { color: "var(--text-secondary)", minWidth: 32 },
  "& .MuiDivider-root": { borderColor: "var(--border-color)" },
};

export default function UserProfileMenu() {
  const { user, signOut, signInWithOAuth } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [connecting, setConnecting] = useState(false);

  if (!user) return null;

  const open = Boolean(anchorEl);
  const name =
    user.user_metadata?.first_name || user.email?.split("@")[0] || "User";
  const email = user.email;
  const initials = (
    user.user_metadata?.first_name?.[0] ||
    user.email?.[0] ||
    "U"
  ).toUpperCase();

  // Check if GitHub is connected via OAuth identities
  const gh = user.identities?.find(
    (identity) => identity.provider === "github",
  );

  const connectGH = async () => {
    try {
      setConnecting(true);
      const { data, error } = await signInWithOAuth("github");
      if (error) {
        console.error("GitHub connect failed:", error);
        setConnecting(false);
      }
    } catch (err) {
      console.error("GitHub connect failed:", err);
      setConnecting(false);
    }
  };

  return (
    <>
      <IconButton
        className="upm-trigger"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="User menu"
      >
        <Avatar
          src={user.user_metadata?.avatar_url}
          alt={name}
          className="upm-trigger-avatar"
        >
          {initials}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{ zIndex: 1500 }}
        slotProps={{ paper: { sx: paperSx } }}
      >
        {/* User info */}
        <div className="upm-header">
          <Avatar
            src={user.user_metadata?.avatar_url}
            alt={name}
            className="upm-header-avatar"
          >
            {initials}
          </Avatar>
          <div className="upm-header-info">
            <span className="upm-name">{name}</span>
            {email && <span className="upm-email">{email}</span>}
          </div>
        </div>

        <Divider />

        {/* GitHub */}
        <div className="upm-gh-section" onClick={(e) => e.stopPropagation()}>
          <span className="upm-section-label">GitHub</span>
          {gh ? (
            <div className="upm-gh-row">
              <Avatar
                src={gh.identity_data?.avatar_url}
                className="upm-gh-avatar"
              >
                <FaGithub size={14} />
              </Avatar>
              <span className="upm-gh-user">
                {gh.identity_data?.user_name ||
                  gh.identity_data?.preferred_username ||
                  "Connected"}
              </span>
              <Chip label="Connected" size="small" className="upm-gh-chip" />
            </div>
          ) : (
            <Button
              fullWidth
              size="small"
              startIcon={<FaGithub size={14} />}
              onClick={connectGH}
              disabled={connecting}
              className="upm-gh-btn"
            >
              {connecting ? "Connecting…" : "Connect GitHub"}
            </Button>
          )}
        </div>

        <Divider />
        <MenuItem onClick={() => signOut()} className="upm-danger">
          <ListItemIcon>
            <LogoutIcon fontSize="small" className="upm-danger-icon" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
