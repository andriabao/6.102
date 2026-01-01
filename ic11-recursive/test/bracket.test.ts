import assert from 'node:assert';

import { Team } from '../src/team.js';
import { Bracket, bracketize } from '../src/bracket.js';

describe('Bracket', function() {
    
    // MISSING testing strategy (not a todo for today)
    
    it('covers single team', function() {
        const team = new Team('Brooklyn', 'Dodgers');
        const singleTeam = bracketize([ team ]);
        const winner = singleTeam.winner(singleTeam, new Map([[team.name, 1]])); 
        assert(winner.equalValue(team)); // TODO-2 winner is team
    });
    
    it('covers one match', function() {
        const team1 = new Team('Mudville', 'Mudders');
        const team2 = new Team('East Podunk', 'Bears');
        const oneMatch = bracketize([ team1, team2 ]);
        const winner = oneMatch.winner(oneMatch, new Map([[team1.name, 1], [team2.name, 2]])); 
        assert(winner.equalValue(team1)); // TODO-2 winner is team1
    });
    
    // MISSING test additional partitions (not a todo for today)
});
