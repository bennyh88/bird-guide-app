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


const createWindow = () => {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })

  // win.loadFile('admin.html')
  win.loadFile('birdGuide.html')
}


app.whenReady().then(() => {

  ipcMain.handle('fetchBirdList', async (event, data) => { 
    console.log("fetchBirdList!");
    response = fetchBirdList();
    return response
  });

  ipcMain.handle('loadBird', async (event, data) => { 
    console.log("loadBird!");
    response = loadBird(data);
    return response
  });

  // ipcMain.handle('ping', () => 'pong');
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


async function query() {
  return new Promise((resolve, reject) => {
    const database = new sqlite3.Database('./public/app_database.sqlite');
    database.all('SELECT * FROM bird_sample', (error, rows) => {
      if (error) {
        reject(error); // Reject the promise if there's an error
      } else {
        resolve(rows); // Resolve the promise with the result
      }
    });
  });
}



// function fetchBirdList() {
//   const statement = db.prepare(`
//     SELECT bg.group_description, bh.english_name
//     FROM bird_groups bg
//     LEFT JOIN bird_header bh
//     ON bh.group_id = bg.group_id
//     WHERE bh.english_name is not null
//     ORDER BY bg.group_index asc`
//   );
//   try {
//     result = statement.get();
//     return result
//   } catch (err) {
//     return err
//   }
// }

function fetchBirdList() {
  return new Promise((resolve, reject) => {
    const statement = db.prepare(`
      SELECT bg.group_index, bg.group_name, bg.group_description, bh.english_name, bh.bird_id
      FROM bird_groups bg
      LEFT JOIN bird_header bh
      ON bh.group_id = bg.group_id
      WHERE bh.english_name is not null
      AND bg.group_description != 'No Group Assigned'
      ORDER BY bg.group_index asc`
    );
    try {
      result = []

      for (const row of statement.iterate()) {
        let count = 0;

        result.forEach((group) => {
          // if the group exists add bird to members
          if (group.index === row.group_index) {
            group.members.push(
              {
                englishName : row.english_name,
                id : row.bird_id
              }
              
            )
            count++;
          }
        });

        if (count == 0) {
          // create a new group and append bird to it
          const group = {
            index: row.group_index,
            groupName: row.group_name,
            groupDescription: row.group_description,
            members: []
          }
          group.members.push(
            {
              englishName : row.english_name,
              id : row.bird_id
            }
          )
          result.push(group)
        }
      }

      resolve(result);
      
    } catch (err) {
      reject(err);
    }
  });

}

function loadBird(birdId) {
  console.log("birdId: ", birdId);
  return new Promise((resolve, reject) => {
    const statement = db.prepare(`
      SELECT 
        bh.bird_id AS birdId,
        bh.english_name AS englishName,
        bh.international_name AS internationalName,
        bh.latin_name AS latinName,
        bg.group_name AS groupName,
        bg.group_description AS groupDescription
      FROM bird_header bh
      LEFT JOIN bird_groups bg
      ON bg.group_id = bh.group_id
      WHERE bh.bird_id = ?`
    );

    const attr_statement = db.prepare(`
      SELECT 
        acd.attribute_category_index,
        acd.attribute_category_name,
        bat.attribute_name,
        bat.attribute_value,
        ifnull(
          (
            SELECT display_text 
            FROM language_map 
            WHERE internal_text = bat.attribute_name 
            AND language = 'ENGLISH'
          ), 
          bat.attribute_name
        ) AS attribute_display_name
      FROM
        bird_attributes_text bat
        
      LEFT JOIN
        attribute_category_mapping acm
      ON
        acm.attribute_name = bat.attribute_name
        
      LEFT JOIN
        attribute_category_definition acd
      ON 
        acd.attribute_category_name = acm.attribute_category_name

      WHERE 
        bat.bird_id = ?

      ORDER BY
        acd.attribute_category_index, bat.attribute_name`
    );

    try {
      result = statement.get(birdId);

      attributeCategories = {}
      for (const row of attr_statement.iterate(birdId)) {
        const attribute = {
          attributeDisplayName: row.attribute_display_name,
          attributeName: row.attribute_name,
          attributeValue: row.attribute_value
        }
        if (attributeCategories[row.attribute_category_index]) {
          attributeCategories[row.attribute_category_index].attributes.push(attribute);
        } else {
          attributeCategories[row.attribute_category_index] = {
            attributeCategoryIndex: row.attribute_category_index,
            attributeCategoryName: row.attribute_category_name,
            attributeCategoryDisplayName: row.attribute_category_name,
            attributes: []
          }
          attributeCategories[row.attribute_category_index].attributes.push(attribute);
        }

      }

      result["attributeCategories"] = attributeCategories;
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });

}


// function fetchBirdList() {
//   return new Promise((resolve, reject) => {
//     const statement = db.prepare(`
//       SELECT bg.group_description, bh.english_name
//       FROM bird_groups bg
//       LEFT JOIN bird_header bh
//       ON bh.group_id = bg.group_id
//       WHERE bh.english_name is not null
//       ORDER BY bg.group_index asc`
//     );
//     try {
//       result = statement.all();
//       resolve(result);
//     } catch (err) {
//       reject(err);
//     }
//   });

// }

//   const statement = db.prepare(`
//     SELECT bg.group_description, bh.english_name
//     FROM bird_groups bg
//     LEFT JOIN bird_header bh
//     ON bh.group_id = bg.group_id
//     WHERE bh.english_name is not null
//     ORDER BY bg.group_index asc`
//   );

//   result = statement.get();
//   console.log(result);
//   return result

// }


async function fetchAllRecords(event, data) {
  // console.log(event)
  // console.log(data)
  // return await query()
}


function addBirdRecord(channel, bird) {
  
  console.log(bird);

  // Get the ID for the new Bird
  const bird_id = getNextId('header_counter');
  const group_id = getNextId('group_counter');

  const insert_bird_header = db.prepare('INSERT INTO bird_header (bird_id, group_id, english_name, latin_name, international_name) VALUES (?, ?, ?, ?)');
  try {
    insert_bird_header.run(bird_id, group_id, bird.header.englishName, bird.header.latinName);
    return true

  } catch (err) {
    console.log(err);
    console.log(`Failed to insert to bird_header: ${bird.header.englishName}`);
  }
  
  bird.attributes.forEach((attribute) => {
    attribute.attribute_id = getNextId('attribute_counter');
    insertBirdAttribute(bird_id, attribute);
  });
 
}


function insertBirdAttribute(bird_id, attribute) {
  let statement = '';
  switch (attribute.attribute_type) {
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
      console.log(`Unknown Attribute Type: ${attribute.attribute_type}`);
      return false
  }
  try {
    statement.run(attribute.attribute_id, attribute.attribute_name, attribute.attribute_value, bird_id);
    return true

  } catch (err) {
    console.log(err);
    console.log(`Failed to insert Attribute: ${attribute}`);
  }
}


function getNextId(counterName) {

  const incStmt = db.prepare(`
    UPDATE counters
    SET counter_count = counter_count + 1
    WHERE counter_name = ?`);

  const getStmt = db.prepare(`
    SELECT counter_prefix || printf('%08X', counter_count) AS next_id
    FROM counters
    WHERE counter_name = ?`
  );

  const getNextId = db.transaction((counterName) => {
    incStmt.run(counterName);
    const row = getStmt.get(counterName);
    // return row ? row.value : null;
    return row ? row.next_id : null;
  });

  try {
    newID = getNextId(counterName);
    console.log(newID);
    return newID

  } catch (err) {
    console.log(err);
    console.log(`Failed to generate new ID for counter: ${counterName}`);
  }

}




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
