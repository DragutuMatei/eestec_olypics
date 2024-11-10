import axios from "axios";
import React, { useEffect, useState } from "react";
import MainProf from "./Prof/MainProf";
import MainElev from "./Elev/MainElev";
import Axios from "./AxiosConfig";

function Main({ user }) {
  return (
    <>
      {user.role == "professor" ? (
        <MainProf user={user} />
      ) : (
        <MainElev user={user} />
      )}
    </>
  );
}

export default Main;
