// TODO guaranteed first click empty
// TODO user parameter entries
// TODO styling 

var startTime;
var timeOutId;
var started = false;
var grid;

window.onload = function () {
    var canvas = document.getElementById('canvas'),
        newGame = document.getElementById('new-game');
        context = canvas.getContext('2d'),
        width = 0,
        height = 0;
    
    canvas.addEventListener('mousedown', function (event) {
        if (!started) {
            startTime = new Date().valueOf();
            timeOutId = setInterval(function() {
                var d = new Date().valueOf();
                document.getElementById('time').innerHTML = Math.floor((d - startTime) / 1000);
                console.log(d);
            }, 1000); 
            started = true;
        }
        if (!grid.finished) {
            if (event.button === 0) {
                grid.clicked(event.clientX, event.clientY);
            } else {
                grid.rightClicked(event.clientX, event.clientY);
            } 
            if (grid.finished) {
                var d = new Date().valueOf();
                clearTimeout(timeOutId);
                document.getElementById('time').innerHTML = (d - startTime) / 1000;
            }    
        }
        document.getElementById('bombs').innerHTML = grid.flags;
        document.getElementById('total').innerHTML = grid.bombs.length; 
    });
    canvas.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        return false;
    });

    newGame.addEventListener('click', function() {
        event.preventDefault();
        started = false;
        document.getElementById('time').innerHTML = 0;
        start();
    })

    start();
    // begin
    function start() {
        grid = new Grid(9, 9, 35, context);
        width = canvas.width = grid.w * grid.size;
        height = canvas.height = grid.h * grid.size;
        grid.draw();
    }
};

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

function Box(x, y, size, context) {
    this.neighbours = [];
    this.x = x;
    this.y = y;
    this.size = size;
    this.hasBomb = false;
    this.bombs = 0;
    this.clicked = false;
    this.highlighted = false;
    this.flagged = false;

    this.draw = function() {
        context.beginPath();
        context.rect(this.x * this.size, this.y * this.size, this.size, this.size);
        if (this.clicked) {
            if (this.hasBomb) {
                context.fillStyle = "#FF5555";
            } else {
                context.fillStyle = "#FFFFFF";
            }
            context.font = '18px "Droid Sans Mono"';
            context.textAlign = 'left';
            context.fill();
            if (!this.hasBomb && this.bombs) {
                context.fillStyle = 'rgb(' + Math.floor(255-42.5*this.bombs) + ',0,0)';
                context.fillText(this.bombs, this.x * this.size + this.size / 3, this.y * this.size + this.size / 1.4);
            }
        } else {
            context.strokeStyle = "#444444";
            if(this.highlighted) {
                context.fillStyle = "#DDDDFF";
            } 
            else if(this.flagged) {
                context.fillStyle = "#55FF55";
            }
            else {
                context.fillStyle = "#5555FF";
            }
            context.fill();
        }
        context.stroke();
    }

    this.setClicked = function() {
        if (!this.clicked) {
            if(!this.flagged) {
                this.clicked = true;
                if (!this.bombs) {
                    this.neighbours.forEach(function(neighbour) {
                        neighbour.setClicked();
                    });
                }
                this.draw();
            }
        } else {
            this.clearNeighbours();
        }
    }

    this.rightClicked = function() {
        if (this.clicked) {
            this.clearNeighbours();
        } else {
            this.flagged = !this.flagged;
            this.wrong = this.flagged && !this.hasBomb;
            this.draw();
        }
    }

    this.clearNeighbours = function() {
        let flags = this.neighbours.filter(function(neighbour) {
            return neighbour.flagged;
        });
        if (flags.length && flags.length === this.bombs) {
            this.neighbours.forEach(function(neighbour) {
                if(!neighbour.clicked && !neighbour.flagged) {
                    neighbour.setClicked();
                }
            });
        }
    }
};
