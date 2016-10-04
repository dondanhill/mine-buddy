function Box(x, y, size, context) {
    this.neighbours = [];
    this.x = x;
    this.y = y;
    this.size = size;
    this.hasBomb = false;
    this.bombs = 0;
    this.clicked = false;
    this.flagged = false;

    this.draw = function() {
        context.beginPath();
        context.clearRect(this.x * this.size, this.y * this.size, this.size, this.size);
        if (this.clicked) {
            this.fillBox("#FFFFFF");
            if (this.hasBomb) {
                this.fillBox('#FF8888')
                this.drawBomb();
            }
            if (!this.hasBomb && this.bombs) {
                context.font = "18px sans-serif";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = "#333333";
                context.fillText(this.bombs, this.x * this.size + this.size / 2, this.y * this.size + this.size / 2);
            }
        } else {
            if(this.flagged) {
                this.fillBox('#88FF88');
                this.drawFlag();
            } else {
                this.fillBox('#8888FF');
            }
        }
        
    };

    this.setClicked = function() {
        console.log(this)
        if (!this.clicked && !this.flagged) {
            this.clicked = true;
            if (!this.bombs) {
                this.neighbours.forEach(function(neighbour) {
                    neighbour.setClicked();
                });
            }
            this.draw();
        } else {
            this.clearNeighbours();
        }
    };

    this.rightClicked = function() {
        if (this.clicked) {
            this.clearNeighbours();
        } else {
            this.flagged = !this.flagged;
            this.draw();
        }
    };

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
    };

    this.drawFlag = function() {
        context.beginPath();
        context.moveTo(this.x * this.size + this.size * 0.3, this.y * this.size + this.size * 0.75);
        context.lineTo(this.x * this.size + this.size * 0.3, this.y * this.size + this.size * 0.25);
        context.lineTo(this.x * this.size + this.size * 0.7, this.y * this.size + this.size * 0.4);
        context.lineTo(this.x * this.size + this.size * 0.3, this.y * this.size + this.size * 0.6);
        context.stroke();
    };

    this.drawBomb = function() {
        context.beginPath();
        context.fillStyle = '#333333';
        context.moveTo(this.x * this.size + this.size * 0.5, this.y * this.size + this.size * 0.5);
        context.arc(
            this.x * this.size + this.size * 0.5, 
            this.y * this.size + this.size * 0.5, 
            this.size * 0.16, 0, 2 * Math.PI);
        context.fill();        
    }

    this.fillBox = style => {
        context.beginPath();
        context.fillStyle = style;
        context.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
        context.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
    }
};
