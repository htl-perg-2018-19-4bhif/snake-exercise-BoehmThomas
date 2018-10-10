var keypress = require('keypress');
var ansi = require('ansi');

var cursor = ansi(process.stdout);
var posX = 0;
var posY = 0;
var dirX = 0;
var dirY = 0;
var appleX = 0;
var appleY = 0;
var width = 30;
var height = 15;
var points = 0;
var speed = 2;

keypress(process.stdin);
process.stdin.setRawMode(true);
process.stdin.resume();


try {
    process.stdout.write('\x1Bc');
    process.stdout.write('\x1B[?25l');

    cursor.bg.white();

    drawHoriz(1, 1, width);
    drawHoriz(1, height, width);

    drawVert(1, 1, height);
    drawVert(width, 1, height);

    cursor.bg.reset();

    process.stdin.on('keypress', keyInput);

    posX = Math.floor(width / 2);
    posY = Math.floor(height / 2);

    drawApple();
    game();

} catch (ex) {
    console.log(ex);
    closeGame();
}


function closeGame() {
    cursor.reset();
    cursor.bg.reset();
    process.stdout.write('\x1B[?25h');
    cursor.goto(1, height + 4);
    process.exit();
}


function game() {
    delSnake(posX, posY);

    posX = posX + dirX;
    posY = posY + dirY;

    if (posX == 1 || posX == width || posY == 1 || posY == height) {
        cursor.red();
        cursor.goto(width + 10, height / 2).write("Game over");
        cursor.goto(width + 10, height / 2 + 2).write('Points: ' + points.toString());
        closeGame();
    }

    if (posX == appleX && posY == appleY) {
        points++;
        if (speed < 25) {
            speed++;
        }
        drawApple();
    }

    drawSnake();
    setTimeout(game, 1000 / speed);
}


function keyInput(chunk, key) {
    switch (key.name) {
        case 'c':
            closeGame();
            break;
        case 'left':
            dirX = -1;
            dirY = 0;
            break;
        case 'right':
            dirX = 1;
            dirY = 0;
            break;
        case 'up':
            dirX = 0;
            dirY = -1;
            break;
        case 'down':
            dirX = 0;
            dirY = 1;
            break;
    }

}


function drawApple() {
    appleX = Math.ceil(Math.random() * (width - 2)) + 1;
    appleY = Math.ceil(Math.random() * (height - 2)) + 1;

    cursor.bg.red();
    cursor.goto(appleX, appleY).write(' ');
    cursor.bg.reset();

    cursor.goto(1, height + 2).write('Points: ' + points.toString());
    cursor.goto(1, height + 3).write('Speed: ' + speed.toString());
}

function drawSnake() {
    cursor.bg.green();
    cursor.goto(posX, posY).write(' ');
    cursor.bg.reset();
}

function drawHoriz(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col + i, row).write(' ');
    }
}

function drawVert(col, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(col, row + i).write(' ');
    }
}

function delSnake() {
    cursor.bg.black();
    cursor.goto(posX, posY).write(' ');
    cursor.bg.reset();
}
