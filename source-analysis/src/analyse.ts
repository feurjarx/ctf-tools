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

let promises: Array<IThenable> = [];

let ucgOptions = config.ucg_options;

if (!ucgOptions && process.argv[2]) {
    ucgOptions = process.argv.slice(2, -1);
}

let ucgMaker = (PCRE: string) => {

    let ucg: any;

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

    return ucg;
};

let ucgListeners = function(resolve: Function, signature: string) {
    this.stdout.on('data', (data) => {
        !config.options.non_displayed && console.log(data.toString());

        resolve({
            data: data.toString(),
            signature: signature
        });
    });

    this.stderr.on('data', (err: any) => {
        !config.options.non_displayed && console.log(err.toString());
        resolve({
            data: '',
            signature: signature
        });
    });

    this.on('exit', (code: number) => {
        code && resolve({
            data: '',
            signature: signature
        });
    });
};

if (config.custom_pcre) {

    let ucg = ucgMaker(config.custom_pcre);
    promises.push(new Promise((resolve: Function) => {
        ucgListeners.call(ucg, resolve, 'CUSTOM by ' + config.custom_pcre);
    }));
}

config.signatures = config.signatures || [];
config.signatures.forEach((signature: string) => {

    let ucg = ucgMaker(wrap('./../signatures/' + signature).replace(/\|\(\s*\)/g, ''));
    promises.push(new Promise((resolve: Function) => {
        ucgListeners.call(ucg, resolve, signature);
    }));
});

promises.length && Promise.all(promises).then((results: Array<PromiseResolveAnalyseData>) => {

    let content = '';

    let parts = results.map((it: PromiseResolveAnalyseData) => it.data);
    let signatures = results.map((it: PromiseResolveAnalyseData) => it.signature);

    signatures.forEach((signature: string, index: number) => {
        content += '***' + signature + '***' + '\n' + parts[index] + '\n';
    });

    let outFilename = '../results/'
        + config.target.split(/([\\])|([\/])/g).slice(-1)
        + (config.options.one_result_file ? '' : ('_' + new Date().getTime().toString()))
        + '.txt'
    ;

    fs.writeFile(outFilename, content, function (err) {
        if (err) {
            !config.options.non_displayed && console.log(err);
        }
    });
});