const mongodb = require("@/src/lib/mongodb");
const User = require("@/src/model/schema");
const { cookies } = require("next/headers");

export const dynamic = "force-dynamic";

export async function Backend() {
  await mongodb.connect();
  const cookieStore = cookies();
  const username = cookieStore.get("username").value;
  //const username = "logan";
  const password = "xyzwhatever";
  const user = await User.findOne({ username, password });
  return <div>Backend: {user.username}</div>;
}
