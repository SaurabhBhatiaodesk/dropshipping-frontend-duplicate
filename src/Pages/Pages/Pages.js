import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";
import "./Pages.css";
import {
  Routes,
  Route,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Home from "../Home/Home/Home";
import Navbar from "../Shared/Navbar/Navbar";
import Header from "../Shared/Header/Header";
import Auth from "../Shopify/Auth/Auth";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import DefaultSettings from "../DefaultSettings/DefaultSettings/DefaultSettings";
import { AppContext } from "../../App";
import { loginCheck } from "../store";

import { useRecoilValue, useSetRecoilState } from "recoil";
import Installation from "../Installation/Installation";
import History from "../History/History";

const Pages = () => {
  const queryParams = new URLSearchParams(window.location.search);
  // Get the charge_id from the URL query parameters
  let charge_id_from_url = queryParams.get("charge_id");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const setLogin = useSetRecoilState(loginCheck);
  const login = useRecoilValue(loginCheck);
  const Navigate = useNavigate();
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const loginCheckRef = useRef(false);
  const {
    isLoggedIn,
    setIsLoggedIn,
    accessToken,
    setAccessToken,
    userId,
    setUserId,
    subscription,
    setSubscription,
    chargeId,
    setChargeId,
    mobileNavbar,
    setMobileNavbar,
  } = useContext(AppContext);

  // useEffect(() => {
  //   const initializeChargeId = async () => {
  //     if (charge_id_from_url) {
  //       setChargeId(charge_id_from_url);
  //       localStorage.setItem("chargeId", charge_id_from_url);
  //       console.log("chargeId set through charge_id_from_url");
  //     } else {
  //       const localChargeId = localStorage.getItem("chargeId");
  //       setChargeId(localChargeId);
  //       console.log("chargeId set through localStorage");
  //     }
  //   };

  //   initializeChargeId();
  // }, [charge_id_from_url]);

  // console.log("after initializeChargeId useEffect ::", chargeId)

  useEffect(() => {
    console.log("charge_id_from_url chargeId ::", chargeId);
    callAuthchek();
  }, []);

  // subscriptionUpdate Api Func
  const subscriptionUpdateApiFunc = (charge_id_from_url, accessToken) => {
    // subscriptionupdate api starts
    var myHeaders = new Headers();
    myHeaders.append("charge_id", charge_id_from_url);
    myHeaders.append("x-shopify-access-token", accessToken);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${API_BASE_URL}/api/subscriptionupdate`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log("subscriptionupdate restlttttt", result))
      .catch((error) => console.log("error", error));
    // subscriptionupdate api ends
  };

  // subscription Api Func
  const subscriptionApiFunc = (accessToken) => {
    // subscriptions api starts
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
        // Make sure this is the correct access token
      },
      redirect: "follow",
    };
    fetch(`${API_BASE_URL}/api/subscriptions`, requestOptions)
      .then((response) => response.json()) // Assuming the response will be JSON
      .then((result) => {
        // Check if the confirmationUrl exists and redirect
        if (result?.result?.data?.appSubscriptionCreate?.confirmationUrl) {
          window.location =
            result.result.data.appSubscriptionCreate.confirmationUrl;
          // setSubscription(true);
        } else {
          // setSubscription(false);
        }
      })
      .catch((error) => console.log("error", error));
    // subscriptions api ends
  };

  const authTrueFunc = (body) => {
    // console.log("authTrueFunc body :::", body)
    setIsLoggedIn(true);
    setLogin(true);
    setAccessToken(body?.accessToken);
    setUserId(body?.user);
  };

  const callAuthchek = async () => {
    if (!isLoggedIn) {
      const response = await fetch("/api/user/chklogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      });
      const body = await response.json();
      if (body.error === true) {
        setIsLoggedIn(false);
        setLogin(false);
        Navigate("/login");
      }
      if (body.error === false) {
        // console.log("body.error === false");
        console.log("body.error charge_id_from_url::", charge_id_from_url);
        console.log(
          "body.error localStorage.getItem('chargeId')::",
          localStorage.getItem("chargeId")
        );

        if (body?.charge_id && !localStorage.getItem("chargeId")) {
          console.log("user will go to login page");
          Navigate(`/login`);
        } else if (charge_id_from_url) {
          console.log("user gets charge id in param, so route to home page");
          Navigate(`/?charge_id=${charge_id_from_url}`);
          localStorage.setItem("chargeId", charge_id_from_url);
          subscriptionUpdateApiFunc(charge_id_from_url, body?.accessToken);
          authTrueFunc(body);
        } else if (
          body?.charge_id &&
          body?.charge_id == localStorage.getItem("chargeId")
        ) {
          console.log("charge id matched, go to homepage");
          Navigate(`/?charge_id=${body?.charge_id}`);
          authTrueFunc(body);
        } else {
          console.log("run subscription api else");
          console.log("body?.accessToken ::", body?.accessToken);
          // subscriptions api starts
          subscriptionApiFunc(body?.accessToken);
          // subscriptions api ends
        }

        // if (body?.charge_id && chargeId === body?.charge_id) {
        //   console.log("chargeId matched");
        //   Navigate(`/?charge_id=${body?.charge_id}`);

        //   // // subscriptionupdate api starts
        //   subscriptionUpdateApiFunc(chargeId, body?.accessToken);
        //   // // subscriptionupdate api ends
        // } else if (body?.charge_id && chargeId !== body?.charge_id) {
        //   console.log("chargeId not matched");
        //   localStorage.setItem("chargeId", body?.charge_id);
        //   Navigate(`/?charge_id=${body?.charge_id}`);

        //   // // subscriptionupdate api starts
        //   subscriptionUpdateApiFunc(chargeId, body?.accessToken);
        //   // // subscriptionupdate api ends

        //   setIsLoggedIn(true);
        //   setLogin(true);
        //   setAccessToken(body?.accessToken);
        //   setUserId(body?.user);
        // } else if (body?.charge_id) {
        //   if (chargeId === null || chargeId === "") {
        //     console.log("take user to login page");
        //     Navigate(`/login`);
        //   }
        // } else if (body?.charge_id === null || body?.charge_id === "") {
        //   if (!charge_id_from_url || !chargeId) {
        //     console.log("run subscription api");

        //     // subscriptions api starts
        //     subscriptionApiFunc(body?.accessToken);
        //     // subscriptions api ends
        //   } else {
        //     Navigate(`/?charge_id=${charge_id_from_url}`);
        //     // subscriptionupdate api starts
        //     subscriptionUpdateApiFunc(charge_id_from_url, body?.accessToken);
        //     // subscriptionupdate api ends

        //     localStorage.setItem("chargeId", charge_id_from_url);
        //     console.log("charge_id_from_url else");
        //     setIsLoggedIn(true);
        //     setLogin(true);
        //     setAccessToken(body?.accessToken);
        //     setUserId(body?.user);
        //   }
        // }
      }
    }
  };

  const [urls] = useState(["/auth", "/login", "/signup"]);

  const HandleMobileNavbar = () => {
    if (mobileNavbar) {
      setMobileNavbar(false);
    } else {
      setMobileNavbar(true);
    }
  };
  // console.log("localChargeId ::", chargeId);
  // console.log("charge_id_from_url ::", charge_id_from_url);
  // console.log("chargeId ::", chargeId);

  return (
    <div className="Pages-os">
      <div className="Pages-row-os">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/installation" element={<Installation />} />
        </Routes>

        {isLoggedIn && accessToken && userId && (
          <>
            {/* {!urls.includes(window.location.pathname) && isLoggedIn && (
              )} */}
            <div className={`overlay-os ${mobileNavbar ? "active" : ""}`}></div>
            <OutsideClickHandler
              onOutsideClick={() => {
                setMobileNavbar(false);
              }}
            >
              <div className={`Pages-col-os-1 ${mobileNavbar ? "active" : ""}`}>
                <Navbar />
              </div>
            </OutsideClickHandler>
            <div className="Pages-col-os-2">
              <div
                className={`mobile-hamburger-btn-os ${
                  mobileNavbar ? "active" : ""
                }`}
              >
                <button type="button" onClick={HandleMobileNavbar}>
                  <span className="line-1-os"></span>
                  <span className="line-2-os"></span>
                  <span className="line-3-os"></span>
                </button>
              </div>
              {!urls.includes(window.location.pathname) && isLoggedIn && (
                <Header />
              )}

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/defaultsettings" element={<DefaultSettings />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </div>
          </>
        )}
        <Routes>
          <Route path="/auth" element={<Auth />} />
        </Routes>

        {location?.pathname !== "/login" &&
          location?.pathname !== "/signup" &&
          !accessToken &&
          isLoggedIn &&
          userId && <Installation />}
      </div>
    </div>
  );
};

export default Pages;
