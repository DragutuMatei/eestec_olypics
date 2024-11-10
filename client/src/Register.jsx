// import axios from "axios";
// import React, { useState } from "react";
// import { auth } from "./firebaseConfig";
// import Axios from "./AxiosConfig";

// function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("student");

//   const handleRegister = async () => {
//     try {
//       const response = await Axios.post("/register", {
//         email,
//         password,
//         role,
//       });

//       console.log("User registered:", response.data);
//     } catch (error) {
//       console.error("Registration error:", error);
//     }
//   };
//   return (
//     <>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <div>
//         <label>Role:</label>
//         <select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="student">Student</option>
//           <option value="professor">Professor</option>
//         </select>
//       </div>

//       <button onClick={handleRegister}>Register</button>
//     </>
//   );
// }

// export default Register;

import axios from "axios";
import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import Axios from "./AxiosConfig";
import "./login.css";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleRegister = async () => {
    try {
      const response = await Axios.post("/register", {
        email,
        password,
        role,
      });

      console.log("User registered:", response.data);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>

        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="label">Role:</label>
        <select
          className="select-field"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="professor">Professor</option>
        </select>

        <button className="btn-primary" onClick={handleRegister}>
          Register
        </button>
        <div className="register-link">
          <Link to="/Login">You have an account? Login now!</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
