import React from "react";
import './Button.css'

const Button = ({ type, onClick, title, disabled }) => {
  return (
    <div className="Button-os">
      <button disabled={disabled} type={type} onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

export default Button;
