import express from "express";
import axios from "axios";
import admin from "firebase-admin";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import { getStorage } from "firebase-admin/storage";
import { db_simple } from "./firebaseConfig.js";
import {
  getDoc,
  doc,
  getDocs,
  addDoc,
  collection,
  query,
  orderBy,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.region, // Choose the region where your bucket is located
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(fileUpload());

app.use(express.json());

const serviceAccount = JSON.parse(fs.readFileSync("./firebase.json", "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "hack-eab96.firebasestorage.app",
});

const bucket = getStorage().bucket();

const db = admin.firestore();

// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });

// Register a new user
app.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    const user = {
      email,
      role,
    };
    if (role == "professor") {
      user["materie"] = ["matematica", "fizica", "programare"];
    } else {
      user["classes"] = [];
    }

    // Add user to Firestore with role
    await db.collection("users").doc(userRecord.uid).set({
      email,
      role,
    });

    res.status(201).send({
      message: "User registered successfully",
      userId: userRecord.uid,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ error: "Error registering user" });
  }
});

// Login (optional - Firebase Authentication already handles login client-side)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate with Firebase Admin SDK
    const user = await admin.auth().getUserByEmail(email);

    // Since Firebase Admin SDK doesn’t support password verification, use custom token creation instead
    const token = await admin.auth().createCustomToken(user.uid);

    res.status(200).send({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).send({ error: "Invalid email or password" });
  }
});

app.get("/getRole/:email", async (req, res) => {
  const email = req.params.email;
  const user_ref = collection(db_simple, "users");
  const q = query(user_ref, where("email", "==", email));
  let role = "";
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    role = doc.data().role;
    return;
  });

  res.status(200).json({ role: role });
});

app.get("/getDetails/:email", async (req, res) => {
  const email = req.params.email;
  const user_ref = collection(db_simple, "users");
  const q = query(user_ref, where("email", "==", email));
  let data = null;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data = { id: doc.id, ...doc.data() };
  });
  if (data != null) res.status(200).json({ ...data });
  else {
    res.status(200).json({ message: "Nu a fost gasit user" });
  }
});

app.post("/addClass", async (req, res) => {
  const { name, materie, timestamp, prof_id } = req.body;
  try {
    const document = await addDoc(collection(db_simple, "classes"), {
      name,
      materie,
      prof_id,
      timestamp,
      elevi: [],
      home: {
        responses: [],
      },
    });
    res.status(200).json({ message: "Class added!", id: document.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Eroare" });
  }
});

app.get("/getClasses/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const classes = await getDocs(
    query(
      collection(db_simple, "classes"),
      where("prof_id", "==", id),
      orderBy("timestamp", "desc")
    )
  );
  const data = [];
  classes.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json({ data });
});

app.post("/deleteClass", async (req, res) => {
  const id = req.body.id;
  await deleteDoc(doc(db_simple, "classes", id));
  res.status(200).json({ message: "Successfully deleted!" });
});

app.get("/getClass/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const class_ref = doc(db_simple, "classes", id);
  const clasa = await getDoc(class_ref);
  res.status(200).json({ id: clasa.id, ...clasa.data() });
});

app.post("/addElev", async (req, res) => {
  const id = req.body.class_id;
  const class_ref = doc(db_simple, "classes", id);
  const clasa = await getDoc(class_ref);
  let clasa_data = clasa.data();
  try {
    if (!clasa_data.elevi.some((e) => e.email === req.body.student.email)) {
      const { classes, ...rest } = req.body.student;
      clasa_data.elevi.push({ ...rest });
    } else
      res
        .status(200)
        .json({ ok: false, message: "This student is already in this class!" });
    await updateDoc(class_ref, clasa_data);
    const elev_ref = doc(db_simple, "users", req.body.student.id);
    const elev = await getDoc(elev_ref);
    let elev_data = elev.data();
    // if (elev.exists()) {
    // if (elev_data.clases.length == 0) {
    //   console.log("erkjbaskbj");
    //   elev_data.classes = [];
    // }
    const { elevi, ...rest } = clasa.data();
    if (!elev_data.classes.some((e) => e.name === rest.name)) {
      elev_data.classes.push({ ...rest, id_clasa: clasa.id });
      console.log(elev_data.classes);
      await updateDoc(elev_ref, elev_data);
    }
    res.status(200).json({ message: "The student was uploaded" });
  } catch {
    res.status(500).json({ message: "The student was NOT uploaded" });
  }
});

app.post("/deleteElev", async (req, res) => {
  const id = req.body.class_id;
  const class_ref = doc(db_simple, "classes", id);
  const clasa = await getDoc(class_ref);
  let clasa_data = clasa.data();
  const newStudents = clasa_data.elevi.filter(
    (elev) => elev.email != req.body.email
  );
  clasa_data.elevi = newStudents;
  await updateDoc(class_ref, clasa_data);

  const elev_ref = doc(db_simple, "users", req.body.id);
  const elev = await getDoc(elev_ref);
  let elev_data = elev.data();
  const newClassess = elev_data.classes.filter(
    (clasa) => clasa.id_clasa != req.body.class_id
  );
  elev_data.classes = newClassess;
  await updateDoc(elev_ref, elev_data);
  res.status(200).json({ message: "Successfully deleted!" });
});

