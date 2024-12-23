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
    if (board) board.updateScales();
}

['mousePressed', 'mouseDragged', 'mouseReleased'].forEach(handler => {
    window[handler] = _ => board[handler]();
});







function displayError(message) {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show');
    alertElement.setAttribute('role', 'alert');
  
    alertElement.innerHTML = `${message} 
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
  
    const container = document.getElementById('error-container');
    container.appendChild(alertElement);

    setTimeout(_ => {
        const closeButton = alertElement.querySelector('.btn-close');
        closeButton.click();
    }, 5000);
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const settings = {
    maxPairsRange: 10,
    preferredPairsRange: false,
};

let debounce;

document.getElementById("saveChanges").addEventListener("click", _ => {
    if (debounce) return;

    for (const documentId in settings) {
        const element = document.getElementById(documentId);
        if (element.disabled) settings[documentId] = false;
        else settings[documentId] = parseInt(element.value);
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('newPuzzleModal'));
    modal.hide();
});

document.getElementById("newPuzzle").addEventListener("click", _ => {
    if (debounce) return;

    const validPuzzle = logic.generateNewPuzzle(settings.maxPairsRange, settings.preferredPairsRange);
    if (!validPuzzle) displayError("Could not generate a valid puzzle.");
    board.updateBoard(logic.unsolvedBoard);
});

document.getElementById("solveButton").addEventListener("click", async _ => {
    if (debounce) return;
    debounce = true;

    board.updateBoard(logic.unsolvedBoard);

    const solutions = logic.getSolution(true);
    if (!solutions) {
        displayError("Could not animate puzzle solution.");
        board.updateBoard(logic.solvedBoard, true);
        debounce = false;
        return;
    }

    for (const solution of solutions) {
        board.updateBoard(solution, true);
        await sleep(75);
    }

    debounce = false;
});