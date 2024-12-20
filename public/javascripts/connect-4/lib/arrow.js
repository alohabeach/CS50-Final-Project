class Arrow {
    constructor(y, scale_) {
        this.pos = new createVector(mouseX, y);
        this.scale = scale_;
        this.init();
    }

    init() {
        this.a = new createVector();
        this.b = new createVector();
        this.c = new createVector();

        this.setupAnimator();
        this.visible = false;
    }

    setupAnimator() {
        this.animator = 0;
        this.originalY = this.pos.y;
        this.top = this.originalY - this.scale/2;
        this.bottom = this.originalY + this.scale/2;
    }

    animate() {
        this.animator += 0.07;
        this.pos.y = map(sin(this.animator), -1, 1, this.top, this.bottom);
    }

    follow(tx) {
        this.pos.x = lerp(tx, this.pos.x, 0.85);
    }

    calculateVertices() {
        this.a.set(this.pos.x, this.pos.y + this.scale);
        this.b.set(this.pos.x - this.scale, this.pos.y);
        this.c.set(this.pos.x + this.scale, this.pos.y);
    }

    draw() {
        if (!this.visible) return;
        
        this.animate();
        this.calculateVertices();

        push();
        fill(255);
        stroke(0);
        strokeWeight(this.scale*0.121);
        triangle(this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y);
        pop();
    }
}