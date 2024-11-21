const {dialog} = require('electron');
const fs = require('fs');

function readFile(mainWindow) {
    // Parse to data to display in ui
    function parseToData(data) {
        return new Promise((resolve) => {
            let edges = '';
            let terminals = '';
            const lines = data.split('\n');
            let section = '';
            for (const line of lines) {
                if (line.startsWith('SECTION')) {
                    section = line.split(' ')[1];
                } else if (line.startsWith("E ")) {
                    edges += line.substring(2) + '\n';
                } else if (line.startsWith("T ")) {
                    terminals += line.substring(2) + '\n';
                }
            }
            resolve([edges.trim(), terminals.trim()]);
        });
    }

    // Parse to test to run ago
    function parseToTest(data) {
        return new Promise((resolve) => {
            const lines = data.split("\n");
            let res = lines.slice(8);
            res.splice(3, 0, "");

            resolve(res);
        });
    }


    return new Promise( (resolve, reject) => {
        dialog.showOpenDialog(mainWindow, {
            properties: ['openFile']
        }).then(async result => {
            if (result.canceled) {
                reject('Open file dialog canceled');
                return;
            }

            const filePath = result.filePaths[0];
            await fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    reject('Read file error: ' + err);
                    return;
                }
                Promise.all([parseToData(data), parseToTest(data)])
                    .then(([[edges, terminals], value]) => {
                        resolve({
                            val1: [edges, terminals],
                            val2: value,
                        });
                    }).catch((error) => {
                    console.log(error);
                })

            });
        }).catch(err => {
            reject('Open file error: ' + err);
        });
    });

}

module.exports = {readFile};
