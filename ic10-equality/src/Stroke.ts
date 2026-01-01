import { Point } from './Point.js';

export enum Color { BLACK, RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, WHITE }

/**
 * An immutable colored stroke, drawn from a start point to an end point.
 */
export class Stroke {
    
    /**
     * Start point of this line segment stroke.
     */
    public readonly start: Point;
    /**
     * End point of this line segment stroke.
     */
    public readonly end: Point;
    
    // Abstraction function:
    //      AF(start,end,color) = a line segment from start to end, colored color.
    // Rep invariant:
    //      true
    // Safety from rep exposure:
    //      All fields are readonly immutable.
    
    // assert the rep invariant (including the implicit conditions!)
    private checkRep(): void {
        // nothing to do
    }
    
    /**
     * Construct a line segment stroke out of coordinate pairs.
     * 
     * @param startx x-coordinate of start point
     * @param starty y-coordinate of start point
     * @param endx x-coordinate of end point
     * @param endy y-coordinate of end point
     * @param color stroke color
     */
    public constructor(startx: number, starty: number, endx: number, endy: number,
        public readonly color: Color
    ) {
        this.start = new Point(startx, starty);
        this.end = new Point(endx, endy);
        this.checkRep();
    }
    
    /**
     * @returns the length of this line segment stroke
     */
    public length(): number {
        return Math.sqrt(Math.pow(this.start.x - this.end.x, 2)
                         + Math.pow(this.start.y - this.end.y, 2));
    }
    
    /**
     * @inheritdoc
     */
     public toString(): string {
        return `Stroke ${this.start} -> ${this.end} looks very ${this.color}`;
    }
    
    /**
     * @param that stroke to compare to this stroke
     * @returns true iff this and that are the same line segment stroke
     */
    public equalValue(that: Stroke): boolean {
        return this.start.equalValue(that.start) && this.end.equalValue(that.end)
            && this.color === that.color;
    }
}
