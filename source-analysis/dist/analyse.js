"use strict";
var ucg_wrapper_1 = require('./ucg_wrapper');
var fs = require('fs');
var child_process_1 = require('child_process');
var Promise = require('promise');
var config = require('./../config/analyse.json');
var PCRE, ucg;
var promises = [];
config.signatures.forEach(function (signature) {
    PCRE = ucg_wrapper_1.wrap('./../signatures/' + signature);
    if (/^win/.test(process.platform)) {
        ucg = child_process_1.spawn('cmd.exe', ['/c', 'echo', PCRE, config.target]);
    }
    else {
        ucg = child_process_1.spawn('ucg', [PCRE, config.target]);
    }
    promises.push(new Promise(function (resolve) {
        ucg.stdout.on('data', function (data) {
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
Promise.all(promises).then(function (results) {
    var content = '';
    var parts = results.map(function (it) { return it.data; });
    var signatures = results.map(function (it) { return it.signature; });
    signatures.forEach(function (signature, index) {
        content += '***' + signature + '***' + '\n' + parts[index] + '\n';
    });
    var outFilename = '../results/'
        + config.target.split(/([\\])|([\/])/g).slice(-1)
        + '_'
        + (new Date().getTime().toString()) + '.txt';
    fs.writeFile(outFilename, content, function (err) {
        if (err) {
            return console.log(err);
        }
    });
});
