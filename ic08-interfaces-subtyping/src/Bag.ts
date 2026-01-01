import { BasicBag } from './BasicBag.js';

/**
 * A mutable multiset, also called a bag.
 * In a multiset, elements may occur more than once.
 * For example, { a, a, a, b, b } is a multiset with 3 occurrences of a and 2 occurrences of b.
 * { a^3, b^2 } is another common way to write it.
 */
export interface Bag<Element> {
    
    //////
    // observers:
        
    /**
     * Get size of the bag.
     * @returns the number of elements in this bag
     */
    size(): number;

    /**
     * Test for membership.
     * @param elt a possible element
     * @returns true iff this bag contains elt
     */
    contains(elt: Element): boolean;

    //////
    // mutators:
    
    /**
     * Modifies this bag by adding one occurrence of x to the bag.
     * @param elt element to add
     */
    add(elt: Element): void;

    /**
     * Modifies this bag by removing one occurrence of elt, if found.
     * If elt is not found in the bag, has no effect.
     * @param elt element to remove
     */
    remove(elt: Element): void
    
}

// TODO: factory function
export function makeBag<Element>(): Bag<Element> {
    return new BasicBag<Element>();
}
