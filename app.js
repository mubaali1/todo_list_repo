let btns = document.querySelectorAll(".btn");
let resetBtn = document.querySelector("#rst");
let newGameBtn = document.querySelector(".ng");
let msg = document.querySelector("#msg");
let gameGrid = document.querySelector(".game");

let pvpBtn = document.querySelector("#pvp-btn");
let pvcBtn = document.querySelector("#pvc-btn");
let modeSelectionContainer = document.querySelector("#mode-selection-container");
let nameInputContainer = document.querySelector("#name-input-container");
let player1NameInput = document.querySelector("#player1-name");
let player1SymbolInput = document.querySelector("#player1-symbol");
let player2NameInput = document.querySelector("#player2-name");
let player2SymbolInput = document.querySelector("#player2-symbol");
let startPvpBtn = document.querySelector("#start-pvp-btn");
let starterSelectionContainer = document.querySelector("#starter-selection-container");
let starterP1Btn = document.querySelector("#starter-p1-btn");
let starterP2Btn = document.querySelector("#starter-p2-btn");
let gameContainer = document.querySelector("#game-container");

let backFromNamesBtn = document.querySelector("#back-from-names-btn");
let backFromStarterBtn = document.querySelector("#back-from-starter-btn");
let backToMenuBtn = document.querySelector("#back-to-menu-btn");
let quitBtn = document.querySelector("#quit-btn"); // ⭐ New selector for the Quit button

let players = {
    p1: { name: 'Player 1', symbol: '' },
    p2: { name: 'Player 2', symbol: '' }
};

let currentPlayer = players.p1;
let confettiInterval;
let autoStartTimer;

const winPattrn = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// --- Core Game Functions ---

const resetGame = () => {
    for (let button of btns) {
        button.disabled = false;
        button.innerText = "";
        button.style.backgroundColor = "";
        button.style.color = "#b042E1";
    }
    msg.style.display = "none";
    resetBtn.disabled = false;
    clearInterval(confettiInterval);
    gameGrid.classList.remove('hidden');
};

const disableBtns = () => {
    for (let button of btns) {
        button.disabled = true;
    }
};

const showWinner = (winnerName) => {
    msg.innerText = `😀Congratulations, ${winnerName} Wins!`;
    msg.style.display = "block";
    gameGrid.classList.add('hidden');
};

const checkWinner = () => {
    let winnerFound = false;
    for (let pattern of winPattrn) {
        let pos1Val = btns[pattern[0]].innerText;
        let pos2Val = btns[pattern[1]].innerText;
        let pos3Val = btns[pattern[2]].innerText;

        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                winnerFound = true;
                btns[pattern[0]].style.backgroundColor = "#8ecae6";
                btns[pattern[1]].style.backgroundColor = "#8ecae6";
                btns[pattern[2]].style.backgroundColor = "#8ecae6";
                btns[pattern[0]].style.color = "#023047";
                btns[pattern[1]].style.color = "#023047";
                btns[pattern[2]].style.color = "#023047";

                disableBtns();
                resetBtn.disabled = true;
                
                let winningPlayer = null;
                if (pos1Val === players.p1.symbol) 
                    winningPlayer = players.p1;
                else if (pos1Val === players.p2.symbol) 
                    winningPlayer = players.p2;

                if (winningPlayer) 
                    showWinner(winningPlayer.name);
                else console.error("Winning player not found!");
                
                confettiInterval = setInterval(() => { confetti(); }, 100);
                setTimeout(() => { clearInterval(confettiInterval); }, 5000);
                return;
            }
        }
    }

    let allFilled = true;
    for (let btn of btns) {
        if (btn.innerText === "") {
            allFilled = false;
            break;
        }
    }

    if (allFilled && !winnerFound) {
        msg.innerText = "It's a Draw!";
        msg.style.display = "block";
        disableBtns();
        resetBtn.disabled = true;
        gameGrid.classList.add('hidden');
    }
};

// --- Player vs Computer (AI) Logic ---

const computerMove = () => {
    disableBtns();
    setTimeout(() => {
        let availableMoves = [];
        btns.forEach((btn, index) => {
            if (btn.innerText === "") {
                availableMoves.push(index);
            }
        });
        if (availableMoves.length === 0) { checkWinner(); return; }
        let bestMove;
        const playerSymbol = players.p1.symbol;
        const computerSymbol = players.p2.symbol;
        
        for (let i of availableMoves) {
            btns[i].innerText = computerSymbol;
            if (checkWin(computerSymbol)) { bestMove = i; btns[i].innerText = ''; break; }
            btns[i].innerText = '';
        }
        
        if (bestMove === undefined) {
            for (let i of availableMoves) {
                btns[i].innerText = playerSymbol;
                if (checkWin(playerSymbol)) { bestMove = i; btns[i].innerText = ''; break; }
                btns[i].innerText = '';
            }
        }
        
        if (bestMove === undefined && availableMoves.includes(4)) { bestMove = 4; }
        if (bestMove === undefined) {
            const corners = [0, 2, 6, 8];
            const oppositeCorners = {0: 8, 2: 6, 6: 2, 8: 0};
            for(let corner of corners) {
                if(btns[corner].innerText === playerSymbol && availableMoves.includes(oppositeCorners[corner])) {
                    bestMove = oppositeCorners[corner];
                    break;
                }
            }
        }
        if (bestMove === undefined) {
            let corners = [0, 2, 6, 8];
            let availableCorners = corners.filter(index => availableMoves.includes(index));
            if (availableCorners.length > 0) {
                bestMove = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }
        }
        if (bestMove === undefined) {
            let sides = [1, 3, 5, 7];
            let availableSides = sides.filter(index => availableMoves.includes(index));
            if (availableSides.length > 0) {
                bestMove = availableSides[Math.floor(Math.random() * availableSides.length)];
            }
        }

        if (bestMove !== undefined) {
            btns[bestMove].innerText = computerSymbol;
            btns[bestMove].disabled = true;
            currentPlayer = players.p1;
        } else {
            btns[availableMoves[0]].innerText = computerSymbol;
            btns[availableMoves[0]].disabled = true;
            currentPlayer = players.p1;
        }
        
        btns.forEach(btn => {
            if (btn.innerText === "") {
                btn.disabled = false;
            }
        });
        checkWinner();
    }, 500);
};

