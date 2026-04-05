
function loadBirdList() {
  window.api.doInvoke('fetchBirdList', '')
  .then((response) => {
    console.log(response);
    
    let content = '';
    response.forEach((group) => {
      content += `<b>${group.groupDescription}</b>`;
      content += `<ul>`;
      group.members.forEach((member) => {
        content += `<li id="${member.id}" class="BirdAsideUL">${member.englishName}</li>`;
      });
      content += `</ul>`;
    });

    const aside = document.getElementById('aside');
    aside.innerHTML = content;

    let birds = document.querySelectorAll('aside li');
    birds.forEach((item) => {
      item.addEventListener('click', (event) => {
        console.log(event.target.id);
        loadBird(event.target.id);
      });

    });

  });
}

function loadBird(birdId) {
  window.api.doInvoke('loadBird', birdId)
  .then((response) => {
    console.log(response);
    document.getElementById('groupDescriptionHeader').innerHTML = response.group_description;
    document.getElementById('englishNameHeader').innerHTML = response.english_name;
    document.getElementById('internationalNameHeader').innerHTML = response.international_name;
    document.getElementById('latinNameHeader').innerHTML = response.latin_name;
  });
}

loadBirdList();








// const information = document.getElementById('info')
// information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

// function displayData(data) {
//   const d = document.getElementById('data');
//   window.api.doInvoke('fetchAllRecords', data)
//     .then((response) => {
//       let message = '';
//       response.forEach((element) => message+=`${element.EnglishName}, ${element.Species}, ${element.Lifespan}\n`)
      
//       d.innerText = message;
//       console.log(response);
//     });
// }

// displayData("Some Test Data!");

// window.onload(fetchBirdList());



// async function fetchBirdList() {
//   try {
//     const response = window.api.doInvoke('fetchbirdList', '');
//     console.log(response);
//     const aside = document.getElementById('aside');
//     aside.innerHTML = response;
//   } catch (err) {
//     console.log(err);
//     const aside = document.getElementById('aside');
//     aside.innerHTML = err;
//   }
  
// }



// window.api.doInvoke('fetchbirdList', '').then(
//   (response) => {
//     console.log(response);
//     const aside = document.getElementById('aside');
//     aside.innerHTML = response;
//   }, (err) => {
//     console.log(err);
//     const aside = document.getElementById('aside');
//     aside.innerHTML = err;
//   });

// const addBirdButton = document.getElementById('addBirdButton');
// addBirdButton.addEventListener('click', addBird);

function addBird() {
  // collect the form Data
  bird = constructBird();
  console.log(bird);

  // Pass the bird object to the main.js process to send to the database
  window.api.doInvoke('addBirdRecord', bird)
  .then((response) => {
    if (response === true) {
      document.getElementById('messagebox').innerText = "Successfully Added Bird!";
    }
    document.getElementById('messagebox').innerText = "Failed to Add Bird!";
    console.log(response);
  });

}


