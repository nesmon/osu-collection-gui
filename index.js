require('v8-compile-cache')

const osuCollection = require("./osu-collection-creation/app")
const {app, BrowserWindow, ipcMain} = require('electron')
const nodesu = require("nodesu")
const sqlite3 = require('sqlite3').verbose();
const pathDB = `${__dirname}/osu-collection-creation/collection.db`.replace('app.asar', 'app.asar.unpacked');
const db = new sqlite3.Database(pathDB);
let mainWindow

console.log(require('os').homedir());

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    ipcMain.on('creationRequest', async (event, api, name, value, isMD5) => {
        try{
            const osu = new nodesu.Client(api)
            const getUser = await osu.user.get("nesmon")
            console.log(getUser)
        }catch(e)
        {
            return event.reply("responseRequest", false, "Please Give a valid API key !", isMD5)
        }

        const osuWrite = new osuCollection(api, mainWindow, db);
        osuWrite.createCollection(`${require('os').homedir()}\\${name}.db`, value, false).then((data) => {
            event.reply("responseRequest", true, "Collection created !")
        })
    })

    mainWindow.loadURL(`file://${__dirname}/public/index.html`)

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.removeMenu()
}

app.whenReady().then(createWindow)

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})