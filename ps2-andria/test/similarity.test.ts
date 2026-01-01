/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import { Interval } from '../src/interval.js';
import { IntervalSet, IntervalConflictError, makeIntervalSet } from '../src/intervalset.js';
import { MultiIntervalSet } from '../src/multiintervalset.js';
import { similarity, UnitIntervalSet } from '../src/similarity.js';
import * as utils from '../src/utils.js';

/*
 * Tests for the similarity module.
 */

describe('similarity', function() {

    /*
     * Testing strategy for similarity(..)
     * 
     * partition on all of similarity, setA, and set B: empty, nonempty
     * partition on similarity: no intervals have defined similarity, some intervals have defined similarity, all intervals have defined similarity
     * partition on intervals in setA and setB: intervals are identical, intervals partially overlap, intervals do not overlap
     * partition on labels for the same interval in setA and setB: labels are the same, labels are different
     * 
     */

    it('covers all sets empty', function() {
        const result = similarity([], new MultiIntervalSet<string>(), new MultiIntervalSet<string>());
        utils.assertApproxEqual(0, result);
    });
    it('covers one set empty', function() {
        const intervalSetB = makeIntervalSet<string>();
        intervalSetB.add(0n, 1n, 'happy');
        const setB = new MultiIntervalSet<string>(intervalSetB);
        const result = similarity([], new MultiIntervalSet<string>(), setB);
        utils.assertApproxEqual(0, result);
    });
    it('covers identical intervals; identical labels', function() {
        const intervalSetA = makeIntervalSet<string>();
        intervalSetA.add(-1n, 10n, 'happy');
        const setA = new MultiIntervalSet<string>(intervalSetA);
        const intervalSetB = makeIntervalSet<string>();
        intervalSetB.add(-1n, 10n, 'happy');
        const setB = new MultiIntervalSet<string>(intervalSetB);
        const result = similarity([], setA, setB);
        utils.assertApproxEqual(1, result);
    });
    it('covers non-overlapping intervals', function() {
        const intervalSetA = makeIntervalSet<string>();
        intervalSetA.add(-1n, 1n, 'happy');
        const setA = new MultiIntervalSet<string>(intervalSetA);
        const intervalSetB = makeIntervalSet<string>();
        intervalSetB.add(1n, 2n, 'sad');
        const setB = new MultiIntervalSet<string>(intervalSetB);
        const result = similarity([], setA, setB);
        utils.assertApproxEqual(0, result);
    });
    it('covers partially overlapping intervals; identical labels', function() {
        const intervalSetA = makeIntervalSet<string>();
        intervalSetA.add(-1n, 1n, 'happy');
        const setA = new MultiIntervalSet<string>(intervalSetA);
        const intervalSetB = makeIntervalSet<string>();
        intervalSetB.add(0n, 2n, 'happy');
        const setB = new MultiIntervalSet<string>(intervalSetB);
        const result = similarity([], setA, setB);
        utils.assertApproxEqual(1/3, result);
    });
    it('covers overlapping intervals; no similarity defined', function() {  
        const intervalSetA = makeIntervalSet<string>();
        intervalSetA.add(-1n, 1n, 'happy');
        const setA = new MultiIntervalSet<string>(intervalSetA);
        const intervalSetB = makeIntervalSet<string>();
        intervalSetB.add(0n, 2n, 'sad');
        const setB = new MultiIntervalSet<string>(intervalSetB);
        const result = similarity([], setA, setB);
        utils.assertApproxEqual(0, result);
    });
    it('covers overlapping intervals; some similarity defined', function() {
        const intervalSetA = makeIntervalSet<string>();
        intervalSetA.add(4n, 8n, 'happy');
        const setA = new MultiIntervalSet<string>(intervalSetA);
        setA.add(-10n, -1n, 'happy');
        const intervalSetB = makeIntervalSet<string>();
        intervalSetB.add(5n, 7n, 'meh');
        const setB = new MultiIntervalSet<string>(intervalSetB);
        setB.add(-4n, 5n, 'meh');
        const result = similarity([['happy', 'sad', 0.6], ['happy', 'meh', 0.3]], setA, setB);
        utils.assertApproxEqual(0.1, result);
    });
    it('covers all intervals with defined similarity', function() {
        const intervalSetA = makeIntervalSet<string>();
        intervalSetA.add(-10n, 2n, 'happy');
        intervalSetA.add(2n, 22n, 'sad');
        const setA = new MultiIntervalSet<string>(intervalSetA);

        const intervalSetB = makeIntervalSet<string>();
        intervalSetB.add(-10n, -5n, 'meh');
        intervalSetB.add(-5n, 1n, 'happy');
        intervalSetB.add(1n, 15n, 'sad');
        const setB = new MultiIntervalSet<string>(intervalSetB);
        setB.add(15n, 22n, 'meh');

        const result = similarity([['happy', 'meh', 0.1], ['sad', 'happy', 0.6], ['sad', 'meh', 0.7]], setA, setB);
        utils.assertApproxEqual(0.78125, result);
    });


});

describe('UnitIntervalSet', function() {

    /*
     * Testing strategy for UnitIntervalSet
     * 
     * constructor, min, max, getLabel:
     * partition on size of set: 0, 1, >1
     * partition on intervals: intervals span entire set, intervals do not span entire set
     * 
     * getLabel:
     * partition on output: output is undefined, output is defined
     */

    it('covers size = 0, output is undefined', function() {
        // TODO remember to write the partitions covered in the test name
        const empty = new UnitIntervalSet(new MultiIntervalSet<string>());
        assert.strictEqual(undefined, empty.getLabel(0));
    });
    it('covers size = 1', function() {
        const intervalSet = makeIntervalSet<string>();
        intervalSet.add(0n, 1n, 'happy');
        const set = new MultiIntervalSet<string>(intervalSet);
        const unitSet = new UnitIntervalSet(set);
        assert.strictEqual('happy', unitSet.getLabel(0));
        assert.strictEqual(undefined, unitSet.getLabel(1));
        assert.strictEqual(0, unitSet.getMin());
        assert.strictEqual(0, unitSet.getMax());
    });
    it('covers size > 1, intervals span entire set', function() {
        const intervalSet = makeIntervalSet<string>();
        intervalSet.add(0n, 1n, 'happy');
        intervalSet.add(1n, 2n, 'sad');
        const set = new MultiIntervalSet<string>(intervalSet);
        const unitSet = new UnitIntervalSet(set);
        assert.strictEqual('happy', unitSet.getLabel(0));
        assert.strictEqual('sad', unitSet.getLabel(1));
        assert.strictEqual(undefined, unitSet.getLabel(2));
        assert.strictEqual(0, unitSet.getMin());
        assert.strictEqual(1, unitSet.getMax());
    });
    it('covers size > 1, intervals do not span entire set', function() {
        const intervalSet = makeIntervalSet<string>();
        intervalSet.add(0n, 1n, 'happy');
        intervalSet.add(2n, 3n, 'sad');
        const set = new MultiIntervalSet<string>(intervalSet);
        const unitSet = new UnitIntervalSet(set);
        assert.strictEqual('happy', unitSet.getLabel(0));
        assert.strictEqual(undefined, unitSet.getLabel(1));
        assert.strictEqual('sad', unitSet.getLabel(2));
        assert.strictEqual(undefined, unitSet.getLabel(3));
        assert.strictEqual(0, unitSet.getMin());
        assert.strictEqual(2, unitSet.getMax());
    });

});
