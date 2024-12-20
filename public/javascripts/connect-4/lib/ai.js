class Connect4AI {
    constructor({ depth = 3, columns = 7, rows = 6 } = {}) {
        this.depth = depth;
        this.columns = columns;
        this.rows = rows;
    }

    getMove(board) {
        return this.minimax(board, this.depth, true).column;
    }

    // http://blog.gamesolver.org/solving-connect-four/03-minmax/
    minimax(board, depth, isMaximizing) {
        const winner = this.checkWinner(board);
        if (winner === 2) return { score: 100 };
        if (winner === 1) return { score: -100 };
        if (this.isBoardFull(board) || depth === 0) return { score: 0 };

        let bestMove = isMaximizing ? { score: -Infinity } : { score: Infinity };

        for (let column = 0; column < this.columns; column++) {
            const row = this.getNextEmptyRow(board, column);
            if (row !== null) {
                board[column][row] = isMaximizing ? 2 : 1;
                const result = this.minimax(board, depth - 1, !isMaximizing);
                board[column][row] = 0;

                if (
                    (isMaximizing && result.score > bestMove.score) ||
                    (!isMaximizing && result.score < bestMove.score)
                ) {
                    bestMove = { column: column, score: result.score };
                }
            }
        }

        return bestMove;
    }

    isBoardFull(board) {
        return board.every(column => column[0] !== 0);
    }

    getNextEmptyRow(board, column) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (board[column][row] === 0) return row;
        }

        return null;
    }

    checkWinner(board) {
        const isWinningLine = (cells) => cells.every(cell => cell === cells[0] && cell !== 0);

        // Check vertical lines
        for (let column = 0; column < this.columns; column++) {
            for (let row = 0; row <= this.rows - 4; row++) {
                const line = [board[column][row], board[column][row + 1], board[column][row + 2], board[column][row + 3]];
                if (isWinningLine(line)) return line[0];
            }
        }

        // Check horizontal lines
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column <= this.columns - 4; column++) {
                const line = [board[column][row], board[column + 1][row], board[column + 2][row], board[column + 3][row]];
                if (isWinningLine(line)) return line[0];
            }
        }

        // Check diagonal lines (bottom-left to top-right)
        for (let column = 0; column <= this.columns - 4; column++) {
            for (let row = 3; row < this.rows; row++) {
                const line = [board[column][row], board[column + 1][row - 1], board[column + 2][row - 2], board[column + 3][row - 3]];
                if (isWinningLine(line)) return line[0];
            }
        }

        // Check diagonal lines (top-left to bottom-right)
        for (let column = 0; column <= this.columns - 4; column++) {
            for (let row = 0; row <= this.rows - 4; row++) {
                const line = [board[column][row], board[column + 1][row + 1], board[column + 2][row + 2], board[column + 3][row + 3]];
                if (isWinningLine(line)) return line[0];
            }
        }

        return null;
    }
}