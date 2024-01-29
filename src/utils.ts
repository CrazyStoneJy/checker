import { exec } from 'child_process';

async function execShell(shell: string) {
    return new Promise((resolve, reject) => {
        exec(shell, (err, stdout, stderr) => {
            if (err) {
                reject(stderr);
            }
            // console.log('shell execute success.');
            // console.log(`stdout: ${stdout}`);
            resolve(stdout);
        });
    });
}

export {
    execShell
}