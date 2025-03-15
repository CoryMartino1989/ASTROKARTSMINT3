// Get the game canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas settings
canvas.width = 800;
canvas.height = 400;

// Load assets
const ninjaImg = new Image();
ninjaImg.src = "assets/ninja.png";

const obstacleImg = new Image();
obstacleImg.src = "assets/obstacle.png";

const speedPowerupImg = new Image();
speedPowerupImg.src = "assets/powerup-speed.png";

const shieldPowerupImg = new Image();
shieldPowerupImg.src = "assets/powerup-shield.png";

const jumpPowerupImg = new Image();
jumpPowerupImg.src = "assets/powerup-jump.png";

// Game variables
let ninja = {
    x: 50, 
    y: 300, 
    width: 50, 
    height: 50, 
    velocityY: 0, 
    gravity: 1.2, 
    jumpPower: -18, 
    canDoubleJump: false,
    grounded: true, 
    jumpBuffer: false,
    invincible: false
};

let obstacles = [];
let powerups = [];
let gameSpeed = 6;
let speedMultiplier = 1;
let score = 0;
let isGameOver = false;

// Jump function
function jump() {
    if (ninja.grounded) {
        ninja.velocityY = ninja.jumpPower;
        ninja.grounded = false;
    } else if (ninja.canDoubleJump) {
        ninja.velocityY = ninja.jumpPower * 0.9; // Slightly lower second jump
        ninja.canDoubleJump = false; // Only one double jump per air time
    }
}

// Event listener for jumping
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !isGameOver) {
        if (!ninja.grounded) ninja.jumpBuffer = true;
        jump();
    }
});

// Obstacle class
class Obstacle {
    constructor() {
        this.x = canvas.width;
        this.y = 320;
        this.width = 40;
        this.height = 50;
    }

    update() {
        this.x -= gameSpeed * speedMultiplier;
    }

    draw() {
        ctx.drawImage(obstacleImg, this.x, this.y, this.width, this.height);
    }
}

// Power-Up class
class PowerUp {
    constructor(type) {
        this.x = canvas.width;
        this.y = 300;
        this.width = 30;
        this.height = 30;
        this.type = type;
        this.image = type === "speed" ? speedPowerupImg :
                     type === "shield" ? shieldPowerupImg :
                     jumpPowerupImg;
    }

    update() {
        this.x -= gameSpeed * speedMultiplier;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

// Power-Up effects
function activatePowerUp(type) {
    if (type === "speed") {
        speedMultiplier = 1.5;
        setTimeout(() => speedMultiplier = 1, 5000);
    } else if (type === "shield") {
        ninja.invincible = true;
        setTimeout(() => ninja.invincible = false, 5000);
    } else if (type === "jump") {
        ninja.canDoubleJump = true;
    }
}

// Game loop
function updateGame() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ninja
    ctx.drawImage(ninjaImg, ninja.x, ninja.y, ninja.width, ninja.height);

    // Apply gravity
    ninja.y += ninja.velocityY;
    ninja.velocityY += ninja.gravity;

    // Ground collision
    if (ninja.y >= 300) {
        ninja.y = 300;
        ninja.velocityY = 0;
        ninja.grounded = true;
    }

    // Spawn obstacles
    if (Math.random() < 0.02) {
        obstacles.push(new Obstacle());
    }

    // Spawn power-ups randomly
    if (Math.random() < 0.005) {
        let types = ["speed", "shield", "jump"];
        let powerType = types[Math.floor(Math.random() * types.length)];
        powerups.push(new PowerUp(powerType));
    }

    // Update & Draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].draw();

        // Collision detection (unless invincible)
        if (!ninja.invincible &&
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
            gameSpeed += 0.01; // Slowly increase difficulty
        }
    }

    // Update & Draw power-ups
    for (let i = powerups.length - 1; i >= 0; i--) {
        powerups[i].update();
        powerups[i].draw();

        if (
            ninja.x < powerups[i].x + powerups[i].width &&
            ninja.x + ninja.width > powerups[i].x &&
            ninja.y < powerups[i].y + powerups[i].height &&
            ninja.y + ninja.height > powerups[i].y
        ) {
            activatePowerUp(powerups[i].type);
            powerups.splice(i, 1);
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
