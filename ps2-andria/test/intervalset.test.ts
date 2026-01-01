/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import { Interval } from '../src/interval.js';
import { IntervalSet, IntervalConflictError } from '../src/intervalset.js';
import { implementationsForTesting } from '../src/intervalset-impls.js';
import * as utils from '../src/utils.js';

// Do not use makeIntervalSet here, because it will only return one particular implementation.
const makeIntervalSet = undefined;
// Do not refer to specific concrete implementations.
const RepMapIntervalSet = undefined, RepArrayIntervalSet = undefined;

/*
 * PS2 instructions: tests you write in this file must be runnable against any implementations that
 * follow the spec! Your tests will be run against staff implementations of IntervalSet.
 * 
 * Do NOT strengthen the spec of any of the tested methods.
 * Your tests MUST call `new SomeIntervalSet` to obtain IntervalSet instances, NOT makeIntervalSet.
 * Your tests MUST NOT refer to specific concrete implementations.
 */

implementationsForTesting().forEach(SomeIntervalSet => describe(SomeIntervalSet.name, function() {

    /*
     * Testing strategy for IntervalSet
     * 
     * add(), labels(), interval():
     *  partition on the size of IntervalSet: 0, 1, >1
     *  partition on the type of label: string, not string
     * 
     * add(), interval():
     * partition on the label: label in this, label not in this
     * 
     * add():
     * partition on [start, end): [start, end) overlaps with existing interval, [start, end) does not overlap with existing interval
     * partition on start: start is large, start is small (where "small" fits in a Typescript number, and "large" doesn't)
     */

    it('covers size = 0, interval with label not in this', function() {
        const empty = new SomeIntervalSet<string>();
        assert.deepStrictEqual(empty.labels(), new Set());
        assert.deepStrictEqual(empty.interval('A'), undefined);
    });

    it('covers add with size = 0; interval for label in this; size = 1; add for label not in this', function() {
        const empty = new SomeIntervalSet<string>();
        empty.add(-10n, 10n, 'A');
        assert.deepStrictEqual(empty.labels(), new Set(['A']));
        utils.assertEqualIntervals(empty.interval('A') as Interval, new Interval(-10n, 10n));
    });

    it('covers size > 1; add for large start', function() {
        const empty = new SomeIntervalSet<string>();
        empty.add(0n, 10000000000n, 'A');
        empty.add(10000000000n, 10000000001n, 'B');
        assert.deepStrictEqual(empty.labels(), new Set(['A', 'B']));
        utils.assertEqualIntervals(empty.interval('A') as Interval, new Interval(0n, 10000000000n));
    });
    
    it('covers add with size > 1; add for overlapping intervals; add for label in this', function() {
        const empty = new SomeIntervalSet<string>();
        empty.add(50n, 60n, 'A');
        empty.add(30n, 50n, 'B');
        assert.throws(() => empty.add(30n, 51n, 'B'), IntervalConflictError);
        assert.throws(() => empty.add(25n, 31n, 'C'), IntervalConflictError);
        empty.add(30n, 50n, 'B');
        empty.add(-100n, -10n, 'C');
        assert.deepStrictEqual(empty.labels(), new Set(['A', 'B', 'C']));
        utils.assertEqualIntervals(empty.interval('C') as Interval, new Interval(-100n, -10n));
    });

    it('covers non-string labels', function() {
        const empty = new SomeIntervalSet();
        const labelA = { id: 1, toString: () => "same" };
        const labelC = { id: 1, toString: () => "same" };
        const labelB = { id: 2, toString: () => "same" };
        
        empty.add(-20n, -10n, labelA);
        assert.throws(() => empty.add(-20n, -10n, labelB), IntervalConflictError);
        assert.throws(() => empty.add(-20n, -10n, labelC), IntervalConflictError);
        empty.add(0n, 10n, labelB);
        empty.add(-10n, 0n, labelC);
        assert.deepStrictEqual(empty.labels(), new Set([labelA, labelB, labelC]));
        utils.assertEqualIntervals(empty.interval(labelB) as Interval, new Interval(0n, 10n));
        utils.assertEqualIntervals(empty.interval(labelC) as Interval, new Interval(-10n, 0n));
    });

}));
