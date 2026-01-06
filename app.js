const API_BASE = 'http://localhost:5500';
const MAX_GUESSES = 6;

let guessesMade = 0;
let gameOver = false;

const board = document.getElementById('board');
const submitBtn = document.getElementById('submit');
const message = document.getElementById('message');

const month = document.getElementById('month');
const day = document.getElementById('day');
const year = document.getElementById('year');

async function startGame() {
    try{
        const response = await fetch(`${API_BASE}/daily`);
        const data = await response.json();

        message.textContent = `Difficulty: ${data.difficulty}`;
        createEmptyBoard();
    } catch (err){
        message.textContent = 'Failed to load daily event.';
        console.error(err);
    }
}

function createEmptyBoard() {
    for(i=0; i<MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.className = 'row';

        for(j=0; j<3; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            row.appendChild(cell);
        }

        board.appendChild(row);
    }
}

submitBtn.addEventListener('click', submitGuess);

async function submitGuess() {
    if(gameOver || guessesMade >= MAX_GUESSES) return;

    const month = parseInt(monthInput.value);
    const day = parseInt(dayInput.value);
    const year = parseInt(yearInput.value);

    if(!isValidInput(month, day, year)){
        message.textContent = 'Invalid date. Please try again.';
        return;
    }

    try{
        const response = await fetch(`${API_BASE}/guess`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ month, day, year })
        });

        const result = await response.json();
        renderGuess(result, { month, day, year });

        guessesMade++;

        if(result.win){
            message.textContent = 'Congratulations! You guessed correctly!';
            gameOver = true;
        } else if(guessesMade === MAX_GUESSES){
            message.textContent = 'Game Over! Better luck next time.';
            gameOver = true;
        } else{
            message.textContent = `Guesses left: ${MAX_GUESSES - guessesMade}`;
        }

        clearInputs();
    } catch (err){
        message.textContent = 'Error submitting guess. Please try again.';
        console.error(err);
    }
}

function renderGuess(result, guess) {
    const row = board.children[guessesMade];
    const values = [guess.month, guess.day, guess.year];
    const keys = ['month', 'day', 'year'];

    keys.forEach((key, index) => {
        const cell = row.children[index];
        cell.textContent = values[index];
        cell.classList.add(mapResultToClass(result[key]));
    });
}

function mapResultToClass(result) {
    switch(result) {
        case 'correct':
            return 'correct';
        case 'too_low':
            return 'too_low';
        case 'too_high':
            return 'too_high';
        default:
            return 'wrong';
    }
}

function isValidInput(month, day, year) {
    if(!day || !month || !year) return false;
    if(month < 1 || month > 12) return false;
    if(day < 1 || day > 31) return false;
    if(year < 1) return false;
    return true;
}

function clearInputs() {
    monthInput.value = '';
    dayInput.value = '';
    yearInput.value = '';
}

startGame();