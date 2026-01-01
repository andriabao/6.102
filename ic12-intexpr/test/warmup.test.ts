import assert from 'node:assert';

import { parse } from '../src/parser.js';

describe('warmup', function() {

    it('original expression', function() {
        const input = "54+(2+ 89)";
        const expression = parse(input);
        console.log("AST: " + expression);
        assert.strictEqual(expression.value(), 145);
    });

    it('same AST but different parse tree', function() {
        // replace TODO with a string that produces
        // the same AST as "54+(2+ 89)"
        // but a different parse tree
        const input = "(54+(2+89))";
        const expression = parse(input);
        console.log("AST: " + expression);
        assert.strictEqual(expression.value(), 145);
    });

    it('same AST leaves and expression value, but different parse tree and different AST', function() {
        // replace TODO with a string that produces
        // the same AST leaf nodes (54, 2, 89) and the same final value,
        // but different parse tree and different AST
        const input = "(54+2)+89";
        const expression = parse(input);
        console.log("AST: " + expression);
        assert.strictEqual(expression.value(), 145);
    });

    it('same AST leaves and value, but parse tree with fewest possible primary nodes', function() {
        // replace TODO with a string that produces
        // the same AST leaf nodes (54, 2, 89) and the same final value,
        // but the fewest possible "primary" nodes
        const input = "54+2+89";
        const expression = parse(input);
        console.log("AST: " + expression);
        assert.strictEqual(expression.value(), 145);
    });

});
