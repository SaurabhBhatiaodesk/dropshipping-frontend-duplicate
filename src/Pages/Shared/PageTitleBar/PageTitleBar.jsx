import React from "react";
import "./PageTitleBar.css";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginCheck } from "../../store";
import { useNavigate } from "react-router-dom";

const PageTitleBar = ({ title }) => {
  const setLogin = useSetRecoilState(loginCheck);
  const history = useNavigate();

  const handleLogout = async () => {
    const response = await fetch("/api/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    });
    const body = await response.json();
    console.log("body data:====================== ", body);

    document.cookie = `jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setLogin(false);
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <section className="PageTitleBar-section-os default-padding-os">
      <div className="PageTitleBar-row-os">
        <div className="container-os">{title}</div>
        {/* <Link to="/login" onClick={handleLogout}>
          <span></span>
          Logout
        </Link> */}
      </div>
    </section>
  );
};

export default PageTitleBar;
