// Quiz functionality for Sexual Education
class SexualEducationQuiz {
    constructor() {
        this.questions = [
            {
                id: 1,
                question: "Qual é a idade média do início da puberdade nas meninas?",
                options: [
                    "8-9 anos",
                    "10-11 anos",
                    "12-13 anos",
                    "14-15 anos",
                    "16-17 anos"
                ],
                correct: 1,
                explanation: "A puberdade nas meninas geralmente começa entre os 10-11 anos, embora possa variar entre 8-13 anos."
            },
            {
                id: 2,
                question: "Qual método contraceptivo oferece proteção dupla (gravidez e ISTs)?",
                options: [
                    "Pílula anticoncepcional",
                    "DIU",
                    "Preservativo (camisinha)",
                    "Implante hormonal",
                    "Coito interrompido"
                ],
                correct: 2,
                explanation: "O preservativo é o único método que oferece proteção contra gravidez indesejada e infecções sexualmente transmissíveis."
            },
            {
                id: 3,
                question: "O que significa a sigla IST?",
                options: [
                    "Infecção Sexual Temporária",
                    "Infecção Sexualmente Transmissível",
                    "Inflamação Sexual Tratável",
                    "Irritação Sexual Típica",
                    "Infecção Sistêmica Transmissível"
                ],
                correct: 1,
                explanation: "IST significa Infecção Sexualmente Transmissível, termo atual para o que antes era chamado de DST."
            },
            {
                id: 4,
                question: "Durante o ciclo menstrual, em qual período geralmente ocorre a ovulação?",
                options: [
                    "1º ao 5º dia",
                    "6º ao 10º dia",
                    "11º ao 16º dia",
                    "17º ao 21º dia",
                    "22º ao 28º dia"
                ],
                correct: 2,
                explanation: "A ovulação geralmente ocorre entre o 11º e 16º dia do ciclo menstrual em um ciclo de 28 dias."
            },
            {
                id: 5,
                question: "Qual hormônio é responsável pelo desenvolvimento das características sexuais secundárias masculinas?",
                options: [
                    "Estrogênio",
                    "Progesterona",
                    "Testosterona",
                    "Insulina",
                    "Cortisol"
                ],
                correct: 2,
                explanation: "A testosterona é o principal hormônio masculino responsável pelas características sexuais secundárias como voz grave, pelos corporais e desenvolvimento muscular."
            },
            {
                id: 6,
                question: "O que é importante para manter um relacionamento saudável?",
                options: [
                    "Controle sobre o parceiro",
                    "Comunicação e respeito mútuo",
                    "Dependência emocional",
                    "Ciúme constante",
                    "Isolamento social"
                ],
                correct: 1,
                explanation: "Relacionamentos saudáveis são baseados em comunicação aberta, respeito mútuo, confiança e autonomia individual."
            },
            {
                id: 7,
                question: "Qual é a principal função do sistema reprodutivo?",
                options: [
                    "Produzir energia",
                    "Garantir a reprodução da espécie",
                    "Regular a temperatura corporal",
                    "Filtrar toxinas",
                    "Produzir enzimas digestivas"
                ],
                correct: 1,
                explanation: "A principal função do sistema reprodutivo é garantir a continuidade da espécie através da reprodução."
            },
            {
                id: 8,
                question: "O que é consentimento sexual?",
                options: [
                    "Uma obrigação no relacionamento",
                    "Acordo verbal ou não verbal livre e consciente",
                    "Algo que não pode ser retirado",
                    "Responsabilidade apenas de um parceiro",
                    "Algo que se presume automaticamente"
                ],
                correct: 1,
                explanation: "Consentimento é um acordo livre, consciente e revogável entre pessoas capazes para participar de atividade sexual."
            },
            {
                id: 9,
                question: "Qual a importância da educação sexual?",
                options: [
                    "Estimular precocemente a atividade sexual",
                    "Promover conhecimento e prevenção",
                    "Substituir a educação familiar",
                    "Causar curiosidade desnecessária",
                    "Determinar orientação sexual"
                ],
                correct: 1,
                explanation: "A educação sexual promove conhecimento científico, prevenção de riscos, autonomia e tomada de decisões conscientes."
            },
            {
                id: 10,
                question: "O HPV (Papilomavírus Humano) pode causar:",
                options: [
                    "Apenas verrugas genitais",
                    "Apenas câncer de colo do útero",
                    "Verrugas genitais e alguns tipos de câncer",
                    "Apenas problemas de pele",
                    "Infertilidade em homens"
                ],
                correct: 2,
                explanation: "O HPV pode causar verrugas genitais e está associado a vários tipos de câncer, incluindo colo do útero, ânus, pênis e orofaringe."
            },
            {
                id: 11,
                question: "A diversidade sexual e de gênero deve ser tratada com:",
                options: [
                    "Discriminação e preconceito",
                    "Respeito e inclusão",
                    "Indiferença total",
                    "Tentativas de mudança",
                    "Isolamento social"
                ],
                correct: 1,
                explanation: "A diversidade sexual e de gênero deve ser tratada com respeito, inclusão e reconhecimento dos direitos humanos fundamentais."
            }
        ];
        
        this.currentQuestion = 0;
        this.answers = [];
        this.startTime = null;
        this.endTime = null;
        
        this.init();
    }

