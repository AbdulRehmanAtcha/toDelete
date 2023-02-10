import axios from "axios";
import React, { useState } from "react";

let baseURL = "";
if (window.location.href.split(":")[0] === "http") {
  baseURL = "http://localhost:5001";
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [admin, setAdmin] = useState(false);
  // const [allItems, setAllItems] = useState(null);


  // const allProducts = async () => {
  //   try {
  //     const response = await axios.get(`${baseURL}/products`);
  //     console.log("Getting All Products Success", response.data);
  //     setAllItems(response.data.data);
  //     // console.log(allItems)
  //   } catch (error) {
  //     console.log("Error", error);
  //   }
  // };

  // useEffect(() => {
  //   allProducts();
  // }, []);

  const loginHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/login`, {
        email: email,
        password: password,
      })
      .then((response) => {
        document.write(`<h1>${response.data}</h1>`)
        console.log(response.data)
        // {(response.data === "Admin Login Successfull")? setAdmin(true):null}
      })
      .catch((err) => {
        document.write(err);
      });
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
      {/* {admin === true && allItems !== null ? (
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Position</th>
              <th scope="col">Salary</th>
              <th scope="col">Delete</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map((eachProduc, i) => (
              <tr key={i}>
                <td>{eachProduc?._id}</td>
                <td>{eachProduc?.name}</td>
                <td>{eachProduc?.position}</td>
                <td>${eachProduc?.salary}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null} */}
    </>
  );
};

export default Login;
