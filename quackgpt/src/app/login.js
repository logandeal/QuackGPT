"use client";

import React, { useState } from "react";
import "./login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    // @ts-ignore
    window.electronAPI.send("register", { username, password });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // @ts-ignore
    window.electronAPI.send("login", { username, password });
  };

  return (
    <>
      <div className="LoginPage">
        <div className="Register">
          <h1>Register</h1>
          <form onSubmit={handleRegister}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            ></input>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
            <input type="submit" value="Register"></input>
          </form>
        </div>
        {/* <div className="Logo">
          <img src="./QuackGPT logo.svg" alt="QuackGPT logo.svg"/>
        </div> */}
        <div className="Login">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            ></input>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
            <input type="submit" value="Login"></input>
          </form>
        </div>
      </div>
    </>
  );
}
