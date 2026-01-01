import assert from 'node:assert';
import { Bag } from './Bag.js';

// An immutable type representing the result of one coin flip.
export enum Flip {
    HEADS, TAILS
}


// A mutable bag of coin flips.
export class FlipBag implements Bag<Flip> {

    private flips: number = 0;
    private heads: number = 0;
    
    // Representation invariant:
    //   0 <= heads <= flips
    //   heads and flips are both integers
    // Abstraction function:
    //   AF(flips, heads) = a bag of flips flips containing heads heads
    // Safety from rep exposure:
    //   flips and heads are private and immutable
    
    private checkRep(): void {
        assert(this.heads >= 0 && Number.isInteger(this.heads));
        assert(this.flips >= 0 && Number.isInteger(this.flips));
        assert(this.heads <= this.flips);
    }
    
    public FlipBag() {
        this.checkRep();
    }
    
    public size(): number {
        this.checkRep();
        return this.flips;
    }
    
    public contains(flip: Flip): boolean {
        this.checkRep();
        return flip === Flip.HEADS ? this.heads > 0 : this.flips > this.heads;
        // TODO
    }
    
    public add(flip: Flip): void {
        // TODO
        if (flip === Flip.HEADS) {
            ++this.heads;
        }
        ++this.flips;
        this.checkRep();
    }   
    
    public remove(flip: Flip): void {
        if (flip === Flip.HEADS && this.heads > 0) {
            --this.heads;
            --this.flips;
        } else if (flip === Flip.TAILS && this.heads < this.flips) {
            --this.flips;
        }
        this.checkRep();
    }
    
}

//////
// tests:

describe('FlipBag', function() {

    // Testing strategy
    //
    // For all operations:
    //    partition on bag size: 0, 1, >1
    //
    // For contains, add, remove:
    //    partition on multiplicity of elt: 0, 1, >1

    it('covers add with size=0; contains elt has multiplicity 1; size=1; add elt with multiplicity 0', function() {
        const s: Bag<Flip> = new FlipBag();
        s.add(Flip.HEADS);        
        assert.strictEqual(s.size(), 1);
        assert(s.contains(Flip.HEADS));
        assert(! s.contains(Flip.TAILS));
    });
});

/**/
