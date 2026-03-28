const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const createWindow = () => {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}


app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong');
  ipcMain.handle('fetchAllRecords', async (event, data) => { 
    return await fetchAllRecords(event, data)
  });

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

})

async function fetchAllRecords(event, data) {
  // console.log(event)
  console.log(data)
  return await queryData(event, data)
}

async function queryData(event, data) {
  return await query()
}

async function query() {
  return new Promise((resolve, reject) => {
    const database = new sqlite3.Database('./public/app_database');
    database.all('SELECT * FROM bird_sample', (error, rows) => {
      if (error) {
        reject(error); // Reject the promise if there's an error
      } else {
        resolve(rows); // Resolve the promise with the result
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
