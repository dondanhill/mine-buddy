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