    init() {
        this.setupQuizInterface();
        this.bindEvents();
        this.shuffleQuestions();
        this.showQuestion();
    }

    setupQuizInterface() {
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;

        quizContainer.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <span class="progress-text" id="progress-text">1 de ${this.questions.length}</span>
                </div>
                <div class="quiz-timer" id="quiz-timer">00:00</div>
            </div>
            
            <div class="question-container" id="question-container">
                <h3 class="question-text" id="question-text"></h3>
                <div class="options-container" id="options-container"></div>
            </div>
            
            <div class="quiz-navigation">
                <button class="btn btn-secondary" id="prev-question" disabled>Anterior</button>
                <button class="btn btn-primary" id="next-question" disabled>Próxima</button>
                <button class="btn btn-success hidden" id="finish-quiz">Finalizar Quiz</button>
            </div>
            
            <div class="quiz-results hidden" id="quiz-results"></div>
        `;
    }

    bindEvents() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const finishBtn = document.getElementById('finish-quiz');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
        
        if (finishBtn) {
            finishBtn.addEventListener('click', () => this.finishQuiz());
        }
    }

    shuffleQuestions() {
        this.questions = Utils.shuffleArray(this.questions);
        // Also shuffle options for each question
        this.questions.forEach(question => {
            const correctAnswer = question.options[question.correct];
            question.options = Utils.shuffleArray(question.options);
            question.correct = question.options.indexOf(correctAnswer);
        });
    }

    showQuestion() {
        if (this.currentQuestion === 0 && !this.startTime) {
            this.startTime = new Date();
            this.startTimer();
        }

        const question = this.questions[this.currentQuestion];
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (!question || !questionText || !optionsContainer) return;

        // Update progress
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${this.currentQuestion + 1} de ${this.questions.length}`;

        // Show question
        questionText.textContent = question.question;
        
        // Create options
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" name="answer" id="option-${index}" value="${index}">
                <label for="option-${index}">${Utils.sanitizeHTML(option)}</label>
            `;
            
            optionElement.addEventListener('click', () => {
                const radio = optionElement.querySelector('input[type="radio"]');
                radio.checked = true;
                this.selectAnswer(index);
            });
            
            optionsContainer.appendChild(optionElement);
        });

        // Restore previous answer if exists
        if (this.answers[this.currentQuestion] !== undefined) {
            const selectedOption = optionsContainer.querySelector(`input[value="${this.answers[this.currentQuestion]}"]`);
            if (selectedOption) {
                selectedOption.checked = true;
                this.updateNavigationButtons();
            }
        }

        this.updateNavigationButtons();
    }

    selectAnswer(answerIndex) {
        this.answers[this.currentQuestion] = answerIndex;
        this.updateNavigationButtons();
        
        // Add visual feedback
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            option.classList.remove('selected');
            if (index === answerIndex) {
                option.classList.add('selected');
            }
        });
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const finishBtn = document.getElementById('finish-quiz');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
        }
        
        const hasAnswer = this.answers[this.currentQuestion] !== undefined;
        const isLastQuestion = this.currentQuestion === this.questions.length - 1;
        
        if (nextBtn && finishBtn) {
            if (isLastQuestion) {
                nextBtn.classList.add('hidden');
                finishBtn.classList.remove('hidden');
                finishBtn.disabled = !hasAnswer;
            } else {
                nextBtn.classList.remove('hidden');
                finishBtn.classList.add('hidden');
                nextBtn.disabled = !hasAnswer;
            }
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.showQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.showQuestion();
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const now = new Date();
            const elapsed = Math.floor((now - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            
            const timerElement = document.getElementById('quiz-timer');
            if (timerElement) {
                timerElement.textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
    }

    finishQuiz() {
        this.endTime = new Date();
        clearInterval(this.timerInterval);
        
        const results = this.calculateResults();
        this.showResults(results);
        this.saveResults(results);
    }

    calculateResults() {
        let correct = 0;
        const detailedResults = [];
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.answers[index];
            const isCorrect = userAnswer === question.correct;
            
            if (isCorrect) correct++;
            
            detailedResults.push({
                question: question.question,
                userAnswer: question.options[userAnswer] || 'Não respondida',
                correctAnswer: question.options[question.correct],
                isCorrect: isCorrect,
                explanation: question.explanation
            });
        });
        
        const totalTime = Math.floor((this.endTime - this.startTime) / 1000);
        const score = Math.round((correct / this.questions.length) * 100);
        
        return {
            correct: correct,
            total: this.questions.length,
            percentage: score,
            time: totalTime,
            detailedResults: detailedResults
        };
    }

    showResults(results) {
        const container = document.getElementById('quiz-container');
        if (!container) return;

        const performanceLevel = this.getPerformanceLevel(results.percentage);
        const timeFormatted = this.formatTime(results.time);
        
        container.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <h2>Resultados do Quiz</h2>
                    <div class="score-display ${performanceLevel.class}">
                        <span class="score-number">${results.percentage}%</span>
                        <span class="score-label">${performanceLevel.label}</span>
                    </div>
                </div>
                
                <div class="results-summary">
                    <div class="summary-item">
                        <i class="fas fa-check-circle"></i>
                        <span>Respostas Corretas: ${results.correct}/${results.total}</span>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-clock"></i>
                        <span>Tempo Total: ${timeFormatted}</span>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-chart-line"></i>
                        <span>Desempenho: ${performanceLevel.feedback}</span>
                    </div>
                </div>
                
                <div class="detailed-results">
                    <h3>Respostas Detalhadas</h3>
                    ${this.renderDetailedResults(results.detailedResults)}
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-primary" onclick="location.reload()">Refazer Quiz</button>
                    <button class="btn btn-secondary" onclick="this.shareResults(${results.percentage})">Compartilhar</button>
                    <a href="pages/charts.html" class="btn btn-info">Ver Estatísticas</a>
                    <a href="index.html" class="btn btn-outline">Voltar ao Início</a>
                </div>
            </div>
        `;
    }

