import React from "react";
import "./Input.css";

const Input = ({ type, name, value, required, onChange, placeholder, label, Asterisk, disabled }) => {
  return (
    <div className="Input-os">
      {label && (
        <label>
          {label}
          {Asterisk && <span>{Asterisk}</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;