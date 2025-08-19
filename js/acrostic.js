// Acrostic Game for Sexual Education
class AcrosticGame {
    constructor() {
        this.baseWord = 'EDUCAÇÃOSEXUAL';
        this.examples = {
            'E': 'Ensino responsável e científico',
            'D': 'Desenvolvimento saudável da sexualidade',
            'U': 'União de conhecimento e prática',
            'C': 'Cuidado com o próprio corpo',
            'A': 'Autonomia nas decisões pessoais',
            'Ç': 'Ção preventiva contra riscos',
            'Ã': 'Ão educativa transformadora',
            'O': 'Orientação profissional qualificada',
            'S': 'Saúde sexual e reprodutiva',
            'E': 'Educação baseada em evidências',
            'X': 'eXperiência respeitosa e segura',
            'U': 'Unidade entre corpo e mente',
            'A': 'Amor próprio e autoestima',
            'L': 'Liberdade de escolha consciente'
        };
        
        this.userAcrostics = [];
        this.currentAcrostic = {};
        
        this.init();
    }

    init() {
        this.setupGameInterface();
        this.bindEvents();
        this.showExample();
        this.loadUserAcrostics();
        this.displayRanking();
    }

    setupGameInterface() {
        const gameContainer = document.getElementById('acrostic-container');
        if (!gameContainer) return;

        gameContainer.innerHTML = `
            <div class="acrostic-header">
                <h2>Jogo do Acróstico - Educação Sexual</h2>
                <p>Crie frases criativas para cada letra da palavra "EDUCAÇÃO SEXUAL"</p>
            </div>

            <div class="acrostic-example">
                <h3>Exemplo de Acróstico</h3>
                <div class="example-acrostic" id="example-acrostic">
                    ${this.renderAcrosticExample()}
                </div>
            </div>

            <div class="acrostic-creator">
                <h3>Crie seu Acróstico</h3>
                <div class="creator-form">
                    <div class="player-info">
                        <input type="text" id="player-name" placeholder="Seu nome" maxlength="20" required>
                        <button class="btn btn-info" id="shuffle-word">Embaralhar Palavra</button>
                    </div>
                    
                    <div class="acrostic-form" id="acrostic-form">
                        ${this.renderAcrosticForm()}
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-primary" id="save-acrostic">Salvar Acróstico</button>
                        <button class="btn btn-secondary" id="clear-form">Limpar Formulário</button>
                        <button class="btn btn-info" id="preview-acrostic">Visualizar</button>
                    </div>
                </div>
            </div>

            <div class="acrostic-preview hidden" id="acrostic-preview">
                <h3>Pré-visualização</h3>
                <div class="preview-content" id="preview-content"></div>
                <div class="preview-actions">
                    <button class="btn btn-success" id="confirm-save">Confirmar e Salvar</button>
                    <button class="btn btn-secondary" id="edit-more">Continuar Editando</button>
                </div>
            </div>

            <div class="acrostic-ranking">
                <h3>Ranking dos Melhores Acrósticos</h3>
                <div class="ranking-controls">
                    <button class="btn btn-sm btn-outline" id="sort-by-votes">Ordenar por Votos</button>
                    <button class="btn btn-sm btn-outline" id="sort-by-date">Ordenar por Data</button>
                    <button class="btn btn-sm btn-outline" id="show-my-acrostics">Meus Acrósticos</button>
                </div>
                <div class="ranking-list" id="ranking-list"></div>
            </div>

            <div class="acrostic-tips">
                <h3>Dicas para um Bom Acróstico</h3>
                <ul>
                    <li>Use frases que façam sentido e sejam educativas</li>
                    <li>Relacione cada frase com temas de educação sexual</li>
                    <li>Seja criativo mas mantenha o conteúdo apropriado</li>
                    <li>Tente criar frases que rimem ou tenham ritmo</li>
                    <li>Use vocabulário científico quando apropriado</li>
                </ul>
            </div>
        `;
    }

