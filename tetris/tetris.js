const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const tetrisboard = document.getElementById("board");
const tetrisboard_ctx = tetrisboard.getContext("2d");

tetrisboard_ctx.canvas.width = COLS * BLOCK_SIZE;
tetrisboard_ctx.canvas.height = ROWS * BLOCK_SIZE;

tetrisboard_ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

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
            } else {
                board.piece.move(p);
            }
            tetrisboard_ctx.clearRect(0, 0, tetrisboard_ctx.canvas.width, tetrisboard_ctx.canvas.height);

            board.piece.draw();
            board.drawBoard();
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
                        this.aboveFloor(y) && board.grid[board.piece.y + dy + 1][board.piece.x + dx] === 0
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
        this.ctx.fillStyle = this.COLORS[board.piece.typeId];
        this.SHAPES[board.piece.typeId].forEach((row, y) => {
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
        for (let y = 0; y < this.SHAPES[board.piece.typeId].length; ++y) {
            for (let x = 0; x < y; ++x) {
                [this.SHAPES[board.piece.typeId][x][y], this.SHAPES[board.piece.typeId][y][x]] = [this.SHAPES[board.piece.typeId][y][x], this.SHAPES[board.piece.typeId][x][y]];
            }
        }

        this.SHAPES[board.piece.typeId].forEach(row => row.reverse());

        return this;
    }

    freeze() {
        board.piece.SHAPES[board.piece.typeId].forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    board.grid[y + board.piece.y][x + board.piece.x] = value;
                }
            });
        });
    }
}

let board = new Board();
let lines = 0;
let clearedLines = 0;
let points = 0;

const POINTS = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 800,
    SOFT_DROP: 1,
    HARD_DROP: 2
}
Object.freeze(POINTS);

const LEVEL = {
    0: 1000,
    1: 900,
    2: 800,
    3: 600,
    4: 400,
    5: 200
}
Object.freeze(LEVEL);

time = {start: 0, elapsed: 0, level: LEVEL["0"]};

function drawPiece() {
    board.piece.typeId = board.piece.randomizeTetrominoType(7);
    board.piece.draw();
    animate();
}

function play() {
    board.reset();
    console.table(board.grid);

    board.piece = new Piece(tetrisboard_ctx);

    drawPiece();
}

function drop() {
    return board.piece.SHAPES[board.piece.typeId].every((row, dy) => {
        return row.every((value, dx) => {
            let y = board.piece.y + dy + 1;
            return board.isEmpty(value) || board.aboveFloor(y) && board.grid[board.piece.y + dy + 1][board.piece.x + dx] === 0
        });
    })
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
            tetrisboard_ctx.clearRect(0, 0, tetrisboard_ctx.canvas.width, tetrisboard_ctx.canvas.height);

            board.drawBoard();
            board.piece.draw();
        } else {
            board.piece.freeze();
            clearLine();
            console.table(board.grid);

            board.drawBoard();
            board.piece.x = 3;
            board.piece.y = 0;
            drawPiece();
            return
        }
    }
    requestAnimationFrame(animate);
}