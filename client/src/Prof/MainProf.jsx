// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { auth } from "../firebaseConfig";
// import { signOut } from "firebase/auth";
// import Axios from "../AxiosConfig";
// import { Link } from "react-router-dom";

// function MainProf({ user }) {

//   const logout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };
//   const [classes, setClasses] = useState([]);
//   const [newClass, setNewClass] = useState("");
//   const [materie, setMaterie] = useState("");
//   console.log(user);

//   const addClass = async () => {
//     Axios.post("/addClass", {
//       name: newClass,
//       materie: materie,
//       prof_id: user.id,
//       timestamp: Math.floor(Date.now() / 1000),
//     }).then((res) => {
//       console.log(res);
//       setClasses((old) => [
//         {
//           name: newClass,
//           materie: materie,
//           id: res.data.id,
//           prof_id: user.id,
//           timestamp: Math.floor(Date.now() / 1000),
//         },
//         ...old,
//       ]);
//     });
//   };

//   useEffect(() => {
//     getClasses();
//   }, []);
//   const getClasses = async () => {
//     await Axios.get(`/getClasses/${user.id}`).then((res) => {
//       setClasses(res.data.data);
//     });
//   };
//   const deleteClass = async (id) => {
//     Axios.post("/deleteClass", { id: id }).then((res) => {
//       setClasses((old) => [...old.filter((cl) => cl.id != id)]);
//     });
//   };
//   return (
//     <>
//       {user && user.email}
//       <br />
//       {user && user.id}
//       <h1>Add Class</h1>
//       <input
//         type="text"
//         placeholder="Class Name"
//         onChange={(e) => setNewClass(e.target.value)}
//       />
//       <select
//         required
//         onChange={(e) => setMaterie(e.target.value)}
//         name=""
//         id=""
//       >
//         <option defaultValue value="">
//           alege o materie
//         </option>
//         {user &&
//           user.materie &&
//           user.materie.map((mat) => {
//             return (
//               <>
//                 <option value={mat}>{mat}</option>
//               </>
//             );
//           })}
//       </select>
//       <button onClick={addClass}>add Class</button>

//       <h1>Classes: </h1>
//       <ul>
//         {classes &&
//           classes.map((clas) => {
//             return (
//               <li>
//                 <Link to={`class/${clas.id}`}>{clas.name}</Link>
//                 <button onClick={() => deleteClass(clas.id)}>
//                   delete class
//                 </button>
//               </li>
//             );
//           })}
//       </ul>
//       <button onClick={logout}>logout</button>
//     </>
//   );
// }

// export default MainProf;

import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import Axios from "../AxiosConfig";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaTrashAlt, FaSignOutAlt } from "react-icons/fa"; // Icons
import "./styles.css";

function MainProf({ user }) {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState("");
  const [materie, setMaterie] = useState("");

  const addClass = async () => {
    Axios.post("/addClass", {
      name: newClass,
      materie: materie,
      prof_id: user.id,
      timestamp: Math.floor(Date.now() / 1000),
    }).then((res) => {
      setClasses((old) => [
        {
          name: newClass,
          materie: materie,
          id: res.data.id,
          prof_id: user.id,
          timestamp: Math.floor(Date.now() / 1000),
        },
        ...old,
      ]);
    });
  };

  useEffect(() => {
    getClasses();
  }, []);

  const getClasses = async () => {
    await Axios.get(`/getClasses/${user.id}`).then((res) => {
      setClasses(res.data.data);
    });
  };

  const deleteClass = async (id) => {
    Axios.post("/deleteClass", { id: id }).then((res) => {
      setClasses((old) => [...old.filter((cl) => cl.id != id)]);
    });
  };

  return (
    <div className="container">
      <div className="main-container">

        <div className="add-class">
          <h2>Add New Class</h2>
          <div className="input-group">
            <input
              type="text"
              className="input-field"
              placeholder="Class Name"
              onChange={(e) => setNewClass(e.target.value)}
            />
          </div>

          <div className="input-group">
            <select
              className="input-field"
              onChange={(e) => setMaterie(e.target.value)}
            >
              <option value="">Select a Subject</option>
              {user &&
                user.materie &&
                user.materie.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
            </select>
          </div>

          <button className="btn-primary" onClick={addClass}>
            <FaPlusCircle /> Add Class
          </button>
        </div>

        <div className="class-list">
          <h3>Your Classes</h3>
          <ul>
            {classes &&
              classes.map((clas) => (
                <li key={clas.id} className="class-item">
                  <Link to={`class/${clas.id}`} className="class-link">
                    {clas.name}
                  </Link>
                  <button
                    className="btn-danger"
                    onClick={() => deleteClass(clas.id)}
                  >
                    <FaTrashAlt />
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="logout-btn">
          <button className="btn-secondary" onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainProf;
