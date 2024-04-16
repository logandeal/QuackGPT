const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const serve = require("electron-serve");
const path = require("path");
const crypto = require("crypto");
const dirTree = require("directory-tree");
const fs = require("fs");
const server_url = app.isPackaged
  ? "https://quackgpt.vercel.app"
  : "http://localhost:3000";

// If development environment
if (!app.isPackaged) {
  // @ts-ignore
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "..", "node_modules", ".bin", "electron"),
    hardResetMethod: "exit",
  });
}

function getAppDataPath() {
  const homedir = require("os").homedir();
  switch (process.platform) {
    case "darwin": {
      return path.join(
        homedir,
        "Library",
        "Application Support",
        "QuackGPTData"
      );
    }
    case "win32": {
      return path.join(homedir, "QuackGPTData");
    }
    case "linux": {
      return path.join(homedir, ".QuackGPTData");
    }
    default: {
      console.log("Unsupported platform!");
      process.exit(1);
    }
  }
}

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

  // possible modification to createWindow function
  /*

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  */

  win.loadURL(server_url);
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }
  win.webContents.on("did-fail-load", (e, code, desc) => {
    win.webContents.reloadIgnoringCache();
  });

  return win;
};

const createCredentialCookies = async (win, status, username, password) => {
  const { session } = win.webContents;
  await session.cookies.set({
    name: "status",
    value: status,
    url: server_url,
  });
  await session.cookies.set({
    name: "username",
    value: username,
    url: server_url,
  });
  await session.cookies.set({
    name: "password_hash",
    value: crypto.createHash("sha256").update(password).digest("hex"),
    url: server_url,
  });
  // Reload so that cookies can be accessed
  win.loadURL(server_url);
};

app.on("ready", () => {
  const win = createWindow();

  ipcMain.on("save_messages", async (_, { messages, username }) => {
    const appDatatDirPath = getAppDataPath();
    let filePath = appDatatDirPath + "/" + username + ".json";
    if (!fs.existsSync(appDatatDirPath)) {
      fs.mkdirSync(appDatatDirPath);
    }
    fs.writeFile(filePath, JSON.stringify(messages), (error) => {
      if (error) {
        console.log(error);
      }
    });
  });

  ipcMain.on("register", async (_, { username, password }) => {
    createCredentialCookies(win, "register", username, password);
  });

  ipcMain.on("login", async (_, { username, password }) => {
    createCredentialCookies(win, "login", username, password);
  });

  ipcMain.on("request-data", (event, arg) => {
    const appDatatDirPath = getAppDataPath();
    let filePath = appDatatDirPath + "/" + arg + ".json";
    console.log(filePath);
    let checkExists = true;
    if (!fs.existsSync(appDatatDirPath)) {
      fs.mkdirSync(appDatatDirPath);
      fs.writeFileSync(filePath, JSON.stringify([]));
      checkExists = false;
    }
    var messages = JSON.stringify([]);
    if (checkExists) {
      fs.readFile(filePath, "utf8", function (err, data) {
        messages = data;
        event.sender.send("reply-data", messages);
      });
    } else {
      event.sender.send("reply-data", JSON.stringify([]));
    }
  });

  ipcMain.on("open-file-dialog", async (event) => {
    try {
      const result = await dialog.showOpenDialog(win, {
        properties: ["openFile", "openDirectory"],
      });
      if (!result.canceled) {
        const selectedPath = result.filePaths[0];
        console.log("Selected path:", selectedPath);

        const filteredTree = dirTree(
          selectedPath,
          {
            extensions:
              /\.(js|ts|py|c|cpp|h|hpp|java|html|css|json|md|cs|php|rb)$/,
            attributes: ["size", "type", "extension"],
            exclude: /node_modules/,
          },
          (item, path, stats) => {
            const content = fs.readFileSync(path).toString();
            item.custom = {
              content,
            };
          }
        );

        event.sender.send("open-file-result", {
          fileTree: filteredTree,
        });
      } else {
        console.log("No file or directory selected");
      }
    } catch (err) {
      console.log(err);
    }
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
