
// Louis Reasoner likes all his variables up at the top
// where he can keep a close eye on them.

function main(): void {
    const puzzleSize = 4;
    const sudoku = new Sudoku(puzzleSize);
    do {
        sudoku.fillRandomly();
        sudoku.print();
    } while (!sudoku.isSolved());
    console.log("solved!");
}

class Sudoku {

    private readonly puzzleSize: number;
    private readonly puzzle: Array<Array<number>>;
    
    public constructor(puzzleSize: number) {
        this.puzzleSize = puzzleSize;
        this.puzzle = [];
        
        for (let row = 0; row < this.puzzleSize; ++row) {
            const row: Array<number> = [];
            for (let column = 0; column < this.puzzleSize; ++column) {
                row.push(0);
            }
            this.puzzle.push(row);
        }
    }
    
    public fillRandomly(): void {
        for (let row = 0; row < this.puzzle.length; ++row) {
            for (let column = 0; column < this.puzzle.length; ++column) {
                // pick a random integer from 1 to puzzle.length inclusive
                this.puzzle[row][column] = 1 + Math.floor(Math.random() * this.puzzle.length);
            }
        }
    }
    
    public isSolved(): boolean {
        for (let row = 0; row < this.puzzle.length; ++row) {
            const numbers = new Set();
            for (let column = 0; column < this.puzzle.length; ++column) {
                // === snapshot! draw a diagram of the 1st time we reach this point ===
                if (numbers.has(this.puzzle[row][column])) {
                    return false;
                }
                numbers.add(this.puzzle[row][column]);
            }
        }
        
        for (let column = 0; column < this.puzzle.length; ++column) {
            const numbers = new Set();
            for (let row = 0; row < this.puzzle.length; ++row) {
                if (numbers.has(this.puzzle[row][column])) {
                    return false;
                }
                numbers.add(this.puzzle[row][column]);
            }
        }
                
        for (let block = 0; block < this.puzzle.length; ++block) {
            const numbers = new Set();
            const blockSize = Math.floor(Math.sqrt(this.puzzle.length));
            const firstRow = block / blockSize;
            const firstColumn = block % blockSize;
            for (let row = 0; row < blockSize; ++row) {
                for (let column = 0; column < blockSize; ++column) {
                    if (numbers.has(this.puzzle[firstRow+row][firstColumn+column])) {
                        return false;
                    }
                    numbers.add(this.puzzle[firstRow+row][firstColumn+column]);
                }
            }
        }
        
        return true;
    }

    public print(): void {
        let printout = "";
        for (let row = 0; row < this.puzzle.length; ++row) {
            for (let column = 0; column < this.puzzle.length; ++column) {
                printout += this.puzzle[row][column];
            }
            printout += "\n";
        }
        console.log(printout);
    }
}


main();
