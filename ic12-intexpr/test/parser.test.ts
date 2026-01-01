import assert from 'node:assert';

import { parse } from '../src/parser.js';

describe('parser', function() {

    // Testing strategy:
    //
    // partition on largest number: single-digit, multi-digit 
    // partition on # of additions: 0, 1, >1
    // partition on # of multiplications: 0, 1, >1
    // partition: add is subexpression of multiply, or not
    // partition: mutiply as subexpression of add, or not
    // partition on parens: required, not required
    
    it('covers multidigit number, 0 adds, 0 multiplies', function() {
        assert.strictEqual(parse("32").value(), 32);
    });

    it('covers single digit, >1 adds, parens not required', function() {
        assert.strictEqual(parse("1+2+3").value(), 6);
    });

    it('covers >1 multiplies, multiply subexpr of add, add subexpr of multiply, parens required', function() {
        assert.strictEqual(parse("5*(2+3*4)").value(), 70);
    });
    
});
