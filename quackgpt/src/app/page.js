import React from "react";
import { Backend } from "./backend";
import Login from "./login";
import pkg from "../../package.json";

export default function Landing() {
  // @ts-ignore
  if (typeof window !== "undefined" && window && !window.electronAPI) {
    return (
      <div>
        <ul>
          <li>
            <a href={`/downloads/QuackGPT-${pkg.version}-arm64.dmg`}>Mac</a>
          </li>
          <li>
            <a href={`/downloads/QuackGPT ${pkg.version}`}>Windows</a>
          </li>
        </ul>
      </div>
    );
  }
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
