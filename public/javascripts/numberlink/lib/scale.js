class Scale {
    constructor(w, h) {
        this.update(w, h);
    }

    getScale() {
        return this.scl;
    }

    update(w, h) {
        resizeCanvas(w, h);
        this.scl = (w + h) * 0.04;
    }
}