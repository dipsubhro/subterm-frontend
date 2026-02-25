import { Button as MuiButton } from "@mui/material";

const Button = ({ children, onClick, type = "button", disabled }) => (
  <MuiButton
    variant="contained"
    color="primary"
    size="small"
    onClick={onClick}
    type={type}
    disabled={disabled}
    sx={{ textTransform: "none", fontFamily: "inherit", fontSize: 12 }}
  >
    {children}
  </MuiButton>
);

export default Button;
