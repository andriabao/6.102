import assert from 'node:assert';

import { Point } from './Point.js';

/**
 * An immutable line segment in 2D.
 */
 export class LineSegment {
    
    private readonly p1: Point;
    private readonly p2: Point;
    
    // Abstraction function:
    //      AF(p1,p2) = the line segment in the plane whose endpoints are p1 and p2
    // Rep invariant:
    //      p1 and p2 are different points
    // Safety from rep exposure:
    //      All fields are private readonly immutable.
    
    private checkRep(): void {
        assert( ! this.p1.equalValue(this.p2), 'LineSegment must have distinct endpoints');
    }
    
    /**
     * Construct a line segment from coordinate pairs, which must be different points.
     * 
     * @param x1 x-coordinate of one endpoint
     * @param y1 y-coordinate of one endpoint
     * @param x2 x-coordinate of another endpoint
     * @param y2 y-coordinate of another endpoint
     */
    public constructor(x1: number, y1: number, x2: number, y2: number) {
        this.p1 = new Point(x1, y1);
        this.p2 = new Point(x2, y2);
        this.checkRep();
    }
    
    /**
     * @returns endpoints of this line segment, unordered
     */
    public endpoints(): [ Point, Point ] {
        if (this.p1.x < this.p2.x || (this.p1.x === this.p2.x && this.p1.y < this.p2.y)) {
            return [ this.p1, this.p2 ];
        } else {
            return [ this.p2, this.p1 ];
        }
    }
    
    /**
     * @returns the length of this line segment
     */
     public length(): number {
        return Math.sqrt(Math.pow(this.p1.x - this.p2.x, 2)
                         + Math.pow(this.p1.y - this.p2.y, 2));
    }
    
    /**
     * @inheritdoc
     */
     public toString(): string {
        return 'a line segment';
    }
    
    /**
     * @param that line segment to compare to this line segment
     * @returns true iff this and that are same line segment in the plane
     */
    public equalValue(that: LineSegment): boolean {
        // return (this.p1.equalValue(that.p1) && this.p2.equalValue(that.p2)) || ((this.p1.equalValue(that.p2)  && this.p2.equalValue(that.p1)));
        return(this.endpoints()[0].equalValue(that.endpoints()[0]) && this.endpoints()[1].equalValue(that.endpoints()[1])) || (this.endpoints()[0].equalValue(that.endpoints()[1]) && this.endpoints()[1].equalValue(that.endpoints()[0]));
    }

}
