class AI {
    constructor(board) {
        this.board = board;
        this.ON = false;
    }

    set(toggle) {
        this.ON = toggle;
    }

    run(delay) {
        if (!this.ON || board.debounce) return;

        board.debounce = true;

        setTimeout(() => {
            board.debounce = false;
            if (board.gameOver) return;

            board.addPiece(board.displayPiece.type, Math.floor(random(0, board.columns)));
        }, delay);
    }
}