const fs = require('fs')
function convertGen() {
    return new Promise((resolve, reject) => {
        const filepath = './tests_results/activity_GA.log';
        const genRes = [];
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                console.error("[convert generations log] => Error reading file: ", err);
                reject(err);
                return;
            }

            const lines = data.split("\n");
            for (const line of lines) {
                if (line.startsWith("At ")) {
                    genRes.push(line.split(" ")[3]);
                }
            }
            resolve(genRes);
        });
    });
}


module.exports = { convertGen };
