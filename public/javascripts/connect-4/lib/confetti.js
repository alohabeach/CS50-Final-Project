class Confetti {
    constructor(x, y, scl, col) {
        this.pos = new createVector(x, y);
        this.scale = scl;
        this.color = col;
        this.init();
    }

    init() {
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(0.5, 2));
        this.gravity = new createVector(0, 0.09);
        this.randomDeg = random(0, 360);
        this.lifetime = 255;
    }

    update() {
        this.vel.add(this.gravity);
        this.pos.add(this.vel);
        this.lifetime -= 5;
    }

    draw() {
        this.update();
        push();
        noStroke();
        fill(this.color._getRed(), this.color._getGreen(), this.color._getBlue(), this.lifetime);
        translate(this.pos.x, this.pos.y);
        rotate(this.randomDeg);
        rectMode(CENTER);
        rect(0, 0, this.scale*2, this.scale);
        pop();
    }
}

class ConfettiEmitter {
    constructor(x, y) {
        this.pos = new createVector(x, y);
        this.init();
    }

    init() {
        this.particles = [];
        this.rainbow = new Rainbow();
    }

    setPos(x, y) {
        this.pos.set(x, y);
    }

    emit(amount, scl) {
        const x = this.pos.x;
        const y = this.pos.y;
        const col = this.rainbow.getColor();

        for (let i = 0; i < amount; i++) {
            this.particles.push(new Confetti(x, y, scl, col));
        }
    }

    update() {
        this.rainbow.update();
        for (const i in this.particles) {
            const particle = this.particles[i];
            if (particle.lifetime > 0) {
                particle.draw();
            } else {
                this.particles.splice(i, 1);
            }
        }
    }
}