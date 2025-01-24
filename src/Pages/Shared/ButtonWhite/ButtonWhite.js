import React from "react";
import "./ButtonWhite.css";

const ButtonWhite = ({ type, onClick, title }) => {
  return (
    <div className="ButtonWhite-os">
      <button type={type} onClick={onClick}>
        {title}
      </button>
    </div>
  );
};

export default ButtonWhite;
