// http://edocket.access.gpo.gov/cfr_2007/octqtr/pdf/47cfr15.119.pdf

'use strict'

function parse608(cues) {
    function valid(byte) {
        // byte is valid if it has odd parity
        var bits = 0;
        while (byte) {
            bits += byte & 1;
            byte = byte >> 1;
        }
        return bits % 2 == 1;
    }

    function to7bit(byte) {
        if (valid(byte)) {
            return byte & 0x7F;
        } else {
            return -1;
        }
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
            return null; // FIXME
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

    cues.forEach(function(cue) {
        var charCodes = [];

        var index, first, second;
        for (index = 0; index + 1 < cue.data.length; index += 2) {
            first = to7bit(cue.data[index]);
            second = to7bit(cue.data[index + 1]);
            if (first >= 0x10 && first <= 0x1F) {
                if (first == 0x11 && second >= 0x30 && second <= 0x3F) {
                    charCodes.push(toCharCodeSpecial(second));
                }
                // FIXME: control codes
            } else {
                if (first >= 0x20) {
                    charCodes.push(toCharCode(first));
                }
                if (second >= 0x20) {
                    charCodes.push(toCharCode(second));
                }
            }
        }

        cue.text = String.fromCharCode.apply(String, charCodes);
    });

    var pre = document.createElement('pre');
    pre.textContent = cues.map(function(cue) { return cue.text; }).join('\n');
    document.body.appendChild(pre);
}
