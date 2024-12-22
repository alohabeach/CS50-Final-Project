// solver is made by me
class NumberlinkSolver {
    constructor(puzzle) {
        this.originalPuzzle = puzzle;
        this.savedStates = [puzzle];
        this.solvedPuzzle = puzzle;

        this.lastMovedNumber = [];
        this.rowCount = puzzle.length;
        this.columnCount = puzzle[0].length;
        this.directions = [
            { row: -1, column: 0 }, // up
            { row: 1, column: 0 }, // down
            { row: 0, column: -1 }, // left
            { row: 0, column: 1 } // right
        ];

        this.linkInfo = [];
        for (const row in puzzle) {
            for (const column in puzzle[row]) {
                const number = puzzle[row][column];
                if (number) {
                    const posType = !this.linkInfo[number] ? 'startPos' : 'endPos';
                    if (!this.linkInfo[number]) this.linkInfo[number] = {};
                    this.linkInfo[number][posType] = this.newPos(row, column);
                }
            }
        }
    }

    solve(showSteps = false) {
        // complete any links with forced moves
        const pos = this.getBestLinkPos();
        if (pos && this.hasForcedMoves(pos)) {
            this.completeForcedMoves(pos);
            return this.solve(showSteps);
        }

        // complete links where their path is literally one spot away
        if (this.completeObviousMoves()) {
            return this.solve(showSteps);
        }

        // check if the solver was successfull
        if (!this.isPuzzleCompleted() || this.hasOpenSpots()) return false;

        // return the solved puzzle or the steps to solve it
        return showSteps ? this.savedStates : this.solvedPuzzle;
    }

    isPuzzleCompleted() {
        let completed = true;
        for (const number in this.linkInfo) {
            if (!this.isNumberCompleted(number)) {
                completed = false;
                break;
            }
        }

        return completed;
    }

    hasOpenSpots() {
        let openSpots = false;
        for (const row in this.solvedPuzzle) {
            for (const column in this.solvedPuzzle[row]) {
                if (this.solvedPuzzle[row][column] === null) {
                    openSpots = true;
                    break;
                }
            }
        }

        return openSpots;
    }

    newPos(row, column) {
        return { row: parseInt(row), column: parseInt(column) };
    }

    getNumberFromLink(link) {
        return this.solvedPuzzle[link.startPos.row][link.startPos.column];
    }

    getAround(pos) {
        const spotsAround = [];
        for (const dir of this.directions) {
            const row = pos.row + dir.row;
            const column = pos.column + dir.column;
            const nextPos = this.newPos(row, column);

            if (this.inBounds(nextPos)) {
                spotsAround.push(nextPos);
            }
        }

        return spotsAround;
    }

    doesPathExist(startPos, endPos, number) {
        const visited = Array(this.rowCount).fill().map(_ => Array(this.columnCount));
        return this.pathExistsRecursive(startPos, endPos, number, visited);
    }

    pathExistsRecursive(startPos, endPos, number, visited) {
        let exists = false;
        for (const nextPos of this.getAround(startPos)) {
            if (nextPos.row == endPos.row && nextPos.column == endPos.column) {
                exists = true;
                break;
            } else if ((this.solvedPuzzle[nextPos.row][nextPos.column] === null || this.solvedPuzzle[nextPos.row][nextPos.column] == number) && !visited[nextPos.row][nextPos.column]) {
                visited[nextPos.row][nextPos.column] = true;
                exists = this.pathExistsRecursive(nextPos, endPos, number, visited);
                if (exists) break;
            }
        }

        return exists;
    }

    getBestLinkPos() {
        const allNumbers = [];

        for (const row in this.solvedPuzzle) {
            for (const column in this.solvedPuzzle[row]) {
                const pos = this.newPos(row, column);
                const value = this.solvedPuzzle[row][column];
                if (typeof value == "number") {
                    if (this.isNumberCompleted(value)) continue;

                    let totalMoves = 0;
                    for (const nextPos of this.getAround(pos)) {
                        if (this.solvedPuzzle[nextPos.row][nextPos.column] === null) {
                            totalMoves++;
                        }
                    }

                    if (totalMoves > 0) {
                        allNumbers.push({
                            totalMoves: totalMoves,
                            pos: pos
                        });
                    }
                }
            }
        }

        allNumbers.sort((a, b) => {
            if (a.totalMoves > b.totalMoves) return 1;
            if (a.totalMoves < b.totalMoves) return -1;
            return 0;
        });

        return allNumbers.length > 0 && allNumbers[0].pos;
    }

