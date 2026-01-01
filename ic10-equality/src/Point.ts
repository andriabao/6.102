
/**
 * An immutable point in 2D floating-point space.
 */
export class Point {
    
    // Abstraction function:
    //      AF(x,y) = the point (x,y) in the plane.
    // Rep invariant:
    //      true
    // Safety from rep exposure:
    //      All fields are readonly immutable.
    
    private checkRep(): void {
        // nothing to do
    }
    
    /**
     * Construct a point at the given coordinates.
     * 
     * @param x x-coordinate
     * @param y y-coordinate
     */
    public constructor(
        public readonly x: number,
        public readonly y: number
    ) {
        this.checkRep();
    }
    
    /**
     * @inheritdoc
     */
    public toString(): string {
        return `(${this.x},${this.y})`;
    }
    
    /**
     * @param that point to compare to this point
     * @returns true iff this and that are the same point in floating-point space
     */
    public equalValue(that: Point): boolean {
        return this.x === that.x && this.y === that.y;
    }
}
