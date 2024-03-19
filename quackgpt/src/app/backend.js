const mongodb = require("@/src/lib/mongodb");
const User = require("@/src/model/schema");
const { cookies } = require("next/headers");

export async function Backend() {
  const cookieStore = cookies();

  if (!cookieStore.get("status")) {
    return "";
  }

  await mongodb.connect();

  const status = cookieStore.get("status").value;
  const username = cookieStore.get("username").value;
  const password_hash = cookieStore.get("password_hash").value;

  if (status == "register") {
    const user = await User.create({
      username: username,
      password: password_hash,
    });
    if (!user) {
      return "Problem with registering.";
    }
    return <div>Successful registration. User {username} created.</div>;
  } else if (status == "login") {
    const user = await User.findOne({ username, password_hash });
    if (!user) {
      return "Can't find user.";
    }
  }

  // @ts-ignore
  window.electronAPI.send("route-to-home");
}
