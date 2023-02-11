import axios from "axios";
import React, { useState } from "react";

let baseURL = "";
if (window.location.href.split(":")[0] === "http") {
  baseURL = "http://localhost:5001";
}

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Male");
  const [conPassword, setConPassword] = useState("");
  const registerHandler = (e) => {
    e.preventDefault();
    if (password === conPassword) {
      axios
        .post(`${baseURL}/api/v1/register`, {
          name: name,
          email: email,
          phone: phone,
          password: password,
          gender: gender,
        })
        .then((response) => {
          if (response?.data?.keyPattern?.email === 1) {
            alert("This Email is already registered");
          } else if (
            response?.data?.message ===
            "Employee validation failed: name: Path `name` is required."
          ) {
            alert(response.data.message);
          } else {
            alert(response.data.message);
          }
        })
        .catch((err) => {
          alert(err.message);
        });
      // console.log(gender);
    } else {
      alert("Password Did'nt Match");
    }
  };

  const onOptionChange = (e) => {
    setGender(e.target.value);
  };

  return (
    <>
      <h2>Hello Signup</h2>
      <form onSubmit={registerHandler}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          type="tel"
          placeholder="Phone"
          name="phone"
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Confirm-Password"
          name="password"
          onChange={(e) => {
            setConPassword(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          type="radio"
          name="gender"
          value="Male"
          id="male"
          checked={gender === "Male"}
          onChange={onOptionChange}
        />
        <label htmlFor="male">Male</label>

        <input
          type="radio"
          name="gender"
          value="Female"
          id="female"
          checked={gender === "Female"}
          onChange={onOptionChange}
        />
        <label htmlFor="female">Female</label>

        <br />
        <br />
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Signup;
