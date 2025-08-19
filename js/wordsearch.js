// Word Search Game for Sexual Education
class WordSearchGame {
    constructor() {
        this.words = [
            'PUBERDADE', 'HORMONIO', 'OVULACAO', 'MENSTRUACAO', 'TESTOSTERONA',
            'ESTROGENO', 'PROGESTERONA', 'FERTILIZACAO', 'GRAVIDEZ', 'CONTRACEPTIVO',
            'PRESERVATIVO', 'PREVENCAO', 'EDUCACAO', 'SEXUALIDADE', 'REPRODUCAO',
            'ANATOMIA', 'FISIOLOGIA', 'DESENVOLVIMENTO', 'ADOLESCENCIA', 'MATURIDADE',
            'RESPONSABILIDADE', 'CONSENTIMENTO', 'RESPEITO', 'DIVERSIDADE', 'ORIENTACAO',
            'IDENTIDADE', 'RELACIONAMENTO', 'COMUNICACAO', 'INTIMIDADE', 'AFETIVIDADE'
        ];
        
        this.gridSize = 20;
        this.grid = [];
        this.selectedWords = [];
        this.foundWords = [];
        this.currentSelection = [];
        this.isSelecting = false;
        this.startTime = null;
        this.endTime = null;
        this.difficulty = 'medium';
        this.playerName = '';
        
        this.difficulties = {
            easy: { wordCount: 8, gridSize: 15 },
            medium: { wordCount: 12, gridSize: 18 },
            hard: { wordCount: 16, gridSize: 22 }
        };
        
        this.init();
    }

    init() {
        this.setupGameInterface();
        this.bindEvents();
        this.showDifficultySelection();
    }

