const canvas = document.getElementById('simonCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

const colors = ['red', 'lime', 'blue', 'yellow'];
const sounds = {
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    lime: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
};

let sequence = [];
let playerSequence = [];
let level = 0;

canvas.addEventListener('click', handlePlayerClick);
startButton.addEventListener('click', startGame);

function startGame() {
    sequence = [];
    playerSequence = [];
    level = 0;
    nextLevel();
}

function nextLevel() {
    level++;
    playerSequence = [];
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(nextColor);
    playSequence();
    updateLevelDisplay();
}

function updateLevelDisplay() {
    const levelDisplay = document.getElementById('currentLevel');
    if (level > 0) {
        levelDisplay.textContent = level;
    } else {
        levelDisplay.textContent = '';
    }
}


function playSequence() {
    let delay = 0;
    sequence.forEach((color, index) => {
        setTimeout(() => {
            playSound(color);
            flashColor(color);
        }, delay);
        delay += 1000;
    });
}

function flashColor(color) {
    const prevStyle = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.classList.add('glow');
    setTimeout(() => {
        ctx.fillStyle = prevStyle;
        drawBoard();
        canvas.classList.remove('glow');
    }, 500);
}

function playSound(color) {
    sounds[color].play();
}

function handlePlayerClick(event) {
    const { offsetX, offsetY } = event;
    const width = canvas.width / 2;
    const height = canvas.height / 2;

    let color;
    if (offsetX < width && offsetY < height) {
        color = 'red';
    } else if (offsetX > width && offsetY < height) {
        color = 'lime';
    } else if (offsetX < width && offsetY > height) {
        color = 'blue';
    } else {
        color = 'yellow';
    }

    playSound(color);
    flashColor(color);
    playerSequence.push(color);
    checkPlayerMove();
}

function checkPlayerMove() {
    const currentMove = playerSequence.length - 1;
    if (playerSequence[currentMove] !== sequence[currentMove]) {
        alert('Game Over! You reached level ' + level);
        return;
    }

    if (playerSequence.length === sequence.length) {
        setTimeout(nextLevel, 1000);
    }
}

function drawBoard() {
    const gradientRed = ctx.createLinearGradient(0, 0, canvas.width / 2, canvas.height / 2);
    gradientRed.addColorStop(0, '#ff4b4b');
    gradientRed.addColorStop(1, '#ff0000');

    const gradientlime = ctx.createLinearGradient(canvas.width / 2, 0, canvas.width, canvas.height / 2);
    gradientlime.addColorStop(0, '#4bff4b');
    gradientlime.addColorStop(1, '#00ff00');

    const gradientBlue = ctx.createLinearGradient(0, canvas.height / 2, canvas.width / 2, canvas.height);
    gradientBlue.addColorStop(0, '#4b4bff');
    gradientBlue.addColorStop(1, '#0000ff');

    const gradientYellow = ctx.createLinearGradient(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height);
    gradientYellow.addColorStop(0, '#ffff4b');
    gradientYellow.addColorStop(1, '#ffff00');

    ctx.fillStyle = gradientRed;
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = gradientlime;
    ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = gradientBlue;
    ctx.fillRect(0, canvas.height / 2, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = gradientYellow;
    ctx.fillRect(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);

    const smallCircleRadius = 60;
    const smallCircleX = canvas.width / 2;
    const smallCircleY = canvas.width / 2; // Slightly above the main canvas circle

    const metallicGradient = ctx.createLinearGradient(
        smallCircleX - smallCircleRadius, 
        smallCircleY - smallCircleRadius, 
        smallCircleX + smallCircleRadius, 
        smallCircleY + smallCircleRadius
    );
    metallicGradient.addColorStop(0, '#ccc');
    metallicGradient.addColorStop(0.5, '#666');
    metallicGradient.addColorStop(1, '#ccc');

    ctx.beginPath();
    ctx.arc(smallCircleX, smallCircleY, smallCircleRadius, 0, Math.PI * 2, true);
    ctx.fillStyle = metallicGradient;
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'white';
    ctx.font = 'bold 50px Nunito';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Only draw the level if it's greater than 0
    if (level > 0) {
        ctx.fillText(level, smallCircleX, smallCircleY);
    }
}


drawBoard();
