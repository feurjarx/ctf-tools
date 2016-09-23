"use strict";
var fs = require('fs');
var rules = [{
        from: /[ ]/g,
        to: '[ ]*'
    }, {
        from: /[(]/g,
        to: '[(]+'
    }, {
        from: /[)]/g,
        to: '[)]+'
    }, {
        from: /[.]/g,
        to: '[.]+'
    }, {
        from: /[\"]/g,
        to: '[\\"]+'
    }, {
        from: /[\']/g,
        to: '[\\\']+'
    }];
exports.wrap = function (filename, separator) {
    separator = separator || ')|(';
    var data = fs.readFileSync(filename, 'utf8');
    rules.forEach(function (rule) {
        if (!rule.off) {
            data = data.replace(rule.from, rule.to);
        }
    });
    if (/^win/.test(process.platform)) {
        data = data.replace(/[\r][\n]/g, separator);
    }
    else {
        data = data.replace(/[\n]/g, separator);
    }
    var separatorRear = separator[separator.length - 1], separatorFront = separator[0], separatorMain = separator.slice(1, -1);
    data = separatorRear + data + separatorFront;
    var regexp = new RegExp('[' + separatorMain + ']{1}'
        + '[' + separatorRear + ']{1}'
        + '[' + separatorFront + ']{1}', 'g');
    return data.replace(regexp, '');
};
