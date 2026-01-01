import assert from 'node:assert';
import { Sudoku } from '../src/sudoku.js';

/*
 * Testing strategy
 *
 * For getRow/getColumn/getBlock: 
 *  partition: row=0, row=max, 0<row<max
 *  partition: column=0, column=max, 0<column<max
 *  partition: block is on left, middle, right
 *  partition: block is on top, middle, bottom
 *  partition: # blanks in row/col/block: 0, 1, >1 but not all, all
 */

const solvedPuzzle = [
  [ 2, 4, 8,  3, 9, 5,  7, 1, 6, ],
  [ 5, 7, 1,  6, 2, 8,  3, 4, 9, ],
  [ 9, 3, 6,  7, 4, 1,  5, 8, 2, ],
  
  [ 6, 8, 2,  5, 3, 9,  1, 7, 4, ],
  [ 3, 5, 9,  1, 7, 4,  6, 2, 8, ],
  [ 7, 1, 4,  8, 6, 2,  9, 5, 3, ],
  
  [ 8, 6, 3,  4, 1, 7,  2, 9, 5, ],
  [ 1, 9, 5,  2, 8, 6,  4, 3, 7, ],
  [ 4, 2, 7,  9, 5, 3,  8, 6, 1, ],
];

describe('Sudoku.getRow', function() {
  it('covers row=0', function() {
    const sudoku = new Sudoku(solvedPuzzle);
    assert.deepStrictEqual(sudoku.getRow(0, 0), [ 2, 4, 8,  3, 9, 5,  7, 1, 6, ]);
  });
  it('covers 0<row<max', function() {
    const sudoku = new Sudoku(solvedPuzzle);
    assert.deepStrictEqual(sudoku.getRow(3, 0), [ 6, 8, 2,  5, 3, 9,  1, 7, 4, ]);
  });
  it('covers row=max', function() {
    const sudoku = new Sudoku(solvedPuzzle);
    assert.deepStrictEqual(sudoku.getRow(8, 0), [ 4, 2, 7,  9, 5, 3,  8, 6, 1, ]);
  });
});

describe('Sudoku.getColumn', function() {
  it('covers column=0', function() {
    const sudoku = new Sudoku(solvedPuzzle);
    assert.deepStrictEqual(sudoku.getColumn(4, 0), [ 2, 5, 9,  6, 3, 7,  8, 1, 4, ]);
  });
  it('covers 0<column<max', function() {
    const sudoku = new Sudoku(solvedPuzzle);
    assert.deepStrictEqual(sudoku.getColumn(7, 5), [ 5, 8, 1,  9, 4, 2,  7, 6, 3, ]);
  });
  it('covers column=max', function() {
    const sudoku = new Sudoku(solvedPuzzle);
    assert.deepStrictEqual(sudoku.getColumn(1, 8), [ 6, 9, 2,  4, 8, 3,  5, 7, 1, ]);
  });
});

describe('Sudoku.getBlock', function() {
  it('covers block on left,top', function() {
    const sudoku = new Sudoku(solvedPuzzle);
    assert.deepStrictEqual(sudoku.getBlock(0, 0), [ 2, 4, 8,  5, 7, 1,  9, 3, 6, ]);
  });
  it('covers block on middle,bottom', function() {
    const sudoku = new Sudoku(solvedPuzzle);
    assert.deepStrictEqual(sudoku.getBlock(7, 5), [ 4, 1, 7,  2, 8, 6,  9, 5, 3, ]);
  });
  it('covers block on right,middle', function() {
    const sudoku = new Sudoku(solvedPuzzle);
    assert.deepStrictEqual(sudoku.getBlock(4, 8), [ 1, 7, 4,  6, 2, 8,  9, 5, 3, ]);
  });
});
