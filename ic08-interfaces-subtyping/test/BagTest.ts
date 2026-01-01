import assert from 'node:assert';

import { Bag, makeBag } from '../src/Bag.js';
import { BasicBag } from '../src/BasicBag.js';

describe('Bag', function() {
    
    // Testing strategy
    //
    // For all operations:
    //    partition on bag size: 0, 1, >1
    //
    // For contains, add, remove:
    //    partition on multiplicity of elt: 0, 1, >1

    
    it('covers size=0, contains elt with multiplicity 0', function() {
        const bag: Bag<String> = makeBag();
        assert.strictEqual(bag.size(), 0);
        assert( ! bag.contains("a"));
    });
    
    it('covers add with size=0; contains elt with multiplicity 1; size=1; add elt with multiplicity 0', function() {
        const bag: Bag<string> = makeBag();
        bag.add("b"); // s is now { "b" }
        assert.strictEqual(bag.size(), 1);
        assert(bag.contains("b"));
        assert( ! bag.contains("c"));
    });
    
    it('covers remove with size > 1; remove elt with multiplicity >1', function() {
        const bag: Bag<String> = makeBag();
        bag.add("d"); // s is now { "d" }
        bag.add("d"); // s is now { "d", "d" }
        bag.remove("d"); // s is now { "d" }
        assert.strictEqual(bag.size(), 1);
        assert(bag.contains("d"));
        assert(! bag.contains("e"));
    });
    
    // not shown: additional tests to cover the rest of the partitions
    
});
