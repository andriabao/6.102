import assert from 'node:assert';
import { isDeepStrictEqual } from 'node:util';

/**
 * Mutable type representing Sudoku puzzles.
 * 
 * A Sudoku puzzle is a square NxN grid of cells in which the numbers 1..N
 * should be written so that, after the puzzle is solved by filling in all the cells,
 * each number appears exactly once in each row, column, and block,
 * where a block is a sqrt(N) x sqrt(N) grid of cells, and the whole grid is tiled by N blocks.
 * Thus N must be a perfect square: 4, 9, 16, etc.
 * The conventional size for human solving is N=9.
 * See http://en.wikipedia.org/wiki/Sudoku for more information.
 */
export class Sudoku {
    
    private readonly puzzle: number[][];
    private readonly blockSize: number;
    private readonly puzzleSize: number;
    
    // Rep invariant:
    //   - TODO: some conditions are missing here
    //   - number of rows and cols in puzzle is equal to puzzle size
    //   - block size is sqrt of puzzle size
    //   - contains only numbers or blanks:
    //       puzzle[i][j] in { 0, ..., puzzleSize } for all 0 <= i, j < puzzleSize
    //   - no positive number appears more than once in any row, column, or block
    
    // Abstraction function:
    //     AF(s) = { s.puzzle[i][j] | 0 <= i, j < s.puzzleSize }

    
    // Safety from rep exposure:
    //     puzzle is a copy of the array, so the rep is not exposed
    //     puzzleSize and blockSize are private and immutable
    //     getRow, getColumn, and getBlock return copies of the arrays, so the rep is not exposed
    
    
    // asserts the rep invariant
    private checkRep(): void {
        
        // TODO: implement the part of the rep invariant you added above

        for (const puzzleRow of this.puzzle) {
            for (const cell of puzzleRow) {
                assert(cell >= 0 && cell <= this.puzzleSize);
            }
        }
        
        assert(this.puzzle[0].length == this.puzzleSize);
        assert(this.puzzle.length == this.puzzleSize);
        assert(this.blockSize == Math.sqrt(this.puzzleSize))
        // nonzero numbers that are allowed in the grid
        const allowed = new Set<number>();
        for (let number = 1; number <= this.puzzleSize; number++) {
            allowed.add(number);
        }
        
        // each row must have only those numbers and no duplicates
        for (let row = 0; row < this.puzzleSize; row++) {
            const found = new Set<number>();
            for (let column = 0; column < this.puzzleSize; column++) {
                const cell = this.puzzle[row][column];
                if (cell === 0) { continue; } // skip blanks
                assert(allowed.has(cell), `invalid number ${cell} at (${row}, ${column})`);
                assert( ! found.has(cell), `duplicate ${cell} in row ${row}`);
                found.add(cell);
            }
        }
        
        // each column must have only those numbers and no duplicates
        for (let column = 0; column < this.puzzleSize; column++) {
            const found = new Set<number>();
            for (let row = 0; row < this.puzzleSize; row++) {
                const cell = this.puzzle[row][column];
                if (cell === 0) { continue; } // skip blanks
                assert( ! found.has(cell), `duplicate ${cell} in column ${column}`);
                found.add(cell);
            }
        }
        
        // each block must have only those numbers and no duplicates
        for (let block = 0; block < this.puzzleSize; block++) {
            const found = new Set<number>();
            const startRow = Math.floor(block / this.blockSize) * this.blockSize;
            const startColumn = (block % this.blockSize) * this.blockSize;
            for (let cellRow = 0; cellRow < this.blockSize; cellRow++) {
                for (let cellColumn = 0; cellColumn < this.blockSize; cellColumn++) {
                    const cell = this.puzzle[startRow + cellRow][startColumn + cellColumn];
                    if (cell === 0) { continue; } // skip blanks
                    assert( ! found.has(cell), `duplicate ${cell} in block ${block}`);
                    found.add(cell);
                }
            }
        }
    }
    
    /**
     * Make a Sudoku with squares filled in.
     * @param puzzle a Sudoku puzzle in row-major order where 0 stands for blank, requires:
     *  - puzzle is a square array N x N for perfect square N
     *  - puzzle[i][j] in { 0, 1, ..., N } for all 0 <= i, j < N
     *  - no positive number appears more than once in any row, column, or block
     */
    public constructor(puzzle: number[][]) {
        this.puzzleSize = FIXME;
        this.blockSize = FIXME;
        this.puzzle = puzzle.slice();
    }
    
    /**
     * @returns size N of this puzzle
     */
    public size() {
        return this.puzzleSize;
    }
    
