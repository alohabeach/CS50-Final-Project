class EasingStyles {
    constructor() {}

    linear(t) {
        return t;
    }

    easeInQuad(t) {
        return t*t;
    }

    easeOutQuad(t) {
        return t*(2-t);
    }

    easeInOutQuad(t) {
        return t<0.5 ? 2*t*t : -1+(4-2*t)*t;
    }

    easeInCubic(t) {
        return t*t*t;
    }

    easeOutCubic(t) {
        return (--t)*t*t+1;
    }

    easeInOutCubic(t) {
        return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1;
    }

    easeInQuart(t) {
        return t*t*t*t;
    }

    easeOutQuart(t) {
        return 1-(--t)*t*t*t;
    }

    easeInOutQuart(t) {
        return t<0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
    }

    easeInQuint(t) {
        return t*t*t*t*t;
    }

    easeOutQuint(t) {
        return 1+(--t)*t*t*t*t;
    }

    easeInOutQuint(t) {
        return t<0.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t;
    }

    easeInBounce(t) {
        return 1 - this.easeOutBounce(1 - t);
    }

    easeOutBounce(t) {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }

    easeInOutBounce(t) {
        if (t < 0.5) {
            return (1 - this.easeOutBounce(1 - 2 * t)) / 2;
        } else {
            return (1 + this.easeOutBounce(2 * t - 1)) / 2;
        }
    }
}