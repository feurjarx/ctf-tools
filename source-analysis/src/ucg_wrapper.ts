/**
 * Created by Roman on 22.09.2016.
 */

///<reference path="interfaces.d.ts"/>

import * as fs from 'fs';

const rules: Array<Rule> = [{
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

export const wrap = (filename: string, separator?: string) => {

    separator = separator || ')|(';

    let data = fs.readFileSync(filename, 'utf8');

    rules.forEach(function (rule: Rule) {
        if (!rule.off) {
            data = data.replace(rule.from, rule.to);
        }
    });

    if (/^win/.test(process.platform)) {

        data = data.replace(/[\r][\n]/g, separator);

    } else {

        data = data.replace(/[\n]/g, separator);
    }

    let
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

    return data.replace(regexp, '');
};