    renderDetailedResults(detailedResults) {
        return detailedResults.map((result, index) => `
            <div class="result-item ${result.isCorrect ? 'correct' : 'incorrect'}">
                <div class="result-header">
                    <span class="result-number">${index + 1}</span>
                    <i class="fas ${result.isCorrect ? 'fa-check' : 'fa-times'}"></i>
                </div>
                <div class="result-content">
                    <h4>${Utils.sanitizeHTML(result.question)}</h4>
                    <div class="answer-comparison">
                        <div class="user-answer">
                            <strong>Sua resposta:</strong> ${Utils.sanitizeHTML(result.userAnswer)}
                        </div>
                        ${!result.isCorrect ? `
                            <div class="correct-answer">
                                <strong>Resposta correta:</strong> ${Utils.sanitizeHTML(result.correctAnswer)}
                            </div>
                        ` : ''}
                    </div>
                    <div class="explanation">
                        <strong>Explicação:</strong> ${Utils.sanitizeHTML(result.explanation)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getPerformanceLevel(percentage) {
        if (percentage >= 90) {
            return {
                class: 'excellent',
                label: 'Excelente!',
                feedback: 'Você demonstra excelente conhecimento em educação sexual!'
            };
        } else if (percentage >= 70) {
            return {
                class: 'good',
                label: 'Bom!',
                feedback: 'Você tem um bom conhecimento, mas ainda pode melhorar.'
            };
        } else if (percentage >= 50) {
            return {
                class: 'fair',
                label: 'Regular',
                feedback: 'Você precisa estudar mais sobre educação sexual.'
            };
        } else {
            return {
                class: 'poor',
                label: 'Precisa Melhorar',
                feedback: 'Recomendamos revisar o conteúdo educativo antes de refazer o quiz.'
            };
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    saveResults(results) {
        const quizResult = {
            score: results.percentage,
            correct: results.correct,
            total: results.total,
            time: results.time,
            answers: this.answers.slice(),
            questions: this.questions.map(q => q.id)
        };
        
        StorageManager.saveQuizResult(quizResult);
        
        // Update progress
        StorageManager.updateProgress('quiz_completed', true);
    }

    shareResults(score) {
        if (navigator.share) {
            navigator.share({
                title: 'Meu resultado no Quiz de Educação Sexual',
                text: `Consegui ${score}% no Quiz de Educação Sexual! Teste seus conhecimentos também.`,
                url: window.location.origin
            });
        } else {
            // Fallback for browsers without native sharing
            const text = `Consegui ${score}% no Quiz de Educação Sexual! Teste seus conhecimentos também: ${window.location.origin}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    alert('Resultado copiado para a área de transferência!');
                });
            } else {
                // Final fallback
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Resultado copiado para a área de transferência!');
            }
        }
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        window.quiz = new SexualEducationQuiz();
    }
});

// Export for use in other modules
window.SexualEducationQuiz = SexualEducationQuiz;
