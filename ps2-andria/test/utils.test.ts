/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import { Interval } from '../src/interval.js';
import { IntervalSet, IntervalConflictError } from '../src/intervalset.js';
import { MultiIntervalSet } from '../src/multiintervalset.js';
import * as utils from '../src/utils.js';

/*
 * Tests for utility functions in `utils.ts`.
 */


/**
 * Tests for checkOverlap
 */
describe('checkOverlap', function() {
    /*
     * Testing strategy
     * 
     * partition on intervalA and intervalB: 
     *      intervals identical
     *      intervalA completely before intervalB, 
     *      intervalA completely after intervalB, 
     *      intervalA partially before intervalB
     *      intervalA partially after intervalB
     * 
     */

    it('covers intervals identical', function() {
        const intervalA = new Interval(0n, 10n);
        const intervalB = new Interval(0n, 10n);
        assert.strictEqual(utils.checkOverlap(intervalA, intervalB), true);
    });
    it('covers intervalA completely before intervalB', function() {
        const intervalA = new Interval(0n, 10n);
        const intervalB = new Interval(20n, 30n);
        assert.strictEqual(utils.checkOverlap(intervalA, intervalB), false);
    });
    it('covers intervalA completely after intervalB', function() {
        const intervalA = new Interval(20n, 30n);
        const intervalB = new Interval(0n, 10n);
        assert.strictEqual(utils.checkOverlap(intervalA, intervalB), false);
    });
    it('covers intervalA partially before intervalB', function() {
        const intervalA = new Interval(0n, 15n);
        const intervalB = new Interval(10n, 20n);
        assert.strictEqual(utils.checkOverlap(intervalA, intervalB), true);
    });
    it('covers intervalA partially after intervalB', function() {
        const intervalA = new Interval(10n, 20n);
        const intervalB = new Interval(0n, 15n);
        assert.strictEqual(utils.checkOverlap(intervalA, intervalB), true);
    });

});
