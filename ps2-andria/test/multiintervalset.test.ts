/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import { Interval } from '../src/interval.js';
import { IntervalSet, IntervalConflictError, makeIntervalSet } from '../src/intervalset.js';
import { MultiIntervalSet } from '../src/multiintervalset.js';
import * as utils from '../src/utils.js';

/*
 * PS2 instructions: tests you write in this file must be runnable against any implementations that
 * follow the spec! Your tests will be run against staff implementations of MultiIntervalSet.
 * 
 * Do NOT strengthen the spec of any of the tested methods.
 */

describe('MultiIntervalSet', function() {

    /*
     * Testing strategy for IntervalSet
     * 
     * constructor:
     * partition on the size of initial IntervalSet: 0, 1, >1
     * 
     * add(), labels(), intervals(), clear():
     *  partition on the size of MultiIntervalSet: 0, 1, >1
     * 
     * add(), labels(), intervals():
     *  partition on this: produced by constructor, produced by add, produced by clear
     *  partition on the type of label: string, not string
     * 
     * add(), intervals():
     * partition on the label: label not in this, label in this with exactly one interval, label in this with more than one interval
     * partitions on order in which intervals are added: increasing order, non-increasing order
     * 
     * add():
     * partition on [start, end): [start, end) overlaps with existing interval, [start, end) does not overlap with existing interval
     * partition on start: start is large, start is small (where "small" fits in a Typescript number, and "large" doesn't)
     */

    it('covers size = 0; intervals with label not in this', function() {
        const empty = new MultiIntervalSet<string>();
        assert.deepStrictEqual(empty.labels(), new Set());
        assert.deepStrictEqual(empty.intervals('A').labels(), new Set());
        assert.strictEqual(empty.clear(), false);
        assert.strictEqual(empty.clear(), false);
    });

    it('covers clear on size 1; operations after clear; large start', function() {
        const empty = new MultiIntervalSet<string>();
        empty.add(-10n, 10n, 'A');

        //clear operation
        assert.strictEqual(empty.clear(), true);
        assert.deepStrictEqual(empty.intervals('A').labels(), new Set());

        empty.add(-51n, 62n, 'A');
        empty.add(10000000000n, 20000000000n, 'B');

        //compute expected
        const expectedA = makeIntervalSet<number>();
        expectedA.add(-51n, 62n, 0);
        const expectedB = makeIntervalSet<number>();
        expectedB.add(10000000000n, 20000000000n, 0);

        //compare operations with expected output
        assert.deepStrictEqual(empty.labels(), new Set(['A', 'B']));

        utils.assertEqualIntervalSet(empty.intervals('A'), expectedA);
        utils.assertEqualIntervalSet(empty.intervals('B'), expectedB);
    });

    it('covers size of initial IntervalSet = 1; intervals with label associated with more than one interval; size = 1', function() {
        const singleInterval = makeIntervalSet<string>();
        singleInterval.add(-10n, 10n, 'A');
        const multiSet = new MultiIntervalSet<string>(singleInterval);

        const expectedInterval = makeIntervalSet<number>();
        expectedInterval.add(-10n, 10n, 0);

        assert.deepStrictEqual(multiSet.labels(), new Set(['A']));
        utils.assertEqualIntervalSet(multiSet.intervals('A'), expectedInterval);
        assert.deepStrictEqual(multiSet.intervals('C').labels(), new Set());
    });
    
    it('covers size of initial IntervalSet > 1; add for overlapping intervals; add for label in this', function() {
        const multipleIntervals = makeIntervalSet<string>();
        multipleIntervals.add(-10n, 10n, 'A');
        multipleIntervals.add(10n, 30n, 'B');
        const multiSet = new MultiIntervalSet<string>(multipleIntervals);
        multiSet.add(-10n, 10n, 'A'); //should do nothing

        //compute expected
        const expectedInterval = makeIntervalSet<number>();
        expectedInterval.add(-10n, 10n, 0);

        //compare operations with expected output
        assert.throws(() => multiSet.add(-10n, 10n, 'B'), IntervalConflictError);
        assert.throws(() => multiSet.add(29n, 1000n, 'C'), IntervalConflictError);
        assert.deepStrictEqual(multiSet.labels(), new Set(['A', 'B']));
        utils.assertEqualIntervalSet(multiSet.intervals('A'), expectedInterval);
    });

    it('covers size of initial IntervalSet > 1; ' +
        'intervals added in non-increasing order; ' +
        'intervals with label associated with more than one interval;' +
        'clear on size >1', function() {
        const multipleIntervals = makeIntervalSet<string>();
        multipleIntervals.add(-10n, 10n, 'A');
        multipleIntervals.add(10n, 30n, 'B');
        const multiSet = new MultiIntervalSet<string>(multipleIntervals);
        multiSet.add(30n, 50n, 'C');
        multiSet.add(50n, 70n, 'C');
        multiSet.add(10000000000n, 20000000000n, 'A');
        multiSet.add(-10000000000n, -10n, 'A');
        
        //compute expected
        const expectedA = makeIntervalSet<number>();
        expectedA.add(-10000000000n, -10n, 0);
        expectedA.add(-10n, 10n, 1);
        expectedA.add(10000000000n, 20000000000n, 2);

        const expectedB = makeIntervalSet<number>();
        expectedB.add(10n, 30n, 0);

        const expectedC = makeIntervalSet<number>();
        expectedC.add(30n, 50n, 0);
        expectedC.add(50n, 70n, 1);
        
        //compare operations with expected output
        assert.deepStrictEqual(multiSet.labels(), new Set(['A', 'B', 'C']));
        utils.assertEqualIntervalSet(multiSet.intervals('A'), expectedA);
        utils.assertEqualIntervalSet(multiSet.intervals('B'), expectedB);
        utils.assertEqualIntervalSet(multiSet.intervals('C'), expectedC);
        assert.strictEqual(multiSet.clear(), true);
        assert.deepStrictEqual(multiSet.labels(), new Set());
    });

    it('covers non-string labels', function() {
        const empty = makeIntervalSet();
        const multiInterval = new MultiIntervalSet(empty);
        const labelA = { id: 1, toString: () => "same" };
        const labelC = { id: 1, toString: () => "same" };
        const labelB = { id: 2, toString: () => "same" };
        
        multiInterval.add(-20n, -10n, labelA);
        assert.throws(() => multiInterval.add(-20n, -10n, labelB), IntervalConflictError);
        assert.throws(() => multiInterval.add(-20n, -10n, labelC), IntervalConflictError);
        multiInterval.add(0n, 10n, labelB);
        multiInterval.add(-10n, 0n, labelC);
        multiInterval.add(-100n, -20n, labelC);

        //compute expected
        const expectedA = makeIntervalSet<number>();
        expectedA.add(-20n, -10n, 0);

        const expectedB = makeIntervalSet<number>();
        expectedB.add(0n, 10n, 0);

        const expectedC = makeIntervalSet<number>();
        expectedC.add(-100n, -20n, 0);
        expectedC.add(-10n, 0n, 1);

        //compare operations with expected output
        assert.deepStrictEqual(multiInterval.labels(), new Set([labelA, labelB, labelC]));
        utils.assertEqualIntervalSet(multiInterval.intervals(labelA), expectedA);
        utils.assertEqualIntervalSet(multiInterval.intervals(labelB), expectedB);
        utils.assertEqualIntervalSet(multiInterval.intervals(labelC), expectedC);
        assert.strictEqual(multiInterval.clear(), true);
        assert.deepStrictEqual(multiInterval.labels(), new Set());
    });

});