function constructBird() {
  let bird = {};
  bird.header = {
    "englishName" : document.getElementById('EnglishNameInput').value,
    "internationalName" : document.getElementById('InternationalNameInput').value,
    "latinName" : document.getElementById('LatinNameInput').value,
    "groupName" : document.getElementById('GroupNameInput').value,
  };

  // attribute types : "text", "integer", "float"
  bird.attributes = [
    { "attribute_name" : "howToId",               "attribute_value" : document.getElementById('HowToIdInput').value,                "attribute_type" : "text" },
    { "attribute_name" : "keyFeatures",           "attribute_value" : document.getElementById('KeyFeaturesInput').value,            "attribute_type" : "text" },
    { "attribute_name" : "conservationStatus",    "attribute_value" : document.getElementById('ConservationStatusInput').value,     "attribute_type" : "text" },
    { "attribute_name" : "diet",                  "attribute_value" : document.getElementById('DietInput').value,                   "attribute_type" : "text" },
    { "attribute_name" : "beak",                  "attribute_value" : document.getElementById('BeakInput').value,                   "attribute_type" : "text" },
    { "attribute_name" : "feather",               "attribute_value" : document.getElementById('FeatherInput').value,                "attribute_type" : "text"},
    { "attribute_name" : "leg",                   "attribute_value" : document.getElementById('LegInput').value,                    "attribute_type" : "text" },
    { "attribute_name" : "lengthMin",             "attribute_value" : document.getElementById('LengthMinInput').value,              "attribute_type" : "integer" },
    { "attribute_name" : "lengthMax",             "attribute_value" : document.getElementById('LengthMaxInput').value,              "attribute_type" : "integer" },
    { "attribute_name" : "wingspanMin",           "attribute_value" : document.getElementById('WingspanMinInput').value,            "attribute_type" : "integer" },
    { "attribute_name" : "wingspanMax",           "attribute_value" : document.getElementById('WingspanMaxInput').value,            "attribute_type" : "integer" },
    { "attribute_name" : "weightMin",             "attribute_value" : document.getElementById('WeightMinInput').value,              "attribute_type" : "integer" },
    { "attribute_name" : "weightMax",             "attribute_value" : document.getElementById('WeightMaxInput').value,              "attribute_type" : "integer" },
    { "attribute_name" : "europeanPopulationMin", "attribute_value" : document.getElementById('EuropeanPopulationMinInput').value,  "attribute_type" : "integer" },
    { "attribute_name" : "europeanPopulationMax", "attribute_value" : document.getElementById('EuropeanPopulationMaxInput').value,  "attribute_type" : "integer" },
    { "attribute_name" : "ukBreedingPairsMin",    "attribute_value" : document.getElementById('UKBreedingPairsMinInput').value,     "attribute_type" : "integer" },
    { "attribute_name" : "ukBreedingPairsMax",    "attribute_value" : document.getElementById('UKBreedingPairsMaxInput').value,     "attribute_type" : "integer" },
    { "attribute_name" : "difficultyRating",      "attribute_value" : document.getElementById('DifficultyRatingInput').value,       "attribute_type" : "text" },
    { "attribute_name" : "whereWhenStatement",    "attribute_value" : document.getElementById('WhereWhenStatementInput').value,     "attribute_type" : "text" },
    { "attribute_name" : "habitatDescription",    "attribute_value" : document.getElementById('HabitatDescriptionInput').value,     "attribute_type" : "text" }
  ];

  // bird.header.englishName = document.getElementById('EnglishNameInput').value;
  // bird.latinName = document.getElementById('LatinNameInput').value;
  // bird.groupName = document.getElementById('GroupNameInput').value;

  // bird.howToId = document.getElementById('HowToIdInput').value;
  // bird.keyFeatures = document.getElementById('KeyFeaturesInput').value;
  // bird.conservationStatus = document.getElementById('ConservationStatusInput').value;
  // bird.diet = document.getElementById('DietInput').value;
  // bird.beak = document.getElementById('BeakInput').value;
  // bird.feather = document.getElementById('FeatherInput').value;
  // bird.legInput = document.getElementById('LegInput').value;
  // bird.lengthMin = document.getElementById('LengthMinInput').value;
  // bird.lengthMax = document.getElementById('LengthMaxInput').value;
  // bird.wingspanMin = document.getElementById('WingspanMinInput').value;
  // bird.wingspanMax = document.getElementById('WingspanMaxInput').value;
  // bird.weightMin = document.getElementById('WeightMinInput').value;
  // bird.weightMax = document.getElementById('WeightMaxInput').value;
  // bird.europeanPopulationMin = document.getElementById('EuropeanPopulationMinInput').value;
  // bird.europeanPopulationMax = document.getElementById('EuropeanPopulationMaxInput').value;
  // bird.ukBreedingPairsMin = document.getElementById('UKBreedingPairsMinInput').value;
  // bird.ukBreedingPairsMax = document.getElementById('UKBreedingPairsMaxInput').value;
  // bird.difficultyRating = document.getElementById('DifficultyRatingInput').value;
  // bird.whereWhenStatement = document.getElementById('WhereWhenStatementInput').value;
  // bird.habitatDescription = document.getElementById('HabitatDescriptionInput').value;


  let monthsResident = {};
  monthsResident.jan = isChecked(document.getElementById('JanCB'));
  monthsResident.feb = isChecked(document.getElementById('FebCB'));
  monthsResident.mar = isChecked(document.getElementById('MarCB'));
  monthsResident.apr = isChecked(document.getElementById('AprCB'));
  monthsResident.may = isChecked(document.getElementById('MayCB'));
  monthsResident.jun = isChecked(document.getElementById('JunCB'));
  monthsResident.jul = isChecked(document.getElementById('JulCB'));
  monthsResident.aug = isChecked(document.getElementById('AugCB'));
  monthsResident.sep = isChecked(document.getElementById('SepCB'));
  monthsResident.oct = isChecked(document.getElementById('OctCB'));
  monthsResident.nov = isChecked(document.getElementById('NovCB'));
  monthsResident.dec = isChecked(document.getElementById('DecCB'));
  
  bird.monthsResident = monthsResident;

  return bird
}

function isChecked(e) {
  if (e.checked) {
    return true
  }
  return false
}