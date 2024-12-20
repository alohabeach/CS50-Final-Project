const COLUMNS = 7;
const ROWS = 6;

let game, board, ai, scaleHandler;
const defaultGameState = { pieces: Array(7).fill().map(() => Array(6).fill(0)) };

// sketch stuff
function setup() {
    createCanvas(windowWidth * 0.6, windowHeight * 0.6, document.getElementById("connect4"));
    scaleHandler = new Scale(width, height);
    scale = scaleHandler.getScale();

    board = new Board(COLUMNS, ROWS, scaleHandler, new createVector(width/2, height/2), defaultGameState);
    board.singlePlayer = true;
    board.players = [
        { username: "Player 1", playerNum: 1, type: "players" },
        { username: isCoop ? "Player 2" : "Computer", playerNum: 2, type: "players" }
    ];
    board.user = board.players[0];
    board.playerTurn = board.user;

    game = new Game(COLUMNS, ROWS);
    game.players = board.players;

    ai = new Connect4AI({ depth: 5, columns: COLUMNS, rows: ROWS });
}

function mouseClicked() {
    if (!board) return;

    if (board.isMouseOver('pieces') && board.canPlay()) {
        if (!game.isValidPlay(board.selectedColumn)) return;

        let newGameState = game.play(board.selectedColumn, board.user.playerNum);

        board.play(board.selectedColumn, board.user.playerNum);

        if (isCoop) {
            board.playerTurn = board.players.find(player => player.playerNum != board.playerTurn.playerNum);
            board.user = board.playerTurn;
        } else {
            if (newGameState.winner || newGameState.tie) {
                board.user = {};
                board.gameOver(newGameState);

                return;
            }

            const bestMove = ai.getMove(newGameState.pieces);
            const otherPlayerNum = board.players.find(player => player.playerNum != board.playerTurn.playerNum).playerNum;

            newGameState = game.play(bestMove, otherPlayerNum)
            board.play(bestMove, otherPlayerNum);
        }

        if (newGameState.winner || newGameState.tie) {
            board.user = {};
            board.gameOver(newGameState);
        }
    } else if (board.isMouseOver('restartBtn')) {
        game.reset();
        board.gameState.pieces = game.gameState.pieces;
        board.init();
        setup();
    }
}

function draw() {
    background(29, 99, 240);

    // draws and updates everything
    board.draw();

    // mouse stuff
    if ((board.isMouseOver() && board.canPlay()) || board.isMouseOver('restartBtn')) {
        cursor('pointer');
    } else {
        cursor('default');
    }
}

function windowResized() {
    scaleHandler.update(windowWidth * 0.6, windowHeight * 0.6);
    if (board) board.updateScales();
}