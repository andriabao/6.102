import assert from 'node:assert';
import { Sudoku } from './sudoku.js';

/**
 * @param puzzle a Sudoku puzzle
 * @returns true if the puzzle can be solved, and modifies puzzle to fill in blank cells
 *          with a solution; returns false if no solution exists
 */
export function solve(puzzle: Sudoku): boolean {
    // do a depth-first search using a stack
    const stack = [ puzzle ];
    
    searching:
    while (stack.length) {
        // pop a partially-filled puzzle off the stack
        puzzle = stack.pop() ?? assert.fail();
        
        // find an empty cell in the puzzle
        for (let row = 0; row < puzzle.size(); row++) {
            for (let column = 0; column < puzzle.size(); column++) {
                if (puzzle.get(row, column) === 0) {
                    // found an empty cell; try to fill it all remaining legal ways
                    const alreadyUsed = new Set([
                        ...puzzle.getRow(row, column),
                        ...puzzle.getColumn(row, column),
                        ...puzzle.getBlock(row, column),
                    ]);
                    for (let number = 1; number < puzzle.size(); number++) {
                        if ( ! alreadyUsed.has(number)) {
                            // number is a legal value for the blank,
                            // fill it in and push it back on the stack for more search
                            puzzle.set(row, column, number);
                            stack.push(puzzle);
                        }
                    }
                    continue searching;
                }
            }
        }
        // if we got here, we didn't find any empty cells, so puzzle is solved!
        return true;
    }
    // search failed, so no solution
    return false;
}