    /**
     * @param row    0 <= row < size of this puzzle
     * @param column 0 <= column < size
     * @returns the row of the puzzle that contains the cell at (row, column),
     *          using 1...size for cells that contain numbers, and 0 for empty cells
     */
    public getRow(row: number, column: number): number[] {
        return this.puzzle[row].slice();
    }
    
    /**
     * @param row    0 <= row < size of this puzzle
     * @param column 0 <= column < size
     * @returns the column of the puzzle that contains the cell at (row, column),
     *          using 1...size for cells that contain numbers, and 0 for empty cells
     */
    public getColumn(row: number, column: number): number[] {
        const cells = [];
        for (let ii = 0; ii < this.puzzleSize; ii++) {
            cells.push(this.puzzle[ii][column]);
        }
        return cells;
    }
    
    /**
     * @param row    0 <= row < size of this puzzle
     * @param column 0 <= column < size
     * @returns the block of the puzzle that contains the cell at (row, column),
     *          using 1...size for cells that contain numbers, and 0 for empty cells,
     *          returned in order from left to right, top to bottom
     */
    public getBlock(row: number, column: number): number[] {
        const cells = [];
        const startRow = Math.floor(row / this.blockSize) * this.blockSize;
        const startColumn = Math.floor(column / this.blockSize) * this.blockSize;
        for (let cellRow = 0; cellRow < this.blockSize; cellRow++) {
            for (let cellColumn = 0; cellColumn < this.blockSize; cellColumn++) {
                cells.push(this.puzzle[startRow + cellRow][startColumn + cellColumn]);
            }
        }
        return cells;
    }
    
    /**
     * @returns true if the puzzle can be solved, and modifies puzzle to fill in blank cells
     *          with a solution; returns false if no solution exists
     */
    public solve(): boolean {
        // find an empty cell
        for (let row = 0; row < this.puzzleSize; row++) {
            for (let column = 0; column < this.puzzleSize; column++) {
                if (this.puzzle[row][column] === 0) {
                    // found an empty cell; try to fill it
                    const rowColumnBlock = [
                        this.getRow(row, column),
                        this.getColumn(row, column),
                        this.getBlock(row, column),
                    ];
                    const alreadyUsed = new Set<number>();
                    for (const used of rowColumnBlock) {
                        for (const number of used) {
                            alreadyUsed.add(number);
                        }
                    }
                    for (let number = 1; number <= this.puzzleSize; number++) {
                        if ( ! alreadyUsed.has(number)) {
                            this.puzzle[row][column] = number;
                            if (this.solve()) {
                                return true;
                            }
                            // couldn't solve it with that choice,
                            // so clear the cell again and backtrack
                            this.puzzle[row][column] = 0;
                        }
                    }
                    return false; // nothing works for this cell! give up and backtrack
                }
            }
        }
        return true; // no empty cells found, so puzzle is already solved
    }
    
    /**
     * @returns true if and only if each row, column, and block of the puzzle uses all the
     *          numbers 1...size exactly once
     */
    public isSolved(): boolean {
        // make the set of expected numbers
        const solved = new Set<number>();
        for (let number = 1; number <= this.puzzleSize; number++) {
            solved.add(number);
        }
        // look at each row and column (using cells on the diagonal)
        for (let ii = 0; ii < this.puzzleSize; ii++) {
            if ( ! isDeepStrictEqual(new Set(this.getRow(ii, ii)), solved)) {
                return false;
            }
            if ( ! isDeepStrictEqual(new Set(this.getColumn(ii, ii)), solved)) {
                return false;
            }
        }
        // look at each block (using the upper-left cells)
        for (let row = 0; row < this.puzzleSize; row += this.blockSize) {
            for (let column = 0; column < this.puzzleSize; column += this.blockSize) {
                if ( ! isDeepStrictEqual(new Set(this.getBlock(row, column)), solved)) {
                    return false;
                }
            }
        }
        return true; // all rows, columns, and blocks are correct
    }
    
    /**
     * @returns string representation of puzzle, suitable for printing
     */
    public toString(): string {
        let result = '';
        for (let row = 0; row < this.puzzleSize; row++) {
            if (row > 0 && row % this.blockSize === 0) {
                for (let column = 0; column < this.puzzleSize; column++) {
                    if (column > 0 && column % this.blockSize === 0) {
                        result += '+';
                    }
                    result += '-';
                }
                result += '\n';
            }
            for (let column = 0; column < this.puzzleSize; column++) {
                if (column > 0 && column % this.blockSize === 0) {
                    result += '|';
                }
                const cell = this.puzzle[row][column];
                if (cell === 0) {
                    result += ' ';
                } else {
                    result += this.puzzle[row][column];
                }
            }
            result += '\n';
        }
        return result;
    }
}
