const { app, BrowserWindow, ipcMain } = require("electron");
const serve = require("electron-serve");
const path = require("path");
const mongodb = require("../src/lib/mongodb");
const User = require("../src/model/schema");

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }

  return win;
};

app.on("ready", () => {
  const win = createWindow();

  ipcMain.on("login", async (_, { username, password }) => {
    // TODO: make API call back to next instead of calling mongo directly
    await mongodb.connect();
    const user = await User.findOne({ username, password });
    if (user) {
      // TODO: create session record for user
      // win.webContents.send("navigate-to", "/home");
      win.loadURL("http://localhost:3000/home");
      // return a redirect

      const { session } = win.webContents;
      await session.cookies.set({
        name: "username",
        value: username,
        url: "http://localhost:3000",
      });
      await session.cookies.set({
        name: "password",
        value: password,
        url: "http://localhost:3000",
      });
    } else {
      console.log("PROBLEM");
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
