import React, { useEffect, useRef, useContext, useState } from "react";
import PageTitleBar from "../../Shared/PageTitleBar/PageTitleBar";
import CsvFile from "../CsvFile/CsvFile";
import { AppContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { loginCheck } from "../../store";
import { useRecoilValue, useSetRecoilState } from "recoil";

const Home = () => {
  const [isAccessToken, setIsAccessToken] = useState(false);
  const { accessToken, setAccessToken } = useContext(AppContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //     navigate("/installation");
  // }, [isAccessToken]);

  return (
    <div className="Home-page-os">
      <CsvFile />
    </div>
  );
};

export default Home;
