let game, board, ai, scaleHandler;
const defaultGameState = { pieces: Array(7).fill().map(() => Array(6).fill(0)) };

// sketch stuff
function setup() {
    createCanvas(windowWidth * 0.6, windowHeight * 0.6, document.getElementById("connect4"));
    scaleHandler = new Scale(width, height);
    scale = scaleHandler.getScale();

    board = new Board(7, 6, scaleHandler, new createVector(width/2, height/2), defaultGameState);
    board.singlePlayer = true;
    board.players = [
        { username: "Player 1", playerNum: 1, type: "players" },
        { username: "Player 2", playerNum: 2, type: "players" }
    ];
    board.user = board.players[0];
    board.playerTurn = board.user;

    game = new Game(7, 6);
    game.players = board.players;
}

function mouseClicked() {
    if (!board) return;

    if (board.isMouseOver('pieces') && board.canPlay()) {
        if (!game.isValidPlay(board.selectedColumn)) return;

        const newGameState = game.play(board.selectedColumn, board.user.playerNum);

        board.play(board.selectedColumn, board.user.playerNum);
        board.playerTurn = board.players.find(player => player.playerNum != board.playerTurn.playerNum);
        board.user = board.playerTurn;
    
        if (newGameState.winner || newGameState.tied) {
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
    if (board.isMouseOver() && board.canPlay()) {
        cursor('pointer');
    } else if (board.isMouseOver('restartBtn')) {
        cursor('pointer');
    } else {
        cursor('default');
    }
}

function windowResized() {
    scaleHandler.update(windowWidth * 0.6, windowHeight * 0.6);
    if (board) board.updateScales();
}