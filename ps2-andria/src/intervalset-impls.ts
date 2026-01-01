/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

/** Interval set implementations. @module */

import assert from 'node:assert';
import { Interval } from './interval.js';
import { IntervalSet, IntervalConflictError } from './intervalset.js';
import * as utils from './utils.js';

/**
 * An implementation of IntervalSet.
 * 
 * PS2 instructions: you must use the provided rep. You may not change the spec of the constructor.
 */
export class RepMapIntervalSet<Label> implements IntervalSet<Label> {

    private readonly startMap: Map<Label, bigint> = new Map();
    private readonly endMap: Map<bigint, bigint> = new Map();

    // Abstraction function:
    //   AF(startMap, endMap) = {(l, [start, end)) | l in startMap.keys(), start = startMap.get(l), end = endMap.get(start)},
    //                            where (l, [start, end)) is an interval [start, end) with label l
    // Representation invariant:
    // - All values in startMap must have a corresponding key in endMap with the same start value and vice versa
    // - Each (key, value) interval in endMap must be non-overlapping with all other intervals in the set
    // - For each interval in the set, the start value must be less than the end value.
    //
    // Safety from rep exposure:
    // All fields are private and readonly; the Map types are mutable but never passed or returned from an operation; 
    // labels() returns a new Set object; interval() returns a new Interval with immutable bigint values
    //

    /**
     * Create an empty interval set.
     */
    public constructor() {
        this.checkRep();
    }

    private checkRep(): void {
        assert(this.startMap.size === this.endMap.size);
        for (const [_, start] of this.startMap) {
            assert(this.endMap.has(start));
            const end = this.endMap.get(start) as bigint;
            assert(start < end);
            // Check if interval overlaps with other intervals
            for (const [existingStart, existingEnd] of this.endMap) {
                if(utils.checkOverlap(new Interval(start, end), new Interval(existingStart, existingEnd)) && (start !== existingStart && end !== existingEnd)) {
                    throw new Error('overlapping intervals');
                }
            }
        }
    }

    /**
     * @inheritDoc
     */
    public add(start: bigint, end: bigint, label: Label): void {
        if(start >= end ) {
            throw new Error('start must be less than end');
        }

        // Check if label is already in set
        if(this.startMap.has(label)) {
            // Throw error if interval is present with different start or end
            if (this.startMap.get(label) !== start || this.endMap.get(start) !== end) {
                throw new IntervalConflictError();
            }
            return; // Do nothing if interval is already present
        }
        
        // Throw error if new interval overlaps with existing intervals
        for (const [existingStart, existingEnd] of this.endMap) {
            if (utils.checkOverlap(new Interval(start, end), new Interval(existingStart, existingEnd))) {
                throw new IntervalConflictError();
            }
        }

        // Add new interval
        this.startMap.set(label, start);
        this.endMap.set(start, end);
        this.checkRep();
    }

    /**
     * @inheritDoc
     */
    public labels(): Set<Label> {
        return new Set(this.startMap.keys());
    }

    /**
     * @inheritDoc
     */
    public interval(label: Label): Interval | undefined {
        if (!this.startMap.has(label)) return undefined; // label not in set
        const start = this.startMap.get(label) as bigint;
        return new Interval(start, this.endMap.get(start) as bigint);

    }

    public toString(): string {
        const intervals = Array.from(this.startMap.entries())
            .map(([label, start]) => `${label}=[${start},${this.endMap.get(start)})`)
            .join(", ");
        return `{ ${intervals} }`;
    }
        
}

/**
 * An implementation of IntervalSet.
 * 
 * PS2 instructions: you must use the provided rep. You may not change the spec of the constructor.
 */
export class RepArrayIntervalSet<Label> implements IntervalSet<Label> {

    private readonly labelList: Array<Label> = [];
    private readonly valueList: Array<bigint> = [];

    // Abstraction function:
    //   AF(labelList, valueList) = {(labelList[i], [valueList[i*2], valueList[i*2+1])) | 0 <= i < labelList.length},
    //                              where (labelList[i], [valueList[i*2], valueList[i*2+1])) is an interval [valueList[i], valueList[i+1]) with label labelList[i]
    // Representation invariant:
    //  - ValueList must have twice the length of labelList
    //  - For each interval in the set, the start value must be less than the end value
    //  - Each interval in the set must be non-overlapping with all other intervals in the set
    //
    // Safety from rep exposure:
    //   All fields are private and readonly; Although mutable Array type labelList is returned from the labels() method, 
    //   labels are stored and retrieved only by reference with === and never modified by this ADT, meaning mutation of
    //   labels by clients will not affect the integrity of the rep invariants. In addition, interval() returns a new Interval
    //   object with immutable bigint values

    /**
     * Create an empty interval set.
     */
    public constructor() {
        this.checkRep();
    }

    private checkRep(): void {
        assert(this.labelList.length * 2 === this.valueList.length);
        for (let i = 0; i < this.labelList.length/2; i++) {
            const start = this.valueList[i*2] as bigint;
            const end = this.valueList[i*2 + 1] as bigint;
            assert(start < end);
            // Check if interval overlaps with other intervals
            for (let j = 0; j < this.labelList.length/2; j++) {
                if (i !== j && utils.checkOverlap(new Interval(start, end), new Interval(this.valueList[j*2] as bigint, this.valueList[j*2 + 1] as bigint))) {
                    throw new Error('overlapping intervals');
                }
            }
        }
    }

    /**
     * @inheritDoc
     */
    public add(start: bigint, end: bigint, label: Label): void {
        if(start >= end ) {
            throw new Error('start must be less than end');
        }
        // Check if label is already in set
        if (this.labelList.includes(label)) {
            const index = this.labelList.indexOf(label);
            // Throw error if interval is present with different start or end
            if (this.valueList[index*2] !== start || this.valueList[index*2 + 1] !== end) {
                throw new IntervalConflictError();
            }
            return;
        }
        // Throw error if new interval overlaps with existing interval
        for (let i = 0; i < this.valueList.length; i+=2) {
            if (utils.checkOverlap(new Interval(start, end), new Interval(this.valueList[i] as bigint, this.valueList[i+1] as bigint))) {
                throw new IntervalConflictError();
            }
        }
        this.labelList.push(label);
        this.valueList.push(start);
        this.valueList.push(end);
        this.checkRep();
    }

    /**
     * @inheritDoc
     */
    public labels(): Set<Label> {
        return new Set(this.labelList);
    }

    /**
     * @inheritDoc
     */
    public interval(label: Label): Interval | undefined {
        if (!this.labelList.includes(label)) return undefined;
        const index = this.labelList.indexOf(label);
        this.checkRep();
        return new Interval(this.valueList[index*2] as bigint, this.valueList[index*2 + 1] as bigint);
    }
    
    public toString(): string {
        const intervals = this.labelList.map((label, i) => `${label}=[${this.valueList[i*2]},${this.valueList[i*2+1]})`).join(", ");
        return `{ ${intervals} }`;
    }
}

/**
 * PS2 instructions: both implementations are exported for testing purposes only.
 * @returns IntervalSet implementations to test
 */
export function implementationsForTesting(): Array<IntervalSetCtor> {
    return [ RepMapIntervalSet, RepArrayIntervalSet ];
}

type IntervalSetCtor = new <L>() => IntervalSet<L>;
