#!/usr/bin/env node

import { Command } from 'commander';
import { exec } from 'child_process';

const program = new Command();

program.name('hello-cr')
    .description('CLI of check apk is proected whether or not.')
    .version(`${require('../package.json').version}`, '-v --version');

// program.command('r')
//     .description('reverse apk')
//     .option('-o --output <output directory>')
//     .argument('<apk file>', 'file of apk')
//     .action((apkFile, options) => {
//         if (!hasAPKSuffix(apkFile)) {
//             return;
//         }
//         let command_string = `apktool d ${apkFile}`;
//         if (options.output) {
//             command_string += ` -o ${options.output}`;
//         }
//         console.log("execute commnad:", command_string);
//         execShell(command_string);
//     });

program.parse(process.argv);

function execShell(shell: string) {
    exec(shell, (err, stdout, stderr) => {
        if (err) {
            // @ts-ignore
            log(`stderr: ${stderr}`);
            throw new Error('occur error');
        }
        console.log('shell execute success.');
        console.log(`stdout: ${stdout}`);
    });
}

function hasAPKSuffix(fileName: string): boolean {
    if (!fileName) {
        return false;
    }
    return fileName.endsWith('.apk');
}