    hasForcedMoves(pos) {
        if (this.isNumberCompleted(this.solvedPuzzle[pos.row][pos.column])) return false;

        let totalMoves = 0;
        for (const nextPos of this.getAround(pos)) {
            if (this.solvedPuzzle[nextPos.row][nextPos.column] === null) {
                totalMoves++;
            }
        }

        return totalMoves == 1;
    }

    completeForcedMoves(pos) {
        if (!this.hasForcedMoves(pos)) return;

        const number = this.solvedPuzzle[pos.row][pos.column];
        for (const nextPos of this.getAround(pos)) {
            if (this.solvedPuzzle[nextPos.row][nextPos.column] === null) {
                this.solvedPuzzle[nextPos.row][nextPos.column] = number;
                this.lastMovedNumber[number] = nextPos;
                this.saveChanges();
                return this.completeForcedMoves(nextPos);
            }
        }
    }

    completeObviousMoves() {
        let completed = false;
        for (const row in this.solvedPuzzle) {
            for (const column in this.solvedPuzzle[row]) {
                const value = this.solvedPuzzle[row][column];
                if (typeof value == 'number' && !this.isNumberCompleted(value)) {
                    for (const nextPos of this.getAround(this.newPos(row, column))) {
                        if (this.solvedPuzzle[nextPos.row][nextPos.column] === null && this.isSurrounded(nextPos, value)) {
                            this.solvedPuzzle[nextPos.row][nextPos.column] = value;
                            this.lastMovedNumber[value] = nextPos;
                            this.saveChanges();
                            completed = true;
                            break;
                        }
                    }
                }
            }
        }

        return completed;
    }

    isNumberCompleted(number) {
        const visited = Array(this.rowCount).fill().map(_ => Array(this.columnCount));
        const linkInfo = this.linkInfo[number];
        return this.isNumberCompletedRecursive(linkInfo.startPos, linkInfo.endPos, number, visited);
    }

    isNumberCompletedRecursive(pos, endPos, number, visited) {
        let completed = false;
        for (const nextPos of this.getAround(pos)) {
            if (nextPos.row == endPos.row && nextPos.column == endPos.column) {
                completed = true;
                break;
            } else if (this.solvedPuzzle[nextPos.row][nextPos.column] == number && !visited[nextPos.row][nextPos.column]) {
                visited[nextPos.row][nextPos.column] = true;
                completed = this.isNumberCompletedRecursive(nextPos, endPos, number, visited);
                if (completed) break;
            }
        }

        return completed;
    }

    isSurrounded(pos, number) {
        let spotsAround = 0;
        for (const nextPos of this.getAround(pos)) {
            if (this.solvedPuzzle[nextPos.row][nextPos.column] == number) {
                spotsAround++;
            }
        }

        if (spotsAround == 2) {
            const linkInfo = this.linkInfo[number];
            return this.isNextTo(pos, linkInfo.startPos) || this.isNextTo(pos, linkInfo.endPos);
        }

        return false;
    }

    isNextTo(pos1, pos2) {
        let isNextTo = false;
        for (const nextPos of this.getAround(pos1)) {
            if (nextPos.row == pos2.row && nextPos.column == pos2.column) {
                isNextTo = true;
                break;
            }
        }

        return isNextTo;
    }

    inBounds(pos) {
        const rowInBound = pos.row >= 0 && pos.row < this.rowCount;
        const columnInBound = pos.column >= 0 && pos.column < this.columnCount;
        return rowInBound && columnInBound;
    }

    saveChanges() {
        const duplicatedArray = this.solvedPuzzle.map(row => [...row]);
        this.savedStates.push(duplicatedArray);
    }
}

