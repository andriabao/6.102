/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import { revealAnimation, movingAnimation } from '../src/toolbox.js';
import { assertApproxEqual } from '../src/utils.js';
import { Color } from '../src/colors.js';
import * as utils from '../src/utils.js';

describe('revealAnimation', function() {
    
    /*
     * Testing strategy
     * 
     * partition on number of sublists: 1, >1
     * partition on length of sublists: 2, >2
     * partition on length of path: 1, >1
     * partition on values in path: increasing, decreasing, non-monotonic
     * partition on values in path: contains 1, does not contain 1
     * partition on values in path: contains 0, does not contain 0
     */
    it('covers number of sublists=1, '
        + 'length of sublist=2, '
        + 'length of path=1, '
        + 'path contains 1', function() {
        const drawing = [[{x: 0, y: 0}, {x: 1, y: 1}]];
        const palette = [[8, 16, 20] as Color];
        const path = [{x: 1, y: 0}];
        assert.deepStrictEqual(revealAnimation(drawing, palette, path), 
        [[{color: [8, 16, 20], points: [{x: 0, y: 0}, {x: 1, y: 1}]}]],
        "expected one frame with point");
    });
    it('covers number of sublists=1, '
        + 'length of sublist>2,'
        + 'length of path>1, '
        + 'increasing values in path, '
        + 'path contains 0 ', function() {
        const drawing = [[{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}]];
        const palette = [[8, 16, 20] as Color, [16, 32, 40] as Color, [24, 48, 60] as Color];
        const path = [{x: 0, y: 0}, {x: 0.8, y: 0}];
        const actual = revealAnimation(drawing, palette, path);
        assert.strictEqual(actual.length, 2, "expected two frames");
        assert.deepStrictEqual(actual[0],[], "expected empty first frame")
        assert.deepStrictEqual(actual[1], [{color: [8,16,20], points: [{x:0,y:0}, {x:1,y:1}]},
                                           {color: [16,32,40], points: [{x:1,y:1}, {x:2,y:2}]},
                                           {color: [24,48,60], points: [{x:2,y:2}, {x:3,y:3}]}], 
                                           "expected entire drawing revealed in second frame");
    });
    it('covers number of sublists>1, '
        + 'number of sublists>2,'
        + 'length of sublist>2,'
        + 'length of path>1, '
        + 'decreasing values in path, '
        + 'path does not contain 0, '
        + 'path does not contain 1', function() {
        const drawing = [[{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}],
                        [{x: 5, y: 0}, {x: 6, y: 1}, {x: 2, y: 2}, {x: 1, y: 3}]];
        const palette = [[8, 16, 20] as Color, [16, 32, 40] as Color, [24, 48, 60] as Color];
        const path = [{x: 0.7, y: 0}, {x: 0.2, y: 0}];
        const actual = revealAnimation(drawing, palette, path);
        assert.strictEqual(actual.length, 2, "expected two frames");
        assert.strictEqual(actual[1].length, 2, "smaller number of polylines in second frame");
        assert.deepStrictEqual(actual[0], [{color: [8,16,20], points: [{x:0,y:0}, {x:1,y:1}]},
                                           {color: [16,32,40], points: [{x:1,y:1}, {x:2,y:2}]},
                                           {color: [24,48,60], points: [{x:2,y:2}, {x:3,y:3}]},
                                           {color: [8,16,20], points: [{x:5,y:0}, {x:6,y:1}]},
                                           {color: [16,32,40], points: [{x:6,y:1}, {x:2,y:2}]},
                                           {color: [24,48,60], points: [{x:2,y:2}, {x:1,y:3}]}], 
                                           "expected entire drawing with 2 curves in first frame");

    });
    it('covers number of sublists=1, '
        + 'length of sublist>2,'
        + 'length of path>1, '
        + 'non-monotonic values in path, '
        + 'path does not contain 0, '
        + 'path does not contain 1', function() {
        const drawing = [[{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}]];
        const palette = [[8, 16, 20] as Color, [16, 32, 40] as Color, [24, 48, 60] as Color];
        const path = [{x: 0.7, y: 0}, {x: 0.2, y: 0}, {x: 0.5, y: 0}];
        const actual = revealAnimation(drawing, palette, path);
        assert.strictEqual(actual.length, 3, "expected 3 frames");
        assert.deepStrictEqual(actual[0], [{color: [8,16,20], points: [{x:0,y:0}, {x:1,y:1}]},
                                           {color: [16,32,40], points: [{x:1,y:1}, {x:2,y:2}]},
                                           {color: [24,48,60], points: [{x:2,y:2}, {x:3,y:3}]}], 
                                           "expected entire drawing in first frame");
        assert.deepStrictEqual(actual[1],[{color: [8,16,20], points: [{x:0,y:0}, {x:1,y:1}]}], 
            "expected one polyline of animation in frame")
        assert.deepStrictEqual(actual[2],[{color: [8,16,20], points: [{x:0,y:0}, {x:1,y:1}]},
                                          {color: [16,32,40], points: [{x:1,y:1}, {x:2,y:2}]}])

    });
});

describe('movingAnimation', function() {
    
    /*
     * Testing strategy
     * 
     * partition on number of sublists: 1, >1
     * partition on length of sublists: 1, >1
     * partition on length of path: 1, >1
     */
    it('covers number of sublists=1, '
        + 'length of sublist>1, '
        + 'length of path=1 ', function() {
        const drawing = [[{x: 0, y: 0}, {x: 1, y: 1}]];
        const gradient = new Map<number, Color>([[0, [8, 16, 20] as Color]]);
        const path = [{x: 1, y: 0}];
        assert.deepStrictEqual(movingAnimation(drawing, gradient, path), 
        [[{color: [8, 16, 20], points: [{x: 1, y: 0}, {x: 2, y: 1}]}]],
        "expected one frame with point");
    });
    it('covers number of sublists>1, '
        + 'length of sublist=1, '
        + 'length of path>1 ', function() {
        const drawing = [[{x: 0, y: 0}],
                         [{x: 6, y: 1}]];
        const gradient = new Map<number, Color>([[0, [8, 16, 20] as Color], [1, [16, 32, 40] as Color]]);
        const path = [{x: 1, y: 0}, {x: 5, y: -5}];
        assert.deepStrictEqual(movingAnimation(drawing, gradient, path), 
        [[{color: [8, 16, 20], points: [{x: 1, y: 0}]},
          {color: [8, 16, 20], points: [{x: 7, y: 1}]}],
         [{color: [16, 32, 40], points: [{x: 5, y: -5}]},
         {color: [16, 32, 40], points: [{x: 11, y: -4}]}]],
        "expected two frames with two points");
    });

});



