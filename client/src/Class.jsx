// import React, { useEffect, useState } from "react";
// import Axios from "./AxiosConfig";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { FileUploader } from "react-drag-drop-files";

// function Class({ user }) {
//   const { id } = useParams();
//   console.log(id);
//   const [currentClass, setCurrentClass] = useState({});
//   const getClass = async () => {
//     await Axios.get(`/getClass/${id}`).then((res) => {
//       console.log(res);
//       setCurrentClass(res.data);
//     });
//   };

//   useEffect(() => {
//     getClass();
//     // getHomework();
//   }, []);
//   const [lookedEmail, setLookedEmail] = useState("");
//   const [elev, setElev] = useState(null);
//   const [searched, setSearched] = useState(false);
//   const search = async () => {
//     setSearched(true);
//     Axios.get(`/getDetails/${lookedEmail}`).then((res) => {
//       console.log(res.data);
//       if (!res.data.message) {
//         setElev(res.data);
//       }
//     });
//   };

//   const add = async (student) => {
//     await Axios.post("/addElev", {
//       student,
//       class_id: id,
//     }).then((res) => {
//       console.log(res);
//       if (res.data.ok == false) {
//         toast(res.data.message);
//       } else {
//         let clas = currentClass;
//         clas.elevi.push(student);
//         console.log(clas);
//         currentClass.elevi = clas.elevi;
//         setCurrentClass({ ...clas });
//       }
//     });
//   };
//   const deleteStudent = async (elev) => {
//     await Axios.post("/deleteElev", {
//       class_id: id,
//       email: elev.email,
//       id: elev.id,
//     }).then((res) => {
//       let clas = currentClass;
//       clas.elevi = clas.elevi.filter((el) => el.email != elev.email);
//       setCurrentClass({ ...clas });
//     });
//   };

//   const [cerinta, setCerinta] = useState("");
//   const [untill, setUntill] = useState();
//   const [exemplu, setExemplu] = useState(null);
//   const addHomework = async () => {
//     console.log({
//       cerinta: cerinta,
//       untill: untill,
//       exemplu: exemplu,
//       clasa_id: id,
//     });
//     const datas = {
//       cerinta: cerinta,
//       untill: untill,
//       exemplu: exemplu,
//       clasa_id: id,
//     };
//     const formdata = new FormData();
//     formdata.append("cerinta", cerinta);
//     formdata.append("untill", untill);
//     formdata.append("exemplu", exemplu);
//     formdata.append("clasa_id", id);

//     await Axios.post("http://localhost:4000/addHomework", datas, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }).then((res) => {
//       let clas = currentClass;
//       clas.home = res.data.home;
//       setCurrentClass({ ...clas });
//       console.log(res);
//     });
//   };
//   const deleteHome = async () => {
//     await Axios.post("/deleteHome", { id_class: id }).then((res) => {
//       toast(res.data.message);
//       let clas = currentClass;
//       clas.home = {};
//       setCurrentClass({ ...clas });
//     });
//   };
//   const magic = async () => {};
//   const isObjectEmpty = (objectName) => {
//     console.log("objectName: ", objectName);
//     console.log(
//       JSON.stringify(objectName) === '{"responses":[]}' ||
//         JSON.stringify(objectName) == undefined
//     );
//     console.log(JSON.stringify(objectName));
//     return (
//       JSON.stringify(objectName) === '{"responses":[]}' ||
//       JSON.stringify(objectName) == undefined
//     );
//   };
//   return (
//     <div>
//       <h1>Add students in this class:</h1>
//       <input type="email" onChange={(e) => setLookedEmail(e.target.value)} />
//       <button onClick={search}>search</button>
//       <br />

