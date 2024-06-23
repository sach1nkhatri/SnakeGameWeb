const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;
let score = 0;
let highScore = 0;
let gameOver = false;
let speed = 100; // Initial speed

(function setup() {
    canvas.width = 600;
    canvas.height = 600;

    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();

    window.setInterval(() => {
        if (!gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fruit.update();
            fruit.draw();
            snake.update();
            snake.draw();

            if (snake.eat(fruit)) {
                score++;
                if (score > highScore) {
                    highScore = score;
                    document.querySelector('.high-score').innerText = highScore;
                }
                document.querySelector('.score').innerText = score;
                fruit.pickLocation();
                speed -= 5; // Decrease interval to increase speed
            }

            snake.checkCollision();
        }
    }, speed); // Adjust speed based on interval
}());

window.addEventListener('keydown', (event) => {
    const direction = event.key.replace('Arrow', '');
    snake.changeDirection(direction);
});

document.getElementById('restart-btn').addEventListener('click', () => {
    resetGame();
});

function resetGame() {
    gameOver = false;
    score = 0;
    speed = 100; // Reset speed
    document.querySelector('.score').innerText = score;
    snake = new Snake();
    fruit.pickLocation();
    document.getElementById('game-over').style.display = 'none';
}

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 1; // Start with one segment
    this.tail = [];

    this.draw = function () {
        // Draw body segments
        ctx.fillStyle = "#a9ed09"; // Green color for body segments
        for (let i = 0; i < this.tail.length; i++) {
            ctx.beginPath();
            ctx.arc(this.tail[i].x + scale / 2, this.tail[i].y + scale / 2, scale / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        // Draw head
        ctx.fillStyle = "#0fe5fc"; //color for head
        ctx.beginPath();
        ctx.arc(this.x + scale / 2, this.y + scale / 2, scale / 2, 0, Math.PI * 2);
        ctx.fill();
    };

    this.update = function () {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width) {
            this.x = 0;
        }

        if (this.y >= canvas.height) {
            this.y = 0;
        }

        if (this.x < 0) {
            this.x = canvas.width - scale;
        }

        if (this.y < 0) {
            this.y = canvas.height - scale;
        }
    };

    this.changeDirection = function (direction) {
        switch (direction) {
            case 'Up':
                if (this.ySpeed !== scale * 1) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed !== -scale * 1) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed !== scale * 1) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed !== -scale * 1) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function (fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            return true;
        }
        return false;
    };

    this.checkCollision = function () {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                gameOver = true;
                document.getElementById('game-over').style.display = 'block';
            }
        }
    };
}

function Fruit() {
    this.x;
    this.y;
    this.radius = scale / 2;
    this.breathingSpeed = 0.9; // Faster breathing speed
    this.maxRadius = scale * 0.6;
    this.minRadius = scale / 3;
    this.increasing = true;

    this.pickLocation = function () {
        this.x = (Math.floor(Math.random() * rows)) * scale;
        this.y = (Math.floor(Math.random() * columns)) * scale;
    };

    this.update = function () {
        if (this.increasing) {
            this.radius += this.breathingSpeed;
            if (this.radius >= this.maxRadius) {
                this.increasing = false;
            }
        } else {
            this.radius -= this.breathingSpeed;
            if (this.radius <= this.minRadius) {
                this.increasing = true;
            }
        }
    };

    this.draw = function () {
        ctx.fillStyle = "#ff4136";
        ctx.beginPath();
        ctx.arc(this.x + scale / 2, this.y + scale / 2, this.radius, 0, Math.PI * 2);
        ctx.fill();
    };
}
