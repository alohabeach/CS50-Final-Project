class Game {
    constructor(columns, rows) {
        this.columns = columns;
        this.rows = rows;
        this.pieces = Array(columns).fill().map(() => Array(rows).fill(0));
        this.players = [];
        this.spectators = [];

        this.clearGameState();
        this.gameState.waitingForPlayers = true;
    }

    reset() {
        this.clearGameState();
    }

    clearGameState() {
        this.pieces = Array(this.columns).fill().map(() => Array(this.rows).fill(0));
        this.updateGameState({ pieces: this.pieces })
    }

    getGameState() {
        return this.gameState;
    }

    updateGameState(gameState) {
        this.gameState = gameState;
    }

    isValidPlay(col) {
        return this.pieces[col][0] == 0;
    }
    
    play(col, playerNum) {
        const column = this.pieces[col];
        for (let row = column.length - 1; row >= 0; row--) {
            const piece = column[row];
            if (piece == 0) {
                column[row] = playerNum;
                break;
            }
        }

        return this.checkWin(playerNum);
    }

    checkWin(playerNum) {
        let newGameState = {};

        // check for four in a row
        const directions = [
            [1, 0], // horizontal
            [0, 1], // verticle
            [1, 1], // diagonal
            [1, -1] // anti diagonal
        ];
        for (let column = 0; column < this.pieces.length; column++) {
            for (let row = 0; row < this.pieces[column].length; row++) {
                const firstPiece = this.pieces[column][row];
                if (firstPiece != 0) {
                    directions.forEach(dir => {
                        try {
                            let nextPiece;
                            for (let i = 0; i < 4; i++) {
                                nextPiece = [column + dir[0]*i, row + dir[1]*i];
                                if (firstPiece !== this.pieces[nextPiece[0]][nextPiece[1]]) {
                                    nextPiece = false;
                                    break;
                                }
                            }
                            if (nextPiece) {
                                newGameState.fourInARow = { a: [column, row], b: nextPiece };
                                newGameState.winner = this.players[playerNum - 1];
                            }
                        } catch {}
                    });
                }
            }
        }

        // check for tie
        if (!newGameState.winner) {
            newGameState.tie = true;
            this.pieces.forEach(column => {
                column.forEach(piece => {
                    if (piece === 0) newGameState.tie = false;
                });
            });
        }

        // update game state
        newGameState.pieces = this.pieces;
        newGameState.playerTurn = this.players[playerNum % 2];
        this.updateGameState(newGameState);
 
        return newGameState;
    }

    printGameState() {
        const gameState = this.getGameState();

        console.log('--------------------------------');
        for (let row = 0; row < this.rows; row++) {
            let rowString = '|';
            for (let column = 0; column < this.columns; column++) {
                rowString += `| ${this.pieces[column][row]} |`;
            }
            console.log(rowString + '|');
        }
        console.log('--------------------------------');

        if (gameState.winner) {
            console.log(`Player ${gameState.winner} won!`);
        } else if (gameState.tie) {
            console.log('Tie!')
        }
    }
}