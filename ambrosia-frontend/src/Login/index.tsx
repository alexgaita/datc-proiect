import React, { useState, ChangeEvent } from "react";
import  "./styles.css";

interface Credentials {
  username: string;
  password: string;
}

export function Login() {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: keyof Credentials
  ) => {
    setCredentials({
      ...credentials,
      [field]: event.target.value,
    });
  };
const isDisabled=!credentials.username || !credentials.password;
  return (
    <form>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(event) => handleInputChange(event, "username")}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(event) => handleInputChange(event, "password")}
      />
      <button style={{
          
          color: "white",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          backgroundColor:isDisabled?"red":"green"}} disabled={isDisabled} onClick={()=>{
        alert("Login succesfull")
        
      }}>Login</button>
    </form>
  );
}
