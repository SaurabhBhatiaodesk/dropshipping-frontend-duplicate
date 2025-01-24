import React from "react";
import "./NotificationBar.css";

const NotificationBar = ({title, style}) => {
  return (
    <>
      {title && (
        <div className="success-alert-os" style={style}>
          {title}
        </div>
      )}
    </>
  );
};

export default NotificationBar;
