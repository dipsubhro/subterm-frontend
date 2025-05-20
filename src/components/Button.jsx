import React from "react";
import "./Button.css";

const Button = ({ children, onClick, type = "button", disabled }) => {
  return (
    <button
      className="custom-button"
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