const checkWin = (symbol) => {
    for (let pattern of winPattrn) {
        if (btns[pattern[0]].innerText === symbol && btns[pattern[1]].innerText === symbol && btns[pattern[2]].innerText === symbol) {
            return true;
        }
    }
    return false;
};

// --- Main Event Listeners ---

pvpBtn.addEventListener('click', () => {
    gameMode = 'pvp';
    modeSelectionContainer.classList.add('hidden');
    nameInputContainer.classList.remove('hidden');
    player1NameInput.value = '';
    player1SymbolInput.value = '';
    player2NameInput.value = '';
    player2SymbolInput.value = '';
});

pvcBtn.addEventListener('click', () => {
    gameMode = 'pvc';
    players.p1.name = 'You';
    players.p1.symbol = 'H';
    players.p2.name = 'Computer';
    players.p2.symbol = 'C';
    
    modeSelectionContainer.classList.add('hidden');
    starterSelectionContainer.classList.remove('hidden');
    
    starterP1Btn.innerText = `${players.p1.name} (${players.p1.symbol})`;
    starterP2Btn.innerText = `${players.p2.name} (${players.p2.symbol})`;
    
    document.querySelector('#starter-heading').innerText = "Who starts?";
    autoStartTimer = setTimeout(() => {
        starterP2Btn.click();
    }, 30000);
});

startPvpBtn.addEventListener('click', () => {
    const p1Symbol = player1SymbolInput.value.trim().toUpperCase();
    const p2Symbol = player2SymbolInput.value.trim().toUpperCase();

    if (!p1Symbol || !p2Symbol || p1Symbol.length !== 1 || p2Symbol.length !== 1 || p1Symbol === p2Symbol) {
        alert("Please enter a unique, single-character symbol for each player.");
        return;
    }
    
    players.p1.name = player1NameInput.value.trim() || 'Player 1';
    players.p1.symbol = p1Symbol;
    players.p2.name = player2NameInput.value.trim() || 'Player 2';
    players.p2.symbol = p2Symbol;
    
    nameInputContainer.classList.add('hidden');
    starterSelectionContainer.classList.remove('hidden');
    
    starterP1Btn.innerText = `${players.p1.name} (${players.p1.symbol})`;
    starterP2Btn.innerText = `${players.p2.name} (${players.p2.symbol})`;
    
    document.querySelector('#starter-heading').innerText = "Who wants to start?";
});

starterP1Btn.addEventListener('click', () => {
    clearTimeout(autoStartTimer);
    starterSelectionContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    currentPlayer = players.p1;
    resetGame();
});

starterP2Btn.addEventListener('click', () => {
    clearTimeout(autoStartTimer);
    starterSelectionContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    currentPlayer = players.p2;
    resetGame();
    if (gameMode === 'pvc') {
        computerMove();
    }
});

btns.forEach((box) => {
    box.addEventListener("click", () => {
        if (box.innerText !== "") return;
        
        box.innerText = currentPlayer.symbol;
        box.style.color = "#b042E1";
        box.disabled = true;
        checkWinner();
        
        currentPlayer = (currentPlayer === players.p1) ? players.p2 : players.p1;
        
        if (gameMode === 'pvc' && currentPlayer === players.p2) {
            setTimeout(computerMove, 500);
        }
    });
});

resetBtn.addEventListener("click", () => {
    resetGame();
    if (gameMode === 'pvc' && currentPlayer === players.p2) {
        computerMove();
    }
});

newGameBtn.addEventListener("click", () => {
    resetGame();
    if (gameMode === 'pvc' && currentPlayer === players.p2) {
        computerMove();
    }
});

backFromNamesBtn.addEventListener('click', () => {
    nameInputContainer.classList.add('hidden');
    modeSelectionContainer.classList.remove('hidden');
});

backFromStarterBtn.addEventListener('click', () => {
    starterSelectionContainer.classList.add('hidden');
    modeSelectionContainer.classList.remove('hidden');
    clearTimeout(autoStartTimer);
});

backToMenuBtn.addEventListener('click', () => {
    gameContainer.classList.add('hidden');
    nameInputContainer.classList.add('hidden');
    starterSelectionContainer.classList.add('hidden');
    modeSelectionContainer.classList.remove('hidden');
    resetGame();
});

// ⭐ New event listener for the Quit button
quitBtn.addEventListener('click', () => {
    window.close();
});

document.addEventListener('DOMContentLoaded', () => {
    resetGame();
    gameContainer.classList.add('hidden');
    nameInputContainer.classList.add('hidden');
    starterSelectionContainer.classList.add('hidden');
    modeSelectionContainer.classList.remove('hidden');
});