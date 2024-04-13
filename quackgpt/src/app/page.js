import React from "react";
import { Backend } from "./backend";
import dynamic from "next/dynamic";

const LoginOrDownload = dynamic(() => import("./login"), { ssr: false });

export default function Landing() {
  return (
    <div>
      <LoginOrDownload />
      <br />
      <Backend />
    </div>
  );
}
