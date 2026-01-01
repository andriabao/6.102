import assert from 'node:assert';
import { solve } from '../src/solver.js';
import { Sudoku } from '../src/sudoku.js';

/*
 * Testing strategy
 *
 * For solve:
 *  partition on # blanks in puzzle: 0, 1, >1 but not all, all
 *  partition on # blanks in one row:    0, 1, >1 but not all, all
 *  partition on # blanks in one column: 0, 1, >1 but not all, all
 *  partition on # blanks in one block:  0, 1, >1 but not all, all
 */

describe('solver.solve', function() {
  
  it('regression test for user-reported bug #1079', function() {
    const unsolved = [ [ 1,0, 3,4 ],
                       [ 3,0, 1,2 ],
                       [ 2,3, 4,1 ],
                       [ 4,1, 2,3 ] ];
    const puzzle = new Sudoku(unsolved);
    const solution = new Sudoku(unsolved);
    solution.set(0,1, 2);
    solution.set(1,1, 4);
    
    console.log(`before:\n${puzzle}`);
    const claimsToBeSolved = solve(puzzle);
    console.log(`after:\n${puzzle}`);
    assert.strictEqual(claimsToBeSolved, true);
    
    assertSameValues(puzzle, solution);
  });
  
  it('covers no blanks, 0 blanks in a row/column/block', function() {
    const puzzle = makeSolved9x9Puzzle();
    
    assert.strictEqual(puzzle.isSolved(), true);
    assert.strictEqual(solve(puzzle), true);
    assert.strictEqual(puzzle.isSolved(), true);
  });
  
  it('covers 1 blank, 0 & 1 blank in a row/column/block', function() {
    // start with a solved puzzle
    const puzzle = makeSolved9x9Puzzle();
    // clear 1 cell
    puzzle.set(3,3, 0);
    
    assert.strictEqual(puzzle.isSolved(), false);
    assert.strictEqual(solve(puzzle), true);
    assert.strictEqual(puzzle.isSolved(), true);
    assertSameValues(puzzle, makeSolved9x9Puzzle());
  });
  
  it('covers >1 blanks, 1 & >1 blanks in a row/column/block', function() {
    // start with a solved puzzle
    const puzzle = makeSolved9x9Puzzle();
    // clear 4 cells
    puzzle.set(3,3, 0);
    puzzle.set(7,3, 0);
    puzzle.set(6,6, 0);
    puzzle.set(7,8, 0);
    
    assert.strictEqual(puzzle.isSolved(), false);
    assert.strictEqual(solve(puzzle), true);
    assert.strictEqual(puzzle.isSolved(), true);
    assertSameValues(puzzle, makeSolved9x9Puzzle());
  });
  
  it.only('covers all blanks, >1 blanks in a row/column/block', function() {
    // const puzzle = makeEmptyPuzzle(9);
    
    // another way to make an empty puzzle: start with a solved puzzle and empty it
    const puzzle = makeSolved9x9Puzzle();
    for (let row = 1; row < 9; row++) {
      for (let column = 8; column < 9; column++) {
        puzzle.set(row, column, 0);
      }
    }
    
    assert.strictEqual(puzzle.isSolved(), false);
    console.log(`before:\n${puzzle}`);
    assert.strictEqual(solve(puzzle), true);
    console.log(`after:\n${puzzle}`);
    assert.strictEqual(puzzle.isSolved(), true);
  });
});

// make a new empty puzzle of size N
function makeEmptyPuzzle(n: number): Sudoku {
  const blank: number[][] = [];
  for (let row = 0; row < n; row++) {
    blank.push(new Array(n).fill(0));
  }
  return new Sudoku(blank);
}

// make a new solved puzzle with the same constant values
function makeSolved9x9Puzzle(): Sudoku {
  return new Sudoku([
    [ 2, 4, 8,  3, 9, 5,  7, 1, 6, ],
    [ 5, 7, 1,  6, 2, 8,  3, 4, 9, ],
    [ 9, 3, 6,  7, 4, 1,  5, 8, 2, ],
    
    [ 6, 8, 2,  5, 3, 9,  1, 7, 4, ],
    [ 3, 5, 9,  1, 7, 4,  6, 2, 8, ],
    [ 7, 1, 4,  8, 6, 2,  9, 5, 3, ],
    
    [ 8, 6, 3,  4, 1, 7,  2, 9, 5, ],
    [ 1, 9, 5,  2, 8, 6,  4, 3, 7, ],
    [ 4, 2, 7,  9, 5, 3,  8, 6, 1, ],
  ]);
}

// assert that actual and expected are puzzles with identical values
function assertSameValues(actual: Sudoku, expected: Sudoku): void {
  assert.strictEqual(actual.size(), expected.size());
  for (let row = 0; row < expected.size(); row++) {
    for (let column = 0; column < expected.size(); column++) {
      assert.strictEqual(actual.get(row, column), expected.get(row, column));
    }
  }
}
