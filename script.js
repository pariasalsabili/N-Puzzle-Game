const gridElement = document.getElementById("grid");
const gridSizeSelector = document.getElementById("grid-size");
const moveCountElement = document.getElementById("move-count");
const timeCountElement = document.getElementById("time-count");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("start-button");

let gridSize = 3;
let moveCount = 0;
let timeCount = 0;
let interval;
let tiles = [];

function createGrid() {
    gridElement.innerHTML = "";
    gridElement.dataset.size = gridSize;
    tiles = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
    tiles.push(null);
    shuffleTiles();
    renderGrid();
}

function shuffleTiles() {
    tiles.sort(() => Math.random() - 0.5);
    if (!isSolvable(tiles)) shuffleTiles();
}

function isSolvable(arr) {
    let inversions = 0;
    const flattened = arr.filter(n => n !== null);

    // Calculate the number of inversions
    for (let i = 0; i < flattened.length; i++) {
        for (let j = i + 1; j < flattened.length; j++) {
            if (flattened[i] > flattened[j]) inversions++;
        }
    }

    // Find the row of the blank space (counting from the bottom)
    const blankRowFromBottom = Math.floor(arr.indexOf(null) / gridSize);

    // Solvability check based on gridSize and inversions
    return gridSize % 2 === 1
        ? inversions % 2 === 0
        : inversions % 2 === blankRowFromBottom % 2;
}


function renderGrid() {
    gridElement.innerHTML = "";
    tiles.forEach((tile, index) => {
        const tileElement = document.createElement("div");
        if (tile !== null) {
            tileElement.textContent = tile;
            tileElement.classList.add("tile");
            tileElement.addEventListener("click", () => moveTile(index));
        }
        gridElement.appendChild(tileElement);
    });
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf(null);
    const isValidMove =
        (index === emptyIndex - 1 && emptyIndex % gridSize !== 0) ||
        (index === emptyIndex + 1 && index % gridSize !== 0) ||
        index === emptyIndex - gridSize ||
        index === emptyIndex + gridSize;

    if (isValidMove) {
        tiles[emptyIndex] = tiles[index];
        tiles[index] = null;
        moveCount++;
        moveCountElement.textContent = moveCount;
        renderGrid();
        checkWin();
    }
}

function checkWin() {
    const isComplete = tiles.slice(0, -1).every((tile, i) => tile === i + 1);
    if (isComplete) {
        clearInterval(interval);
        calculateScore();
        alert("Congratulations! You solved the puzzle.");
    }
}

function startGame() {
    gridSize = parseInt(gridSizeSelector.value);
    moveCount = 0;
    timeCount = 0;
    moveCountElement.textContent = moveCount;
    timeCountElement.textContent = timeCount;
    scoreElement.textContent = 0;
    createGrid();
    clearInterval(interval);
    interval = setInterval(() => {
        timeCount++;
        timeCountElement.textContent = timeCount;
    }, 1000);
}

function calculateScore() {
    const baseScore = 1000;
    const timePenalty = timeCount * 2;
    const movePenalty = moveCount * 3;
    const finalScore = Math.max(baseScore - timePenalty - movePenalty, 0);
    scoreElement.textContent = finalScore;
}

startButton.addEventListener("click", startGame);