    bindEvents() {
        const shuffleBtn = document.getElementById('shuffle-word');
        const saveBtn = document.getElementById('save-acrostic');
        const clearBtn = document.getElementById('clear-form');
        const previewBtn = document.getElementById('preview-acrostic');
        const confirmBtn = document.getElementById('confirm-save');
        const editBtn = document.getElementById('edit-more');
        const sortVotesBtn = document.getElementById('sort-by-votes');
        const sortDateBtn = document.getElementById('sort-by-date');
        const myAcrosticsBtn = document.getElementById('show-my-acrostics');

        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.shuffleWord());
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.previewAcrostic());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearForm());
        }

        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewAcrostic());
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.saveAcrostic());
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => this.hidePreview());
        }

        if (sortVotesBtn) {
            sortVotesBtn.addEventListener('click', () => this.displayRanking('votes'));
        }

        if (sortDateBtn) {
            sortDateBtn.addEventListener('click', () => this.displayRanking('date'));
        }

        if (myAcrosticsBtn) {
            myAcrosticsBtn.addEventListener('click', () => this.showMyAcrostics());
        }

        // Auto-save form data
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('acrostic-input')) {
                this.autoSaveProgress();
            }
        });
    }

    renderAcrosticExample() {
        return this.baseWord.split('').map(letter => `
            <div class="acrostic-line example-line">
                <span class="letter">${letter}</span>
                <span class="phrase">${this.examples[letter]}</span>
            </div>
        `).join('');
    }

    renderAcrosticForm() {
        return this.baseWord.split('').map((letter, index) => `
            <div class="acrostic-input-group">
                <label class="letter-label">${letter}</label>
                <input type="text" 
                       class="acrostic-input" 
                       id="input-${index}" 
                       data-letter="${letter}"
                       placeholder="Digite uma frase que comece com '${letter}'..."
                       maxlength="100">
                <div class="input-feedback" id="feedback-${index}"></div>
            </div>
        `).join('');
    }

    showExample() {
        // Add animation to example
        const exampleLines = document.querySelectorAll('.example-line');
        exampleLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '0';
                line.style.transform = 'translateX(-20px)';
                line.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateX(0)';
                }, 100);
            }, index * 200);
        });
    }

    shuffleWord() {
        // Create a shuffled version for variety
        const shuffledWords = [
            'EDUCAÇÃOSEXUAL',
            'SEXUALIDADE',
            'REPRODUÇÃO',
            'PREVENÇÃO',
            'SAÚDE'
        ];
        
        const randomWord = shuffledWords[Math.floor(Math.random() * shuffledWords.length)];
        this.baseWord = randomWord;
        
        // Update form
        const formContainer = document.getElementById('acrostic-form');
        if (formContainer) {
            formContainer.innerHTML = this.renderAcrosticForm();
        }
    }

    previewAcrostic() {
        const playerName = document.getElementById('player-name').value.trim();
        if (!playerName) {
            alert('Por favor, digite seu nome antes de continuar.');
            return;
        }

        const acrosticData = this.collectAcrosticData();
        if (!this.validateAcrostic(acrosticData)) {
            return;
        }

        this.displayPreview(acrosticData);
    }

    collectAcrosticData() {
        const playerName = document.getElementById('player-name').value.trim();
        const acrostic = {};
        
        this.baseWord.split('').forEach((letter, index) => {
            const input = document.getElementById(`input-${index}`);
            if (input) {
                acrostic[letter] = input.value.trim();
            }
        });

        return {
            playerName,
            word: this.baseWord,
            acrostic,
            timestamp: new Date().toISOString()
        };
    }

    validateAcrostic(data) {
        let isValid = true;
        const errors = [];

        // Check if all fields are filled
        Object.entries(data.acrostic).forEach(([letter, phrase], index) => {
            const feedback = document.getElementById(`feedback-${index}`);
            
            if (!phrase) {
                errors.push(`Preencha a frase para a letra '${letter}'`);
                feedback.textContent = 'Campo obrigatório';
                feedback.className = 'input-feedback error';
                isValid = false;
            } else if (phrase.length < 10) {
                errors.push(`A frase para '${letter}' deve ter pelo menos 10 caracteres`);
                feedback.textContent = 'Frase muito curta (mín. 10 caracteres)';
                feedback.className = 'input-feedback warning';
            } else if (!phrase.toLowerCase().startsWith(letter.toLowerCase())) {
                errors.push(`A frase para '${letter}' deve começar com esta letra`);
                feedback.textContent = `Deve começar com '${letter}'`;
                feedback.className = 'input-feedback error';
                isValid = false;
            } else {
                feedback.textContent = 'Ótimo!';
                feedback.className = 'input-feedback success';
            }
        });

        if (!isValid) {
            alert('Por favor, corrija os erros antes de continuar:\n' + errors.join('\n'));
        }

        return isValid;
    }

    displayPreview(data) {
        const previewContainer = document.getElementById('acrostic-preview');
        const previewContent = document.getElementById('preview-content');
        
        if (!previewContainer || !previewContent) return;

        previewContent.innerHTML = `
            <div class="preview-header">
                <h4>Acróstico de ${Utils.sanitizeHTML(data.playerName)}</h4>
                <p>Palavra: <strong>${data.word}</strong></p>
            </div>
            <div class="preview-acrostic">
                ${Object.entries(data.acrostic).map(([letter, phrase]) => `
                    <div class="acrostic-line preview-line">
                        <span class="letter">${letter}</span>
                        <span class="phrase">${Utils.sanitizeHTML(phrase)}</span>
                    </div>
                `).join('')}
            </div>
        `;

        this.currentAcrostic = data;
        previewContainer.classList.remove('hidden');
        
        // Smooth scroll to preview
        previewContainer.scrollIntoView({ behavior: 'smooth' });
    }

    hidePreview() {
        const previewContainer = document.getElementById('acrostic-preview');
        if (previewContainer) {
            previewContainer.classList.add('hidden');
        }
    }

    saveAcrostic() {
        if (!this.currentAcrostic.playerName) {
            alert('Erro: dados do acróstico não encontrados.');
            return;
        }

        // Add additional data
        this.currentAcrostic.id = Utils.generateId();
        this.currentAcrostic.votes = 0;
        this.currentAcrostic.quality = this.calculateQuality(this.currentAcrostic);

        // Save to storage
        StorageManager.saveAcrosticEntry(this.currentAcrostic);

        // Show success message
        this.showSuccessMessage();

        // Reset form
        this.clearForm();
        this.hidePreview();

        // Update ranking
        this.displayRanking();

        // Update progress
        StorageManager.updateProgress('acrostic_created', true);
    }

    calculateQuality(acrosticData) {
        let score = 0;
        const phrases = Object.values(acrosticData.acrostic);
        
        // Length bonus
        phrases.forEach(phrase => {
            if (phrase.length > 20) score += 2;
            else if (phrase.length > 15) score += 1;
        });

        // Educational content bonus
        const educationalTerms = [
            'educação', 'saúde', 'prevenção', 'cuidado', 'respeito',
            'conhecimento', 'responsabilidade', 'desenvolvimento', 'sexualidade'
        ];
        
        phrases.forEach(phrase => {
            educationalTerms.forEach(term => {
                if (phrase.toLowerCase().includes(term)) {
                    score += 1;
                }
            });
        });

        // Creativity bonus (varied word usage)
        const uniqueWords = new Set();
        phrases.forEach(phrase => {
            phrase.split(' ').forEach(word => {
                if (word.length > 3) {
                    uniqueWords.add(word.toLowerCase());
                }
            });
        });
        
        score += Math.min(uniqueWords.size / 5, 5); // Max 5 points for vocabulary diversity

        return Math.min(score, 50); // Cap at 50 points
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'alert alert-success';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Acróstico salvo com sucesso! Obrigado por participar.
        `;
        
        const container = document.getElementById('acrostic-container');
        container.insertBefore(message, container.firstChild);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 5000);
    }

    clearForm() {
        const inputs = document.querySelectorAll('.acrostic-input');
        inputs.forEach(input => {
            input.value = '';
        });

        const feedbacks = document.querySelectorAll('.input-feedback');
        feedbacks.forEach(feedback => {
            feedback.textContent = '';
            feedback.className = 'input-feedback';
        });

        this.currentAcrostic = {};
    }

    autoSaveProgress() {
        const data = this.collectAcrosticData();
        localStorage.setItem('acrostic_draft', JSON.stringify(data));
    }

    loadDraft() {
        const draft = localStorage.getItem('acrostic_draft');
        if (draft) {
            try {
                const data = JSON.parse(draft);
                
                // Restore player name
                const nameInput = document.getElementById('player-name');
                if (nameInput) {
                    nameInput.value = data.playerName || '';
                }

                // Restore acrostic inputs
                Object.entries(data.acrostic || {}).forEach(([letter, phrase], index) => {
                    const input = document.getElementById(`input-${index}`);
                    if (input) {
                        input.value = phrase;
                    }
                });
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }

    displayRanking(sortBy = 'votes') {
        const rankingList = document.getElementById('ranking-list');
        if (!rankingList) return;

        let acrostics = StorageManager.getAcrosticEntries();
        
        // Sort based on criteria
        if (sortBy === 'votes') {
            acrostics.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        } else if (sortBy === 'date') {
            acrostics.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } else if (sortBy === 'quality') {
            acrostics.sort((a, b) => (b.quality || 0) - (a.quality || 0));
        }

        if (acrostics.length === 0) {
            rankingList.innerHTML = `
                <div class="empty-ranking">
                    <i class="fas fa-pen"></i>
                    <p>Ainda não há acrósticos salvos. Seja o primeiro a criar um!</p>
                </div>
            `;
            return;
        }

        rankingList.innerHTML = acrostics.slice(0, 20).map((acrostic, index) => `
            <div class="ranking-item" data-id="${acrostic.id}">
                <div class="ranking-position">#${index + 1}</div>
                <div class="ranking-content">
                    <div class="ranking-header">
                        <h4>${Utils.sanitizeHTML(acrostic.playerName)}</h4>
                        <div class="ranking-stats">
                            <span class="votes">
                                <i class="fas fa-heart"></i> ${acrostic.votes || 0}
                            </span>
                            <span class="quality">
                                <i class="fas fa-star"></i> ${(acrostic.quality || 0).toFixed(1)}
                            </span>
                            <span class="date">
                                <i class="fas fa-calendar"></i> ${Utils.formatDate(acrostic.timestamp)}
                            </span>
                        </div>
                    </div>
                    <div class="ranking-acrostic">
                        <div class="acrostic-word">
                            <strong>Palavra:</strong> ${acrostic.word}
                        </div>
                        <div class="acrostic-preview-short">
                            ${Object.entries(acrostic.acrostic).slice(0, 3).map(([letter, phrase]) => `
                                <div class="mini-line">
                                    <span class="mini-letter">${letter}</span>
                                    <span class="mini-phrase">${Utils.sanitizeHTML(phrase.substring(0, 50))}${phrase.length > 50 ? '...' : ''}</span>
                                </div>
                            `).join('')}
                            ${Object.keys(acrostic.acrostic).length > 3 ? `<div class="more-lines">+${Object.keys(acrostic.acrostic).length - 3} linhas</div>` : ''}
                        </div>
                    </div>
                    <div class="ranking-actions">
                        <button class="btn btn-sm btn-outline vote-btn" data-id="${acrostic.id}" data-vote="up">
                            <i class="fas fa-heart"></i> Curtir
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="this.expandAcrostic('${acrostic.id}')">
                            <i class="fas fa-expand"></i> Ver Completo
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Bind voting events
        this.bindVotingEvents();
    }

    bindVotingEvents() {
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const acrosticId = e.target.closest('.vote-btn').dataset.id;
                const vote = e.target.closest('.vote-btn').dataset.vote === 'up';
                this.voteAcrostic(acrosticId, vote);
            });
        });
    }

    voteAcrostic(acrosticId, isUpvote) {
        // Simple voting system - in a real app, you'd want to prevent multiple votes
        const voted = localStorage.getItem(`voted_${acrosticId}`);
        if (voted) {
            alert('Você já votou neste acróstico!');
            return;
        }

        StorageManager.voteAcrosticEntry(acrosticId, isUpvote ? 1 : -1);
        localStorage.setItem(`voted_${acrosticId}`, 'true');
        
        // Refresh ranking
        this.displayRanking();
        
        // Show feedback
        const message = isUpvote ? 'Voto registrado!' : 'Feedback registrado!';
        window.app?.showNotification(message, 'success');
    }

    expandAcrostic(acrosticId) {
        const acrostics = StorageManager.getAcrosticEntries();
        const acrostic = acrostics.find(a => a.id === acrosticId);
        
        if (!acrostic) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'acrostic-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentNode.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Acróstico de ${Utils.sanitizeHTML(acrostic.playerName)}</h3>
                    <button class="modal-close" onclick="this.closest('.acrostic-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="full-acrostic">
                        <div class="acrostic-word-display">
                            <strong>Palavra:</strong> ${acrostic.word}
                        </div>
                        ${Object.entries(acrostic.acrostic).map(([letter, phrase]) => `
                            <div class="acrostic-line modal-line">
                                <span class="letter">${letter}</span>
                                <span class="phrase">${Utils.sanitizeHTML(phrase)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="acrostic-meta">
                        <p><strong>Criado em:</strong> ${Utils.formatDate(acrostic.timestamp)}</p>
                        <p><strong>Qualidade:</strong> ${(acrostic.quality || 0).toFixed(1)}/50</p>
                        <p><strong>Votos:</strong> ${acrostic.votes || 0}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    showMyAcrostics() {
        const playerName = document.getElementById('player-name').value.trim();
        if (!playerName) {
            alert('Digite seu nome para ver seus acrósticos.');
            return;
        }

        const acrostics = StorageManager.getAcrosticEntries();
        const myAcrostics = acrostics.filter(a => 
            a.playerName.toLowerCase() === playerName.toLowerCase()
        );

        const rankingList = document.getElementById('ranking-list');
        if (!rankingList) return;

        if (myAcrostics.length === 0) {
            rankingList.innerHTML = `
                <div class="empty-ranking">
                    <i class="fas fa-user"></i>
                    <p>Você ainda não criou nenhum acróstico.</p>
                </div>
            `;
            return;
        }

        rankingList.innerHTML = `
            <div class="my-acrostics-header">
                <h4>Seus Acrósticos (${myAcrostics.length})</h4>
                <button class="btn btn-sm btn-outline" onclick="window.acrosticGame.displayRanking()">
                    Ver Todos
                </button>
            </div>
            ${myAcrostics.map((acrostic, index) => `
                <div class="ranking-item my-acrostic" data-id="${acrostic.id}">
                    <div class="ranking-position">#${index + 1}</div>
                    <div class="ranking-content">
                        <div class="ranking-header">
                            <h4>${Utils.sanitizeHTML(acrostic.playerName)}</h4>
                            <div class="ranking-stats">
                                <span class="votes">
                                    <i class="fas fa-heart"></i> ${acrostic.votes || 0}
                                </span>
                                <span class="quality">
                                    <i class="fas fa-star"></i> ${(acrostic.quality || 0).toFixed(1)}
                                </span>
                            </div>
                        </div>
                        <div class="acrostic-preview-short">
                            ${Object.entries(acrostic.acrostic).slice(0, 2).map(([letter, phrase]) => `
                                <div class="mini-line">
                                    <span class="mini-letter">${letter}</span>
                                    <span class="mini-phrase">${Utils.sanitizeHTML(phrase)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    loadUserAcrostics() {
        this.userAcrostics = StorageManager.getAcrosticEntries();
    }
}

// Initialize acrostic game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const acrosticContainer = document.getElementById('acrostic-container');
    if (acrosticContainer) {
        window.acrosticGame = new AcrosticGame();
    }
});

// Export for use in other modules
window.AcrosticGame = AcrosticGame;
