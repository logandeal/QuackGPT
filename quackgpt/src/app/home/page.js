//const { Home } = require("./home");
//import { Backend } from "./backend.js";

const mongodb = require("@/src/lib/mongodb");
const User = require("@/src/model/schema");
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function Backend() {}

export default async function Page() {
  await mongodb.connect();
  const cookieStore = cookies();
  // TODO: get session id cookie
  const username = cookieStore.get("username").value;
  const password = cookieStore.get("password").value;
  //const username = "logan";
  // TODO: get user for session id
  const user = await User.findOne({ username, password });
  return <div>Backend: {user.username}</div>;
  // return (
  //   <div>
  //     {/* <Home /> */}
  //     <Backend />
  //   </div>
  // );
}
