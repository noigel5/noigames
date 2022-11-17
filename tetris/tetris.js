const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const tetrisboard = document.getElementById("board");
const tetrisboard_ctx = tetrisboard.getContext("2d");

const nextboard = document.getElementById("next");
const nextboard_ctx = nextboard.getContext("2d");

tetrisboard_ctx.canvas.width = COLS * BLOCK_SIZE;
tetrisboard_ctx.canvas.height = ROWS * BLOCK_SIZE;

nextboard_ctx.canvas.width = 6 * BLOCK_SIZE;
nextboard_ctx.canvas.height = 6 * BLOCK_SIZE;

tetrisboard_ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
nextboard_ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

const KEY = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    SPACE: 'Space',
    UP: 'ArrowUp'
}
Object.freeze(KEY);

const moves = {
    [KEY.LEFT]: p => ({...p, x: p.x - 1}),
    [KEY.RIGHT]: p => ({...p, x: p.x + 1}),
    [KEY.DOWN]: p => ({...p, y: p.y + 1}),
    [KEY.SPACE]: p => ({...p, y: p.y + 1}),
    [KEY.UP]: p => ({...p})
};

let lines = 0;
let clearedLines = 0;
let points = 0;

const POINTS = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 800,
    SOFT_DROP: 1,
    HARD_DROP: 15
}
Object.freeze(POINTS);

const LEVEL = {
    0: 1000,
    1: 900,
    2: 800,
    3: 700,
    4: 600,
    5: 500
}
Object.freeze(LEVEL);

time = {start: 0, elapsed: 0, level: LEVEL["0"]};

function refreshBoard() {
    tetrisboard_ctx.clearRect(0, 0, tetrisboard_ctx.canvas.width, tetrisboard_ctx.canvas.height);
    board.drawBoard();
}

document.addEventListener('keydown', event => {
    if (moves[event.code]) {
        event.preventDefault();

        let p = moves[event.code](board.piece);

        if (event.code === KEY.UP) {
            board.piece.rotate();
        }

        if (board.valid(p)) {
            if (event.code === KEY.SPACE) {
                while (board.valid(p)) {
                    board.piece.move(p);
                    p = moves[KEY.DOWN](board.piece);
                }
                board.piece.freeze();
                clearLine();
                refreshBoard();
                drawPiece();
                points += POINTS.HARD_DROP;
                document.getElementById("score").innerHTML = points;
            } else {
                board.piece.move(p);
                refreshBoard();
                board.piece.draw();
                if (event.code === KEY.DOWN) {
                    points += POINTS.SOFT_DROP;
                    document.getElementById("score").innerHTML = points;
                }
            }
        } else {
            if (event.code === KEY.UP) {
                board.piece.rotate();
                board.piece.rotate();
                board.piece.rotate();
            }
        }
    }
});

class Board {

    isEmpty(value) {
        return value <= 0;
    }

    insideWalls(x) {
        return !(x > 9 || x < 0);
    }

    aboveFloor(y) {
        return y <= 19;
    }

    reset() {
        this.grid = this.getEmptyBoard();
    }

    getEmptyBoard() {
        return Array.from(
            {length: ROWS}, () => Array(COLS).fill(0)
        );
    }

    valid(p) {
        return p.SHAPES[board.piece.typeId].every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return (
                    this.isEmpty(value) ||
                    (this.insideWalls(x) &&
                        this.aboveFloor(y) && board.grid[y][x] === 0
                    )
                );
            });
        });
    }

    drawBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    tetrisboard_ctx.fillStyle = board.piece.COLORS[value - 1];
                    tetrisboard_ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }
}

class Piece {
    typeId = 0;
    constructor(ctx) {
        this.ctx = ctx;
        this.COLORS = [
            'cyan',
            'blue',
            'orange',
            'yellow',
            'green',
            'purple',
            'red'
        ];
        this.SHAPES = [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [2, 0, 0],
                [2, 2, 2],
                [0, 0, 0]
            ],
            [
                [0, 0, 3],
                [3, 3, 3],
                [0, 0, 0]
            ],
            [
                [4, 4],
                [4, 4]
            ],
            [
                [0, 5, 5],
                [5, 5, 0],
                [0, 0, 0]
            ],
            [
                [0, 6, 0],
                [6, 6, 6],
                [0, 0, 0]
            ],
            [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ]
        ];

