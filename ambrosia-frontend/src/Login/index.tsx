import React, { useState, ChangeEvent } from "react";
import useLogin from "../api/login";

interface Credentials {
  username: string;
  password: string;
}

export function Login() {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });

  const { handleCheckLogin } = useLogin();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: keyof Credentials,
  ) => {
    setCredentials({
      ...credentials,
      [field]: event.target.value,
    });
  };
  const isDisabled = !credentials.username || !credentials.password;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        margin: "0",
      }}
    >
      <div
        style={{
          maxWidth: "300px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
          htmlFor="username"
        >
          Username
        </label>
        <input
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(event) => handleInputChange(event, "username")}
        />
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
          htmlFor="password"
        >
          Password
        </label>
        <input
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(event) => handleInputChange(event, "password")}
        />
        <button
          style={{
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: isDisabled ? "red" : "green",
          }}
          disabled={isDisabled}
          onClick={() => {
            handleCheckLogin(credentials.username, credentials.password).then(
              (response) => {
                console.log("intra aici");
                if (response) {
                  window.location.href = "map";
                } else {
                  alert("Wrong username or password");
                }
              },
            );
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
