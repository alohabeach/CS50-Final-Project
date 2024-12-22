class DrawNumberlink {
    constructor(numberlinkBoard, scaleHandler, rootPos) {
        this.numberlinkBoard = numberlinkBoard;
        this.scaleHandler = scaleHandler;
        this.scale = scaleHandler.getScale();
        this.rootPos = rootPos;

        this.init();
    }

    init() {
        this.updateScales();
        this.colors = new Colors();

        for (let column = 0; column < this.numberlinkBoard.length; column++) {
            for (let row = 0; row < this.numberlinkBoard[column].length; row++) {
                const currentValue = this.numberlinkBoard[column][row];

                this.numberlinkBoard[column][row] = {
                    value: currentValue,
                    currentColor: currentValue !== null ? this.colors.getColorAt(currentValue - 1) : color(255),
                    isBaseNumber: currentValue !== null,
                    position: { column, row },
                };
            }
        }
    }

    updateScales() {
        this.scale = this.scaleHandler.getScale();
        this.rootPos.set(width / 2, height / 2);

        this.cellSize = (this.numberlinkBoard.length * this.scale) / this.numberlinkBoard.length;
        this.gridSize = this.numberlinkBoard.length * this.cellSize
    }

    updateBoard(newBoard) {
        this.numberlinkBoard = newBoard;
        this.init();
    }

    getSelectionAtMouse() {
        const offsetX = this.rootPos.x - this.gridSize / 2;
        const offsetY = this.rootPos.y - this.gridSize / 2;

        const adjustedMouseX = mouseX - offsetX;
        const adjustedMouseY = mouseY - offsetY;

        const column = Math.floor(adjustedMouseX / this.cellSize);
        const row = Math.floor(adjustedMouseY / this.cellSize);

        if (column >= 0 && column < this.numberlinkBoard.length &&
            row >= 0 && row < this.numberlinkBoard.length) {
            return {
                column,
                row,
                cell: this.numberlinkBoard[column][row],
            };
        }
    }

    getNeighbors(cell) {
        const neighbors = [];
        const directions = [
            [1, 0],   // Right
            [0, 1],   // Down
            [-1, 0],  // Left
            [0, -1],  // Up
        ];

        for (const direction of directions) {
            const column = cell.position.column + direction[0];
            const row = cell.position.row + direction[1];
            if (column < 0 || column >= this.numberlinkBoard.length || row < 0 || row >= this.numberlinkBoard.length) {
                continue;
            }

            const neighborCell = this.numberlinkBoard[column][row];
            if (!this.colors.isEqual(neighborCell.currentColor, cell.currentColor)) {
                continue;
            }

            neighbors.push(neighborCell);
        }

        return neighbors;
    }

    getLinks(selectedCell, visited = new Set()) {
        const links = [];
        const cellKey = `${selectedCell.position.column},${selectedCell.position.row}`;
        if (visited.has(cellKey)) return links;

        visited.add(cellKey);

        const neighbors = this.getNeighbors(selectedCell);

        for (const neighbor of neighbors) {
            const neighborKey = `${neighbor.position.column},${neighbor.position.row}`;

            if (!visited.has(neighborKey)) {
                links.push(neighbor);
                links.push(...this.getLinks(neighbor, visited));
            }
        }

        return links;
    }

    hasLinkWithBlacklist(selection, blacklistPosition) {
        const links = this.getLinks(selection.cell);

        for (const cell of links) {
            if (
                cell.position.column !== blacklistPosition.column ||
                cell.position.row !== blacklistPosition.row
            ) {
                return true;
            }
        }

        return false;
    }

    removeStrandedCells() {
        for (let column = 0; column < this.numberlinkBoard.length; column++) {
            for (let row = 0; row < this.numberlinkBoard[column].length; row++) {
                const cell = this.numberlinkBoard[column][row];
                if (cell.isBaseNumber) continue;

                const links = this.getLinks(cell);
                const hasValidBaseLink = links.some(link => link.isBaseNumber && this.colors.isEqual(link.currentColor, cell.currentColor));

                if (!hasValidBaseLink) {
                    cell.currentColor = color(255);
                }
            }
        }
    }

    mousePressed() {
        const selection = this.getSelectionAtMouse();
        if (!selection) return;
        if (!selection.cell.isBaseNumber && this.colors.isEqual(selection.cell.currentColor, color(255))) return;

        this.startDrag = selection;
        this.lastDrag = selection;
    }

    mouseReleased() {
        this.startDrag = null;
        this.lastDrag = null;

        this.removeStrandedCells();
    }

    mouseDragged() {
        if (!this.startDrag) return;

        const currentDrag = this.getSelectionAtMouse();
        if (!currentDrag) return;

        const { column, row, cell } = currentDrag;
        const { column: lastColumn, row: lastRow, cell: lastCell } = this.lastDrag;
        const { column: startColumn, row: startRow, cell: startCell } = this.startDrag;

        const validColumnTravel = Math.abs(column - lastColumn) == 1;
        const validRowTravel = Math.abs(row - lastRow) === 1;

        if (validColumnTravel === validRowTravel) return;

        if (cell.isBaseNumber && !this.colors.isEqual(lastCell.currentColor, cell.currentColor)) {
            this.startDrag = null;
            this.lastDrag = null;

            return;
        }

        const isCurrentCellEmpty = !this.colors.isEqual(cell.currentColor, lastCell.currentColor);
        const isLastCellEmpty = this.colors.isEqual(lastCell.currentColor, color(255));

        if (isCurrentCellEmpty) { // drag forward
            const links = this.getNeighbors(lastCell);
            if (links.length >= (lastCell.isBaseNumber ? 1 : 2)) {
                this.lastDrag = currentDrag;
                return;
            }

            cell.currentColor = lastCell.currentColor;
        } else if (!isLastCellEmpty) { // drag back
            // check if dragging from base and theres already a link then remove it
            if (lastCell.isBaseNumber) {
                if (this.hasLinkWithBlacklist(currentDrag, lastCell.position)) cell.currentColor = color(255);

                this.lastDrag = currentDrag;
                return;
            }

            // check if dragged into a base number or came from one
            if (cell.isBaseNumber) {
                if (this.hasLinkWithBlacklist(this.lastDrag, { column, row })) {
                    this.lastDrag = currentDrag;
                    return;
                }

                this.startDrag = currentDrag;
            }

            const links = this.getLinks(cell);
            const baseNumberLinks = links.filter(link => link.isBaseNumber && this.colors.isEqual(link.currentColor, cell.currentColor));

            // check if dragged into the same color and that there are 2 base numbers linked
            if (this.colors.isEqual(cell.currentColor, lastCell.currentColor) && baseNumberLinks.length === 2) {
                this.lastDrag = currentDrag;
                return;
            }

            lastCell.currentColor = color(255);
        }

        this.lastDrag = currentDrag;
        this.removeStrandedCells();
    }

    draw() {
        push()
        const offsetX = this.rootPos.x - this.gridSize / 2;
        const offsetY = this.rootPos.y - this.gridSize / 2;

        for (let column = 0; column < this.numberlinkBoard.length; column++) {
            for (let row = 0; row < this.numberlinkBoard.length; row++) {
                const xPosition = column * this.cellSize + offsetX;
                const yPosition = row * this.cellSize + offsetY;
                const cell = this.numberlinkBoard[column][row];

                fill(cell.currentColor);
                square(xPosition, yPosition, this.cellSize);

                if (cell.isBaseNumber) {
                    const textOffset = this.cellSize / 2;

                    fill(0);
                    textAlign(CENTER, CENTER);
                    textSize(textOffset);
                    text(`${cell.value}`, xPosition + textOffset, yPosition + textOffset);
                }
            }
        }
        pop();
    }
}