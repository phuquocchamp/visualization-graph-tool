const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron');
const {readFile} = require('./core/fileHandler')
const path = require('path');
const fs = require('fs');
const {runIGA, runCMD} = require("../ago/excutor");
const {convertGen} = require("./core/agoGeneration");


let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.maximize();
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}
function writeToFile(testData, filePath) {
    return new Promise( (resolve, reject) => {
        const content = testData.join('\n');
         fs.writeFile(filePath, content, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const mainMenu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            {
                label: 'Open Test File',
                accelerator: 'CmdOrCtrl+O',
            },
            {type: 'separator'},
            {
                label: 'Exit',
                role: 'quit'
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'delete'},
            {type: 'separator'},
            {role: 'selectAll'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'toggledevtools'}
        ]
    },
    {
        label: 'Window',
        submenu: [
            {role: 'minimize'},
            {role: 'zoom'},
            {role: 'close'}
        ]
    }

]);

let count = 0;

async function openFileTest() {
    let graphData;
    await readFile(mainWindow).then( async (data) => {
        graphData = data['val1'];
        const testData = data['val2'];
        const filePath = "./tests/VI/vi_test.stp";
        await writeToFile(testData, filePath).then(() => {
            console.log("[Parse log] => Parse file test successfully");
        }).catch((error) => {
            console.error("[Parse log] => Parse file test error: ", error);
        });
    });
    return graphData;
}

app.whenReady().then(() => {
    // Menu.setApplicationMenu(mainMenu)
    // Menu.setApplicationMenu(null);

    ipcMain.handle('convertGen', async () => {
        // Handle the convertGen event and return a value
        return await convertGen();
    });

    ipcMain.handle("openFileTest",openFileTest);
    ipcMain.handle("runIGA", runIGA);
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
