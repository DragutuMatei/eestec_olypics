// import React from "react";
// import { Link } from "react-router-dom";
// import { auth } from "../firebaseConfig";
// import { signOut } from "firebase/auth";

// function MainElev({ user }) {
//   const logout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };
//   return (
//     <>
//       {user && user.email}
//       <br />
//       {user && user.id}
//       <br />
//       <ul>
//         {user &&
//           user.classes &&
//           user.classes.map((clas) => {
//             return (
//               <li>
//                 <Link to={`class/student/${clas.id_clasa}`}>{clas.name}</Link>
//               </li>
//             );
//           })}
//       </ul>
//       <button onClick={logout}>logout</button>
//     </>
//   );
// }

// export default MainElev;

import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import "./elev.css";
import Axios from "../AxiosConfig";

function MainElev({ user }) {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const test = async () => {
    await Axios.post("/test").then(res => {
      console.log(res);
    })
  }
  return (
    <div className="main-container">
      <div className="user-card">
        <div className="user-info">
          <h2>Your classes</h2>
          {/* <button onClick={test}>test</button> */}
        </div>

        <ul className="class-list">
          {user &&
            user.classes &&
            user.classes.map((clas) => (
              <li key={clas.id_clasa}>
                <Link
                  to={`class/student/${clas.id_clasa}`}
                  className="class-item"
                >
                  {clas.name}
                </Link>
              </li>
            ))}
        </ul>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default MainElev;
