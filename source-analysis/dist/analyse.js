"use strict";
var ucg_wrapper_1 = require('./ucg_wrapper');
var fs = require('fs');
var child_process_1 = require('child_process');
var Promise = require('promise');
var config = require('./../analyse.json');
var promises = [];
var ucgOptions = config.ucg_options;
if (!ucgOptions && process.argv[2]) {
    ucgOptions = process.argv.slice(2, -1);
}
var ucgMaker = function (PCRE) {
    var ucg;
    if (/^win/.test(process.platform)) {
        if (ucgOptions) {
            ucg = child_process_1.spawn('cmd.exe', [].concat(['/c', 'ucg'], ucgOptions, [PCRE, config.target]));
        }
        else {
            ucg = child_process_1.spawn('cmd.exe', ['/c', 'ucg', PCRE, config.target]);
        }
    }
    else {
        if (ucgOptions) {
            ucg = child_process_1.spawn('ucg', [].concat(ucgOptions, [PCRE, config.target]));
        }
        else {
            ucg = child_process_1.spawn('ucg', [PCRE, config.target]);
        }
    }
    return ucg;
};
if (config.custom_pcre) {
    var ucg_1 = ucgMaker(config.custom_pcre);
    promises.push(new Promise(function (resolve) {
console.log(ucg_1)
	
        ucg_1.stdout.on('data', function (data) {
            !config.options.non_displayed && console.log(data.toString());
            resolve({
                data: data.toString(),
                signature: 'CUSTOM by ' + config.custom_pcre
            });
        });

        ucg_1.stderr.on('data', function (err) {

            !config.options.non_displayed && console.log(err.toString());
            resolve({
                data: '',
                signature: 'CUSTOM by ' + config.custom_pcre
            });
        });
    }));
}
/*
config.signatures.forEach(function (signature) {
    var ucg = ucgMaker(ucg_wrapper_1.wrap('./../signatures/' + signature).replace(/\|\(\s*\)/g, ''));
    promises.push(new Promise(function (resolve) {
        ucg.stdout.on('data', function (data) {
            !config.options.non_displayed && console.log(data.toString());
            resolve({
                data: data.toString(),
                signature: signature
            });
        });
        ucg.stderr.on('data', function (err) {
            !config.options.non_displayed && console.log(err.toString());
            resolve({
                data: '',
                signature: signature
            });
        });
    }));
});*/
Promise.all(promises).then(function (results) {
    var content = '';
    var parts = results.map(function (it) { return it.data; });
    var signatures = results.map(function (it) { return it.signature; });
    signatures.forEach(function (signature, index) {
        content += '***' + signature + '***' + '\n' + parts[index] + '\n';
    });
    var outFilename = '../results/'
        + config.target.split(/([\\])|([\/])/g).slice(-1)
        + (config.options.one_result_file ? '' : ('_' + new Date().getTime().toString()))
        + '.txt';
    fs.writeFile(outFilename, content, function (err) {
        if (err) {
            !config.options.non_displayed && console.log(err);
        }
    });
});
