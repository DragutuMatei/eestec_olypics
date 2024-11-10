// import axios from "axios";
// import { signInWithCustomToken } from "firebase/auth";
// import React, { useState } from "react";
// import { auth } from "./firebaseConfig";
// import Axios from "./AxiosConfig";

// function Login() {
//   const handleLogin = async () => {
//     try {
//         Axios
//         .post("/login", {
//           email,
//           password,
//         })
//         .then(async (res) => {
//           console.log("primul res:", res);
//           await loginWithCustomToken(res.data.token).then((res) => {
//             console.log(res);
//           });
//         });
//       // const userCredential = await auth.signInWithEmailAndPassword(email, password);
//       // console.log('Logged in user:', userCredential.user);
//     } catch (error) {
//       console.error("Login error:", error);
//     }
//   };

//   const loginWithCustomToken = async (customToken) => {
//     try {
//       await signInWithCustomToken(auth, customToken);
//       console.log("User logged in with custom token");
//     } catch (error) {
//       console.error("Error logging in with custom token:", error);
//     }
//   };

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

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
//       <button onClick={handleLogin}>login</button>
//     </>
//   );
// }

// export default Login;

import axios from "axios";
import { signInWithCustomToken } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import Axios from "./AxiosConfig";
import "./login.css";
import { Link } from "react-router-dom"; // Importing Link for navigation
import { FaSignInAlt } from "react-icons/fa"; // Icon for the login button

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      Axios.post("/login", {
        email,
        password,
      })
        .then(async (res) => {
          console.log("Response:", res);
          await loginWithCustomToken(res.data.token).then((res) => {
            console.log("Logged in with custom token", res);
          });
        })
        .catch((error) => {
          console.error("Login error:", error);
        });
    } catch (error) {
      console.error("Unexpected login error:", error);
    }
  };

  const loginWithCustomToken = async (customToken) => {
    try {
      await signInWithCustomToken(auth, customToken);
      console.log("User logged in with custom token");
    } catch (error) {
      console.error("Error logging in with custom token:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
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
        <button className="btn-primary" onClick={handleLogin}>
          <FaSignInAlt /> <span style={{ marginLeft: 20 }}> Login</span>
        </button>
        <div className="register-link">
          <Link to="/register">Don't have an account? Register now!</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
