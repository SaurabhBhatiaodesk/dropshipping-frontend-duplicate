import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../../App";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginCheck } from "../../store";

// Image
import logo from "../../../Assets/brand-logo.svg";

const Navbar = () => {
  const setLogin = useSetRecoilState(loginCheck);
  const history = useNavigate();

  const { userName } = useContext(AppContext);
  const [activeLink, setActiveLink] = useState("");
  // console.log("tokennnnnnnn", token)
  let localChargeId = localStorage.getItem("chargeId");

  const currentPath = window.location.pathname;
  useEffect(() => {
    if (currentPath === `/`) {
      setActiveLink("link-1");
    } else if (currentPath === `/defaultsettings/`) {
      setActiveLink("link-2");
    } else if (currentPath === `/history/`) {
      setActiveLink("link-3");
    }
  }, [currentPath]);
  // console.log("currentPath ::", currentPath);

  // Handle active nav link
  const handleActiveLink = (val) => {
    setActiveLink(val);
    // console.log("object", val);
  };

  // Handle signout
  const handleSignOut = async () => {
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
    localStorage.removeItem("chargeId");
    window.location.href = "/";
  };

  // const token = localStorage.getItem("token");
  // console.log("localStorageToken", token);

  return (
    <section className="Navbar-section-os">
      <div className="Navbar-row-os">
        <div className="Navbar-col-os-1">
          <Link to={`/?charge_id=${localChargeId}`}>
            <img src={logo} alt="" />
            <span>SAAS INTEGRATOR</span>
          </Link>
        </div>
        <div className="Navbar-col-os-3">
          {/* {token && ( */}
          <Link
            to={`/?charge_id=${localChargeId}`}
            className={activeLink === "link-1" ? "active" : ""}
            onClick={() => handleActiveLink("link-1")}
          >
            <span>
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_201_6"
                  // style="mask-type:luminance"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="26"
                  height="26"
                >
                  <rect width="25.7757" height="25.7757" fill="white" />
                </mask>
                <g mask="url(#mask0_201_6)">
                  <path
                    d="M11.0113 6.31967L11.3103 10.7659L11.4587 13.0007C11.4603 13.2305 11.4963 13.4589 11.5658 13.6783C11.7451 14.1042 12.1764 14.3749 12.6456 14.356L19.7954 13.8882C20.105 13.8832 20.404 13.999 20.6265 14.2102C20.812 14.3863 20.9317 14.6165 20.9695 14.8642L20.9822 15.0145C20.6863 19.1115 17.6773 22.5287 13.5889 23.4108C9.50036 24.2928 5.30784 22.4295 3.2875 18.8323C2.70506 17.7872 2.34126 16.6385 2.21746 15.4536C2.16574 15.1028 2.14298 14.7485 2.14937 14.3941C2.14298 10.0017 5.27091 6.20435 9.64941 5.28889C10.1764 5.20683 10.693 5.48581 10.9043 5.96654C10.959 6.07786 10.9951 6.1971 11.0113 6.31967Z"
                    fill="white"
                  />
                  <path
                    opacity="0.4"
                    d="M23.6278 10.5383L23.6203 10.5733L23.5986 10.6242L23.6016 10.7639C23.5904 10.949 23.5189 11.127 23.3958 11.271C23.2675 11.4208 23.0922 11.5228 22.8992 11.5624L22.7815 11.5785L14.5324 12.1131C14.258 12.1401 13.9848 12.0516 13.7808 11.8697C13.6107 11.7179 13.502 11.5132 13.4713 11.2926L12.9176 3.05553C12.908 3.02769 12.908 2.9975 12.9176 2.96964C12.9252 2.74258 13.0252 2.52797 13.1952 2.37373C13.3651 2.2195 13.591 2.1385 13.8223 2.14883C18.7196 2.27342 22.8355 5.79499 23.6278 10.5383Z"
                    fill="white"
                  />
                </g>
              </svg>
            </span>
            {/* Data Porting */}
            Stock Adjustments
          </Link>
          <Link
            to={`/defaultsettings/?charge_id=${localChargeId}`}
            className={activeLink === "link-2" ? "active" : ""}
            onClick={() => handleActiveLink("link-2")}
          >
            <span>
              <svg
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.50326 6.54929C7.90347 6.54929 7.34179 6.78266 6.91652 7.20915C6.49325 7.63564 6.25855 8.19894 6.25855 8.80045C6.25855 9.40197 6.49325 9.96526 6.91652 10.3918C7.34179 10.8162 7.90347 11.0516 8.50326 11.0516C9.10306 11.0516 9.66474 10.8162 10.09 10.3918C10.5133 9.96526 10.748 9.40197 10.748 8.80045C10.748 8.19894 10.5133 7.63564 10.09 7.20915C9.8823 6.99924 9.63506 6.83281 9.36267 6.71953C9.09027 6.60625 8.79815 6.54839 8.50326 6.54929ZM16.774 11.287L15.4621 10.1624C15.5243 9.78018 15.5564 9.3899 15.5564 9.00163C15.5564 8.61336 15.5243 8.22107 15.4621 7.84084L16.774 6.71627C16.8731 6.63118 16.944 6.51786 16.9774 6.39137C17.0107 6.26487 17.0048 6.1312 16.9606 6.00813L16.9425 5.95582C16.5815 4.94328 16.0405 4.00473 15.3457 3.18563L15.3096 3.14338C15.2253 3.0439 15.1128 2.97239 14.9871 2.93827C14.8614 2.90416 14.7284 2.90903 14.6055 2.95226L12.9766 3.53366C12.3748 3.03877 11.7048 2.64849 10.9787 2.3769L10.6637 0.668911C10.64 0.540243 10.5777 0.421871 10.4853 0.329522C10.3928 0.237173 10.2746 0.175218 10.1462 0.151888L10.092 0.141829C9.0489 -0.0472764 7.94961 -0.0472764 6.90649 0.141829L6.85232 0.151888C6.72393 0.175218 6.60566 0.237173 6.51322 0.329522C6.42077 0.421871 6.35854 0.540243 6.33478 0.668911L6.01783 2.38494C5.29853 2.6587 4.62846 3.04803 4.03389 3.53768L2.39298 2.95226C2.27015 2.90869 2.137 2.90364 2.01123 2.93778C1.88546 2.97191 1.77303 3.04362 1.68888 3.14338L1.65277 3.18563C0.959277 4.0056 0.418417 4.94392 0.0559897 5.95582L0.0379357 6.00813C-0.0523344 6.2596 0.0218877 6.54125 0.224494 6.71627L1.55247 7.85291C1.49028 8.23113 1.46019 8.61738 1.46019 8.99962C1.46019 9.38588 1.49028 9.77214 1.55247 10.1463L0.228506 11.283C0.129401 11.3681 0.05847 11.4814 0.0251453 11.6079C-0.00817932 11.7344 -0.00231886 11.868 0.0419476 11.9911L0.0600017 12.0434C0.423088 13.0553 0.95869 13.9908 1.65678 14.8136L1.69289 14.8559C1.77725 14.9553 1.88968 15.0268 2.01538 15.061C2.14107 15.0951 2.27412 15.0902 2.39699 15.047L4.0379 14.4616C4.63569 14.9544 5.30168 15.3447 6.02184 15.6143L6.33879 17.3303C6.36255 17.459 6.42479 17.5774 6.51723 17.6697C6.60967 17.7621 6.72794 17.824 6.85634 17.8474L6.9105 17.8574C7.96388 18.0475 9.04265 18.0475 10.096 17.8574L10.1502 17.8474C10.2786 17.824 10.3969 17.7621 10.4893 17.6697C10.5817 17.5774 10.644 17.459 10.6677 17.3303L10.9827 15.6223C11.7089 15.3487 12.3789 14.9605 12.9807 14.4656L14.6095 15.047C14.7324 15.0905 14.8655 15.0956 14.9913 15.0615C15.1171 15.0273 15.2295 14.9556 15.3136 14.8559L15.3497 14.8136C16.0478 13.9868 16.5834 13.0553 16.9465 12.0434L16.9646 11.9911C17.0508 11.7417 16.9766 11.462 16.774 11.287ZM8.50326 12.3371C6.55544 12.3371 4.97671 10.7539 4.97671 8.80045C4.97671 6.84703 6.55544 5.26378 8.50326 5.26378C10.4511 5.26378 12.0298 6.84703 12.0298 8.80045C12.0298 10.7539 10.4511 12.3371 8.50326 12.3371Z"
                  fill="white"
                />
              </svg>
            </span>
            {/* Default Settings */}
            Configuration
          </Link>
          <Link
            to={`/history/?charge_id=${localChargeId}`}
            className={activeLink === "link-3" ? "active" : ""}
            onClick={() => handleActiveLink("link-3")}
          >
            <span>
              <svg
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                // xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <clipPath id="a">
                  <path d="m0 0h24v24h-24z" />
                </clipPath>
                <g
                  clip-path="url(#a)"
                  stroke="#fff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path d="m5.63606 18.3639c3.51471 3.5147 9.21324 3.5147 12.72794 0s3.5147-9.2132 0-12.72792-9.21323-3.51472-12.72794 0c-1.75849 1.75849-2.63717 4.06362-2.63604 6.36842l-.00002 1.9955" />
                  <path d="m1 11.9999 2 2 2-2" />
                  <path d="m11 7.99994v4.99996h5" />
                </g>
              </svg>
            </span>
            History
          </Link>
          <button
            className={activeLink === "link-5" ? "active" : ""}
            onClick={() => {
              handleSignOut();
              handleActiveLink("link-5");
            }}
          >
            <span>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.4414 16.8679L21.0037 11.5445C21.2216 11.296 21.3331 10.9822 21.3333 10.6668C21.3334 10.451 21.2814 10.2344 21.1757 10.0374C21.1287 9.94959 21.0714 9.86618 21.0037 9.78906L16.4414 4.46569C15.9622 3.90656 15.1204 3.84177 14.5613 4.32097C14.0022 4.80017 13.9374 5.6419 14.4166 6.20102L17.1011 9.33335L6.77495 9.33335C6.03857 9.33335 5.44162 9.9303 5.44162 10.6667C5.44162 11.4031 6.03857 12 6.77495 12L17.1013 12L14.4166 15.1325C13.9374 15.6916 14.0022 16.5334 14.5613 17.0126C15.1204 17.4918 15.9622 17.427 16.4414 16.8679ZM7.99992 2.66667C8.7363 2.66667 9.33325 3.26362 9.33325 4L9.33325 6C9.33325 6.73638 9.9302 7.33333 10.6666 7.33333C11.403 7.33333 11.9999 6.73638 11.9999 6L11.9999 4C11.9999 1.79086 10.2091 -4.86254e-07 7.99992 -5.82819e-07L3.99992 -7.57664e-07C1.79078 -8.54229e-07 -8.20943e-05 1.79086 -8.21908e-05 4L-8.27737e-05 17.3333C-8.28702e-05 19.5425 1.79078 21.3333 3.99992 21.3333L7.99992 21.3333C10.2091 21.3333 11.9999 19.5425 11.9999 17.3333L11.9999 15.3333C11.9999 14.597 11.403 14 10.6666 14C9.9302 14 9.33325 14.597 9.33325 15.3333L9.33325 17.3333C9.33325 18.0697 8.7363 18.6667 7.99992 18.6667L3.99992 18.6667C3.26354 18.6667 2.66658 18.0697 2.66658 17.3333L2.66658 4C2.66658 3.26362 3.26354 2.66667 3.99992 2.66667L7.99992 2.66667Z"
                  fill="white"
                />
              </svg>
            </span>
            Sign Out
          </button>
          {/* )} */}
        </div>
      </div>
    </section>
  );
};

export default Navbar;
