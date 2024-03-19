import React from "react";
import { Backend } from "./backend";
import Login from "./login";

export default function Landing() {
  return (
    <>
      <div>
        <Login />
        <br />
        <Backend />
      </div>
    </>
  );
}
