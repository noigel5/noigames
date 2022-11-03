const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const tetrisboard = document.getElementById("board");
const tetrisboard_ctx = tetrisboard.getContext("2d");

tetrisboard_ctx.canvas.width = COLS * BLOCK_SIZE;
tetrisboard_ctx.canvas.height = ROWS * BLOCK_SIZE;

tetrisboard_ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

