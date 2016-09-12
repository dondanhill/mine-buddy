function Grid(w, h, size, context) {
    this.boxes = [];
    this.bombs = [];
    this.flags = 0;
    this.w = w;
    this.h = h;
    this.size = size;
    // generate boxes
    for (let j = 0; j < h; j += 1) {
        for (let i = 0; i < w; i += 1) {
            let box = new Box(i, j, size, context);
            if (Math.random() * 100 > 87) {
                box.hasBomb = true;
                this.bombs.push(box);
            }
            this.boxes.push(box);
        };
    };
    // setup boxes
    for (let i = 0; i < this.boxes.length; i += 1) {
        let cnt = 0;
        let box = this.boxes[i];
        if (!box.hasBomb) {
            let neighbours = [
                i - 1,        // left
                i + 1,        // right 
                i - w - 1,    // above left
                i - w,        // above
                i - w + 1,    // above right
                i + w - 1,    // below left
                i + w,        // below
                i + w + 1     // below right
            ];
            neighbours.forEach(function (x) {
                if (x >= 0 && x < w * h && Math.abs(box.x % w - x % w) <= 1) {
                    if (this.boxes[x].hasBomb) {
                        box.bombs += 1;
                    }
                    box.neighbours.push(this.boxes[x]);
                }
            }, this);
        }
    };

    this.draw = function() {
        this.flags = 0;
        this.boxes.forEach(function(box) {
            box.draw();
        });
    }

    this.clicked = function(x, y) {
        this.getBox(x, y).setClicked();
        this.update();
    }
    this.rightClicked = function(x, y) {
        let box = this.getBox(x, y);
        box.rightClicked();
        this.update();
    }

    this.update = function() {
        let uncovered = 0;
        let flags = 0;
        let bombs = 0;
        this.boxes.forEach(function(box) {
            uncovered += (box.clicked) ? 1 : 0;
            flags += (box.flagged) ? 1 : 0;
            bombs += (box.hasBomb && box.clicked);
        });
        this.flags = flags;
        if (bombs) {
            this.finished = true;
            this.bombs.forEach(function(bomb) {
                bomb.setClicked();
            })
        }
        if (this.boxes.length === uncovered + this.bombs.length) {
            this.finished = true;
        } 
    }

    this.getBox = function(x, y) {
        x = Math.floor(x / size);
        y = Math.floor(y / size);
        return this.boxes[x + y * w];
    }
};
