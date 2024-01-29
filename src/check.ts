import { exec } from 'child_process';
import { readdirSync } from 'fs';
import protectedJson from './protected.json';

const abis = ['arm64-v8a', 'armeabi', 'armeabi-v7a'];

// {
//     "name": "bangbang",
//     "alias": "棒棒加固",
//     "libs": ["ibsecexe", "libsecshell"]
// },
type ProtectedDesc = {
    name: string,
    alias: string,
    libs: string[]
}

export async function check(apkName: string): Promise<string> {
    const dir = await cur_dir();
    const lib_path = `${dir}/${apkName}/lib/${abis[0]}`;
    const so_files = readdirSync(lib_path);
    const files = so_files.map((fileName: string) => {
        return fileName.substring(0, fileName.length - 3);
    })
    return has(files);
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