//       {JSON.stringify(elev) !== "null" ? (
//         <>
//           <h1>{elev.email}</h1>
//           <button onClick={() => add(elev)}>add</button>
//         </>
//       ) : (
//         searched && <h2>There is no student with this email!</h2>
//       )}
//       <h1>Students in this class:</h1>
//       <ul>
//         {currentClass &&
//           currentClass.elevi &&
//           currentClass.elevi.map((elev) => {
//             return (
//               <>
//                 <li>
//                   {elev.email}{" "}
//                   <button onClick={() => deleteStudent(elev)}>
//                     delete student from class
//                   </button>
//                 </li>
//               </>
//             );
//           })}
//       </ul>
//       <hr />
//       {currentClass && isObjectEmpty(currentClass.home) && (
//         <>
//           <button onClick={() => addHomework()}>add homework</button>
//           <textarea
//             name=""
//             onChange={(e) => setCerinta(e.target.value)}
//             id=""
//           ></textarea>
//           <input
//             type="date"
//             onChange={(e) => {
//               console.log(e.target.value);
//               setUntill(e.target.value);
//             }}
//           />
//           <input
//             type="file"
//             onChange={(e) => {
//               console.log(e.target.files[0]);
//               setExemplu(e.target.files[0]);
//             }}
//           />
//         </>
//       )}
//       <br />
//       {currentClass && !isObjectEmpty(currentClass.home) && (
//         <>
//           <h2>Tema curenta</h2>
//           <p>{currentClass.home.cerinta}</p>
//           <a href={currentClass.home.exemplu} download>
//             Download exemplu
//           </a>
//           <h5>{currentClass.home.untill}</h5>

//           <button onClick={() => deleteHome()}>Delete homework</button>
//           <h3>Rezolvari:</h3>
//           <ul>
//             {currentClass.home.responses &&
//               currentClass.home.responses.map((resp) => {
//                 return (
//                   <>
//                     <h4>{resp.user_email}</h4>
//                     <a href={resp.rezolvare} download>
//                       Download rezolvare
//                     </a>
//                   </>
//                 );
//               })}
//           </ul>
//           {new Date(currentClass.home.untill).getTime() / 1000 <=
//             Math.floor(Date.now() / 1000) && (
//             <button onClick={magic}>Corectare automata</button>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default Class;

import React, { useEffect, useState } from "react";
import Axios from "./AxiosConfig";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FileUploader } from "react-drag-drop-files";
import "./class.css";