// generator is from here https://github.com/abhishekpant93/numberlink-generator
class NumberlinkGenerator {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.unsolvedBoard = this.createEmptyBoard(boardSize);
        this.solvedBoard = this.createEmptyBoard(boardSize);
        this.currentPathColor = 0;
        this.totalCoveredCells = 0;
    }

    // Creates an empty board with the given size, with null for empty cells
    createEmptyBoard(size) {
        return new Array(size).fill(null).map(() => new Array(size).fill(null));
    }

    // Counts the number of neighbors of the cell at (rowIndex, columnIndex) on the board
    countNeighbours(board, rowIndex, columnIndex, color = null) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right
        let neighborCount = 0;

        directions.forEach(([directionX, directionY]) => {
            const newRowIndex = rowIndex + directionX;
            const newColumnIndex = columnIndex + directionY;

            if (newRowIndex >= 0 && newRowIndex < this.boardSize && newColumnIndex >= 0 && newColumnIndex < this.boardSize) {
                if (color !== null ? board[newRowIndex][newColumnIndex] === color : board[newRowIndex][newColumnIndex] !== null) {
                    neighborCount++;
                }
            }
        });

        return neighborCount;
    }

    // Checks if a square at (rowIndex, columnIndex) is isolated
    hasIsolatedSquares(board, rowIndex, columnIndex, color, isLastNode) {
        const isEmptyAndHasFourNeighbors = (row, column) => board[row][column] === null && this.countNeighbours(board, row, column) === 4;

        const checkIsolation = (row, column) => isEmptyAndHasFourNeighbors(row, column) &&
            (isLastNode ? this.countNeighbours(board, row, column, color) > 1 : true);

        // Check neighboring squares (Up, Down, Left, Right)
        if (rowIndex > 0 && checkIsolation(rowIndex - 1, columnIndex)) return true;
        if (rowIndex < this.boardSize - 1 && checkIsolation(rowIndex + 1, columnIndex)) return true;
        if (columnIndex > 0 && checkIsolation(rowIndex, columnIndex - 1)) return true;
        if (columnIndex < this.boardSize - 1 && checkIsolation(rowIndex, columnIndex + 1)) return true;

        return false;
    }

    // Attempts to extend a path by finding a valid neighboring cell
    getPathExtensionNeighbour(board, rowIndex, columnIndex, color) {
        const directions = [
            [-1, 0], // Up
            [0, 1],  // Right
            [1, 0],  // Down
            [0, -1]  // Left
        ];

        let randomDirectionIndex = Math.floor(Math.random() * 4);

        for (let attempt = 0; attempt < 4; attempt++) {
            const [directionX, directionY] = directions[randomDirectionIndex];
            randomDirectionIndex = (randomDirectionIndex + 1) % 4;

            const neighborRow = rowIndex + directionX;
            const neighborCol = columnIndex + directionY;

            if (neighborRow < 0 || neighborRow >= this.boardSize || neighborCol < 0 || neighborCol >= this.boardSize || board[neighborRow][neighborCol] !== null) continue;
            if (color && this.countNeighbours(board, neighborRow, neighborCol, color) > 1) continue;

            board[neighborRow][neighborCol] = color;

            if (this.hasIsolatedSquares(board, rowIndex, columnIndex, color, false) || this.hasIsolatedSquares(board, neighborRow, neighborCol, color, true)) {
                board[neighborRow][neighborCol] = null; // Undo move if isolation detected
                continue;
            }

            return [neighborRow, neighborCol];
        }

        return [0, 0]; // No valid neighbor found
    }

    // Tries to add a random path to the board
    addPath() {
        let rowIndex, colIndex, randomIndex, attempt, nextNeighbor;
        this.currentPathColor++;

        randomIndex = Math.floor(Math.random() * this.boardSize * this.boardSize);

        for (attempt = 0; attempt < this.boardSize * this.boardSize; ++attempt) {
            if (++randomIndex === this.boardSize * this.boardSize) randomIndex = 0;

            rowIndex = Math.floor(randomIndex / this.boardSize);
            colIndex = randomIndex % this.boardSize;

            if (this.solvedBoard[rowIndex][colIndex] === null) {
                this.unsolvedBoard[rowIndex][colIndex] = this.currentPathColor;
                this.solvedBoard[rowIndex][colIndex] = this.currentPathColor;

                if (this.hasIsolatedSquares(this.solvedBoard, rowIndex, colIndex, this.currentPathColor, true)) {
                    this.solvedBoard[rowIndex][colIndex] = null;
                    this.unsolvedBoard[rowIndex][colIndex] = null;
                    continue;
                } else {
                    nextNeighbor = this.getPathExtensionNeighbour(this.solvedBoard, rowIndex, colIndex, this.currentPathColor);

                    if (nextNeighbor[0] === 0 && nextNeighbor[1] === 0) {
                        this.solvedBoard[rowIndex][colIndex] = null;
                        this.unsolvedBoard[rowIndex][colIndex] = null;
                        continue;
                    } else {
                        break;
                    }
                }
            }
        }

        if (attempt === this.boardSize * this.boardSize) {
            this.currentPathColor--;
            return false;
        }

        let pathLength = 2;
        this.totalCoveredCells += 2;

        let nextNeighborToAdd = [];
        while (true) {
            rowIndex = nextNeighbor[0];
            colIndex = nextNeighbor[1];

            nextNeighborToAdd = this.getPathExtensionNeighbour(this.solvedBoard, rowIndex, colIndex, this.currentPathColor);

            if ((nextNeighborToAdd[0] !== 0 || nextNeighborToAdd[1] !== 0) && pathLength < this.boardSize * this.boardSize) {
                nextNeighbor = nextNeighborToAdd;
            } else {
                this.unsolvedBoard[nextNeighbor[0]][nextNeighbor[1]] = this.currentPathColor;
                return true;
            }

            pathLength++;
            this.totalCoveredCells++;
        }
    }

    // Shuffles the colors on the board
    shuffleColors() {
        let colorList = [];

        for (let color = 1; color <= this.currentPathColor; color++) {
            colorList.push(color);
        }

        colorList = this.shuffleArray(colorList);

        for (let row = 0; row < this.boardSize; ++row) {
            for (let column = 0; column < this.boardSize; ++column) {
                if (this.unsolvedBoard[row][column] !== null) {
                    this.unsolvedBoard[row][column] = colorList[this.unsolvedBoard[row][column] - 1];
                }
                this.solvedBoard[row][column] = colorList[this.solvedBoard[row][column] - 1];
            }
        }
    }

    // Returns a random permutation of the array using the Fisher-Yates method
    shuffleArray(array) {
        let remainingElements = array.length;
        let temporaryValue, randomIndex;

        while (remainingElements !== 0) {
            randomIndex = Math.floor(Math.random() * remainingElements);
            remainingElements--;

            temporaryValue = array[remainingElements];
            array[remainingElements] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    // Generates the puzzle board and its solution
    generateBoard() {
        do {
            this.unsolvedBoard = this.createEmptyBoard(this.boardSize);
            this.solvedBoard = this.createEmptyBoard(this.boardSize);
            this.currentPathColor = 0;
            this.totalCoveredCells = 0;

            while (this.addPath()) { }

        } while (this.totalCoveredCells < this.boardSize * this.boardSize);

        this.shuffleColors();
        return [this.unsolvedBoard, this.solvedBoard];
    }

    // Pretty print the puzzle for visualization
    prettyPrintPuzzle(puzzle) {
        let output = '';
        for (let rowIndex = 0; rowIndex < this.boardSize; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.boardSize; columnIndex++) {
                output += puzzle[rowIndex][columnIndex] === null ? '.' : puzzle[rowIndex][columnIndex];
                output += ' ';
            }
            output += '\n';
        }

        console.log(output);
    }
}

