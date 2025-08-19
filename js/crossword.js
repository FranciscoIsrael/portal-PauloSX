// Crossword Game for Sexual Education
class CrosswordGame {
    constructor() {
        this.words = {
            easy: [
                { word: 'AMOR', clue: 'Sentimento de afeto profundo', direction: 'across' },
                { word: 'SEXO', clue: 'Conjunto de características biológicas', direction: 'down' },
                { word: 'CORPO', clue: 'Estrutura física do ser humano', direction: 'across' },
                { word: 'VIDA', clue: 'Estado de atividade biológica', direction: 'down' },
                { word: 'SAUDE', clue: 'Estado de bem-estar físico e mental', direction: 'across' }
            ],
            medium: [
                { word: 'PUBERDADE', clue: 'Período de desenvolvimento sexual', direction: 'across' },
                { word: 'HORMONIO', clue: 'Substância química do corpo', direction: 'down' },
                { word: 'OVULACAO', clue: 'Liberação do óvulo pelo ovário', direction: 'across' },
                { word: 'TESTOSTERONA', clue: 'Principal hormônio masculino', direction: 'down' },
                { word: 'MENSTRUACAO', clue: 'Ciclo reprodutivo feminino', direction: 'across' },
                { word: 'GRAVIDEZ', clue: 'Período de gestação', direction: 'down' },
                { word: 'PRESERVATIVO', clue: 'Método de proteção', direction: 'across' }
            ],
            hard: [
                { word: 'CONTRACEPTIVO', clue: 'Método para evitar gravidez', direction: 'across' },
                { word: 'REPRODUCAO', clue: 'Processo de gerar descendentes', direction: 'down' },
                { word: 'FERTILIZACAO', clue: 'União do óvulo com espermatozoide', direction: 'across' },
                { word: 'ESPERMATOZOIDE', clue: 'Célula reprodutiva masculina', direction: 'down' },
                { word: 'CROMOSSOMO', clue: 'Estrutura que carrega genes', direction: 'across' },
                { word: 'PLANEJAMENTO', clue: 'Organização familiar consciente', direction: 'down' }
            ]
        };
        
        this.currentLevel = 'easy';
        this.grid = [];
        this.gridSize = 15;
        this.placedWords = [];
        this.playerName = '';
        this.startTime = null;
        this.endTime = null;
        this.hintsUsed = 0;
        this.maxHints = 3;
        
        this.init();
    }

    init() {
        this.setupGameInterface();
        this.bindEvents();
        this.showLevelSelection();
    }

