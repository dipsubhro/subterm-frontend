import { useUser, useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import { Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Chip, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { FaGithub } from "react-icons/fa";

const paperSx = {
  mt: 1.5, minWidth: 260, bgcolor: "var(--bg-secondary)",
  border: "1px solid var(--border-color-light)", borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-lg)",
  "& .MuiMenuItem-root": { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)", py: 0.8, "&:hover": { bgcolor: "var(--bg-hover)" } },
  "& .MuiListItemIcon-root": { color: "var(--text-secondary)", minWidth: 32 },
  "& .MuiDivider-root": { borderColor: "var(--border-color)" },
};

export default function UserProfileMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [anchorEl, setAnchorEl] = useState(null);
  const [connecting, setConnecting] = useState(false);
  if (!user) return null;

  const open = Boolean(anchorEl);
  const name = user.fullName || user.firstName || user.username || "User";
  const email = user.primaryEmailAddress?.emailAddress;
  const initials = (user.firstName?.[0] || user.username?.[0] || "U").toUpperCase();
  const gh = user.externalAccounts?.find((a) => a.provider === "oauth_github");

  const connectGH = async () => {
    try {
      setConnecting(true);
      const ext = await user.createExternalAccount({
        strategy: "oauth_github",
        redirectUrl: "/sso-callback",
      });
      // The verification object contains the URL to redirect to for OAuth
      const url =
        ext.verification?.externalVerificationRedirectURL?.href ||
        ext.verification?.externalVerificationRedirectURL;
      if (url) {
        window.location.href = url;
      } else {
        console.error("No redirect URL returned:", ext);
        setConnecting(false);
      }
    } catch (err) {
      console.error("GitHub connect failed:", err);
      setConnecting(false);
    }
  };

  return (
    <>
      <button className="upm-trigger" onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="User menu">
        <Avatar src={user.imageUrl} alt={name} className="upm-trigger-avatar">{initials}</Avatar>
      </button>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} onClick={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{ zIndex: 1500 }}
        slotProps={{ paper: { sx: paperSx } }}>

        {/* User info */}
        <div className="upm-header">
          <Avatar src={user.imageUrl} alt={name} className="upm-header-avatar">{initials}</Avatar>
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
              <Avatar src={gh.avatarUrl} className="upm-gh-avatar"><FaGithub size={14} /></Avatar>
              <span className="upm-gh-user">{gh.username || "Connected"}</span>
              <Chip label="Connected" size="small" className="upm-gh-chip" />
            </div>
          ) : (
            <Button fullWidth size="small" startIcon={<FaGithub size={14} />}
              onClick={connectGH} disabled={connecting} className="upm-gh-btn">
              {connecting ? "Connecting…" : "Connect GitHub"}
            </Button>
          )}
        </div>

        <Divider />
        <MenuItem onClick={() => (window.location.href = "/")}>
          <ListItemIcon><HomeIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => signOut({ redirectUrl: "/" })} className="upm-danger">
          <ListItemIcon><LogoutIcon fontSize="small" className="upm-danger-icon" /></ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
