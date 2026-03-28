const { contextBridge, ipcRenderer } = require('electron')
// const { test } = require('./main'.js)

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld(
  'api', {
    // From render to main and back again
    doInvoke: (channel, data) => {
      let validChannels = ["fetchAllRecords"];

      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke('fetchAllRecords', data);
      }
    }
    
  }
)