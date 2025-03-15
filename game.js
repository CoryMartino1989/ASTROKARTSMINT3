// Get the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas settings
canvas.width = 800;
canvas.height = 400;

// Game variables
let ninja = { x: 50, y: 300, width: 50, height: 50, dy: 0, gravity: 1.5, jumpPower: -20, grounded: true };
let obstacles = [];
let gameSpeed = 5;
let score = 0;
let isGameOver = false;

// Jump function
function jump() {
    if (ninja.grounded) {
        ninja.dy = ninja.jumpPower;
        ninja.grounded = false;
    }
}

// Event listener for jumping
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !isGameOver) {
        jump();
    }
});

// Obstacle class
class Obstacle {
    constructor() {
        this.x = canvas.width;
        this.y = 320;
        this.width = 30;
        this.height = 50;
    }

    update() {
        this.x -= gameSpeed;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Game loop
function updateGame() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ninja
    ctx.fillStyle = "white";
    ctx.fillRect(ninja.x, ninja.y, ninja.width, ninja.height);

    // Apply gravity
    ninja.y += ninja.dy;
    ninja.dy += ninja.gravity;

    // Ground collision
    if (ninja.y >= 300) {
        ninja.y = 300;
        ninja.dy = 0;
        ninja.grounded = true;
    }

    // Spawn obstacles
    if (Math.random() < 0.02) {
        obstacles.push(new Obstacle());
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].draw();

        // Collision detection
        if (
            ninja.x < obstacles[i].x + obstacles[i].width &&
            ninja.x + ninja.width > obstacles[i].x &&
            ninja.y < obstacles[i].y + obstacles[i].height &&
            ninja.y + ninja.height > obstacles[i].y
        ) {
            isGameOver = true;
            alert("Game Over! Score: " + score);
            document.location.reload();
        }

        // Remove off-screen obstacles
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
        }
    }

    // Display score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    requestAnimationFrame(updateGame);
}

// Start the game
updateGame();
