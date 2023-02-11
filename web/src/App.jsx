import Main from "./components/posts/Main";
import Signup from "./components/signup/Signup";
import { useContext } from "react";
import { useEffect } from "react";

import Login from "./components/login/Login";
import { GlobalContext } from "./context/Context";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import User from './components/user/User'

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
        console.log(response.data.user.name);
        if (response.data.user.name === "Abdul Rehman Atcha") {
          dispatch({
            type: "ADMIN_LOGIN",
            payload: response.data,
          });
        } else {
          dispatch({
            type: "USER_LOGIN",
            payload: response.data,
          });
        }
      } catch (error) {
        console.log(error);
        console.log(state);
        dispatch({
          type: "USER_LOGOUT",
        });
        dispatch({
          type: "ADMIN_LOGOUT",
        });
      }
    };
    getHome();
  }, []);

  return (
    <>
    
    
      {state.isAdmin === true 
       ? (
        <Routes>
          <Route path="/main" element={<Main />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Main />} />
        </Routes>
        
      ) : null}

      {state.isLogin === true &&
      (state.isAdmin === false || state.isAdmin === null) ? (
        <Routes>
          <Route path="/user" element={<User/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<User/>} />
        </Routes>
      ) : null}

      {state.isAdmin === false && state.isLogin === false ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Login />} />
        </Routes>
      ) : null}

      {state.isAdmin === null && state.isLogin === null ? (
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
      ) : null}
    </>
  );
}

export default App;
