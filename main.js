// const { countReset } = require('node:console');
const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'public', 'app_database.sqlite'), {
  readonly: false,
  fileMustExist: false,
  timeout: 5000,
  verbose: console.log
});


// const sqlite3 = require('sqlite3');
// const { open } = require('sqlite');



// const global = {
//   DBPATH : './public/app_database.sqlite'
// };


const createWindow = () => {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('admin.html')
}


app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong');
  ipcMain.handle('fetchAllRecords', async (event, data) => { 
    console.log("fetchAllRecords!");
  });

  ipcMain.handle('addBirdRecord', async (event, data) => { 
    addBirdRecord(event, data);
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
  // console.log(data)
  // return await query()
}

// async function query() {
//   return new Promise((resolve, reject) => {
//     const database = new sqlite3.Database('./public/app_database.sqlite');
//     database.all('SELECT * FROM bird_sample', (error, rows) => {
//       if (error) {
//         reject(error); // Reject the promise if there's an error
//       } else {
//         resolve(rows); // Resolve the promise with the result
//       }
//     });
//   });
// }

// function getDatabaseConnection() {
//   return new Promise((resolve, reject) => {
//     if (global.database === undefined) {
//       try {
//         global.database = new sqlite3.Database(global.DBPATH);
//       } catch (error) {
//         console.log("Error Connecting to Database");
//         console.log(error);
//         reject(error);
//       }
//     }
//     resolve(global.database);
//   });
// }

function addBirdRecord(channel, bird) {
  
  const insert_bird_header = db.prepare('INSERT INTO bird_header (bird_id, group_id, english_name, latin_name) VALUES (?, ?, ?, ?)');

  console.log(bird);

  const attr = {
    attribute_id: "attribute_id", 
    attribute_name: "attribute_name", 
    attribute_value: "attribute_value", 
    bird_id: "bird_id"
  }
  insertBirdAttribute('text', attr);
  
}


function insertBirdAttribute(type, attribute) {
  let statement = '';
  switch (type) {
    case "text":
      statement = db.prepare('INSERT INTO bird_attributes_text (attribute_id, attribute_name, attribute_value, bird_id) VALUES (?, ?, ?, ?)');
      break;

    case "integer":
      statement = db.prepare('INSERT INTO bird_attributes_text (attribute_id, attribute_name, attribute_value, bird_id) VALUES (?, ?, ?, ?)');
      break;

    case "float":
      statement = db.prepare('INSERT INTO bird_attributes_text (attribute_id, attribute_name, attribute_value, bird_id) VALUES (?, ?, ?, ?)');
      break;

    default:
      console.log(`Unknown Attribute Type: ${type}`);
      return false
  }
  try {
    statement.run(attribute.attribute_id, attribute.attribute_name, attribute.attribute_value, attribute.bird_id);
    return true

  } catch (err) {
    console.log(err);
    console.log(`Failed to insert Attribute: ${attribute}`);
  }
}



// function getNewId(counter_name) {
//   return new Promise((resolve, reject) => {
//     getDatabaseConnection().then(
//       function(database) {
//         const sql = database.prepare(
//           `BEGIN Transaction
//           UPDATE counters
//           SET count = count + 1
//           WHERE counter_name = ?
//           RETURNING counter_prefix || printf('%06X', count) as NEW_ID
//           COMMIT Transaction;`
//         ).get(counter_name);
//         console.log(sql.NEW_ID);
//         resolve(sql.NEW_ID);
//       },
//       function(error) {
//         console.log(error);
//         reject(error);
//       }
//     );
//   });  
// }



// return new Promise((resolve, reject) => {
//     const database = new sqlite3.Database('./public/app_database.sqlite');
//     database.all('SELECT * FROM bird_sample', (error, rows) => {
//       if (error) {
//         reject(error); // Reject the promise if there's an error
//       } else {
//         resolve(rows); // Resolve the promise with the result
//       }
//     });
//   });


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
