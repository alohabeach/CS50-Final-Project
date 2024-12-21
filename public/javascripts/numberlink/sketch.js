let scaleHandler;

function setup() {
    createCanvas(windowWidth * 0.6, windowHeight * 0.6, document.getElementById("numberlink"));

    scaleHandler = new Scale(width, height);
}

function draw() {
    background(0);
}

function windowResized() {
    scaleHandler.update(windowWidth * 0.6, windowHeight * 0.6);
}