function Class({ user }) {
  const { id } = useParams();
  const [currentClass, setCurrentClass] = useState({});
  const [lookedEmail, setLookedEmail] = useState("");
  const [elev, setElev] = useState(null);
  const [searched, setSearched] = useState(false);
  const [cerinta, setCerinta] = useState("");
  const [untill, setUntill] = useState();
  const [exemplu, setExemplu] = useState(null);

  const getClass = async () => {
    await Axios.get(`/getClass/${id}`).then((res) => {
      setCurrentClass(res.data);
    });
  };

  useEffect(() => {
    getClass();
  }, []);

  const search = async () => {
    setSearched(true);
    Axios.get(`/getDetails/${lookedEmail}`).then((res) => {
      if (!res.data.message) {
        setElev(res.data);
      }
    });
  };

  const add = async (student) => {
    await Axios.post("/addElev", {
      student,
      class_id: id,
    }).then((res) => {
      if (res.data.ok == false) {
        toast(res.data.message);
      } else {
        let clas = currentClass;
        clas.elevi.push(student);
        currentClass.elevi = clas.elevi;
        setCurrentClass({ ...clas });
      }
    });
  };

  const deleteStudent = async (elev) => {
    await Axios.post("/deleteElev", {
      class_id: id,
      email: elev.email,
      id: elev.id,
    }).then((res) => {
      let clas = currentClass;
      clas.elevi = clas.elevi.filter((el) => el.email !== elev.email);
      setCurrentClass({ ...clas });
    });
  };

  const addHomework = async () => {
    const datas = {
      cerinta: cerinta,
      untill: untill,
      exemplu: exemplu,
      clasa_id: id,
    };
    const formdata = new FormData();
    formdata.append("cerinta", cerinta);
    formdata.append("untill", untill);
    formdata.append("exemplu", exemplu);
    formdata.append("clasa_id", id);

    await Axios.post("http://localhost:4000/addHomework", datas, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      let clas = currentClass;
      clas.home = res.data.home;
      setCurrentClass({ ...clas });
    });
  };

  const deleteHome = async () => {
    await Axios.post("/deleteHome", { id_class: id }).then((res) => {
      toast(res.data.message);
      let clas = currentClass;
      clas.home = {};
      setCurrentClass({ ...clas });
    });
  };

  const magic = async (email) => {
    await Axios.post("/rezolva", { id_class: id, student_email: email }).then(
      (res) => {
        let clas = currentClass;
        const userResponse = clas.home.responses.filter(
          (resp) => resp.user_email === email
        )[0];
        const { nota, ...rest } = res.data;

        userResponse.nota = Number(nota.toFixed(2));
        userResponse.review = rest;
        for (let i = 0; i < clas.home.responses.length; i++) {
          if (clas.home.responses[i].user_email == email) {
            clas.home.responses[i] = userResponse;
          }
        }
        setCurrentClass({ ...clas });
        // console.log(res);
      }
    );
  };

  return (
    <div className="class-container">
      <div className="class-header">
        <h1>Add students in this class:</h1>
      </div>

      <div className="search-bar">
        <input
          type="email"
          placeholder="Enter student email"
          onChange={(e) => setLookedEmail(e.target.value)}
        />
        <button className="btn-search" onClick={search}>
          Search
        </button>
      </div>

      {elev ? (
        <div className="student-info">
          <h1>{elev.email}</h1>
          <button className="btn-add" onClick={() => add(elev)}>
            Add
          </button>
        </div>
      ) : (
        searched && <h2>No student found with this email!</h2>
      )}

      <div className="students-list">
        <h2>Students in this class:</h2>
        <ul>
          {currentClass.elevi &&
            currentClass.elevi.map((elev) => (
              <li key={elev.id} className="student-item">
                {elev.email}
                <button
                  className="btn-delete"
                  onClick={() => deleteStudent(elev)}
                >
                  Delete from class
                </button>
              </li>
            ))}
        </ul>
      </div>

      <hr />

      {currentClass && currentClass.home && !currentClass.home.cerinta && (
        <div className="homework-form">
          <h2>Upload a new Homework</h2>
          <textarea
            placeholder="Enter homework details"
            onChange={(e) => setCerinta(e.target.value)}
          />
          <h2>Maximum upload time:</h2>
          <input type="date" onChange={(e) => setUntill(e.target.value)} />
          <h2>An example:</h2>
          <input type="file" onChange={(e) => setExemplu(e.target.files[0])} />
          <button
            style={{ marginTop: 20 }}
            className="btn-homework"
            onClick={addHomework}
          >
            Add Homework
          </button>
        </div>
      )}

      {currentClass && currentClass.home && currentClass.home.cerinta && (
        <div className="homework-info">
          <h2>Current Homework</h2>
          <p>{currentClass.home.cerinta}</p>
          <a href={currentClass.home.exemplu} download>
            Download Example
          </a>
          <h5>Due: {currentClass.home.untill}</h5>
          <button className="btn-delete-homework" onClick={deleteHome}>
            Delete Homework
          </button>
          <h3>Submissions:</h3>
          <ul>
            {currentClass.home.responses &&
              currentClass.home.responses.map((resp) => (
                <li key={resp.user_email}>
                  <h4>{resp.user_email}</h4>
                  {resp.review && (
                    <>
                      <h6>Nota: {resp.nota}</h6>
                      <h6>
                        Content:{" "}
                        {resp.review.content.split("\n").map((txt) => {
                          return (
                            <>
                              {txt} <br />
                            </>
                          );
                        })}
                      </h6>
                      <h6>
                        Nivelul de plagiarism:{" "}
                        {resp.review.plagiarism_percentage}
                      </h6>
                      <h6>A folosit AI? {resp.review.ai_detection}</h6>
                    </>
                  )}
                  <a href={resp.rezolvare} download>
                    Download Submission
                  </a>
                  <br />
                  <button
                    style={{ marginTop: 30 }}
                    className="btn-secondary"
                    onClick={() => magic(resp.user_email)}
                  >
                    Auto Correct
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Class;
