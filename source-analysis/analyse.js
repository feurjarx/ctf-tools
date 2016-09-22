#!/usr/bin/env node
/**
 * Created by Roman on 22.09.2016.
 */
var 
    ucgWrapper = require('../ucg-wrapper/ucg_wrapper').wrap,
    config = require('./analyse.json'),
    fs = require('fs'),
    spawn = require('child_process').spawn
;

var PCRE, ucg;

config.signatures.forEach(function (signature) {

    PCRE = ucgWrapper('./signatures/' + signature);

    console.log(PCRE);

    if (/^win/.test(process.platform)) {

        ucg = spawn('cmd.exe', ['/c', 'ucg', PCRE, config.target]);

    } else {

        ucg = spawn('ucg', [PCRE, config.target]);
    }

    ucg.stdout.on('data', function(data) {

        console.log(data.toString());

        fs.writeFile(signature + '_.txt', data, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });

    ucg.stderr.on('data', function(data) {
        console.log(data.toString());
    });
});

