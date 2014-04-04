// http://www.theneitherworld.com/mcpoodle/SCC_TOOLS/DOCS/SCC_FORMAT.HTML

'use strict'

function parseSCC(input) {
    var cues = [];
    var re = /^(\d\d):(\d\d):(\d\d)([:;])(\d\d)\t(.*)/gm;
    var match;
    while ((match = re.exec(input)) !== null) {
        var time = 3600 * match[1] + 60 * match[2] + 1 * match[3];
        time += match[5] / 30; // FIXME: dropframe vs. non-dropframe
        var bytes = [];
        match[6].split(/\s+/).forEach(function(pair) {
            if (/^[0-9a-f]{4}$/i.test(pair)) {
                bytes.push(parseInt(pair.substring(0, 2), 16));
                bytes.push(parseInt(pair.substring(2, 4), 16));
            }
        });
        cues.push({ time: time, data: new Uint8Array(bytes) });
    }
    return cues;
}
