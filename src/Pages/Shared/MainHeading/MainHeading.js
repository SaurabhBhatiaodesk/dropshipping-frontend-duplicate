import React from "react";
import "./MainHeading.css";

const MainHeading = ({ title, image, alt }) => {
  return (
    <div className="MainHeading-os">
      <h2>
        {image && (
          <span>
            <img src={image} alt={alt} />
          </span>
        )}
        {title}
      </h2>
    </div>
  );
};

export default MainHeading;
