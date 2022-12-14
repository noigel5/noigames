const slider = document.getElementById("slider")
const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");

const board_border = 'black';
const board_background = "#383838";
const snake_col = 'green';
const snake_border = 'darkblue';

let isPaused = false;
const HIGHSCORE_KEY = "snakeHighscore";
let highscore = window.localStorage.getItem(HIGHSCORE_KEY) || 0;
document.getElementById('record').innerHTML = highscore;

slider.addEventListener("input", (e) => {
    if (has_game_ended()) {
        gotReseted = true;
        snakeboard.height = e.target.value
        snakeboard.width = e.target.value
        main();
    }
    gotReseted = true;
    snakeboard.height = e.target.value
    snakeboard.width = e.target.value
});

document.addEventListener("keydown", input)

let snake = [
    {x: snakeboard.height / 2, y: snakeboard.width / 2},
    {x: snakeboard.height / 2 - snakeboard.height / 40, y: snakeboard.width / 2},
    {x: snakeboard.height / 2 - snakeboard.height / 40 * 2, y: snakeboard.width / 2},
    {x: snakeboard.height / 2 - snakeboard.height / 40 * 3, y: snakeboard.width / 2},
    {x: snakeboard.height / 2 - snakeboard.height / 40 * 4, y: snakeboard.width / 2}
]
let changing_direction = false;
let dx = snakeboard.width / 40;
let dy = 0;
let score = 0;

let food_x = 0;
let food_y = 0;

let gotReseted = false;

main();

function move() {
    if (gotReseted) {
        gotReseted = false;
        snake = [
            {x: snakeboard.height / 2, y: snakeboard.width / 2},
            {x: snakeboard.height / 2 - snakeboard.height / 40, y: snakeboard.width / 2},
            {x: snakeboard.height / 2 - snakeboard.height / 40 * 2, y: snakeboard.width / 2},
            {x: snakeboard.height / 2 - snakeboard.height / 40 * 3, y: snakeboard.width / 2},
            {x: snakeboard.height / 2 - snakeboard.height / 40 * 4, y: snakeboard.width / 2}
        ]
        changing_direction = false;
        dx = snakeboard.width / 40;
        dy = 0;
        score = 0;
        document.getElementById("title").innerHTML = score;
        main();
        return;
    }
    if (isPaused) {
        document.getElementById('title').innerHTML = 'PAUSED';
        return;
    }
    if (has_game_ended()) {
        if (score > highscore) {
            highscore = score;
            window.localStorage.setItem(HIGHSCORE_KEY, highscore);
            document.getElementById('record').innerHTML = highscore;
        }
        document.getElementById('title').innerHTML = 'Game Over';
        return;
    }
    changing_direction = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        drawSnake();
        move_snake();
        if (hasEaten()) {
            main();
            return
        }
        move();
    }, 100);
}

function main() {
    food_x = generateFoodX();
    food_y = generateFoodY();
    move();
}

function clearCanvas() {
    snakeboard_ctx.fillStyle = board_background;
    snakeboard_ctx.strokestyle = board_border;
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart)
    drawHead(snake[0])
}

function drawHead(snakeHead) {
    snakeboard_ctx.fillStyle = "white";
    snakeboard_ctx.strokestyle = snake_border;
    snakeboard_ctx.fillRect(snakeHead.x, snakeHead.y, snakeboard.width / 40, snakeboard.width / 40);
    snakeboard_ctx.strokeRect(snakeHead.x, snakeHead.y, snakeboard.width / 40, snakeboard.width / 40);
}

function drawSnakePart(snakePart) {
    snakeboard_ctx.fillStyle = snake_col;
    snakeboard_ctx.strokestyle = snake_border;
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, snakeboard.width / 40, snakeboard.width / 40);
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, snakeboard.width / 40, snakeboard.width / 40);
}

function move_snake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (hasEaten()) {
        score += 10;
        document.getElementById('title').innerHTML = score;
        return
    }
    snake.pop();
}

function resetHighscore() {
    window.localStorage.removeItem(HIGHSCORE_KEY);
    document.getElementById('record').innerHTML = "0";
}

function input(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const ENTER = 13;
    const SPACE = 32;
    const keyPressed = event.keyCode;

    if (keyPressed === ENTER) {
        if (has_game_ended()) {
            gotReseted = true;
            main();
        }
        gotReseted = true;
        return;
    }

    if (keyPressed === SPACE) {
        if (isPaused) {
            isPaused = false;
            document.getElementById('title').innerHTML = score;
            move();
        } else {
            isPaused = true;
        }
    }

    if (changing_direction) return;
    changing_direction = true;

    const goingUp = dy === -snakeboard.width / 40;
    const goingDown = dy === snakeboard.width / 40;
    const goingRight = dx === snakeboard.width / 40;
    const goingLeft = dx === -snakeboard.width / 40;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -snakeboard.width / 40;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -snakeboard.width / 40;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = snakeboard.width / 40;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = snakeboard.width / 40;
    }

}

function has_game_ended() {
    if (gotReseted) {
        return false;
    }
    for (let i = 4; i < snake.length; i++) {
        const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y
        if (has_collided) {
            return has_collided;
        }
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - snakeboard.width / 40;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - snakeboard.width / 40;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function random_food(min, max) {
    return Math.round((Math.random() * (max - min) + min) / (snakeboard.width / 40)) * (snakeboard.width / 40);
}

function generateFoodX() {
    return random_food(0, snakeboard.width - snakeboard.width / 40);
}

function generateFoodY() {
    return random_food(0, snakeboard.height - snakeboard.height / 40);
}

function hasEaten() {
    return snake[0].x === food_x && snake[0].y === food_y
}

function drawFood() {
    snakeboard_ctx.fillStyle = 'red';
    snakeboard_ctx.strokestyle = 'white';
    snakeboard_ctx.fillRect(food_x, food_y, snakeboard.width / 40, snakeboard.width / 40);
    snakeboard_ctx.strokeRect(food_x, food_y, snakeboard.width / 40, snakeboard.width / 40);
}