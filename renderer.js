const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

function displayData(data) {
  const d = document.getElementById('data');
  window.api.doInvoke('fetchAllRecords', data)
    .then((response) => {
      let message = '';
      response.forEach((element) => message+=`${element.EnglishName}, ${element.Species}, ${element.Lifespan}\n`)
      
      d.innerText = message;
      console.log(response);
    });
}

displayData("Some Test Data!");

