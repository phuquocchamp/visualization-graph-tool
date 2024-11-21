const { exec } = require('child_process');
const fs = require('fs');
function runCMD(powershellCmd) {
    return new Promise((resolve, reject) => {
        exec(`powershell -Command "${powershellCmd}"`, (error, stdout, stderr) => {
            if (error) {
                reject(stderr.trim());
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

// Example usage:


const test_path = './tests/VI/vi_test.stp';
const generations_path = './tests_results/activity_GA.log';
const GA_command = './ago/SGA.exe';


async function runIGA(){
    await fs.writeFileSync("D:\\Coding\\NCKH\\graph-tool-v2\\tests_results\\activity_GA.log", "");
    await runCMD(GA_command)
        .then(output => console.log("[Ago log] => RunIGA successfully"))
        .catch(err => console.error("[Ago log] => RunIGA error: " + err));
}


module.exports = {runIGA};