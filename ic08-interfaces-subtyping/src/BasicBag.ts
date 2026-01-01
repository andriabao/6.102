import assert from 'node:assert';
import { Bag } from './Bag.js';

/**
 * A mutable multiset (also called a bag) whose elements are strings.
 * In a multiset, elements may occur more than once.
 * For example, { a, a, a, b, b } is a multiset with 3 occurrences of a and 2 occurrences of b.
 * { a^3, b^2 } is another common way to write it.
 */
export class BasicBag<Element> implements Bag<Element> {
    
    private elements: Array<Element> = [];
    
    // Representation invariant:
    //   'elements' contains elements of multiset
    // Abstraction function:
    //   AF(elements) = {elements[i] | 0 <= i < elements.length}
    // Safety from rep exposure:
    //   'elements' is private and never rerned to the clientturned to the client
    
    private checkRep(): void {
    }
    
    /**
     * Make a new empty bag.
     */
     public constructor() {
        this.checkRep();
    }
    /** 
     * @inheritdoc
    */
    public size(): number {
        this.checkRep();
        return this.elements.length;
    }
    
    /**
     * @inheritdoc
     */
    public contains(elt: Element): boolean {
        this.checkRep();
        return this.elements.includes(elt);
    }
    
    /**
     * @inheritdoc
     */
    public add(elt: Element): void {
        this.elements.push(elt);
        this.checkRep();
    }
    
    /**
     * @inheritdoc
     */
    public remove(elt: Element): void {
        const i = this.elements.indexOf(elt);
        if (i !== -1) {
            this.elements.splice(i, 1);
        }
        this.checkRep();
    }

}
