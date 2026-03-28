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

const addBirdButton = document.getElementById('addBirdButton');
addBirdButton.addEventListener('click', addBird);

function addBird() {
  bird = constructBird();
  console.log(bird);
}


function constructBird() {
  let bird = {};
  bird.englishName = document.getElementById('EnglishNameInput').value;
  bird.latinName = document.getElementById('LatinNameInput').value;
  bird.groupName = document.getElementById('GroupNameInput').value;
  bird.howToId = document.getElementById('HowToIdInput').value;
  bird.keyFeatures = document.getElementById('KeyFeaturesInput').value;
  bird.conservationStatus = document.getElementById('ConservationStatusInput').value;
  bird.diet = document.getElementById('DietInput').value;
  bird.beak = document.getElementById('BeakInput').value;
  bird.feather = document.getElementById('FeatherInput').value;
  bird.legInput = document.getElementById('LegInput').value;
  bird.lengthMin = document.getElementById('LengthMinInput').value;
  bird.lengthMax = document.getElementById('LengthMaxInput').value;
  bird.wingspanMin = document.getElementById('WingspanMinInput').value;
  bird.wingspanMax = document.getElementById('WingspanMaxInput').value;
  bird.weightMin = document.getElementById('WeightMinInput').value;
  bird.weightMax = document.getElementById('WeightMaxInput').value;
  bird.europeanPopulationMin = document.getElementById('EuropeanPopulationMinInput').value;
  bird.europeanPopulationMax = document.getElementById('EuropeanPopulationMaxInput').value;
  bird.ukBreedingPairsMin = document.getElementById('UKBreedingPairsMinInput').value;
  bird.ukBreedingPairsMax = document.getElementById('UKBreedingPairsMaxInput').value;
  bird.difficultyRating = document.getElementById('DifficultyRatingInput').value;
  bird.whereWhenStatement = document.getElementById('WhereWhenStatementInput').value;
  bird.habitatDescription = document.getElementById('HabitatDescriptionInput').value;
  bird.europeanPopulationMax = document.getElementById('EuropeanPopulationMaxInput').value;

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