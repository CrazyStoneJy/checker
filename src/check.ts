import { exec } from 'child_process';
import { readdirSync } from 'fs';
import protectedJson from './protected.json';

const abis = ['arm64-v8a', 'armeabi', 'armeabi-v7a'];

type ProtectedDesc = {
    name: string,
    alias: string,
    libs: string[]
}

export async function check(apkName: string): Promise<string> {
    const so_files = await scan_so_file(apkName);
    const files = so_files.map((fileName: string) => {
        return fileName.substring(0, fileName.length - 3);
    })
    return has(files);
}

async function scan_so_file(apkName: string): Promise<string[]> {
    let files = [];
    const dir = await cur_dir();
    // visist libs
    const lib_path = `${dir}/${apkName}/lib/${abis[0]}`;
    const so_libs = readdirSync(lib_path);
    // visit assets
    const assets_path = `${dir}/${apkName}/assets`;
    const assets_files = readdirSync(assets_path);
    const assets_so_libs = assets_files.filter((file: string) => {
        return file.endsWith('.so');
    })
    files = [...so_libs, ...assets_so_libs];
    return files;
}

function has(files: string[]): string {
    let protectedName = '未加固';
    files.forEach((file: string) => {
        // @ts-ignore
        protectedJson.forEach((protectedDesc: ProtectedDesc) => {
            const { libs, alias } = protectedDesc;
            if (libs.includes(file)) {
                protectedName = alias;
                return;
            }
        })
    });
    return protectedName;
}

async function cur_dir(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec("echo ${PWD}", (err, stdout, stderr) => {
            if (err) {
                // @ts-ignore
                log(`stderr: ${stderr}`);
                reject(err);
                return;
            }
            resolve(stdout.trim());
        });
    });
}
