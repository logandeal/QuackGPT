const { app, BrowserWindow, ipcMain } = require("electron");
const serve = require("electron-serve");
const path = require("path");
const crypto = require("crypto");

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

const createCredentialCookies = async (win, status, username, password) => {
  const { session } = win.webContents;
  await session.cookies.set({
    name: "status",
    value: status,
    url: "http://localhost:3000",
  });
  await session.cookies.set({
    name: "username",
    value: username,
    url: "http://localhost:3000",
  });
  await session.cookies.set({
    name: "password_hash",
    value: crypto.createHash("sha256").update(password).digest("hex"),
    url: "http://localhost:3000",
  });
  win.loadURL("http://localhost:3000");
};

app.on("ready", () => {
  const win = createWindow();

  ipcMain.on("register", async (_, { username, password }) => {
    createCredentialCookies(win, "register", username, password);
  });

  ipcMain.on("login", async (_, { username, password }) => {
    createCredentialCookies(win, "login", username, password);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
