import axios from "./axios";
import { AxiosResponse } from "axios";

const responseBody = (response: AxiosResponse) => response.data;

export type LoginResponse = {
  isAdmin: boolean;
};

const checkLogin = (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  return axios
    .post(`/login`, { userName: username, password })
    .then(responseBody)
    .catch((error) => {
      console.log(error);
      return null;
    });
};

const useLogin = () => {
  const handleCheckLogin = async (username: string, password: string) => {
    const response = await checkLogin(username, password);

    if (!response) {
      localStorage.setItem("isAdmin", "null");
      return false;
    }

    // Save login information to localStorage
    localStorage.setItem("isAdmin", response?.isAdmin.toString());

    return true;
  };

  return {
    handleCheckLogin,
  };
};

export default useLogin;