    setupGameInterface() {
        const gameContainer = document.getElementById('wordsearch-container');
        if (!gameContainer) return;

        gameContainer.innerHTML = `
            <div class="wordsearch-header">
                <div class="game-info">
                    <div class="difficulty-display">
                        <span>Dificuldade: <strong id="current-difficulty">Médio</strong></span>
                    </div>
                    <div class="timer-display">
                        <i class="fas fa-clock"></i>
                        <span id="game-timer">00:00</span>
                    </div>
                    <div class="progress-display">
                        <span id="words-progress">0/12 palavras</span>
                    </div>
                </div>
                <div class="game-controls">
                    <button class="btn btn-secondary" id="new-game">Novo Jogo</button>
                    <button class="btn btn-info" id="show-hint">Mostrar Dica</button>
                    <button class="btn btn-warning" id="restart-game">Reiniciar</button>
                </div>
            </div>

            <div class="difficulty-selection" id="difficulty-selection">
                <h3>Escolha a Dificuldade</h3>
                <div class="difficulty-options">
                    <div class="difficulty-card" data-difficulty="easy">
                        <i class="fas fa-star"></i>
                        <h4>Fácil</h4>
                        <p>8 palavras</p>
                        <p>Grade 15x15</p>
                        <small>Ideal para iniciantes</small>
                    </div>
                    <div class="difficulty-card" data-difficulty="medium">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i>
                        <h4>Médio</h4>
                        <p>12 palavras</p>
                        <p>Grade 18x18</p>
                        <small>Desafio moderado</small>
                    </div>
                    <div class="difficulty-card" data-difficulty="hard">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        <h4>Difícil</h4>
                        <p>16 palavras</p>
                        <p>Grade 22x22</p>
                        <small>Para especialistas</small>
                    </div>
                </div>
                <div class="player-name-section">
                    <input type="text" id="player-name" placeholder="Seu nome (opcional)" maxlength="20">
                    <button class="btn btn-primary" id="start-game">Iniciar Jogo</button>
                </div>
            </div>

            <div class="wordsearch-game hidden" id="wordsearch-game">
                <div class="game-layout">
                    <div class="grid-section">
                        <div class="grid-container">
                            <div class="wordsearch-grid" id="wordsearch-grid"></div>
                        </div>
                    </div>
                    <div class="words-section">
                        <h4>Palavras para Encontrar</h4>
                        <div class="words-list" id="words-list"></div>
                        <div class="game-stats">
                            <div class="stat-item">
                                <i class="fas fa-search"></i>
                                <span>Encontradas: <span id="found-count">0</span></span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-target"></i>
                                <span>Restantes: <span id="remaining-count">0</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="completion-modal hidden" id="completion-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="completion-header">
                        <h3>Parabéns!</h3>
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="completion-stats" id="completion-stats"></div>
                    <div class="completion-actions">
                        <button class="btn btn-primary" id="play-again">Jogar Novamente</button>
                        <button class="btn btn-success" id="next-difficulty">Próxima Dificuldade</button>
                        <a href="pages/charts.html" class="btn btn-info">Ver Rankings</a>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Difficulty selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.difficulty-card')) {
                const card = e.target.closest('.difficulty-card');
                this.selectDifficulty(card.dataset.difficulty);
            }
        });

        // Game start
        const startBtn = document.getElementById('start-game');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }

        // Game controls
        const newGameBtn = document.getElementById('new-game');
        const hintBtn = document.getElementById('show-hint');
        const restartBtn = document.getElementById('restart-game');
        const playAgainBtn = document.getElementById('play-again');
        const nextDifficultyBtn = document.getElementById('next-difficulty');

        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.showDifficultySelection());
        }

        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restartGame());
        }

        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.playAgain());
        }

        if (nextDifficultyBtn) {
            nextDifficultyBtn.addEventListener('click', () => this.nextDifficulty());
        }

        // Grid selection events
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Touch events for mobile
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    showDifficultySelection() {
        document.getElementById('difficulty-selection').classList.remove('hidden');
        document.getElementById('wordsearch-game').classList.add('hidden');
        document.getElementById('completion-modal').classList.add('hidden');
    }

    selectDifficulty(difficulty) {
        // Update selection display
        document.querySelectorAll('.difficulty-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('selected');
        this.difficulty = difficulty;
    }

    startGame() {
        this.playerName = document.getElementById('player-name').value.trim() || 'Jogador';
        
        if (!this.difficulty) {
            alert('Por favor, selecione uma dificuldade.');
            return;
        }

        document.getElementById('difficulty-selection').classList.add('hidden');
        document.getElementById('wordsearch-game').classList.remove('hidden');
        
        this.initializeGame();
    }

    initializeGame() {
        const config = this.difficulties[this.difficulty];
        this.gridSize = config.gridSize;
        this.selectedWords = Utils.shuffleArray([...this.words]).slice(0, config.wordCount);
        this.foundWords = [];
        this.currentSelection = [];
        this.isSelecting = false;
        this.startTime = new Date();
        
        this.updateDifficultyDisplay();
        this.createGrid();
        this.placeWords();
        this.fillEmptySpaces();
        this.renderGrid();
        this.renderWordsList();
        this.updateProgress();
        this.startTimer();
    }

    updateDifficultyDisplay() {
        const difficultyNames = {
            easy: 'Fácil',
            medium: 'Médio',
            hard: 'Difícil'
        };
        
        const difficultyElement = document.getElementById('current-difficulty');
        if (difficultyElement) {
            difficultyElement.textContent = difficultyNames[this.difficulty];
        }
    }

    createGrid() {
        this.grid = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill().map(() => ({
                letter: '',
                isWordLetter: false,
                wordId: null,
                found: false
            }))
        );
    }

    placeWords() {
        const directions = [
            { dx: 1, dy: 0 },   // horizontal
            { dx: 0, dy: 1 },   // vertical
            { dx: 1, dy: 1 },   // diagonal down-right
            { dx: 1, dy: -1 },  // diagonal up-right
            { dx: -1, dy: 0 },  // horizontal reverse
            { dx: 0, dy: -1 },  // vertical reverse
            { dx: -1, dy: -1 }, // diagonal up-left
            { dx: -1, dy: 1 }   // diagonal down-left
        ];

        this.selectedWords.forEach((word, wordIndex) => {
            let placed = false;
            let attempts = 0;
            
            while (!placed && attempts < 100) {
                const direction = directions[Math.floor(Math.random() * directions.length)];
                const startRow = Math.floor(Math.random() * this.gridSize);
                const startCol = Math.floor(Math.random() * this.gridSize);
                
                if (this.canPlaceWord(word, startRow, startCol, direction)) {
                    this.placeWord(word, startRow, startCol, direction, wordIndex);
                    placed = true;
                }
                attempts++;
            }
            
            if (!placed) {
                console.warn(`Could not place word: ${word}`);
            }
        });
    }

    canPlaceWord(word, startRow, startCol, direction) {
        const { dx, dy } = direction;
        
        for (let i = 0; i < word.length; i++) {
            const row = startRow + i * dy;
            const col = startCol + i * dx;
            
            if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
                return false;
            }
            
            const cell = this.grid[row][col];
            if (cell.letter && cell.letter !== word[i]) {
                return false;
            }
        }
        
        return true;
    }

    placeWord(word, startRow, startCol, direction, wordIndex) {
        const { dx, dy } = direction;
        
        for (let i = 0; i < word.length; i++) {
            const row = startRow + i * dy;
            const col = startCol + i * dx;
            
            this.grid[row][col] = {
                letter: word[i],
                isWordLetter: true,
                wordId: wordIndex,
                found: false,
                word: word,
                position: i
            };
        }
    }

    fillEmptySpaces() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (!this.grid[row][col].letter) {
                    this.grid[row][col] = {
                        letter: letters[Math.floor(Math.random() * letters.length)],
                        isWordLetter: false,
                        wordId: null,
                        found: false
                    };
                }
            }
        }
    }

    renderGrid() {
        const gridContainer = document.getElementById('wordsearch-grid');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        gridContainer.style.fontSize = this.gridSize > 18 ? '0.8rem' : '1rem';

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.grid[row][col];
                const cellElement = document.createElement('div');
                cellElement.className = 'grid-cell';
                cellElement.textContent = cell.letter;
                cellElement.dataset.row = row;
                cellElement.dataset.col = col;
                
                if (cell.found) {
                    cellElement.classList.add('found');
                }
                
                gridContainer.appendChild(cellElement);
            }
        }
    }

    renderWordsList() {
        const wordsListContainer = document.getElementById('words-list');
        if (!wordsListContainer) return;

        wordsListContainer.innerHTML = this.selectedWords.map((word, index) => `
            <div class="word-item ${this.foundWords.includes(word) ? 'found' : ''}" data-word="${word}">
                <span class="word-text">${word}</span>
                ${this.foundWords.includes(word) ? '<i class="fas fa-check"></i>' : ''}
            </div>
        `).join('');
    }

    handleMouseDown(e) {
        if (!e.target.classList.contains('grid-cell')) return;
        
        e.preventDefault();
        this.isSelecting = true;
        this.currentSelection = [];
        
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        this.addToSelection(row, col);
    }

    handleMouseMove(e) {
        if (!this.isSelecting || !e.target.classList.contains('grid-cell')) return;
        
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        this.updateSelection(row, col);
    }

    handleMouseUp(e) {
        if (!this.isSelecting) return;
        
        this.isSelecting = false;
        this.checkSelection();
        this.clearSelection();
    }

    handleTouchStart(e) {
        if (!e.target.classList.contains('grid-cell')) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('grid-cell')) {
            this.isSelecting = true;
            this.currentSelection = [];
            
            const row = parseInt(element.dataset.row);
            const col = parseInt(element.dataset.col);
            
            this.addToSelection(row, col);
        }
    }

    handleTouchMove(e) {
        if (!this.isSelecting) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('grid-cell')) {
            const row = parseInt(element.dataset.row);
            const col = parseInt(element.dataset.col);
            
            this.updateSelection(row, col);
        }
    }

    handleTouchEnd(e) {
        if (!this.isSelecting) return;
        
        e.preventDefault();
        this.isSelecting = false;
        this.checkSelection();
        this.clearSelection();
    }

    addToSelection(row, col) {
        this.currentSelection = [{ row, col }];
        this.highlightSelection();
    }

    updateSelection(row, col) {
        if (this.currentSelection.length === 0) return;
        
        const start = this.currentSelection[0];
        const selection = this.getLinePath(start.row, start.col, row, col);
        
        if (selection.length > 1) {
            this.currentSelection = selection;
            this.highlightSelection();
        }
    }

    getLinePath(startRow, startCol, endRow, endCol) {
        const path = [];
        
        const deltaRow = endRow - startRow;
        const deltaCol = endCol - startCol;
        
        // Check if it's a valid line (horizontal, vertical, or diagonal)
        const isHorizontal = deltaRow === 0;
        const isVertical = deltaCol === 0;
        const isDiagonal = Math.abs(deltaRow) === Math.abs(deltaCol);
        
        if (!isHorizontal && !isVertical && !isDiagonal) {
            return [{ row: startRow, col: startCol }];
        }
        
        const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
        const stepRow = steps > 0 ? deltaRow / steps : 0;
        const stepCol = steps > 0 ? deltaCol / steps : 0;
        
        for (let i = 0; i <= steps; i++) {
            const row = Math.round(startRow + i * stepRow);
            const col = Math.round(startCol + i * stepCol);
            path.push({ row, col });
        }
        
        return path;
    }

    highlightSelection() {
        // Clear previous highlights
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        // Highlight current selection
        this.currentSelection.forEach(({ row, col }) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('selected');
            }
        });
    }

    checkSelection() {
        if (this.currentSelection.length < 2) return;
        
        const selectedLetters = this.currentSelection.map(({ row, col }) => 
            this.grid[row][col].letter
        ).join('');
        
        const reversedLetters = selectedLetters.split('').reverse().join('');
        
        // Check if selected letters match any word
        for (const word of this.selectedWords) {
            if ((selectedLetters === word || reversedLetters === word) && !this.foundWords.includes(word)) {
                this.foundWord(word);
                break;
            }
        }
    }

    foundWord(word) {
        this.foundWords.push(word);
        
        // Mark cells as found
        this.currentSelection.forEach(({ row, col }) => {
            this.grid[row][col].found = true;
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('found');
            }
        });
        
        // Update display
        this.renderWordsList();
        this.updateProgress();
        
        // Show word found feedback
        this.showWordFoundFeedback(word);
        
        // Check if game is complete
        if (this.foundWords.length === this.selectedWords.length) {
            this.completeGame();
        }
    }

    showWordFoundFeedback(word) {
        const feedback = document.createElement('div');
        feedback.className = 'word-found-feedback';
        feedback.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${word} encontrada!</span>
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }

    clearSelection() {
        this.currentSelection = [];
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('selected');
        });
    }

    updateProgress() {
        const progressElement = document.getElementById('words-progress');
        const foundCountElement = document.getElementById('found-count');
        const remainingCountElement = document.getElementById('remaining-count');
        
        const found = this.foundWords.length;
        const total = this.selectedWords.length;
        const remaining = total - found;
        
        if (progressElement) {
            progressElement.textContent = `${found}/${total} palavras`;
        }
        
        if (foundCountElement) {
            foundCountElement.textContent = found;
        }
        
        if (remainingCountElement) {
            remainingCountElement.textContent = remaining;
        }
    }

    showHint() {
        // Find first unfound word
        const unfoundWord = this.selectedWords.find(word => !this.foundWords.includes(word));
        if (!unfoundWord) return;
        
        // Find the word's position in grid
        let wordCells = [];
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.grid[row][col];
                if (cell.word === unfoundWord && !cell.found) {
                    wordCells.push({ row, col });
                }
            }
        }
        
        if (wordCells.length === 0) return;
        
        // Highlight first few letters of the word
        const hintCells = wordCells.slice(0, Math.min(3, wordCells.length));
        
        hintCells.forEach(({ row, col }) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('hint');
                setTimeout(() => {
                    cell.classList.remove('hint');
                }, 3000);
            }
        });
        
        // Show hint message
        window.app?.showNotification(`Dica: Procure por "${unfoundWord}"`, 'info');
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
        const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 };
        const timeBonus = Math.max(0, 600 - timeSeconds); // Bonus for completing under 10 minutes
        
        return Math.round(baseScore * difficultyMultiplier[this.difficulty] + timeBonus);
    }

    showCompletionModal(gameTime, score) {
        const modal = document.getElementById('completion-modal');
        const stats = document.getElementById('completion-stats');
        
        if (!modal || !stats) return;

        const timeFormatted = this.formatTime(gameTime);
        
        stats.innerHTML = `
            <div class="stat-group">
                <div class="stat-item">
                    <i class="fas fa-trophy"></i>
                    <span>Pontuação: <strong>${score}</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span>Tempo: <strong>${timeFormatted}</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-search"></i>
                    <span>Palavras Encontradas: <strong>${this.foundWords.length}/${this.selectedWords.length}</strong></span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-level-up-alt"></i>
                    <span>Dificuldade: <strong>${this.difficulty.toUpperCase()}</strong></span>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');

        // Show/hide next difficulty button
        const nextBtn = document.getElementById('next-difficulty');
        if (nextBtn) {
            const canAdvance = this.difficulty !== 'hard';
            nextBtn.style.display = canAdvance ? 'inline-block' : 'none';
        }
    }

    saveScore(gameTime, score) {
        const scoreData = {
            playerName: this.playerName,
            difficulty: this.difficulty,
            time: gameTime,
            score: score,
            wordsFound: this.foundWords.length,
            totalWords: this.selectedWords.length
        };
        
        StorageManager.saveWordSearchScore(scoreData);
        
        // Update progress
        StorageManager.updateProgress('wordsearch_completed', true);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    restartGame() {
        this.initializeGame();
    }

    playAgain() {
        document.getElementById('completion-modal').classList.add('hidden');
        this.initializeGame();
    }

    nextDifficulty() {
        const difficulties = ['easy', 'medium', 'hard'];
        const currentIndex = difficulties.indexOf(this.difficulty);
        
        if (currentIndex < difficulties.length - 1) {
            this.difficulty = difficulties[currentIndex + 1];
            document.getElementById('completion-modal').classList.add('hidden');
            this.initializeGame();
        }
    }
}

// Initialize word search game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const wordsearchContainer = document.getElementById('wordsearch-container');
    if (wordsearchContainer) {
        window.wordSearchGame = new WordSearchGame();
    }
});

// Export for use in other modules
window.WordSearchGame = WordSearchGame;
