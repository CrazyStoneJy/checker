#!/usr/bin/env node

import { Command } from 'commander';
import { check } from './check';
import { execShell } from './utils';

const program = new Command();

program.name('acp-cli')
    .description('CLI of check apk is proected whether or not.')
    .version(`${require('../package.json').version}`, '-v --version');

program.command('reverse')
    .description('reverse apk')
    .option('-o --output <output directory>')
    .argument('<apk file>', 'file of apk')
    .action((apkFile, options) => {
        if (!hasAPKSuffix(apkFile)) {
            return;
        }
        let command_string = `apktool d ${apkFile}`;
        if (options.output) {
            command_string += ` -o ${options.output}`;
        }
        console.log("execute commnad:", command_string);
        execShell(command_string);
    });

program.command('check')
.description('check apk is protected')
.argument('<apk file>', 'file of apk')
.action(async(apkFile, options) => {
    if (!hasAPKSuffix(apkFile)) {
        return;
    }
    console.log('analysis...');
    let command_string = `apktool d ${apkFile}`;
    if (options.output) {
        command_string += ` -o ${options.output}`;
    }
    await execShell(command_string);
    const apkName = getApkName(apkFile);
    const res = await check(apkName);
    console.log(`${apkFile} is ${res}`);
    const r = await execShell(`rm -rf ${apkName}`);
});


program.parse(process.argv);


function hasAPKSuffix(fileName: string): boolean {
    if (!fileName) {
        return false;
    }
    return fileName.endsWith('.apk');
}

function getApkName(fileName: string): string {
    if (hasAPKSuffix(fileName)) {
        return fileName.substring(0, fileName.length - 4);
    }
    return '';
}