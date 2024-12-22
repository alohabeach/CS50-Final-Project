let scaleHandler, board, logic;

function setup() {
    createCanvas(windowWidth * 0.6, windowHeight * 0.6, document.getElementById("numberlink"));

    logic = new NumberlinkPuzzle(7);
    logic.generateNewPuzzle(10, 10);

    scaleHandler = new Scale(width, height);
    board = new DrawNumberlink(logic.unsolvedBoard, scaleHandler, new createVector(width / 2, height / 2));
}

function draw() {
    background(29, 99, 240);
    board.draw();
}

function windowResized() {
    scaleHandler.update(windowWidth * 0.6, windowHeight * 0.6);
}

['mousePressed', 'mouseDragged', 'mouseReleased'].forEach(handler => {
    window[handler] = _ => board[handler]();
});