import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Shared/Input/Input";

import "./Login.css"; // Import your custom CSS file for styling
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginCheck } from "../store";

// Image
import logo from "../../Assets/brand-logo.svg";

function Login() {
  const { isLoggedIn, token, setToken, chargeId, setChargeId } =
    useContext(AppContext);
  const setLogin = useSetRecoilState(loginCheck);

  const login = useRecoilValue(loginCheck);
  const history = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState({ email: "", password: "" });
  const [resError, setResError] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  // const NGROG_URL = process.env.REACT_APP_NGROG_URL;
  // console.log("API_BASE_URL:", API_BASE_URL);
  // console.log("NGROG_URL:", NGROG_URL);

  // validation check
  const validateForm = () => {
    let isValid = true;

    // Enter Email validation
    if (!formData.email) {
      setFormError((prevState) => ({
        ...prevState,
        // email: 'Username and Password cannot be Blank',
        email: "Please enter the username",
      }));
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      setFormError((prevState) => ({
        ...prevState,
        password: "Please enter the Password",
      }));
      isValid = false;
    }
    return isValid;
  };

  useEffect(() => {
    if (chargeId) {
      setChargeId(chargeId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fetchData = async () => {
      var myHeaders = new Headers();
      myHeaders.append("email", formData.email);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      try {
        const response = await fetch("/api/getChargeId", requestOptions);
        const result = await response.json(); // Assuming the response is JSON
        if (result && result?.shop?.charge_id) {
          setChargeId(result?.shop?.charge_id);

          localStorage.setItem("chargeId", result?.shop?.charge_id);
          localChargeIdd = localStorage.getItem("chargeId");
        } else {
          console.log("No charge_id in the response");
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();

    const isValid = validateForm();

    if (login && isValid) {
      const response = await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      });
      const body = await response.json();
      document.cookie = `jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      setLogin(false);
      localStorage.removeItem("token");
      console.log("Logged out ===>>");

      setTimeout(async () => {
        try {
          //call api for login
          const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await response.json();

          if (data.error === false) {
            window.location.href = `/?charge_id=${localChargeIdd}`;
          } else {
            console.log("Signed in else ===>>");
            setResError("Invalid username and Password");
            setTimeout(async () => {
              setResError("");
            }, 3000);
          }
        } catch (error) {
          console.error("Error logging in:", error);
        }
      }, 1500);
    }
    if (!login && isValid) {
      const response = await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "",
      });
      const body = await response.json();

      document.cookie = `jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      setLogin(false);
      localStorage.removeItem("token");
      console.log("second Logged out ===>>");

      setTimeout(async () => {
        try {
          //call api for login
          const response = await fetch("/api/user/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await response.json();

          if (data.error === false) {
            window.location.href = `/?charge_id=${localChargeIdd}`;
          } else {
            setResError(data?.message);

            setTimeout(async () => {
              setResError("");
            }, 3000);
          }
        } catch (error) {
          console.error("Error logging in:", error);
        }
      }, 1500);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setFormError({ ...formError, [e.target.name]: "" });
  };

  const callAuthchek = async () => {
    if (!login) {
      // console.log("Form data: ", formData);
      // console.log("Form login: ", login);
      const response = await fetch(`${API_BASE_URL}/api/user/chklogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const body = await response.json();
      // console.log("body data: ", body);

      if (body.error === true) {
        // setIsLoggedIn(false);
        setLogin(false);
        history("/login");
      }
      if (body.error === false) {
        // setIsLoggedIn(true);
        setLogin(true);
        // history("/");
      }
    }
  };

  let localChargeIdd = localStorage.getItem("chargeId");
  useEffect(() => {
    console.log("login :", login);
    if (login === true) {
      history(`/?charge_id=${localChargeIdd}`);
    } else if (login === false) {
      callAuthchek();
    } else {
      console.log("login Status: ", isLoggedIn);
    }
  }, []);

  const handleBrandIcon = () => {
    setTimeout(() => {
      window.location.reload();
      console.log("setTimeout run");
    }, 1000);
  };

  return (
    <div className="Signup-page-os">
      <div className="container-os">
        <form
          className="login-form-os"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="login-form-heading-os">
            <Link to="/" onClick={handleBrandIcon}>
              <img src={logo} alt="" />
            </Link>
            <h1>Login</h1>
          </div>

          {resError && (
            <div className="error-message-os text-center pb-4">
              {resError === "Authentication Failed"
                ? // ? "Please enter correct email or password."
                  "Invalid username and password"
                : "Please signup to create password"}
            </div>
          )}

          <div className="input-col-os">
            <Input
              type="text"
              name="email"
              onChange={handleInputChange}
              placeholder="Enter the Email"
              label="Email"
              Asterisk="*"
            />
            {formError.email && (
              <p className="error-message-os pt-1">{formError.email}</p>
            )}
          </div>

          <div className="input-col-os">
            <Input
              type="password"
              name="password"
              onChange={handleInputChange}
              placeholder="Enter the Password"
              label="Password"
              Asterisk="*"
            />
            {formError.password && (
              <p className="error-message-os pt-1">{formError.password}</p>
            )}
          </div>

          <button type="submit">LOGIN</button>

          <div className="signup-link-os">
            <p>
              Don't have an account?
              <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;