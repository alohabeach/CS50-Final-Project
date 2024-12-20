class Button {
    /**
      * Creates a button bozo. and no u can't change the background or text color
      *
      * @param {String} text_ The text that will go in the button
      * @param {Number} textSize_ The font size of the text in the button
      * @param {Number} x The X coordinate of the button
      * @param {Number} y The Y coordinate of the button
      */
    constructor(text_, textSize_, x, y, color_) {
        this.text = text_;
        this.textSize = textSize_
        this.pos = new createVector(x, y);

        color_ = color_ || color(100);
        const r = color_._getRed();
        const g = color_._getGreen();
        const b = color_._getBlue();
        const a = color_._getAlpha();
        this.color = color_;
        this.hoverColor = color(r-20, g-20, b-20, a);
    }

    setText(text_) {
        this.text = text_;
    }

    getTextWidth() {
        textSize(this.textSize);

        return canvas.getContext('2d').measureText(this.text).width;
    }

    isMouseOver() {
        const rectSizes = this.calculateRectSizes();
        const rectWidth = rectSizes[0] / 2;
        const rectHeight = rectSizes[1] / 2;

        const outsideRight = mouseX > (this.pos.x + rectWidth);
        const outsideLeft = mouseX < this.pos.x - rectWidth;
        const outsideTop = mouseY < this.pos.y - rectHeight;
        const outsideBottom = mouseY > this.pos.y + rectHeight;

        return !outsideRight && !outsideLeft && !outsideTop && !outsideBottom;
    }

    calculateRectSizes() {
        const textWidth = this.getTextWidth();

        return [
            textWidth + this.textSize, // rectangle width
            this.textSize * 2,         // rectangle height
            5                          // rectangle corner curve
        ];
    }

    drawRect() {
        fill(this.isMouseOver() ? this.hoverColor : this.color);
        rectMode(CENTER);
        strokeWeight(this.textSize*0.1);
        stroke(0);

        rect(this.pos.x, this.pos.y, ...this.calculateRectSizes());
    }

    drawText() {
        noStroke();
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(this.textSize);

        text(this.text, this.pos.x, this.pos.y);
    }

    draw() {
        this.drawRect();
        this.drawText();
    }
}