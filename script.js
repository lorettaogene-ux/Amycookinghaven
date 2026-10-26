// Amy's Cooking Hub - African Doll Restaurant Engine

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Game State
let isPlaying = false;
let money = 0;
let ordersCompleted = 0;

// Menu items available to cook
const menuDishes = [
    { name: "Smoky Jollof Rice", icon: "🍚", reward: 500 },
    { name: "Fried Plantain (Dodo)", icon: "🍌", reward: 300 },
    { name: "Spaghetti Stew", icon: "🍝", reward: 600 },
    { name: "Peppered Goat Meat", icon: "🐐", reward: 800 }
];

let currentOrder = null;
let orderTimer = 100; // Patience meter
let orderInterval = null;

// DOM Elements
const menuOverlay = document.getElementById("menu-overlay");
const gameoverOverlay = document.getElementById("gameover-overlay");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const moneyDisplay = document.getElementById("money-display");
const scoreDisplay = document.getElementById("score-display");
const finalMoney = document.getElementById("final-money");
const finalOrders = document.getElementById("final-orders");
const customerRequest = document.getElementById("customer-request");
const orderPanel = document.getElementById("order-panel");

// Generate New Customer Order
function generateNewOrder() {
    if (!isPlaying) return;
    const randomIndex = Math.floor(Math.random() * menuDishes.length);
    currentOrder = menuDishes[randomIndex];
    customerRequest.textContent = `Customer wants: ${currentOrder.icon} ${currentOrder.name}!`;
    orderTimer = 100;
}

// Draw African Doll Buka Restaurant Interior
function drawRestaurant() {
    // Background wall (Pink & White Dollhouse Theme with Ankara-inspired pattern accents)
    ctx.fillStyle = "#fff1f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Counter Top
    const counterY = canvas.height * 0.55;
    ctx.fillStyle = "#fce7f3";
    ctx.fillRect(0, counterY, canvas.width, canvas.height - counterY);

    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, counterY);
    ctx.lineTo(canvas.width, counterY);
    ctx.stroke();

    // Draw Doll Customer behind counter
    ctx.fillStyle = "#8d5524"; // Melanin skin tone doll
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5, counterY - 50, 32, 0, Math.PI * 2);
    ctx.fill();

    // Doll hair (Afro puffs)
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(canvas.width * 0.5 - 20, counterY - 60, 14, 0, Math.PI * 2);
    ctx.arc(canvas.width * 0.5 + 20, counterY - 60, 14, 0, Math.PI * 2);
    ctx.fill();

    // Doll Dress (Pink Ankara Vibe)
    ctx.fillStyle = "#db2777";
    ctx.fillRect(canvas.width * 0.5 - 25, counterY - 15, 50, 40);

    // Draw Patience Bar
    if (currentOrder) {
        ctx.fillStyle = "#cbd5e1";
        ctx.fillRect(canvas.width * 0.25, counterY - 110, canvas.width * 0.5, 10);
        
        ctx.fillStyle = orderTimer > 30 ? "#db2777" : "#ef4444";
        ctx.fillRect(canvas.width * 0.25, counterY - 110, (canvas.width * 0.5) * (orderTimer / 100), 10);
    }
}

// Game Loop
function gameLoop() {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRestaurant();

    // Decrease patience timer
    orderTimer -= 0.25;
    if (orderTimer <= 0) {
        // Customer left angry!
        generateNewOrder();
    }

    requestAnimationFrame(gameLoop);
}

// Player Cooks a Dish
function cookDish(dishName) {
    if (!isPlaying || !currentOrder) return;

    if (currentOrder.name === dishName) {
        // Correct Dish Served!
        money += currentOrder.reward;
        ordersCompleted++;

        moneyDisplay.textContent = `₦${money.toLocaleString()}`;
        scoreDisplay.textContent = `${ordersCompleted} Orders`;

        generateNewOrder();
    } else {
        // Wrong dish penalty
        orderTimer -= 15;
    }
}

// Start Game
function startGame() {
    isPlaying = true;
    money = 0;
    ordersCompleted = 0;
    moneyDisplay.textContent = "₦0";
    scoreDisplay.textContent = "0 Orders";

    menuOverlay.classList.add("hidden");
    gameoverOverlay.classList.remove("hidden"); // Will use for game over later or time limit
    orderPanel.classList.remove("hidden");

    generateNewOrder();
    requestAnimationFrame(gameLoop);
}

// Cooking Button Listeners
document.getElementById("cook-jollof").addEventListener("click", () => cookDish("Smoky Jollof Rice"));
document.getElementById("cook-plantain").addEventListener("click", () => cookDish("Fried Plantain (Dodo)"));
document.getElementById("cook-spaghetti").addEventListener("click", () => cookDish("Spaghetti Stew"));
document.getElementById("cook-meat").addEventListener("click", () => cookDish("Peppered Goat Meat"));

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