class NumberlinkPuzzle extends NumberlinkGenerator {
    /**
     * Initliazes a new NumberlinkPuzzle instance with the given board size.
     * 
     * @param {number} boardSize - The size of the board (number of rows and columns).
     */
    constructor(boardSize, maxPairs) {
        super(boardSize);
    }

    /**
     * Generates a puzzle, and if the number of pairs exceeds the specified maxPairs or doesn't match the preferredPairs,
     * it attempts to regenerate the puzzle. The function will retry up to maxAttempts times.
     * If the puzzle is not valid within the allowed attempts, it stops trying.
     * 
     * @param {Number} maxPairs - The maximum number of pairs in the puzzle. Default is 10.
     * @param {Number|null} preferredPairs - The preferred number of pairs in the puzzle. If not specified, it is treated as null and ignored.
     * @param {Number} maxAttempts - The maximum number of attempts to generate a valid puzzle. Default is 1000. 
     * If the puzzle cannot be generated within the specified attempts, it stops trying and returns the result.
     * 
     * @returns {Boolean} - Returns true if a valid puzzle is generated within the allowed attempts, false otherwise.
     */
    generateNewPuzzle(maxPairs = 10, preferredPairs = false, maxAttempts = 1000) {
        let attempts = 0;
        let validPuzzle = false;
    
        // Loop until maxAttempts is reached or a valid puzzle is generated
        while (attempts < maxAttempts && !validPuzzle) {
            const newPuzzle = this.generateBoard();
    
            this.unsolvedBoard = newPuzzle[0];
            this.solvedBoard = newPuzzle[1];
    
            maxPairs = Math.min(maxPairs, 10);
            if (preferredPairs) preferredPairs = Math.min(preferredPairs, maxPairs);
    
            const numberOfPairs = this.countPairs();
    
            // Check if the puzzle meets the criteria
            if (numberOfPairs <= maxPairs) {
                if (!preferredPairs) validPuzzle = true;
                else if (numberOfPairs === preferredPairs) validPuzzle = true;
            } else {
                attempts++;  // Increment attempts if the puzzle doesn't meet the criteria
            }
        }
    
        // If the puzzle couldn't be generated within maxAttempts, print a message
        if (!validPuzzle && this.countPairs() > 10) {
            this.generateNewPuzzle(maxPairs, preferredPairs, maxAttempts);
        }

        return validPuzzle;
    }

