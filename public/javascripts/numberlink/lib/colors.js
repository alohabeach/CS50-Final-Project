class Colors {
    constructor() {
        this.colors = [
            color(255, 0, 0),
            color(255, 128, 0),
            color(255, 255, 0),
            color(0, 255, 0),
            color(0, 255, 255),
            color(0, 0, 255),
            color(127, 0, 255),
            color(255, 0, 255),
            color(255, 0, 127),
            color(128, 128, 128),
        ]
    }

    getColorAt(index) {
        return this.colors[index] || color(255);
    }

    isEqual(colorA, colorB) {
        if (!colorA || !colorB) return false;

        for (let i = 0; i < colorA.levels.length; i++) {
            if (colorA._array[i] !== colorB._array[i]) {
                return false;
            }
        }

        return true;
    }
}