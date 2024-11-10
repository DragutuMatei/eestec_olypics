import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig.js";
import axios from "axios";
import {
  onAuthStateChanged,
  signOut,
  signInWithCustomToken,
} from "firebase/auth";
import RedirectComp from "./RedirectComp.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Main from "./Main.jsx";
import Axios from "./AxiosConfig.jsx";
import Class from "./Class.jsx";
import StudentClass from "./Elev/StudentClass.jsx";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isRegistered, setIsRegistered] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser !== null)
        await Axios.get(`/getDetails/${currentUser.email}`).then((res) => {
          setUser(res.data);
        });
      else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <RedirectComp to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <RedirectComp to="/" />}
          />
          <Route path="/" element={!user ? <Login /> : <Main user={user} />} />
          <Route
            path="/class/:id"
            element={!user ? <Login /> : <Class user={user} />}
          />
          <Route
            path="/class/student/:id"
            element={!user ? <Login /> : <StudentClass user={user} />}
          />
          
        </Routes>
        <ToastContainer draggable={true} position="top-center" />
      </Router>
    </>
  );
}

export default App;
