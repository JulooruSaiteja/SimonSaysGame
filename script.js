// ========================================
// SIMON SAYS GAME
// ========================================

// Available colors
const colors = ["red", "yellow", "green", "blue"];

// Game state
let gameSequence = [];
let userSequence = [];
let level = 0;

let gameStarted = false;
let userTurn = false;


// ========================================
// HTML ELEMENTS
// ========================================

const statusElement = document.getElementById("status");
const startButton = document.getElementById("startBtn");

const buttons = {
  red: document.getElementById("red"),
  yellow: document.getElementById("yellow"),
  green: document.getElementById("green"),
  blue: document.getElementById("blue")
};

// ========================================
// HELPER FUNCTION
// ========================================

function sleep(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}


// ========================================
// START BUTTON
// ========================================

startButton.addEventListener("click", startGame);


// ========================================
// COLOR BUTTONS
// ========================================

Object.entries(buttons).forEach(([color, button]) => {

  button.addEventListener("pointerdown", (event) => {

    event.preventDefault();

    // Don't allow clicking before game starts
    if (!gameStarted) {
      return;
    }

    // Don't allow clicking while computer is showing sequence
    if (!userTurn) {
      return;
    }

    handleUserInput(color);
  });

});


// ========================================
// START GAME
// ========================================

function startGame() {

  // Clear previous game
  gameSequence = [];
  userSequence = [];

  level = 0;

  gameStarted = true;
  userTurn = false;

  document.body.classList.remove("game-over");

  // Disable Start button while playing
  startButton.disabled = true;
  startButton.textContent = "Game Running...";

  statusElement.textContent = "Get ready...";

  // Start first level
  nextLevel();
}


// ========================================
// NEXT LEVEL
// ========================================

function nextLevel() {

  userTurn = false;

  // Clear player's previous answer
  userSequence = [];

  // Increase level
  level++;

  statusElement.textContent = `Level ${level}`;

  // Generate a random color
  const randomIndex = Math.floor(
    Math.random() * colors.length
  );

  const randomColor = colors[randomIndex];

  // Add new color to sequence
  gameSequence.push(randomColor);

  // Computer shows sequence
  playComputerSequence();
}


// ========================================
// COMPUTER SHOWS SEQUENCE
// ========================================

async function playComputerSequence() {

  userTurn = false;

  document.body.classList.add("computing-sequence");

  statusElement.textContent = "Watch carefully...";

  await sleep(600);


  // Play every color in sequence
  for (const color of gameSequence) {

    const button = buttons[color];

    // Computer flash
    button.classList.add("flash");

    await sleep(450);

    button.classList.remove("flash");

    await sleep(250);
  }


  document.body.classList.remove("computing-sequence");

  // Now player can click
  userTurn = true;

  statusElement.textContent =
    "Your turn — repeat the sequence";
}


// ========================================
// PLAYER CLICKS A COLOR
// ========================================

function handleUserInput(color) {

  const button = buttons[color];

  // Player visual feedback
  button.classList.add("userflash");

  setTimeout(() => {
    button.classList.remove("userflash");
  }, 260);


  // Save player's choice
  userSequence.push(color);

  // Check answer
  checkAnswer();
}


// ========================================
// CHECK PLAYER ANSWER
// ========================================

function checkAnswer() {

  // Position of the latest click
  const currentIndex = userSequence.length - 1;

  const userColor = userSequence[currentIndex];
  const correctColor = gameSequence[currentIndex];


  // ----------------------------------------
  // WRONG ANSWER
  // ----------------------------------------

  if (userColor !== correctColor) {

    endGame();

    return;
  }


  // ----------------------------------------
  // ENTIRE SEQUENCE IS CORRECT
  // ----------------------------------------

  if (userSequence.length === gameSequence.length) {

    userTurn = false;

    statusElement.textContent = "Correct!";

    // Wait before next level
    setTimeout(() => {

      if (gameStarted) {
        nextLevel();
      }

    }, 800);
  }
}


// ========================================
// GAME OVER
// ========================================

function endGame() {

  gameStarted = false;
  userTurn = false;

  document.body.classList.add("game-over");

  statusElement.textContent =
    `Game Over! You reached Level ${level}`;

  // Enable Start button again
  startButton.disabled = false;
  startButton.textContent = "Play Again";
}


// ========================================
// INITIAL MESSAGE
// ========================================

statusElement.textContent = "Press Start to begin";