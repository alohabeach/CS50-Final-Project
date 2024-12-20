class Board {
    constructor(columns, rows, scaleHandler, rootPos, gameState) {
        this.columns = columns;
        this.rows = rows;
        this.scaleHandler = scaleHandler;
        this.scale = scaleHandler.getScale();
        this.rootPos = rootPos;
        this.gameState = gameState;
        this.waitingForPlayers = gameState.waitingForPlayers;

        this.init();
    }

    init() {
        this.updateScales();
        this.easing = new EasingStyles();
    }

    makeOtherDraws() {
        const btnX = this.sides.bottom.x - this.scale * 4.2;
        const btnY = this.sides.bottom.y + this.scale * 0.8;
        this.restartBtn = new Button('Restart', this.scale * 0.3, btnX, btnY, color(0, 70, 240));
        this.arrow = new Arrow(this.sides.top.y - this.scale / 2, this.scale * 0.3);
    }

    updateScales() {
        this.scale = this.scaleHandler.getScale();
        this.rootPos.set(width/2, height/2);

        this.boardWidth = this.columns * this.scale;
        this.boardHeight = this.rows * this.scale;
        this.pieceScale = this.scale * 0.85;

        this.sides = {
            left: new createVector(this.rootPos.x - this.boardWidth / 2, this.rootPos.y),
            top: new createVector(this.rootPos.x, this.rootPos.y - this.boardHeight / 2),
            right: new createVector(this.rootPos.x + this.rootPos.y, this.rootPos.y),
            bottom: new createVector(this.rootPos.x, this.rootPos.y + this.boardHeight / 2)
        };

        this.corners = {
            a: new createVector(this.rootPos.x - this.boardWidth / 2, this.rootPos.y - this.boardHeight / 2), // top left
            b: new createVector(this.rootPos.x + this.boardWidth / 2, this.rootPos.y - this.boardHeight / 2), // top right
            c: new createVector(this.rootPos.x + this.boardWidth / 2, this.rootPos.y + this.boardHeight / 2), // bottom right
            d: new createVector(this.rootPos.x - this.boardWidth / 2, this.rootPos.y + this.boardHeight / 2) // bottom left
        };

        this.makeOtherDraws();
        this.makeAllPieces();
    }

    makeAllPieces() {
        this.fillPieces = Array(this.columns).fill().map(_ => Array(this.rows));

        for (let column = 0; column <= this.columns - 1; column++) {
            for (let row = 0; row <= this.rows - 1; row++) {
                const sizeOffset = this.scale / 2;
                const offset = new createVector(this.sides.left.x, this.sides.top.y)
                const x = column * this.scale + sizeOffset + offset.x;
                const y = row * this.scale + sizeOffset + offset.y;
                let piece = this.gameState.pieces[column][row];
                if (typeof piece != 'number') piece = piece.type;

                this.fillPieces[column][row] = new Piece(x, y, this.pieceScale, 0);
                this.gameState.pieces[column][row] = new Piece(x, y, this.pieceScale, piece);
            }
        }
    }

    removeLastWent() {
        this.gameState.pieces.forEach(column => {
            column.forEach(piece => piece.justWent = false);
        });
    }

    canPlay() {
        return this.user.type != 'spectators' && !this.waitingForPlayers && this.playerTurn.playerNum == this.user.playerNum;
    }

    play(col, playerNum) {
        this.removeLastWent();
        const column = this.gameState.pieces[col];
        for (let row = column.length - 1; row >= 0; row--) {
            const piece = column[row];
            if (piece.type == 0) {
                const currPos = new createVector(piece.pos.x, this.sides.top.y);
                const endPos = this.fillPieces[col][row].pos;
                piece.animStart(currPos, endPos, 1.2);
                piece.justWent = true;
                column[row].type = playerNum;
                break;
            }
        }
    }

    isMouseOver(specific) {
        const hoverable = {};

        hoverable.restartBtn = this.singlePlayer && this.restartBtn.isMouseOver();
        this.fillPieces.forEach(column => {
            column.forEach(piece => {
                if (piece.isMouseOver()) {
                    hoverable.pieces = true;
                    return;
                }
            })
        });

        if (specific) {
            return hoverable[specific];
        } else {
            for (const i in hoverable) {
                if (hoverable[i]) return true;
            }
        }
    }

    drawBorders() {
        push();
        fill(29, 99, 240);
        stroke(0);
        strokeWeight(this.scale*0.03);
        beginShape(QUADS);
        vertex(this.corners.a.x, this.corners.a.y); // top left
        vertex(this.corners.b.x, this.corners.b.y); // top right
        vertex(this.corners.c.x, this.corners.c.y); // bottom right
        vertex(this.corners.d.x, this.corners.d.y); // bottom left
        endShape();
        pop();
    }

    drawAllPieces() {
        this.fillPieces.forEach(columns => columns.forEach(piece => piece.draw()));
        this.gameState.pieces.forEach(columns => columns.forEach(piece => piece.draw()));
    }

    drawTurnDisplay() {
        const textY = this.sides.bottom.y + this.scale*0.5;
        const pieceY = this.sides.bottom.y + this.scale*1.1;
        const center = this.sides.bottom.x;
        const left = center - this.scale*2.2;
        const right = center + this.scale*2.2;
        
        push();
        fill(255);
        stroke(0);
        strokeWeight(0);
        textSize(this.scale*0.3);
        textAlign(CENTER, CENTER);

        if (this.gameOverState) {
            if (this.gameOverState.winner) {
                text(`${this.gameOverState.winner.username} Won!`, center, this.sides.top.y - this.scale*0.8);
            } else if (this.gameOverState.tie) {
                text('Tie!', center, this.sides.top.y - this.scale*0.8);
            }
        } else {
            text(`${this.playerTurn.username}\'s Turn`, center, this.sides.top.y - this.scale*0.8);
        }

        const player1 = this.players[0];
        const player2 = this.players[1];
        
        text(`${player1.username}\n${player1.points} Win${player1.points == 1 ? '' : 's'}`, left, textY);
        text('vs', center, textY);
        text(`${player2.username}\n${player2.points} Win${player2.points == 1 ? '' : 's'}`, right, textY);
        
        ellipseMode(CENTER);
        strokeWeight(this.scale*0.03);
        fill(251, 200, 2);
        ellipse(left, pieceY, this.pieceScale/2);
        fill(207, 36, 52);
        ellipse(right, pieceY, this.pieceScale/2);
        pop();
    }

    gameOver(gameOverState) {
        if (gameOverState.winner) this.players[gameOverState.winner.playerNum - 1].points++;

        this.gameOverAnimFrame = 0;
        this.gameOverAnimEnd = 100;
        this.gameOverAnimSpeed = 1.2;
        this.gameOverState = gameOverState;
    }

    animateGameOver() {
        let a, b;
        for (const column in this.gameState.pieces) {
            for (const row in this.gameState.pieces[column]) {
                const fillPiece = this.fillPieces[column][row];
                const fourInARow = this.gameOverState.fourInARow;
                if (fourInARow.a[0] == column && fourInARow.a[1] == row) {
                    a = fillPiece.pos;
                } else if (fourInARow.b[0] == column && fourInARow.b[1] == row) {
                    b = fillPiece.pos;
                }
            }
        }

        push();
        stroke(0, 25, 175);
        strokeWeight(this.scale*0.05);
        if (this.gameOverAnimFrame < this.gameOverAnimEnd) {
            this.gameOverAnimFrame += this.gameOverAnimSpeed;
            const easeResult = this.easing.easeOutQuad(this.gameOverAnimFrame / this.gameOverAnimEnd);
            line(a.x, a.y, map(easeResult, 0, 1, a.x, b.x), map(easeResult, 0, 1, a.y, b.y));
        } else {
            line(a.x, a.y, b.x, b.y);
        }
        pop();
    }

    drawOthers() {
        if (this.gameOverState && this.gameOverState.fourInARow) this.animateGameOver();
        this.drawTurnDisplay();
        if (this.singlePlayer) this.restartBtn.draw();

        this.arrow.visible = this.canPlay();
        const sizeOffset = this.scale / 2;
        const posOffset = this.sides.left.x;
        this.arrow.follow((this.selectedColumn) * this.scale + sizeOffset + posOffset);
        this.arrow.draw();
    }

    clamp(value, minimum, maximum) {
        return min(max(value, minimum), maximum);
    }

    updateSelectedColumn() {
        const posOffset = this.sides.left.x;
        const column = floor((mouseX - posOffset) / this.scale);
        this.selectedColumn = this.clamp(column, 0, this.columns - 1);
    }

    draw() {
        this.updateSelectedColumn();

        this.drawBorders();
        this.drawAllPieces();
        this.drawOthers();
    }
}