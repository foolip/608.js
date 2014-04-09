// http://edocket.access.gpo.gov/cfr_2007/octqtr/pdf/47cfr15.119.pdf

'use strict'

function parse608(cues) {
    function hex(byte) {
        var s = byte.toString(16);
        return s.length < 2 ? '0' + s : s;
    }

    function parity(byte) {
        var bits = 0;
        while (byte) {
            bits += byte & 1;
            byte = byte >> 1;
        }
        return bits % 2;
    }

    function to7bit(byte) {
        return byte & 0x7F;
    }

    function toCharCode(byte) {
        switch (byte) {
        case 0x2A: // Lower-case a with acute accent
            return 0xE1;
        case 0x5C: // Lower-case e with acute accent
            return 0xE9;
        case 0x5E: // Lower-case i with acute accent
            return 0xED;
        case 0x5F: // Lower-case o with acute accent
            return 0xF3;
        case 0x60: // Lower-case u with acute accent
            return 0xFA;
        case 0x7B: // Lower-case c with cedilla
            return 0xE7;
        case 0x7C: // Division sign
            return 0xF7;
        case 0x7D: // Upper-case N with tilde
            return 0xD1;
        case 0x7E: // Lower-case n with tilde
            return 0xF1;
        case 0x7F: // Solid block
            return 0x2588;
        default: // the rest match ASCII
            return byte;
        }
    }

    function toCharCodeSpecial(byte) {
        switch (byte) {
        case 0x30: // Registered mark symbol
            return 0xAE;
        case 0x31: // Degree sign
            return 0xB0;
        case 0x32: // 1/2
            return 0xBD;
        case 0x33: // Inverse query
            return 0xBF;
        case 0x34: // Trademark symbol
            return 0x2122;
        case 0x35: // Cents sign
            return 0xA2;
        case 0x36: // Pounds Sterling sign
            return 0xA3;
        case 0x37: // Music note
            return 0x266A;
        case 0x38: // Lower-case a with grave accent
            return 0xE0;
        case 0x39: // Transparent space
            console.assert(false, 'transparent space not supported');
            return 0;
        case 0x3A: // Lower-case e with grave accent
            return 0xE8;
        case 0x3B: // Lower-case a with circumflex
            return 0xE2;
        case 0x3C: // Lower-case e with circumflex
            return 0xEA;
        case 0x3D: // Lower-case i with circumflex
            return 0xEE;
        case 0x3E: // Lower-case o with circumflex
            return 0xF4;
        case 0x3F: // Lower-case u with circumflex
            return 0xFB;
        }
    }

    function toCharCodeExtended(bytes) {
        switch (bytes) {
        case 0x1220: // Upper-case a with acute accent
            return 0xC1;
        case 0x1221: // Upper-case e with acute accent
            return 0xC9;
        case 0x1222: // Upper-case o with acute accent
            return 0xD3;
        case 0x1223: // Upper-case u with acute accent
            return 0xDA;
        case 0x1224: // Upper-case u with diaeresis
            return 0xDC;
        case 0x1225: // Lower-case u with diaeresis
            return 0xFC;
        case 0x1226: // Left single quote
            return 0x2018;
        case 0x1227: // Inverted exclamation
            return 0xA1;
        case 0x1228: // Asterisk
            return 0x2A;
        case 0x1229: // Right single quote
            return 0x2019;
        case 0x122A: // Em dash
            return 0x2014;
        case 0x122B: // Copyright symbol
            return 0xA9;
        case 0x122C: // Service mark symbol
            return 0x2120;
        case 0x122D: // Middle dot
            return 0xB7;
        case 0x122E: // Left double quote
            return 0x201C;
        case 0x122F: // Right double quote
            return 0x201D;
        case 0x1230: // Upper-case a with grave accent
            return 0xC0;
        case 0x1231: // Upper-case a with circumflex
            return 0xC2;
        case 0x1232: // Upper-case c with cedilla
            return 0xC7;
        case 0x1233: // Upper-case e with grave accent
            return 0xC8;
        case 0x1234: // Upper-case e with circumflex
            return 0xCA;
        case 0x1235: // Upper-case e with diaeresis
            return 0xCB;
        case 0x1236: // Lower-case e with diaeresis
            return 0xEB;
        case 0x1237: // Upper-case i with circumflex
            return 0xCE;
        case 0x1238: // Upper-case i with diaeresis
            return 0xCF;
        case 0x1239: // Lower-case i with diaeresis
            return 0xEF;
        case 0x123A: // Upper-case o with circumflex
            return 0xD4;
        case 0x123B: // Upper-case u with grave accent
            return 0xD9;
        case 0x123C: // Lower-case u with grave accent
            return 0xF9;
        case 0x123D: // Upper-case u with circumflex
            return 0xDB;
        case 0x123E: // Left double angle quote
            return 0xAB;
        case 0x123F: // Right double angle quote
            return 0xBB;
        case 0x1320: // Upper-case a with tilde
            return 0xC3;
        case 0x1321: // Lower-case a with tilde
            return 0xE3;
        case 0x1322: // Upper-case i with acute accent
            return 0xCD;
        case 0x1323: // Upper-case i with grave accent
            return 0xCC;
        case 0x1324: // Lower-case i with grave accent
            return 0xEC;
        case 0x1325: // Upper-case o with grace accent
            return 0xD2;
        case 0x1326: // Lower-case o with grace accent
            return 0xF2;
        case 0x1327: // Upper-case o with tilde
            return 0xD5;
        case 0x1328: // Lower-case o with tilde
            return 0xF5;
        case 0x1329: // Left curly brace
            return 0x7B;
        case 0x132A: // Right curly brace
            return 0x7D;
        case 0x132B: // Backslash
            return 0x5C;
        case 0x132C: // Circumflex
            return 0x5E;
        case 0x132D: // Underscore
            return 0x1F;
        case 0x132E: // Vertical line
            return 0x7C;
        case 0x132F: // Tidle
            return 0x7E;
        case 0x1330: // Upper-case a with diaeresis
            return 0xC4;
        case 0x1331: // Lower-case a with diaeresis
            return 0xE4;
        case 0x1332: // Upper-case o with diaeresis
            return 0xD6;
        case 0x1333: // Lower-case o with diaeresis
            return 0xF6;
        case 0x1334: // Sharp s
            return 0xDF;
        case 0x1335: // Yen sign
            return 0xA5;
        case 0x1336: // Currency sign
            return 0xA4;
        case 0x1337: // Broken bar
            0xA6;
        case 0x1338: // Upper-case a with ring
            return 0xC5;
        case 0x1339: // Lower-case a with ring
            return 0xE5;
        case 0x133A: // Upper-case o with stroke
            return 0xD8;
        case 0x133B: // Lower-case o with stroke
            return 0xF8;
        case 0x133C: // Box drawings light down and right
            return 0x250C;
        case 0x133D: // Box drawings light down and left
            return 0x2510;
        case 0x133E: // Box drawings light up and right
            return 0x2514;
        case 0x133F: // Box drawings light up and left
            return 0x2518;
        }
    }

    function createChannel() {
        var ROWS = 15;
        var COLUMNS = 32;

        var mode; // pop-on, paint-on, roll-up
        var displayedMemory = new Uint16Array(ROWS * COLUMNS);
        var nonDisplayedMemory = new Uint16Array(ROWS * COLUMNS);
        var row = 1;
        var column = 1;

        function index(row, column) {
            console.assert(row >= 1 && row <= ROWS && column >= 1 && column <= COLUMNS);
            return (COLUMNS * (row - 1)) + (column - 1);
        }

        function set(row, column, charCode) {
            var memory = mode == 'pop-on' ? nonDisplayedMemory : displayedMemory;
            memory[index(row, column)] = charCode;
        }

        function get(row, column) {
            return displayedMemory[index(row, column)];
        }

        function handleCharCode(charCode) {
            set(row, column, charCode);
            if (column < COLUMNS)
                column++;
        }

        function handleCharacter(byte) {
            console.assert(byte >= 0x20);
            handleCharCode(toCharCode(byte));
        }

        function handleSpecialCharacter(byte) {
            console.assert(byte >= 0x30 && byte <= 0x3F);
            handleCharCode(toCharCodeSpecial(byte));
        }

        function handleExtendedCharacter(first, second) {
            console.assert(first >= 0x12 && first <= 0x13 && second >= 0x20 && second <= 0x3F);
            handleCharCode(toCharCodeExtended((first << 8) + second));
        }

        function handlePreambleAddressCode(first, second) {
            console.assert(first >= 0x10 && first <= 0x17 && second >= 0x40 && second <= 0x7F);
            if (first == 0x11) {
                row = second <= 0x5F ? 1 : 2;
            } else if (first == 0x12) {
                row = second <= 0x5F ? 3 : 4;
            } else if (first == 0x15) {
                row = second <= 0x5F ? 5 : 6;
            } else if (first == 0x16) {
                row = second <= 0x5F ? 7 : 8;
            } else if (first == 0x17) {
                row = second <= 0x5F ? 9 : 10;
            } else if (first == 0x10 && second >= 0x60) {
                row = 11;
            } else if (first == 0x13) {
                row = second <= 0x5F ? 12 : 13;
            } else if (first == 0x14) {
                row = second <= 0x5F ? 14 : 15;
            } else {
                console.warn('invalid preamble address code ' + hex(first) + hex(second));
                return;
            }
            if ((second >= 0x40 && second <= 0x4F) || (second >= 0x60 && second <= 0x6F)) {
                console.warn('ignoring color/underline/italics');
            } else if ((second >= 0x50 && second <= 0x5F) || (second >= 0x70 && second <= 0x7F)) {
                var indent = second
                if (indent <= 0x5F) {
                    indent -= 0x50;
                } else {
                    indent -= 0x70;
                }
                indent = (indent >> 1) << 2;
                column = 1 + indent;
            }
        }

        function handleMidRowCode(first, second) {
            console.assert(first == 0x11 && second >= 0x20 && second <= 0x2F);
            console.warn('ignoring mid-row code');
            handleCharCode(0x20);
        }

        function resumeCaptionLoading() {
            mode = 'pop-on';
        }

        function backspace() {
            console.assert(false, 'backspace not supported');
        }

        function deleteToEndOfRow() {
            console.assert(false, 'delete to end of row not supported');
        }

        function rollUpCaptions(rows) {
            console.assert(false, 'roll-up captions not supported');
            if (mode != 'roll-up') {
                mode = 'roll-up';
                row = 15;
                column = 1;
            }
        }

        function flashOn() {
            console.warn('ignoring flash on');
            handleCharCode(0x20);
        }

        function resumeDirectCaptioning() {
            console.assert(false, 'direct captioning not supported');
        }

        function textRestart() {
            console.assert(false, 'text restart not supported');
        }

        function resumeTextDisplay() {
            console.assert(false, 'resume text display not supported');
        }

        function erase(memory) {
            for (var index = 0; index < memory.length; index++) {
                memory[index] = 0;
            }
        }

        function carriageReturn() {
            if (mode == 'roll-up') {
                console.assert(false, 'carriage return not supported');
            }
        }

        function endOfCaption() {
            mode = 'pop-on';
            // flip memories
            var tmp = displayedMemory;
            displayedMemory = nonDisplayedMemory;
            nonDisplayedMemory = tmp;
        }

        function tabOffset(columns) {
            console.assert(columns >= 1 && columns <= 3);
            columns = Math.min(column + columns, COLUMNS);
        }

        function resumeDirectCaptioning() {
            mode = 'paint-on';
        }

        function handleControlCode(pair, first, second) {
            if (first == 0x11 && second >= 0x30 && second <= 0x3F) {
                handleSpecialCharacter(second);
            } else if (first >= 0x12 && first <= 0x13 && second >= 0x20 && second <= 0x3F) {
                handleExtendedCharacter(first, second);
            } else if (second >= 0x40 && second <= 0x7F) {
                handlePreambleAddressCode(first, second);
            } else if (first == 0x11 && second >= 0x20 && second <= 0x2F) {
                handleMidRowCode(first, second);
            } else if (first == 0x14 && second == 0x20) {
                resumeCaptionLoading();
            } else if (first == 0x14 && second == 0x21) {
                backspace();
            } else if (first == 0x14 && second == 0x24) {
                deleteToEndOfRow();
            } else if (first == 0x14 && second >= 0x25 && second <= 0x27) {
                rollUpCaptions(second - 0x23);
            } else if (first == 0x14 && second == 0x28) {
                flashOn();
            } else if (first == 0x14 && second == 0x29) {
                resumeDirectCaptioning();
            } else if (first == 0x14 && second == 0x2A) {
                textRestart();
            } else if (first == 0x14 && second == 0x2B) {
                resumeTextDisplay();
            } else if (first == 0x14 && second == 0x2C) {
                erase(displayedMemory);
            } else if (first == 0x14 && second == 0x2D) {
                carriageReturn();
            } else if (first == 0x14 && second == 0x2E) {
                erase(nonDisplayedMemory);
            } else if (first == 0x14 && second == 0x2F) {
                endOfCaption();
            } else if (first == 0x17 && second >= 0x21 && second <= 0x23) {
                tabOffset(second - 0x20);
            } else {
                console.warn('unsupported control code ' + pair + ' (' + hex(first) + hex(second) + ')');
            }
        }

        function toString() {
            var charCodes = [];
            var row, column, charCode;
            for (row = 1; row <= ROWS; row++) {
                for (column = 1; column <= COLUMNS; column++) {
                    charCode = get(row, column);
                    charCodes.push(charCode ? charCode : 0x20);
                }
                charCodes.push(0x0A);
            }
            return String.fromCharCode.apply(String, charCodes);
        }

        return {
            handleCharacter: handleCharacter,
            handleControlCode: handleControlCode,
            toString: toString
        };
    }

    var c1 = createChannel();
    var c2 = createChannel();
    var cc; // current channel

    cues.forEach(function(cue) {
        var index, pair, first, second;
        for (index = 0; index + 1 < cue.data.length; index += 2) {
            first = cue.data[index];
            second = cue.data[index + 1];
            pair = hex(first) + hex(second);
            if (parity(first) != 1 || parity(second) != 1) {
                console.warn('failed parity check for ' + pair);
                continue;
            }
            first = to7bit(first);
            second = to7bit(second);
            if (first >= 0x10 && first <= 0x1F && second >= 20 && second <= 0x7F) {
                // control codes
                if (index >= 2 && cue.data[index] == cue.data[index - 2] && cue.data[index + 1] == cue.data[index - 1]) {
                    // ignore redundant control code
                    continue;
                }
                if (first < 0x18) {
                    cc = c1;
                } else {
                    // channel 2 control codes are offset by 8
                    cc = c2;
                    first -= 8;
                }
                cc.handleControlCode(pair, first, second);
            } else {
                if (cc) {
                    if (first >= 0x20) {
                        cc.handleCharacter(first);
                    } else if (first != 0x00) {
                        console.info('ignoring non-printing character ' + hex(first));
                    }
                    if (second >= 0x20) {
                        cc.handleCharacter(second);
                    } else if (second != 0x00) {
                        console.info('ignoring non-printing character ' + hex(second));
                    }
                } else {
                    console.warn('no current channel, ignoring ' + pair);
                }
            }
        }
        if (cc) {
            var pre = document.createElement('pre');
            pre.style.width = '32em';
            pre.style.border = '1px dotted green';
            pre.textContent = cc.toString();
            document.body.appendChild(pre);
        }
    });
}
