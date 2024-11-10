import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "content-type": "application/json",
  },
  // withCredentials: true,

});
export default Axios;