// app.get("/getHomework/:clasa_id", async (req, res) => {
//   const { clasa_id } = req.params;

//   const class_ref = doc(db_simple, "classes", clasa_id);
//   const clasa = await getDoc(class_ref);

//   res.status(200).json({ id: clasa.id, ...clasa.data() });
// });

app.post("/addHomework", async (req, res) => {
  const { cerinta, untill, clasa_id } = req.body;

  // const extensie =
  //   req.files["exemplu"].name.split(".")[
  //     req.files["exemplu"].name.split(".").length - 1
  //   ];
  // console.log(req.files["exemplu"]);

  try {
    const uploadParams = {
      Bucket: "eestec-hack",
      Key: req.files["exemplu"].name,
      Body: req.files["exemplu"].data,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(uploadParams);
    const { Location } = await s3.send(command); // Use the send method to send the command
    const url = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;

    const class_ref = doc(db_simple, "classes", clasa_id);
    const clasa = await getDoc(class_ref);
    let clasa_data = clasa.data();
    clasa_data.home = {
      cerinta: cerinta,
      exemplu: url,
      untill: untill,
      responses: [],
    };
    await updateDoc(class_ref, clasa_data);

    res.status(200).json({
      home: {
        cerinta: cerinta,
        exemplu: url,
        untill: untill,
        responses: [],
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
  }
});

app.get("/getStudentClasses/:id_class", async (req, res) => {
  const { id_class } = req.params;

  const class_ref = doc(db_simple, "classes", id_class);
  const clasa = await getDoc(class_ref);
  let clasa_data = clasa.data();
  res.status(200).json({ ...clasa_data, id: clasa.id });
});

app.post("/uploadHome", async (req, res) => {
  const { user_email, class_id } = req.body;
  const rezolvare = req.files["rez"];

  const class_ref = doc(db_simple, "classes", class_id);
  const clasa = await getDoc(class_ref);
  let clasa_data = clasa.data();
  if (
    clasa_data.home.responses.some((resp) => resp.user_email === user_email)
  ) {
    res.status(200).json({ message: "You already uploaded your homework!" });
    return;
  }
  try {
    const uploadParams = {
      Bucket: "eestec-hack",
      Key: rezolvare.name,
      Body: rezolvare.data,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(uploadParams);
    const { Location } = await s3.send(command); // Use the send method to send the command
    const url = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;

    clasa_data.home.responses.push({
      user_email,
      rezolvare: url,
      timestamp: Math.floor(Date.now() / 1000),
      nota: -1,
    });

    await updateDoc(class_ref, clasa_data);

    res.status(200).json({ ...clasa_data.home.responses });
  } catch (error) {
    console.error("Error uploading image:", error);
  }
});

app.post("/deleteHome", async (req, res) => {
  const { id_class } = req.body;

  const class_ref = doc(db_simple, "classes", id_class);
  const clasa = await getDoc(class_ref);
  let clasa_data = clasa.data();
  clasa_data.home = {};
  await updateDoc(class_ref, clasa_data);
  res.status(200).json({ message: "Deleted" });
});
const ip_hanga = "192.168.1.141";
app.post("/test", async (req, res) => {
  await axios.post(`http://${ip_hanga}:8000/increment?nr=${9}`).then((resp) => {
    console.log(resp.data);
    res.status(200).json({ ...resp.data });
  });
});

import FormData from "form-data";

app.post("/rezolva", async (req, res) => {
  const { id_class, student_email } = req.body;

  const class_ref = doc(db_simple, "classes", id_class);
  const clasa = await getDoc(class_ref);
  let clasa_data = clasa.data();

  const userResponse = clasa_data.home.responses.filter(
    (resp) => resp.user_email === student_email
  )[0];

  await axios
    .get(userResponse.rezolvare, {
      responseType: "arraybuffer",
    })
    .then(async (respp) => {
      const data = Buffer.from(respp.data);
      const formdata = new FormData();
      formdata.append("file", data, {
        filename: "amin.txt",
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Optional: set content type if known
      });
      console.log(typeof data);
      formdata.append("requirement", clasa_data.home.cerinta);

      await axios
        .post(
          `http://${ip_hanga}:8000/analyze_file_with_requirements/`,
          formdata,
          {
            headers: {
              ...formdata.getHeaders(),
            },
          }
        )
        .then(async (response) => {
          console.log(response.data);
          const { nota, ...rest } = response.data;
          userResponse.nota = Number(nota.toFixed(2));
          userResponse.review = rest;
          for (let i = 0; i < clasa_data.home.responses.length; i++) {
            if (clasa_data.home.responses[i].user_email == student_email) {
              clasa_data.home.responses[i] = userResponse;
            }
          }

          await updateDoc(class_ref, clasa_data);
          res.status(200).json({ ...response.data });
        });
    });
});

app.get("/rezultate/:class_id/:email", async (req, res) => {
  const { class_id, email } = req.params;

  const class_ref = doc(db_simple, "classes", class_id);
  const clasa = await getDoc(class_ref);
  let clasa_data = clasa.data();
  const userResponse = clasa_data.home.responses.filter(
    (resp) => resp.user_email === email
  )[0];
  res.status(200).json({ ...userResponse });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
