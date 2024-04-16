import React from "react";
import { Backend } from "./backend";
import dynamic from "next/dynamic";
import "./login.css";

const LoginOrDownload = dynamic(() => import("./login"), { ssr: false });

export default function Landing() {
  return (
    <div>
      <div className="Status">
        <Backend />
      </div>
      <LoginOrDownload />
    </div>
  );
}
