import assert from 'node:assert';

/**
 * Represents an immutable sports team.
 */
export class Team {
    
    // Abstraction function:
    //   AF(home, name) maps to:
    //      A team whose name is name from home. 
    // Representation invariant:
    //      true
    // Safety from rep exposure:
    //      All fields are public but immutable; methods never pass references of rep fields to clients. 
       
    // asserts the rep invariant
    private checkRep(): void {
        assert(this.name !== "");
        assert(this.home !== "");
    }
    
    /**
     * Make a new team with the given city and team name
     * @param home city/town/school where this team is from, e.g. "MIT"
     * @param name team name, e.g. "Beavers"
     */
    constructor(
        public readonly home: string,
        public readonly name: string,
    ) {
        this.checkRep();
    }
    
    /**
     * @inheritdoc
     */
    public toString(): string {
        return this.home + " " + this.name;
    }
    
    /**
     * 
     * @param that team to compare to this team
     * @returns true iff this and that are the same team
     */
    public equalValue(that: Team): boolean {
        return (this.name === that.name) && (this.home === that.home);
    }
}
