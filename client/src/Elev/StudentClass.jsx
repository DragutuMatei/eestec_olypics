// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Axios from "../AxiosConfig";
// import { toast } from "react-toastify";

// function StudentClass({ user }) {
//   const { id } = useParams();
//   const [currentClass, setCurrentClass] = useState({});
//   const [rez, setRez] = useState(null);

//   const getClasses = async () => {
//     await Axios.get(`/getStudentClasses/${id}`).then((res) => {
//       console.log(res);
//       setCurrentClass(res.data);
//     });
//   };

//   useEffect(() => {
//     getClasses();
//   }, []);
//   const submitHome = async (clasa) => {
//     // console.log(clasa);
//     await Axios.post(
//       "/uploadHome",
//       {
//         user_email: user.email,
//         class_id: clasa.id,
//         rez,
//       },
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     ).then((res) => {
//       if (res.data.message) {
//         toast(res.data.message);
//         return;
//       }
//       console.log(res);
//     });
//   };
//   return (
//     <>
//       {currentClass && currentClass.home && (
//         <>
//           <p>{currentClass.home.cerinta}</p>
//           <a href={currentClass.home.exemplu} download>
//             Download exemplu
//           </a>
//           <h5>{currentClass.home.untill}</h5>
//           {new Date(currentClass.home.untill).getTime() / 1000 >=
//           Math.floor(Date.now() / 1000) ? (
//             <>
//               <input type="file" onChange={(e) => setRez(e.target.files[0])} />
//               <button onClick={() => submitHome(currentClass)}>
//                 Submit homework
//               </button>
//             </>
//           ) : (
//             <>
//               <h3>You are too late</h3>
//             </>
//           )}
//         </>
//       )}
//     </>
//   );
// }

// export default StudentClass;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../AxiosConfig";
import { toast } from "react-toastify";
import "./studclass.css";

function StudentClass({ user }) {
  const { id } = useParams();
  const [currentClass, setCurrentClass] = useState({});
  const [rez, setRez] = useState(null);
  const [home, setHome] = useState(false);
  const getClasses = async () => {
    try {
      const res = await Axios.get(`/getStudentClasses/${id}`);
      setCurrentClass(res.data);
      if (JSON.stringify(res.data.home).length > 17) {
        setHome(true);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };
  const [rezz, setRezz] = useState(null);
  const getDet = async () => {
    await Axios.get(`/rezultate/${id}/${user.email}`).then((res) => {
      console.log(res.data);
      if (JSON.stringify(res.data) != "{}") setRezz(res.data);
    });
  };
  useEffect(() => {
    getClasses();
    getDet();
  }, []);

  const submitHome = async (clasa) => {
    try {
      const res = await Axios.post(
        "/uploadHome",
        {
          user_email: user.email,
          class_id: clasa.id,
          rez,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast(res.data.message || "Homework submitted successfully");
    } catch (error) {
      console.error("Error submitting homework:", error);
    }
  };
  return (
    <div className="student-class-container">
      {currentClass && home ? (
        <div className="class-card">
          <p className="homework-description">{currentClass.home.cerinta}</p>
          <a
            href={currentClass.home.exemplu}
            download
            className="download-link"
          >
            Download Example
          </a>
          <h5 className="homework-deadline">Due: {currentClass.home.untill}</h5>
          {rezz != null && (
            <>
              <h3>Rezultate:</h3>
              <h5>Nota: {rezz.nota}</h5>
              <h5>
                {" "}
                Content:{" "}
                {rezz.review.content.split("\n").map((txt) => {
                  return (
                    <>
                      {txt} <br />
                    </>
                  );
                })}
              </h5>
              <h6>
                Nivelul de plagiarism: {rezz.review.plagiarism_percentage}
              </h6>
              <h6>A folosit AI? {rezz.review.ai_detection}</h6>
            </>
          )}
          {new Date(currentClass.home.untill).getTime() / 1000 >=
          Math.floor(Date.now() / 1000) ? (
            !rezz ? (
              <>
                <input
                  type="file"
                  className="file-input"
                  onChange={(e) => setRez(e.target.files[0])}
                />
                <button
                  className="submit-button"
                  onClick={() => submitHome(currentClass)}
                >
                  Submit Homework
                </button>
              </>
            ) : (
              <></>
            )
          ) : (
            <div className="late-button">
              <h3>You are too late</h3>
            </div>
          )}
        </div>
      ) : (
        <h1>You don't have any homework!</h1>
      )}
    </div>
  );
}

export default StudentClass;
