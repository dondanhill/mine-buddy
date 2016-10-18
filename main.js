// TODO guaranteed first click empty
// TODO styling 

let startTime;
let timeOutId;
let started = false;
let grid;
let columns = defaultColumns = 20;
let rows = defaultRows = 12;
let maxWidth;

window.onload = () => {
    let canvas = document.getElementById('canvas'),
        newGame = document.getElementById('new-game'),
        context = canvas.getContext('2d'),
        bombsToGo = document.getElementById('total'),
        timer = document.getElementById('time'),
        colInput = document.getElementById('cols'),
        rowInput = document.getElementById('rows');

    colInput.value = columns;
    rowInput.value = rows;
    maxWidth = Math.min(960, window.innerWidth * 0.9);

    canvas.addEventListener('mousedown', event => {
        let now = new Date().valueOf();
        if (!started) {
            startTime = new Date().valueOf();
            timeOutId = setInterval(() => {
                let d = new Date().valueOf();
                timer.innerHTML = Math.floor((d - startTime) / 1000);
            }, 1000); 
            started = true;
        }
        if (!grid.finished) {
            let x = event.offsetX;
            let y = event.offsetY;
            if (event.button === 0) {
                grid.clicked(x, y);
            } else {
                grid.rightClicked(x, y);
            } 
            if (grid.finished) {
                clearTimeout(timeOutId);
                timer.innerHTML = (now - startTime) / 1000;
            }    
        }
        setBombsToGo();  
    });

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault();
        return false;
    });

    newGame.addEventListener('click', () => {
        event.preventDefault();
        started = false;
        timer.innerHTML = 0;
        start();
    });

    start();

    function start() {
        clearTimeout(timeOutId);
        let cols = parseInt(colInput.value);
        let rows = parseInt(rowInput.value);
        grid = new Grid(cols, rows, maxWidth, context);
        grid.draw();
        setBombsToGo();
    };

    function setBombsToGo() {
        bombsToGo.innerHTML = grid.finished ? `finished (${grid.bombs.length})` : grid.getBombsToGo();
    };
};
