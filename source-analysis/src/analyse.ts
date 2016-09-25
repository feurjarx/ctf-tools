/**
 * Created by Roman on 23.09.2016.
 */

///<reference path="interfaces.d.ts"/>

import {wrap} from './ucg_wrapper';
import * as fs from 'fs';
import { spawn } from 'child_process';
import * as Promise from 'promise';
import IThenable = Promise.IThenable;

const config: AnalyseJSON = require('./../analyse.json');
let PCRE, ucg;

let promises: Array<IThenable> = [];

let ucgOptions = config.ucg_options;

if (!ucgOptions && process.argv[2]) {
    ucgOptions = process.argv.slice(2, -1);
}

config.signatures.forEach((signature: string) => {

    PCRE = wrap('./../signatures/' + signature).replace(/\|\(\s*\)/g, '');

    if (/^win/.test(process.platform)) {

        if (ucgOptions) {

            ucg = spawn('cmd.exe', [].concat(['/c', 'ucg'], ucgOptions, [PCRE, config.target]));

        } else {

            ucg = spawn('cmd.exe', ['/c', 'ucg', PCRE, config.target]);
        }

    } else {

        if (ucgOptions) {

            ucg = spawn('ucg', [].concat(ucgOptions, [PCRE, config.target]));

        } else {

            ucg = spawn('ucg', [PCRE, config.target]);
        }
    }

    promises.push(new Promise((resolve: Function) => {
        ucg.stdout.on('data', (data) => {
            console.log(data.toString());

            resolve({
                data: data.toString(),
                signature: signature
            });
        });

        ucg.stderr.on('data', function (err) {
            console.log(err.toString());
            resolve({
                data: '',
                signature: signature
            });
        });
    }));
});

Promise.all(promises).then((results: Array<PromiseResolveAnalyseData>) => {

    let content = '';

    let parts = results.map((it: PromiseResolveAnalyseData) => it.data);
    let signatures = results.map((it: PromiseResolveAnalyseData) => it.signature);

    signatures.forEach((signature: string, index: number) => {
        content += '***' + signature + '***' + '\n' + parts[index] + '\n';
    });

    let outFilename = '../results/'
        + config.target.split(/([\\])|([\/])/g).slice(-1)
        + '_'
        + (config.options.one_result_file ? '' : (new Date().getTime().toString()))
        + '.txt'
    ;

    fs.writeFile(outFilename, content, function (err) {
        if (err) {
            return console.log(err);
        }
    });
});