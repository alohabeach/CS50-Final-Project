class Piece {
    constructor(x, y, diameter, type) {
        this.pos = new createVector(x, y);
        this.diameter = diameter;
        this.radius = diameter / 2;
        this.type = type;
        this.easing = new EasingStyles();
    }

    isMouseOver() {
        return dist(mouseX, mouseY, this.pos.x, this.pos.y) < this.radius;
    }

    animStart(startPos, endPos, speed) {
        this.animating = true;
        this.animFrame = 0;
        this.animSpeed = speed;
        this.animStartPos = startPos;
        this.animEndPos = endPos;
    }

    animEnd() {
        this.animating = false;
        this.pos = this.animEndPos;
    }

    animStep() {
        if (this.animFrame < 100) {
            this.animFrame += this.animSpeed;

            const easeResult = this.easing.easeOutBounce(this.animFrame / 100);
            const sx = this.animStartPos.x;
            const sy = this.animStartPos.y;
            const tx = this.animEndPos.x;
            const ty = this.animEndPos.y;

            this.pos.x = map(easeResult, 0, 1, sx, tx);
            this.pos.y = map(easeResult, 0, 1, sy, ty);
        } else {
            this.animEnd();
        }
    }

    updateColors() {
        this.color = [color(0, 50, 200), color(251, 200, 2), color(207, 36, 52)][this.type];
        if (this.justWent) {
            const r = this.color._getRed();
            const g = this.color._getGreen();
            const b = this.color._getBlue();
            const brightness = map(sin(frameCount/10), -1, 1, 0, 50);
            this.color = color(r + brightness, g + brightness, b + brightness);
        }
    }

    draw() {
        this.updateColors();

        if (this.animating) {
            this.animStep();
        }

        push();
        fill(this.color);
        stroke(0);
        strokeWeight(this.diameter*0.043);
        ellipseMode(CENTER);
        ellipse(this.pos.x, this.pos.y, this.diameter);
        pop();
    }
}