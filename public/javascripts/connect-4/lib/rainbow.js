class Rainbow {
    constructor() {
        this.r = 255;
        this.g = 0;
        this.b = 0;
    }

    getColor() {
        return color(this.r, this.g, this.b);
    }

    getRed() {
        return this.r;
    }

    getGreen() {
        return this.g;
    }

    getBlue() {
        return this.b;
    }

    update() {
        // fade from red to green
        if (this.r > 0 && this.b == 0) {
            this.r--;
            this.g++;
        }

        // fade from green to blue
        if (this.g > 0 && this.r == 0) {
            this.g--;
            this.b++;
        }

        // fade from blue to red
        if (this.b > 0 && this.g == 0) {
            this.b--;
            this.r++;
        }
    }
}