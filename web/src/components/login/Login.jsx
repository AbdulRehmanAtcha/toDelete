import axios from "axios";
import React, { useState, useContext } from "react";
import { GlobalContext } from "../../context/Context";

let baseURL = "";
if (window.location.href.split(":")[0] === "http") {
  baseURL = "http://localhost:5001";
}

const Login = () => {
  let { state, dispatch } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseURL}/api/v1/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "USER_LOGIN",
        payload: response.data.profile,
      });
      alert(response.data.message);
    } catch {
      console.log("Error", e);
    }
  };

  return (
    <>
      <h2>Hello Loginnn</h2>
      <form onSubmit={loginHandler}>
        <input
          required
          type="email"
          placeholder="email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
