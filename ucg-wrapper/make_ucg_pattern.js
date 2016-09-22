#!/usr/bin/env node
var fs = require('fs');

var filename = process.argv[2];
var separator = process.argv[3] || ')|(';

fs.readFile(filename, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    var rules = [
        {
            // off: true
            from: /[ ]/g,
            to: '[ ]*'
        },
        {
            // off: true,
            from: /[(]/g,
            to: '[(]+'
        },
        {
            // off: true,
            from: /[)]/g,
            to: '[)]+'
        },
        {
            // off: true,
            from: /[.]/g,
            to: '[.]+'
        },
        {
            // off: true,
            from: /[\"]/g,
            to: '[\\"]+'
        },
        {
            // off: true,
            from: /[\']/g,
            to: '[\\\']+'
        }
    ];

    rules.forEach(function (rule) {
        if (!rule.off) {
            data = data.replace(rule.from, rule.to);
        }
    });

    data = data.replace(/[\r][\n]/g, separator);

    var
        separatorRear = separator[separator.length - 1], 
        separatorFront = separator[0], 
        separatorMain = separator.slice(1, -1)
    ;

    data = separatorRear + data + separatorFront;

    var regexp = new RegExp(
        '[' + separatorMain + ']{1}'
        + '[' + separatorRear + ']{1}'
        + '[' + separatorFront + ']{1}',
        'g'
    );

    data = data.replace(regexp, '');

    console.log(data);

    fs.writeFile(filename + '_.txt', data, function (err) {
        if (err) {
            return console.log(err);
        }
    });
});
