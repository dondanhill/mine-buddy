function Grid(cols, rows, width, context) {
    this.boxes = [];
    this.bombs = [];
    this.flags = 0;
    this.cols = cols;
    this.rows = rows;
    this.size = Math.min(Math.max(width, context.canvas.width) / cols, 50);
    // generate boxes
    for (let j = 0; j < rows; j += 1) {
        for (let i = 0; i < cols; i += 1) {
            let box = new Box(i, j, this.size, context);
            if (Math.random() * 17 > 14) {
                box.hasBomb = true;
                this.bombs.push(box);
            }
            this.boxes.push(box);
        };
    };
    // setup boxes
    this.boxes.forEach((box, i) => {
        if (!box.hasBomb) {
            let neighboursIndices = [
                i - 1,        // left
                i + 1,        // right 
                i - cols - 1, // above left
                i - cols,     // above
                i - cols + 1, // above right
                i + cols - 1, // below left
                i + cols,     // below
                i + cols + 1  // below right
            ];
            neighboursIndices.forEach(index => {
                let validIndex = 
                    index >= 0 && 
                    index < this.boxes.length && 
                    Math.abs(box.x % cols - index % cols) <= 1; // <= left and right edge cases

                if (validIndex) {
                    if (this.boxes[index].hasBomb) {
                        box.bombs += 1;
                    }
                    box.neighbours.push(this.boxes[index]);
                }
            });
        }
    });

    this.draw = () => {
        this.flags = 0;
        context.beginPath();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.canvas.width = this.cols * this.size + 1;
        context.canvas.height = this.rows * this.size + 1;
        this.boxes.forEach(box => box.draw());
    }

    this.clicked = (x, y) => {
        this.getBox(x, y).setClicked();
        this.update();
    }

    this.rightClicked = (x, y) => {
        this.getBox(x, y).rightClicked();
        this.update();
    }

    this.update = () => {
        let uncovered = 0;
        let flags = 0;
        let gameOver = false;
        this.boxes.forEach(box => {
            uncovered += (box.clicked) ? 1 : 0;
            flags += (box.flagged) ? 1 : 0;
            gameOver = (box.hasBomb && box.clicked) || gameOver;
        });
        this.flags = flags;
        if (gameOver) {
            this.finished = true;
            this.bombs.forEach(bomb => bomb.setClicked());
        }
        if (this.boxes.length === uncovered + this.bombs.length) {
            this.finished = true;
        } 
    }

    this.getBox = (x, y) => {
        x = Math.floor(x / this.size);
        y = Math.floor(y / this.size);
        return this.boxes[x + y * cols];
    }

    this.getBombsToGo = () => {
        return this.bombs.length - this.flags;
    }
};