#!/usr/bin/env node
var ucgWrapper = require('./ucg_wrapper').wrap;
var fs = require('fs');
var filename = process.argv[2];

var data = ucgWrapper(filename, process.argv[3]);
console.log(data);
fs.writeFile(filename + '_.txt', data, function (err) {
    if (err) {
        return console.log(err);
    }
});

