import Main from "./components/posts/Main";
// import Signup from "./components/signup/Signup";
import { useContext } from "react";
import { useEffect } from 'react';

import Login from "./components/login/Login";
import { GlobalContext } from "./context/Context";
import {
  Route, Routes
} from "react-router-dom";
import axios from 'axios';  

let baseURL = "";
if (window.location.href.split(":")[0] === "http") {
  baseURL = "http://localhost:5001";
}

function App() {
  let { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    const getHome = async () => {
      try {
        let response = await axios.get(`${baseURL}/api/v1/profile`, {
          withCredentials: true,
        });
        dispatch({
          type: "USER_LOGIN",
          payload: response.data,
        });
        console.log("Yes Login");
      } catch (error) {
        console.log(error);
        console.log("no Login");
        dispatch({
          type: "USER_LOGOUT",
        });
      }
    };
    getHome();
  }, []);

  return (
    <>
      {state.isLogin === true ? (
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/api/v1/login" element={<Login />} />
          <Route path="*" element={<Main />} />
        </Routes>
      ) : null}
      {state.isLogin === false ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      ) : null}

      {state.isLogin === null ? (
        <Routes>
          <Route
            path="/"
            element={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100vh",
                  minWidth: "100vw",
                }}
              >
                <div className="spinner-border" role="status"></div>
              </div>
            }
          />
        </Routes>
      ) : null}
    </>
  );
}

export default App;