        this.x = 3;
        this.y = 0;
    }

    randomizeTetrominoType(noOfTypes) {
        return Math.floor(Math.random() * noOfTypes);
    }

    draw() {
        this.ctx.fillStyle = this.COLORS[this.typeId];
        this.SHAPES[this.typeId].forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }

    move(p) {
        this.x = p.x;
        this.y = p.y;
    }

    rotate() {
        for (let y = 0; y < this.SHAPES[this.typeId].length; ++y) {
            for (let x = 0; x < y; ++x) {
                [this.SHAPES[this.typeId][x][y], this.SHAPES[this.typeId][y][x]] = [this.SHAPES[this.typeId][y][x], this.SHAPES[this.typeId][x][y]];
            }
        }

        this.SHAPES[this.typeId].forEach(row => row.reverse());

        return this;
    }

    freeze() {
        this.SHAPES[this.typeId].forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    board.grid[y + this.y][x + this.x] = value;
                }
            });
        });
    }
}
let board = new Board();

function resetHighscore() {
    window.localStorage.removeItem(TETRISHIGHSCORE_KEY);
    document.getElementById('record').innerHTML = 0;
}

const TETRISHIGHSCORE_KEY = "tetrisHighscore";
let highscore = window.localStorage.getItem(TETRISHIGHSCORE_KEY) || 0;
document.getElementById('tetrisHighscore').innerHTML = highscore;

function drawPiece() {
    board.piece.x = 3;
    board.piece.y = 0;
    board.piece.typeId = board.nextpiece.typeId;
    board.nextpiece.draw();
    drawNextpiece();
    animate();
}

function drawNextpiece() {
    board.nextpiece.x = 1;
    board.nextpiece.y = 1;
    board.nextpiece.typeId = board.piece.randomizeTetrominoType(7);
    nextboard_ctx.clearRect(0, 0, nextboard_ctx.canvas.width, nextboard_ctx.canvas.height);
    board.nextpiece.draw();
}

function play() {
    board.reset();
    console.table(board.grid);

    points = 0;
    lines = 0;
    document.getElementById("score").innerHTML = points;
    document.getElementById("lines").innerHTML = lines;

    board.piece = new Piece(tetrisboard_ctx);
    board.nextpiece = new Piece(nextboard_ctx);

    drawNextpiece();
    board.piece.x = 3;
    board.piece.y = 0;
    board.piece.typeId = board.piece.randomizeTetrominoType(7);
    board.piece.draw();
    animate();
}

function drop() {
    return board.piece.SHAPES[board.piece.typeId].every((row, dy) => {
        return row.every((value, dx) => {
            let y = board.piece.y + dy + 1;
            return board.isEmpty(value) || board.aboveFloor(y) && board.grid[board.piece.y + dy + 1][board.piece.x + dx] === 0
        });
    })
}

function gameOver() {
    highscore = points;
    window.localStorage.setItem(TETRISHIGHSCORE_KEY, highscore);
    document.getElementById('tetrisHighscore').innerHTML = highscore;
    tetrisboard_ctx.fillStyle = '#181818';
    tetrisboard_ctx.fillRect(1, 3, 8, 1.2);
    tetrisboard_ctx.font = '1px Arial';
    tetrisboard_ctx.fillStyle = 'white';
    tetrisboard_ctx.fillText('GAME OVER', 1.8, 4);
}

function clearLine() {
    board.grid.forEach((row, y) => {
        if (row.every(value => value > 0)) {
            lines++;
            clearedLines++;
            board.grid.splice(y, 1);
            board.grid.unshift(Array(COLS).fill(0));
        }
    });
    if (clearedLines === 1) {
        points += POINTS.SINGLE
    }
    if (clearedLines === 2) {
        points += POINTS.DOUBLE
    }
    if (clearedLines === 3) {
        points += POINTS.TRIPLE
    }
    if (clearedLines === 4) {
        points += POINTS.TETRIS
    }
    document.getElementById("score").innerHTML = points;
    document.getElementById("lines").innerHTML = lines;

    clearedLines = 0;
}

function animate(now = 0) {

    if (lines >= 10) {
        time.level = LEVEL["1"];
        document.getElementById("level").innerHTML = "1";
    }
    if (lines >= 20) {
        time.level = LEVEL["2"];
        document.getElementById("level").innerHTML = "2";
    }
    if (lines >= 30) {
        time.level = LEVEL["3"];
        document.getElementById("level").innerHTML = "3";
    }
    if (lines >= 40) {
        time.level = LEVEL["4"];
        document.getElementById("level").innerHTML = "4";
    }
    if (lines >= 50) {
        time.level = LEVEL["5"];
        document.getElementById("level").innerHTML = "5";
    }

    time.elapsed = now - time.start;

    if (time.elapsed > time.level) {

        time.start = now;
        if (drop()) {
            board.piece.y += 1;
            refreshBoard();
            board.piece.draw();
        } else {
            if (board.piece.y === 0) {
                gameOver();
                return;
            }
            board.piece.freeze();
            console.table(board.grid);
            clearLine();
            refreshBoard();
            drawPiece();
            return
        }
    }
    requestAnimationFrame(animate);
}