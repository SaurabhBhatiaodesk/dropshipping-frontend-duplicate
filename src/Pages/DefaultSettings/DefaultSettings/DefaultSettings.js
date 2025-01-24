import React from "react";
import PageTitleBar from "../../Shared/PageTitleBar/PageTitleBar";
import DefaultSettingsForm from "../DefaultSettingsForm/DefaultSettingsForm";

// If you are not using Create React App, uncomment the following line:
// require('dotenv').config();

const DefaultSettings = () => {

  return (
    <div className="DefaultSettings-page-os">
      {/* <PageTitleBar title="Default Settings Page" /> */}
      <DefaultSettingsForm />
    </div>
  );
};

export default DefaultSettings;