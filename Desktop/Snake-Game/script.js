// Define Html elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highscore');

// Define game variables
const gridSize = 20;
let snake = [{x: 10, y:10}];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

// Teiknar mappið, snake, matinn
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Teikna snák
function drawSnake() {
    snake.forEach((segment) =>{
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Búa til snákinn eða matakubbinn/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of the snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Teikna mat
function drawFood() {
    if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement)
    }
}

// Býr til mat
function generateFood() {
    // passar upp á að random tala sem er generatuð sé heiltala
    // býr til random tölu frá 1 upp í 20 fyrir x-hnit
    const x = Math.floor(Math.random() * gridSize) + 1;

    // Býr til random tölu frá 1 upp í 20 fyrir y-hnit
    const y = Math.floor(Math.random() * gridSize) +1;

    return {x,y}
}

//Moving the snake 
function move() {
    const head = { ...snake[0] }
    switch (direction) {
        case 'up':
            head.y--
            break;

        case 'down':
            head.y++
            break;

        case 'left':
            head.x--;
            break;

        case 'right':
            head.x++
            break;
    }
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

// Start game function
function startGame() {
    gameStarted = true; // Keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//keepress event listener
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'space') || 
        !gameStarted && event.key === ' ') {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break

            case 'ArrowDown':
                direction = 'down';
                break;

            case 'ArrowLeft':
                direction = 'left';
                break;

            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress)

// Increase the speed of the snake
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if(gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

// checks the collision for walls and self.
function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || 
        head.x > gridSize || 
        head.y < 1 || 
        head.y > gridSize) {
            resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

// resets the game after collision
function resetGame() {
    updateHighscore();
    stopGame();
    snake = [{x:10, y:10}]
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

//updates the score
function updateScore() {
    const currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3, '0')
}

//Game stops
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

// Updates the highscore.
function updateHighscore(){
    const currentScore = snake.length -1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}
