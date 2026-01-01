import assert from 'node:assert';
import { Team } from './team.js';

/**
 * Represents an immutable single-elimination tournament.
 */
export interface Bracket {
    
    /** 
     * @param bracket a non-empty bracket
     * @param strengths a map of team names to relative strengths.
     *        All teams in this must be in strength
     * @returns winner of the bracket,
     */
    winner(bracket: Bracket, strengths: Map<string, number>): Team;
    // winner(bracket: Bracket, strengths: (team1: Team, team2: Team) => Team): Team;

}

/**
 * @param teams nonempty list of the unique teams in the tournament
 * @returns Bracket with all the teams placed in it
 */
export function bracketize(teams: ReadonlyArray<Team>): Bracket {
    assert(teams.length !== 0);
    if (teams.length === 1) {
        throw new Error('unimplemented base case');
    } else {
        throw new Error('unimplemented recursive case');
    }
}

// Recursive data type definition:
//   Bracket = Single(Team) + Game(left: Bracket, right: Bracket)

/*
    Recursive functional definition of winner:

    winner(TODO-5) = TODO-5
    winner(TODO-5) = TODO-5
    ...
*/

// TODO-4 implementation classes: 
class winner implements Bracket {

    
    // Abstraction function:
    //   TODO-4
    // Representation invariant:
    //   TODO-4
    // Safety from rep exposure:
    //   TODO-4
    
    // TODO-4 fields
    
    // TODO-4 constructor
    
    // TODO-6 implement winner
    
}
