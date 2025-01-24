import { createContext, useEffect, useState } from "react";
import "./App.css";
import Pages from "./Pages/Pages/Pages";
import { RecoilRoot } from "recoil";
// import Cookies from "js-cookie";
// import Cookies from 'universal-cookie';
import Cookies from "js-cookie";

export const AppContext = createContext();

function App() {
  const [csvData, setCSVData] = useState([]);
  const [file, setFile] = useState(null);
  const [token, setToken] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user's login status
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [chargeId, setChargeId] = useState("");
  const [mobileNavbar, setMobileNavbar] = useState(false);

  useEffect(() => {
    const cookieToken = Cookies.get("jwt");
    setToken(cookieToken);
    // console.log("objectobjectobjectobjectobjectobject111111111111", cookieToken)
  }, [token]);
  // console.log(token,"sdfffffffffffffffff")

  return (
    <div className="App app-os">
      {/* {token && <p>Token: {token}</p>} */}
      <RecoilRoot>
        <AppContext.Provider
          value={{
            csvData,
            setCSVData,
            file,
            setFile,
            setIsLoggedIn,
            isLoggedIn,
            token,
            setToken,
            accessToken,
            setAccessToken,
            userId,
            setUserId,
            chargeId,
            setChargeId,
            mobileNavbar,
            setMobileNavbar,
          }}
        >
          <Pages />
        </AppContext.Provider>
      </RecoilRoot>
    </div>
  );
}

export default App;