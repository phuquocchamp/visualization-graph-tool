const {contextBridge, ipcRenderer} = require('electron')


contextBridge.exposeInMainWorld('file', {
    openFile: () => ipcRenderer.invoke('openFileTest')
})

contextBridge.exposeInMainWorld('graph', {
    drawGraph: ()=> {
        ipcRenderer.send("drawGraph", "Command to draw graph");

    },
    runIGA: async ()=>{
       await ipcRenderer.invoke("runIGA");
    },
    convertGen: async  () =>  {
        return await ipcRenderer.invoke("convertGen")
    }

});






