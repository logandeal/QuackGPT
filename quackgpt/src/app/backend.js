const { User } = require("@/src/model/schema");
const { cookies } = require("next/headers");
import mongoose from "mongoose";
import { redirect } from "next/navigation";

const connection = {};

export async function Backend() {
  const cookieStore = cookies();

  if (!cookieStore.get("status")) {
    return "";
  }

  if (!connection.isConnected) {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
  }

  const status = cookieStore.get("status").value;
  const username = cookieStore.get("username").value;
  const password_hash = cookieStore.get("password_hash").value;

  if (status == "register") {
    console.log("hello", username);
    const userAlreadyExists = await User.findOne({ username });
    console.log(userAlreadyExists);
    if (userAlreadyExists) {
      return <b style={{ color: "orange" }}>Username already taken.</b>;
    }
    const user = await User.create({
      username: username,
      password: password_hash,
    });
    if (!user) {
      return <b style={{ color: "orange" }}>Problem with registering.</b>;
    }
    return (
      <b style={{ color: "chartreuse" }}>
        Successful registration. User {username} created.
      </b>
    );
  } else if (status == "login") {
    //console.log(username, password_hash);
    const user = await User.findOne({
      username: username,
      password: password_hash,
    });
    //console.log(user); //May want to remove this in final product???
    if (!user) {
      return <b style={{ color: "orange" }}>Can't find user.</b>;
    }
    redirect("/home");
  }
}
