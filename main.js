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