    /**
     * Counts the unique numbers present in a 2D array (`unsolvedBoard`).
     * This method iterates through all cells in the 2D array and adds each number
     * to a `Set`, which automatically ensures uniqueness.
     * 
     * @returns {number} - The count of unique numbers in the 2D array.
     */
    countPairs() {
        const uniqueNumbers = new Set();

        for (const column of this.unsolvedBoard) {
            for (const number of column) {
                if (number != null) uniqueNumbers.add(number);
            }
        }

        return uniqueNumbers.size;
    }

    /**
     * Solves the current unsolved puzzle and returns either the final board or an array of all steps to the solution.
     * If `showSteps` is set to true, it returns an array of all intermediate puzzle states. 
     * If `showSteps` is false, it returns only the final solved puzzle.
     * 
     * @param {boolean} showSteps - Determines whether to return all steps (true) or just the final solution (false).
     * @returns {Array|Array[]} - The final solved puzzle board if `showSteps` is false, or an array of puzzle states showing each step of the solution if `showSteps` is true.
     */
    getSolution(showSteps = false) {
        const solver = new NumberlinkSolver(this.unsolvedBoard);
        return solver.solve(showSteps);
    }

    /**
     * Prints the unsolved puzzle in a human-readable format to the console.
     */
    printUnsolved() {
        this._prettyPrint(this.unsolvedBoard);
    }

    /**
     * Prints the solved puzzle in a human-readable format to the console.
     */
    printSolved() {
        this._prettyPrint(this.solvedBoard);  // Calls the _prettyPrint method to display the solved board
    }

    /**
     * Helper method to print a puzzle in a readable, visually appealing format.
     * 
     * @param {Array} puzzle - The puzzle to be printed (either solved or unsolved).
     */
    _prettyPrint(puzzle) {
        let prettyPuzzle = '';

        for (const row of puzzle) {
            let rowString = '';

            for (const column of row) {
                rowString += column === null ? ' . ' : ` ${column} `;
            }

            prettyPuzzle += rowString + '\n';
        }

        console.log(prettyPuzzle);
    }
}