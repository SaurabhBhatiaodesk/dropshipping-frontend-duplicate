import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../App";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css"; // Import your custom CSS file for styling
import Input from "../Shared/Input/Input";

// Image
import logo from "../../Assets/brand-logo.svg";

function Signup() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { isLoggedIn } = useContext(AppContext);
  const history = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    storeName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState({
    username: "",
    email: "",
    storeName: "",
    password: "",
    phoneNumber: "",
    confirmPassword: "",
  });

  // Form validations
  const validateForm = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const webSiteRegex = /^[a-zA-Z]+\.com$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    let isValid = true;

    // Enter Email validation
    if (!formData.email) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Please enter a valid email address",
      }));
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      setFormError((prevState) => ({
        ...prevState,
        email: "Invalid email format",
      }));
      isValid = false;
    }

    // // Enter Phone number validation
    // if (!formData.phoneNumber) {
    //   setFormError((prevState) => ({
    //     ...prevState,
    //     phoneNumber: "Please enter a phone number.",
    //   }));
    //   isValid = false;
    // } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
    //   setFormError((prevState) => ({
    //     ...prevState,
    //     phoneNumber: "Please enter a 10-digit phone number.",
    //   }));
    //   isValid = false;
    // }

    // Password validation
    if (!formData.password) {
      setFormError((prevState) => ({
        ...prevState,
        password: " *Password must contain at least 8 characters",
      }));
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      setFormError((prevState) => ({
        ...prevState,
        password:
          "Password must contain at least one uppercase letter, lowercase letter, and numeric digit",
      }));
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      setFormError((prevState) => ({
        ...prevState,
        confirmPassword: "*Please confirm your password.",
      }));
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      setFormError((prevState) => ({
        ...prevState,
        confirmPassword: "Password and Confirm Password must match.",
      }));
      isValid = false;
    }

    // Confirm password validation
    if (!formData.storeName) {
      setFormError((prevState) => ({
        ...prevState,
        storeName: "Please enter a store name.",
      }));
      isValid = false;
    }
    // else if (!webSiteRegex.test(formData.storeName)) {
    //   setFormError((prevState) => ({
    //     ...prevState,
    //     storeName: "Please enter a valid store name (example.com).",
    //   }));
    //   isValid = false;
    // }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      try {
        //call api for login
        const response = await fetch(`${API_BASE_URL}/api/user/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log("data", data);
        if (data.error === false) {
          console.log("singupdata: ", data);
          history("/login");
        } else {
          console.log("signup Failed: ", data);
        }
      } catch (error) {
        console.error("Error logging in:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setFormError((prevState) => ({
      ...prevState,
      [e.target.name]: "",
    }));
  };

  useEffect(() => {
    if (isLoggedIn) {
      history("/");
    }
  }, []);

  const handleBrandIcon = () => {
    setTimeout(() => {
      window.location.reload();
      console.log("setTimeout run");
    }, 1000);
  };

  return (
    // <div className="signup-container">
    //   <h2 className="signup-heading">Sign Up</h2>
    //   <form onSubmit={handleSignup}>
    //     <div className="form-group">
    //       <label htmlFor="username">Email</label>
    //       <input
    //         type="text"
    //         name="username"
    //         placeholder="Choose a Email"
    //         value={formData.username}
    //         onChange={handleChange}
    //       />
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="storeName">Store Name</label>
    //       <input
    //         type="text"
    //         name="storeName"
    //         placeholder="Choose a Store Name"
    //         value={formData.storeName}
    //         onChange={handleChange}
    //       />
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="password">Password</label>
    //       <input
    //         type="password"
    //         name="password"
    //         placeholder="Create a password"
    //         value={formData.password}
    //         onChange={handleChange}
    //       />
    //     </div>
    //      <a href="/">Already have an account?</a><br></br>
    //     <button type="submit" className="signup-button">
    //       Sign Up
    //     </button>
    //   </form>
    // </div>

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
            <h1>Create account</h1>
          </div>

          <div className="input-col-os">
            <Input
              type="text"
              name="username"
              required="required"
              onChange={handleInputChange}
              placeholder="*Enter the Username"
              Asterisk="*"
            />
          </div>

          <div className="input-col-os">
            <Input
              type="text"
              name="email"
              required="required"
              onChange={handleInputChange}
              placeholder="*Enter the Email"
              Asterisk="*"
            />
            {formError.email && (
              <p className="error-message-os pt-1">{formError.email}</p>
            )}
          </div>

          <div className="input-col-os">
            <Input
              type="text"
              name="storeName"
              required="required"
              onChange={handleInputChange}
              placeholder="*Enter the Store Name"
              Asterisk="*"
            />
            {formError.storeName && (
              <p className="error-message-os pt-1">{formError.storeName}</p>
            )}
          </div>

          <div className="input-col-os">
            <Input
              type="number"
              name="phoneNumber"
              // required="required"
              onChange={handleInputChange}
              placeholder="Enter the Phone Number"
              Asterisk="*"
            />
            {formError.phoneNumber && (
              <p className="error-message-os pt-1">{formError.phoneNumber}</p>
            )}
          </div>

          <div className="input-col-os">
            <Input
              type="password"
              name="password"
              required="required"
              onChange={handleInputChange}
              placeholder="*Enter the Password"
              Asterisk="*"
            />
            {formError.password && (
              <p className="error-message-os pt-1">{formError.password}</p>
            )}
          </div>

          <div className="input-col-os">
            <Input
              type="password"
              name="confirmPassword"
              required="required"
              onChange={handleInputChange}
              placeholder="*Confirm the Password"
              Asterisk="*"
            />
            {formError.confirmPassword && (
              <p className="error-message-os pt-1">
                {formError.confirmPassword}
              </p>
            )}
          </div>

          <div className="note-message-os pb-4">
            <span>Note : </span>
            Password must contain at least one uppercase letter, lowercase
            letter, and numeric digit.
          </div>

          <button type="submit">SIGN UP</button>

          <div className="signup-link-os">
            <p>
              Already have an account?
              <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;