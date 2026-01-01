import assert from 'node:assert';

import { parser, IntegerGrammar } from '../src/parser.js';
import { visualizeAsUrl } from 'parserlib';

describe('grammar', function() {

    it('should handle multiplication now', function() {
        const input = "5*(2+3*4)";
        const parseTree = parser.parse(input);
        console.log("parse tree:\n" + parseTree);
        console.log(visualizeAsUrl(parseTree, IntegerGrammar));
    });
    
});
