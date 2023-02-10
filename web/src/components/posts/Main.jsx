// import logo from './logo.svg';

import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

let baseURL = "";
if (window.location.href.split(":")[0] === "http") {
  baseURL = "http://localhost:5001";
}

function Main() {
  const [empName, setEmpName] = useState("");
  const [empPosition, setEmpPosition] = useState("");
  const [empSalary, setEmpSalary] = useState("");
  const [allItems, setAllItems] = useState(null);
  const [editId, setEditId] = useState("");
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpPosition, setNewEmpPosition] = useState("");
  const [newEmpSalary, setNewEmpSalary] = useState("");

  const addHandler = (e) => {
    e.preventDefault();
    axios
      .post(`${baseURL}/product`, {
        name: empName,
        position: empPosition,
        salary: empSalary,
      })
      .then((response) => {
        console.log(response);
        allProducts();
      })
      .catch((err) => {
        console.log("Error", err);
        // console.log(object)
      });
  };
  const allProducts = async () => {
    try {
      const response = await axios.get(`${baseURL}/products`);
      console.log("Getting All Products Success", response.data);
      setAllItems(response.data.data);
      // console.log(allItems)
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    allProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/product/${id}`);
      alert("Product Deleted Successfully");
      console.log("Delete Success", response);
      allProducts();
    } catch (err) {
      console.log("Delete Error", err);
    }
  };
  const settingId = (id) => {
    setEditId(id);
    // console.log(id);
  };

  const updateHandler = async ()=>{
    try{
      const response = await axios.put(`${baseURL}/product/${editId}`, {
        name: newEmpName,
        position: newEmpPosition,
        salary: newEmpSalary
      })
      console.log("Edit Done", response);
      allProducts();
    }
    catch(error){
      console.log("Error",error)
    }
  }

  return (
    <>
      <h2>Hello World React</h2>
      <form onSubmit={addHandler}>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => {
            setEmpName(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Postion"
          onChange={(e) => {
            setEmpPosition(e.target.value);
          }}
        />
        <br />
        <br />
        <input
          type="number"
          placeholder="Salary"
          onChange={(e) => {
            setEmpSalary(e.target.value);
          }}
        />
        <br />
        <br />
        <button type="submit">SUBMIT</button>
      </form>
      <br />
      <br />
      {allItems === null ? null : (
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
                    onClick={() => {
                      deleteProduct(eachProduc._id);
                    }}
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
                    onClick={() => {
                      settingId(eachProduc._id);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update Form
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="New Name"
                onChange={(e) => {
                  setNewEmpName(e.target.value);
                }}
              />
              <br />
              <br />
              <input
                type="text"
                placeholder="New Position"
                onChange={(e) => {
                  setNewEmpPosition(e.target.value);
                }}
              />
              <br />
              <br />
              <input
                type="number"
                placeholder="New Salary"
                onChange={(e) => {
                  setNewEmpSalary(e.target.value);
                }}
              />
              <br />
              <br />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={updateHandler}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
