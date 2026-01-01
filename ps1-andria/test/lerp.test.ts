/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import { forTestingOnly } from '../src/lerp.js';
import { assertApproxEqual } from '../src/utils.js';
import * as utils from '../src/utils.js';

// PS1 instructions: test each implementation independently, do not call `lerp`
const lerp = undefined, lerpWeak = undefined, lerpStrong = undefined;

describe('lerpWeak', function() {
    const { lerpWeak } = forTestingOnly;

    /*
     * Testing strategy
     * 
     * partition on v0: 0, 255, 0<v0<255
     * partition on v1: 0, 255, 0<v1<255
     * partition on v0 and v1: v1>=v0, v1<v0
     * partition on t: 0, 1, 0<t<1
     */

    it('covers v0=v1, t=1, v1>=v0', function() {
        assert.strictEqual(lerpWeak(0, 255, 1), 255, 'incorrect t=1 value');
    });
    it('covers v0<v1, t=0', function() {
        assert.strictEqual(lerpWeak(255, 0, 0), 255, 'incorrect t=0 value');
    });
    it('covers v0>v1, 0<t<1, v1<v0', function() {
        assertApproxEqual(lerpWeak(198, 111, 0.3), 171.9, 'incorrect 0 < t < 1 value');
    });

});

describe('lerpStrong', function() {
    const { lerpStrong } = forTestingOnly;

    /*
     * Testing strategy:
     * 
     * partition on v0: 0, <0, >0
     * partition on v1: 0, <0, >0
     * partition on v0 and v1: v1>=v0, v1<v0
     * partition on t: 0, <0, >0
     */

    it('covers v0=0, v1>0, t=0', function() {
        assert.strictEqual(lerpStrong(0, 10, 0), 0, 'incorrect t=0 value');
    });
    it('covers v0<0, v1=0, t>0, v1>=v0', function() {
        assertApproxEqual(lerpStrong(-102, 0, 72.3), 7272.6, 'incorrect value for v0<0, v1=0, t>0');
    });
    it('covers v0>0, v1<0, t<0, v1<v0', function() {
        assertApproxEqual(lerpStrong(6.1, -7.5, -4), 60.5, 'incorrect value for v0>0, v1<0, t<0');
    });

});