    setupGameInterface() {
        const gameContainer = document.getElementById('crossword-container');
        if (!gameContainer) return;

        gameContainer.innerHTML = `
            <div class="crossword-header">
                <div class="game-info">
                    <div class="level-display">
                        <span>Nível: <strong id="current-level">Fácil</strong></span>
                    </div>
                    <div class="timer-display">
                        <i class="fas fa-clock"></i>
                        <span id="game-timer">00:00</span>
                    </div>
                    <div class="hints-display">
                        <i class="fas fa-lightbulb"></i>
                        <span id="hints-counter">${this.maxHints} dicas</span>
                    </div>
                </div>
                <div class="game-controls">
                    <button class="btn btn-secondary" id="new-game">Novo Jogo</button>
                    <button class="btn btn-info" id="show-hint">Usar Dica</button>
                    <button class="btn btn-warning" id="reset-grid">Limpar</button>
                </div>
            </div>

            <div class="level-selection" id="level-selection">
                <h3>Escolha o Nível de Dificuldade</h3>
                <div class="level-buttons">
                    <button class="btn btn-success level-btn" data-level="easy">
                        <i class="fas fa-star"></i>
                        Fácil
                        <small>5 palavras simples</small>
                    </button>
                    <button class="btn btn-warning level-btn" data-level="medium">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i>
                        Médio
                        <small>7 palavras moderadas</small>
                    </button>
                    <button class="btn btn-danger level-btn" data-level="hard">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        Difícil
                        <small>6 palavras complexas</small>
                    </button>
                </div>
                <div class="player-name-input">
                    <input type="text" id="player-name" placeholder="Seu nome (opcional)" maxlength="20">
                </div>
            </div>

            <div class="crossword-game hidden" id="crossword-game">
                <div class="game-content">
                    <div class="crossword-grid-container">
                        <div class="crossword-grid" id="crossword-grid"></div>
                    </div>
                    <div class="clues-container">
                        <div class="clues-section">
                            <h4>Horizontal</h4>
                            <ul class="clues-list" id="across-clues"></ul>
                        </div>
                        <div class="clues-section">
                            <h4>Vertical</h4>
                            <ul class="clues-list" id="down-clues"></ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="completion-modal hidden" id="completion-modal">
                <div class="modal-content">
                    <h3>Parabéns!</h3>
                    <div class="completion-stats" id="completion-stats"></div>
                    <div class="completion-actions">
                        <button class="btn btn-primary" id="play-again">Jogar Novamente</button>
                        <button class="btn btn-success" id="next-level">Próximo Nível</button>
                        <a href="pages/charts.html" class="btn btn-info">Ver Ranking</a>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Level selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('level-btn')) {
                this.selectLevel(e.target.dataset.level);
            }
        });

        // Game controls
        const newGameBtn = document.getElementById('new-game');
        const hintBtn = document.getElementById('show-hint');
        const resetBtn = document.getElementById('reset-grid');
        const playAgainBtn = document.getElementById('play-again');
        const nextLevelBtn = document.getElementById('next-level');

        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.showLevelSelection());
        }

        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.useHint());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGrid());
        }

        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.restartCurrentLevel());
        }

        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', () => this.goToNextLevel());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }

    showLevelSelection() {
        document.getElementById('level-selection').classList.remove('hidden');
        document.getElementById('crossword-game').classList.add('hidden');
        document.getElementById('completion-modal').classList.add('hidden');
    }

    selectLevel(level) {
        this.currentLevel = level;
        this.playerName = document.getElementById('player-name').value.trim() || 'Jogador';
        
        document.getElementById('level-selection').classList.add('hidden');
        document.getElementById('crossword-game').classList.remove('hidden');
        
        this.updateLevelDisplay();
        this.startNewGame();
    }

    updateLevelDisplay() {
        const levelNames = {
            easy: 'Fácil',
            medium: 'Médio',
            hard: 'Difícil'
        };
        
        const levelElement = document.getElementById('current-level');
        if (levelElement) {
            levelElement.textContent = levelNames[this.currentLevel];
        }
    }

    startNewGame() {
        this.initializeGrid();
        this.placedWords = [];
        this.hintsUsed = 0;
        this.startTime = new Date();
        this.updateHintsDisplay();
        this.placeWords();
        this.generateClues();
        this.renderGrid();
        this.startTimer();
    }

    initializeGrid() {
        this.grid = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill().map(() => ({
                letter: '',
                number: 0,
                filled: false,
                locked: false,
                isStart: false,
                wordIds: []
            }))
        );
    }

    placeWords() {
        const words = [...this.words[this.currentLevel]];
        Utils.shuffleArray(words);
        
        words.forEach((wordData, index) => {
            const placement = this.findWordPlacement(wordData.word, wordData.direction, index);
            if (placement) {
                this.placeWord(wordData, placement, index + 1);
            }
        });
    }

    findWordPlacement(word, direction, attempts = 0) {
        const maxAttempts = 100;
        if (attempts >= maxAttempts) return null;

        const wordLength = word.length;
        let row, col;

        if (direction === 'across') {
            row = Math.floor(Math.random() * this.gridSize);
            col = Math.floor(Math.random() * (this.gridSize - wordLength + 1));
        } else {
            row = Math.floor(Math.random() * (this.gridSize - wordLength + 1));
            col = Math.floor(Math.random() * this.gridSize);
        }

        // Check if placement is valid
        if (this.canPlaceWord(word, row, col, direction)) {
            return { row, col };
        }

        return this.findWordPlacement(word, direction, attempts + 1);
    }

    canPlaceWord(word, row, col, direction) {
        for (let i = 0; i < word.length; i++) {
            const currentRow = direction === 'across' ? row : row + i;
            const currentCol = direction === 'across' ? col + i : col;

            if (currentRow >= this.gridSize || currentCol >= this.gridSize) {
                return false;
            }

            const cell = this.grid[currentRow][currentCol];
            if (cell.filled && cell.letter !== word[i]) {
                return false;
            }
        }
        return true;
    }

    placeWord(wordData, placement, number) {
        const { word, clue, direction } = wordData;
        const { row, col } = placement;

        const wordInfo = {
            word,
            clue,
            direction,
            number,
            row,
            col,
            completed: false
        };

        this.placedWords.push(wordInfo);

        // Mark start position
        this.grid[row][col].number = number;
        this.grid[row][col].isStart = true;

        // Place letters
        for (let i = 0; i < word.length; i++) {
            const currentRow = direction === 'across' ? row : row + i;
            const currentCol = direction === 'across' ? col + i : col;
            
            const cell = this.grid[currentRow][currentCol];
            cell.letter = word[i];
            cell.filled = true;
            cell.wordIds.push(number);
        }
    }

    generateClues() {
        const acrossClues = document.getElementById('across-clues');
        const downClues = document.getElementById('down-clues');
        
        if (!acrossClues || !downClues) return;

        acrossClues.innerHTML = '';
        downClues.innerHTML = '';

        this.placedWords.forEach(wordInfo => {
            const clueElement = document.createElement('li');
            clueElement.innerHTML = `
                <span class="clue-number">${wordInfo.number}</span>
                <span class="clue-text">${wordInfo.clue}</span>
                <span class="clue-length">(${wordInfo.word.length} letras)</span>
            `;
            clueElement.dataset.wordId = wordInfo.number;
            clueElement.addEventListener('click', () => this.highlightWord(wordInfo.number));

            if (wordInfo.direction === 'across') {
                acrossClues.appendChild(clueElement);
            } else {
                downClues.appendChild(clueElement);
            }
        });
    }

    renderGrid() {
        const gridContainer = document.getElementById('crossword-grid');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.grid[row][col];
                const cellElement = document.createElement('div');
                
                if (cell.filled) {
                    cellElement.className = 'crossword-cell active';
                    cellElement.innerHTML = `
                        ${cell.number ? `<span class="cell-number">${cell.number}</span>` : ''}
                        <input type="text" class="cell-input" maxlength="1" 
                               data-row="${row}" data-col="${col}" 
                               ${cell.locked ? 'readonly' : ''}>
                    `;
                } else {
                    cellElement.className = 'crossword-cell blocked';
                }
                
                gridContainer.appendChild(cellElement);
            }
        }

        // Bind input events
        gridContainer.addEventListener('input', (e) => {
            if (e.target.classList.contains('cell-input')) {
                this.handleCellInput(e);
            }
        });

        gridContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell-input')) {
                this.selectCell(e.target);
            }
        });
    }

    handleCellInput(e) {
        const input = e.target;
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        const letter = input.value.toUpperCase();

        // Update cell
        if (letter.match(/[A-Z]/)) {
            input.value = letter;
            this.checkWordCompletion();
            this.moveToNextCell(row, col);
        } else {
            input.value = '';
        }
    }

    selectCell(input) {
        document.querySelectorAll('.cell-input').forEach(cell => {
            cell.classList.remove('selected');
        });
        input.classList.add('selected');
        input.focus();
    }

    moveToNextCell(row, col) {
        // Find next empty cell in the same word
        const nextInput = this.findNextEmptyCell(row, col);
        if (nextInput) {
            this.selectCell(nextInput);
        }
    }

    findNextEmptyCell(row, col) {
        // Simple implementation - can be improved
        const inputs = document.querySelectorAll('.cell-input');
        for (let input of inputs) {
            if (input.value === '' && !input.readonly) {
                return input;
            }
        }
        return null;
    }

    checkWordCompletion() {
        let allWordsCompleted = true;

        this.placedWords.forEach(wordInfo => {
            let wordCompleted = true;
            
            for (let i = 0; i < wordInfo.word.length; i++) {
                const currentRow = wordInfo.direction === 'across' ? wordInfo.row : wordInfo.row + i;
                const currentCol = wordInfo.direction === 'across' ? wordInfo.col + i : wordInfo.col;
                
                const input = document.querySelector(`.cell-input[data-row="${currentRow}"][data-col="${currentCol}"]`);
                if (!input || input.value !== wordInfo.word[i]) {
                    wordCompleted = false;
                    break;
                }
            }

            wordInfo.completed = wordCompleted;
            
            if (!wordCompleted) {
                allWordsCompleted = false;
            }

            // Update clue styling
            const clueElement = document.querySelector(`[data-word-id="${wordInfo.number}"]`);
            if (clueElement) {
                clueElement.classList.toggle('completed', wordCompleted);
            }
        });

        if (allWordsCompleted) {
            this.completeGame();
        }
    }

    highlightWord(wordId) {
        const wordInfo = this.placedWords.find(w => w.number === wordId);
        if (!wordInfo) return;

        // Remove previous highlights
        document.querySelectorAll('.cell-input').forEach(input => {
            input.classList.remove('highlighted');
        });

        // Highlight word cells
        for (let i = 0; i < wordInfo.word.length; i++) {
            const currentRow = wordInfo.direction === 'across' ? wordInfo.row : wordInfo.row + i;
            const currentCol = wordInfo.direction === 'across' ? wordInfo.col + i : wordInfo.col;
            
            const input = document.querySelector(`.cell-input[data-row="${currentRow}"][data-col="${currentCol}"]`);
            if (input) {
                input.classList.add('highlighted');
            }
        }
    }

    useHint() {
        if (this.hintsUsed >= this.maxHints) {
            alert('Você já usou todas as dicas disponíveis!');
            return;
        }

        // Find first empty cell in an incomplete word
        for (let wordInfo of this.placedWords) {
            if (!wordInfo.completed) {
                for (let i = 0; i < wordInfo.word.length; i++) {
                    const currentRow = wordInfo.direction === 'across' ? wordInfo.row : wordInfo.row + i;
                    const currentCol = wordInfo.direction === 'across' ? wordInfo.col + i : wordInfo.col;
                    
                    const input = document.querySelector(`.cell-input[data-row="${currentRow}"][data-col="${currentCol}"]`);
                    if (input && input.value === '') {
                        input.value = wordInfo.word[i];
                        input.classList.add('hint-letter');
                        this.hintsUsed++;
                        this.updateHintsDisplay();
                        this.checkWordCompletion();
                        return;
                    }
                }
            }
        }
    }

    updateHintsDisplay() {
        const hintsCounter = document.getElementById('hints-counter');
        if (hintsCounter) {
            const remaining = this.maxHints - this.hintsUsed;
            hintsCounter.textContent = `${remaining} dicas`;
            
            const hintBtn = document.getElementById('show-hint');
            if (hintBtn) {
                hintBtn.disabled = remaining === 0;
            }
        }
    }

    resetGrid() {
        document.querySelectorAll('.cell-input').forEach(input => {
            if (!input.readonly) {
                input.value = '';
                input.classList.remove('hint-letter');
            }
        });

        this.placedWords.forEach(wordInfo => {
            wordInfo.completed = false;
        });

        document.querySelectorAll('.clue-element').forEach(clue => {
            clue.classList.remove('completed');
        });
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const now = new Date();
            const elapsed = Math.floor((now - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            
            const timerElement = document.getElementById('game-timer');
            if (timerElement) {
                timerElement.textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
    }

    completeGame() {
        this.endTime = new Date();
        clearInterval(this.timerInterval);
        
        const gameTime = Math.floor((this.endTime - this.startTime) / 1000);
        const score = this.calculateScore(gameTime);
        
        this.showCompletionModal(gameTime, score);
        this.saveScore(gameTime, score);
    }

    calculateScore(timeSeconds) {
        const baseScore = 1000;
        const levelMultiplier = { easy: 1, medium: 1.5, hard: 2 };
        const timeBonus = Math.max(0, 300 - timeSeconds); // Bonus for completing under 5 minutes
        const hintPenalty = this.hintsUsed * 50;
        
        return Math.round(
            baseScore * levelMultiplier[this.currentLevel] + 
            timeBonus - 
            hintPenalty
        );
    }

    showCompletionModal(gameTime, score) {
        const modal = document.getElementById('completion-modal');
        const stats = document.getElementById('completion-stats');
        
        if (!modal || !stats) return;

        const timeFormatted = this.formatTime(gameTime);
        
        stats.innerHTML = `
            <div class="stat-item">
                <i class="fas fa-trophy"></i>
                <span>Pontuação: <strong>${score}</strong></span>
            </div>
            <div class="stat-item">
                <i class="fas fa-clock"></i>
                <span>Tempo: <strong>${timeFormatted}</strong></span>
            </div>
            <div class="stat-item">
                <i class="fas fa-lightbulb"></i>
                <span>Dicas Usadas: <strong>${this.hintsUsed}</strong></span>
            </div>
            <div class="stat-item">
                <i class="fas fa-level-up-alt"></i>
                <span>Nível: <strong>${this.currentLevel.toUpperCase()}</strong></span>
            </div>
        `;

        modal.classList.remove('hidden');

        // Show/hide next level button
        const nextLevelBtn = document.getElementById('next-level');
        if (nextLevelBtn) {
            const canAdvance = this.currentLevel === 'easy' || this.currentLevel === 'medium';
            nextLevelBtn.style.display = canAdvance ? 'inline-block' : 'none';
        }
    }

    saveScore(gameTime, score) {
        const scoreData = {
            playerName: this.playerName,
            level: this.currentLevel,
            score: score,
            time: gameTime,
            hintsUsed: this.hintsUsed
        };
        
        StorageManager.saveCrosswordScore(scoreData);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    restartCurrentLevel() {
        document.getElementById('completion-modal').classList.add('hidden');
        this.startNewGame();
    }

    goToNextLevel() {
        const levels = ['easy', 'medium', 'hard'];
        const currentIndex = levels.indexOf(this.currentLevel);
        
        if (currentIndex < levels.length - 1) {
            this.currentLevel = levels[currentIndex + 1];
            document.getElementById('completion-modal').classList.add('hidden');
            this.updateLevelDisplay();
            this.startNewGame();
        }
    }

    handleKeyPress(e) {
        const activeInput = document.activeElement;
        if (!activeInput || !activeInput.classList.contains('cell-input')) return;

        const row = parseInt(activeInput.dataset.row);
        const col = parseInt(activeInput.dataset.col);

        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.moveTo(row - 1, col);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.moveTo(row + 1, col);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.moveTo(row, col - 1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.moveTo(row, col + 1);
                break;
            case 'Backspace':
                if (activeInput.value === '') {
                    // Move to previous cell and clear it
                    this.moveToPrevious(row, col);
                }
                break;
        }
    }

    moveTo(row, col) {
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            const targetInput = document.querySelector(`.cell-input[data-row="${row}"][data-col="${col}"]`);
            if (targetInput) {
                this.selectCell(targetInput);
            }
        }
    }

    moveToPrevious(row, col) {
        // Find previous filled cell
        for (let i = row * this.gridSize + col - 1; i >= 0; i--) {
            const r = Math.floor(i / this.gridSize);
            const c = i % this.gridSize;
            
            if (this.grid[r][c].filled) {
                const input = document.querySelector(`.cell-input[data-row="${r}"][data-col="${c}"]`);
                if (input && !input.readonly) {
                    input.value = '';
                    this.selectCell(input);
                    return;
                }
            }
        }
    }
}

// Initialize crossword when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const crosswordContainer = document.getElementById('crossword-container');
    if (crosswordContainer) {
        window.crosswordGame = new CrosswordGame();
    }
});

// Export for use in other modules
window.CrosswordGame = CrosswordGame;
