import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ?? "https://3dealexandru.azurewebsites.net",
});

export default instance;
