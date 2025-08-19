// Charts and Data Visualization for Sexual Education App
class ChartsManager {
    constructor() {
        this.charts = {};
        this.chartColors = {
            primary: '#6366f1',
            secondary: '#f59e0b',
            success: '#10b981',
            danger: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        this.init();
    }

    init() {
        this.loadChartLibrary();
        this.setupChartsInterface();
        this.bindEvents();
        this.loadAllData();
    }

    loadChartLibrary() {
        // Chart.js is loaded via CDN in the HTML
        if (typeof Chart === 'undefined') {
            console.error('Chart.js library not loaded');
            return;
        }
        
        // Configure Chart.js defaults
        Chart.defaults.font.family = 'Inter, sans-serif';
        Chart.defaults.color = '#6b7280';
        Chart.defaults.plugins.legend.position = 'bottom';
    }

    setupChartsInterface() {
        const chartsContainer = document.getElementById('charts-container');
        if (!chartsContainer) return;

        chartsContainer.innerHTML = `
            <div class="charts-header">
                <h2>Estatísticas e Gráficos</h2>
                <p>Visualize os dados dos jogos e quizzes</p>
                <div class="charts-controls">
                    <button class="btn btn-primary" id="refresh-charts">Atualizar Dados</button>
                    <button class="btn btn-secondary" id="export-data">Exportar Dados</button>
                    <button class="btn btn-warning" id="clear-data">Limpar Dados</button>
                </div>
            </div>

            <div class="charts-grid">
                <!-- Quiz Results Charts -->
                <div class="chart-section">
                    <div class="section-header">
                        <h3>Resultados do Quiz</h3>
                        <span class="data-count" id="quiz-data-count">0 tentativas</span>
                    </div>
                    <div class="charts-row">
                        <div class="chart-container">
                            <h4>Distribuição de Pontuações</h4>
                            <canvas id="quiz-scores-chart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h4>Respostas por Pergunta</h4>
                            <canvas id="quiz-questions-chart"></canvas>
                        </div>
                    </div>
                    <div class="charts-row">
                        <div class="chart-container">
                            <h4>Performance ao Longo do Tempo</h4>
                            <canvas id="quiz-timeline-chart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h4>Tempo Médio por Quiz</h4>
                            <canvas id="quiz-time-chart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Games Statistics -->
                <div class="chart-section">
                    <div class="section-header">
                        <h3>Estatísticas dos Jogos</h3>
                        <span class="data-count" id="games-data-count">0 jogos</span>
                    </div>
                    <div class="charts-row">
                        <div class="chart-container">
                            <h4>Pontuações Palavras Cruzadas</h4>
                            <canvas id="crossword-scores-chart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h4>Tempos Caça Palavras</h4>
                            <canvas id="wordsearch-times-chart"></canvas>
                        </div>
                    </div>
                    <div class="charts-row">
                        <div class="chart-container">
                            <h4>Popularidade dos Jogos</h4>
                            <canvas id="games-popularity-chart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h4>Níveis de Dificuldade</h4>
                            <canvas id="difficulty-distribution-chart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Rankings and Leaderboards -->
                <div class="chart-section">
                    <div class="section-header">
                        <h3>Rankings e Classificações</h3>
                    </div>
                    <div class="rankings-grid">
                        <div class="ranking-card">
                            <h4>Top Quiz</h4>
                            <div class="ranking-list" id="quiz-ranking"></div>
                        </div>
                        <div class="ranking-card">
                            <h4>Top Palavras Cruzadas</h4>
                            <div class="ranking-list" id="crossword-ranking"></div>
                        </div>
                        <div class="ranking-card">
                            <h4>Top Caça Palavras</h4>
                            <div class="ranking-list" id="wordsearch-ranking"></div>
                        </div>
                        <div class="ranking-card">
                            <h4>Melhores Acrósticos</h4>
                            <div class="ranking-list" id="acrostic-ranking"></div>
                        </div>
                    </div>
                </div>

                <!-- Data Summary -->
                <div class="chart-section">
                    <div class="section-header">
                        <h3>Resumo dos Dados</h3>
                    </div>
                    <div class="summary-grid">
                        <div class="summary-card">
                            <div class="summary-icon">
                                <i class="fas fa-question-circle"></i>
                            </div>
                            <div class="summary-content">
                                <h4 id="total-quizzes">0</h4>
                                <p>Quizzes Realizados</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon">
                                <i class="fas fa-puzzle-piece"></i>
                            </div>
                            <div class="summary-content">
                                <h4 id="total-crosswords">0</h4>
                                <p>Palavras Cruzadas</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <div class="summary-content">
                                <h4 id="total-wordsearches">0</h4>
                                <p>Caça Palavras</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon">
                                <i class="fas fa-pen"></i>
                            </div>
                            <div class="summary-content">
                                <h4 id="total-acrostics">0</h4>
                                <p>Acrósticos Criados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="no-data-message hidden" id="no-data-message">
                <div class="no-data-content">
                    <i class="fas fa-chart-bar"></i>
                    <h3>Nenhum Dado Disponível</h3>
                    <p>Complete alguns jogos e quizzes para ver as estatísticas aqui.</p>
                    <div class="no-data-actions">
                        <a href="pages/quiz.html" class="btn btn-primary">Fazer Quiz</a>
                        <a href="pages/crossword.html" class="btn btn-secondary">Jogar Cruzadas</a>
                        <a href="pages/wordsearch.html" class="btn btn-info">Caça Palavras</a>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const refreshBtn = document.getElementById('refresh-charts');
        const exportBtn = document.getElementById('export-data');
        const clearBtn = document.getElementById('clear-data');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshAllCharts());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllData());
        }
    }

    loadAllData() {
        const quizData = StorageManager.getQuizResults();
        const crosswordData = StorageManager.getCrosswordScores();
        const wordsearchData = StorageManager.getWordSearchScores();
        const acrosticData = StorageManager.getAcrosticEntries();

        // Check if we have any data
        const hasData = quizData.length > 0 || crosswordData.length > 0 || 
                       wordsearchData.length > 0 || acrosticData.length > 0;

        if (!hasData) {
            document.getElementById('no-data-message').classList.remove('hidden');
            return;
        }

        document.getElementById('no-data-message').classList.add('hidden');

        // Update data counts
        this.updateDataCounts(quizData, crosswordData, wordsearchData, acrosticData);

        // Create all charts
        this.createQuizCharts(quizData);
        this.createGameCharts(crosswordData, wordsearchData);
        this.createRankings(quizData, crosswordData, wordsearchData, acrosticData);
        this.updateSummary(quizData, crosswordData, wordsearchData, acrosticData);
    }

    updateDataCounts(quizData, crosswordData, wordsearchData, acrosticData) {
        const quizCount = document.getElementById('quiz-data-count');
        const gamesCount = document.getElementById('games-data-count');

        if (quizCount) {
            quizCount.textContent = `${quizData.length} tentativas`;
        }

        if (gamesCount) {
            const totalGames = crosswordData.length + wordsearchData.length;
            gamesCount.textContent = `${totalGames} jogos`;
        }
    }

    createQuizCharts(quizData) {
        if (quizData.length === 0) return;

        this.createQuizScoresChart(quizData);
        this.createQuizQuestionsChart(quizData);
        this.createQuizTimelineChart(quizData);
        this.createQuizTimeChart(quizData);
    }

    createQuizScoresChart(quizData) {
        const ctx = document.getElementById('quiz-scores-chart');
        if (!ctx) return;

        // Group scores into ranges
        const ranges = {
            '0-20%': 0,
            '21-40%': 0,
            '41-60%': 0,
            '61-80%': 0,
            '81-100%': 0
        };

        quizData.forEach(result => {
            const score = result.score || 0;
            if (score <= 20) ranges['0-20%']++;
            else if (score <= 40) ranges['21-40%']++;
            else if (score <= 60) ranges['41-60%']++;
            else if (score <= 80) ranges['61-80%']++;
            else ranges['81-100%']++;
        });

        if (this.charts.quizScores) {
            this.charts.quizScores.destroy();
        }

        this.charts.quizScores = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(ranges),
                datasets: [{
                    data: Object.values(ranges),
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#f59e0b',
                        '#10b981',
                        '#22c55e'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createQuizQuestionsChart(quizData) {
        const ctx = document.getElementById('quiz-questions-chart');
        if (!ctx || quizData.length === 0) return;

        // Simulate question-by-question analysis
        const questionStats = Array(11).fill().map((_, i) => ({
            question: i + 1,
            correct: 0,
            total: 0
        }));

        // In a real implementation, you'd track individual question responses
        // For now, we'll simulate based on overall scores
        quizData.forEach(result => {
            const correctAnswers = Math.round((result.score / 100) * 11);
            for (let i = 0; i < 11; i++) {
                questionStats[i].total++;
                if (i < correctAnswers) {
                    questionStats[i].correct++;
                }
            }
        });

        if (this.charts.quizQuestions) {
            this.charts.quizQuestions.destroy();
        }

        this.charts.quizQuestions = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: questionStats.map(stat => `P${stat.question}`),
                datasets: [{
                    label: 'Taxa de Acerto (%)',
                    data: questionStats.map(stat => 
                        stat.total > 0 ? (stat.correct / stat.total) * 100 : 0
                    ),
                    backgroundColor: this.chartColors.primary,
                    borderColor: this.chartColors.primary,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createQuizTimelineChart(quizData) {
        const ctx = document.getElementById('quiz-timeline-chart');
        if (!ctx || quizData.length === 0) return;

        // Sort by timestamp and show performance over time
        const sortedData = [...quizData].sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );

        if (this.charts.quizTimeline) {
            this.charts.quizTimeline.destroy();
        }

        this.charts.quizTimeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedData.map((_, index) => `${index + 1}ª tentativa`),
                datasets: [{
                    label: 'Pontuação (%)',
                    data: sortedData.map(result => result.score || 0),
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.chartColors.primary + '20',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createQuizTimeChart(quizData) {
        const ctx = document.getElementById('quiz-time-chart');
        if (!ctx || quizData.length === 0) return;

        // Group by time ranges
        const timeRanges = {
            '< 2 min': 0,
            '2-5 min': 0,
            '5-10 min': 0,
            '> 10 min': 0
        };

        quizData.forEach(result => {
            const time = result.time || 0;
            if (time < 120) timeRanges['< 2 min']++;
            else if (time < 300) timeRanges['2-5 min']++;
            else if (time < 600) timeRanges['5-10 min']++;
            else timeRanges['> 10 min']++;
        });

        if (this.charts.quizTime) {
            this.charts.quizTime.destroy();
        }

        this.charts.quizTime = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(timeRanges),
                datasets: [{
                    data: Object.values(timeRanges),
                    backgroundColor: [
                        this.chartColors.success,
                        this.chartColors.info,
                        this.chartColors.warning,
                        this.chartColors.danger
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createGameCharts(crosswordData, wordsearchData) {
        this.createCrosswordScoresChart(crosswordData);
        this.createWordsearchTimesChart(wordsearchData);
        this.createGamesPopularityChart(crosswordData, wordsearchData);
        this.createDifficultyDistributionChart(crosswordData, wordsearchData);
    }

    createCrosswordScoresChart(crosswordData) {
        const ctx = document.getElementById('crossword-scores-chart');
        if (!ctx || crosswordData.length === 0) return;

        const recentScores = crosswordData.slice(-10).reverse();

        if (this.charts.crosswordScores) {
            this.charts.crosswordScores.destroy();
        }

        this.charts.crosswordScores = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: recentScores.map((_, index) => `Jogo ${index + 1}`),
                datasets: [{
                    label: 'Pontuação',
                    data: recentScores.map(score => score.score || 0),
                    backgroundColor: this.chartColors.secondary,
                    borderColor: this.chartColors.secondary,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createWordsearchTimesChart(wordsearchData) {
        const ctx = document.getElementById('wordsearch-times-chart');
        if (!ctx || wordsearchData.length === 0) return;

        const recentTimes = wordsearchData.slice(-10).reverse();

        if (this.charts.wordsearchTimes) {
            this.charts.wordsearchTimes.destroy();
        }

        this.charts.wordsearchTimes = new Chart(ctx, {
            type: 'line',
            data: {
                labels: recentTimes.map((_, index) => `Jogo ${index + 1}`),
                datasets: [{
                    label: 'Tempo (segundos)',
                    data: recentTimes.map(result => result.time || 0),
                    borderColor: this.chartColors.info,
                    backgroundColor: this.chartColors.info + '20',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return Math.floor(value / 60) + ':' + 
                                       (value % 60).toString().padStart(2, '0');
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createGamesPopularityChart(crosswordData, wordsearchData) {
        const ctx = document.getElementById('games-popularity-chart');
        if (!ctx) return;

        const gameData = {
            'Palavras Cruzadas': crosswordData.length,
            'Caça Palavras': wordsearchData.length,
            'Quiz': StorageManager.getQuizResults().length,
            'Acróstico': StorageManager.getAcrosticEntries().length
        };

        if (this.charts.gamesPopularity) {
            this.charts.gamesPopularity.destroy();
        }

        this.charts.gamesPopularity = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(gameData),
                datasets: [{
                    data: Object.values(gameData),
                    backgroundColor: [
                        this.chartColors.secondary,
                        this.chartColors.info,
                        this.chartColors.primary,
                        this.chartColors.success
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createDifficultyDistributionChart(crosswordData, wordsearchData) {
        const ctx = document.getElementById('difficulty-distribution-chart');
        if (!ctx) return;

        const difficulties = { easy: 0, medium: 0, hard: 0 };

        crosswordData.forEach(score => {
            if (score.level) difficulties[score.level]++;
        });

        wordsearchData.forEach(score => {
            if (score.difficulty) difficulties[score.difficulty]++;
        });

        if (this.charts.difficultyDistribution) {
            this.charts.difficultyDistribution.destroy();
        }

        this.charts.difficultyDistribution = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Fácil', 'Médio', 'Difícil'],
                datasets: [{
                    label: 'Jogos Completados',
                    data: [difficulties.easy, difficulties.medium, difficulties.hard],
                    backgroundColor: [
                        this.chartColors.success,
                        this.chartColors.warning,
                        this.chartColors.danger
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    createRankings(quizData, crosswordData, wordsearchData, acrosticData) {
        this.createQuizRanking(quizData);
        this.createCrosswordRanking(crosswordData);
        this.createWordsearchRanking(wordsearchData);
        this.createAcrosticRanking(acrosticData);
    }

    createQuizRanking(quizData) {
        const rankingContainer = document.getElementById('quiz-ranking');
        if (!rankingContainer) return;

        const topScores = [...quizData]
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 5);

        if (topScores.length === 0) {
            rankingContainer.innerHTML = '<p class="no-data">Nenhum quiz realizado</p>';
            return;
        }

        rankingContainer.innerHTML = topScores.map((score, index) => `
            <div class="ranking-item">
                <span class="rank">#${index + 1}</span>
                <span class="score">${score.score || 0}%</span>
                <span class="time">${this.formatTime(score.time || 0)}</span>
            </div>
        `).join('');
    }

    createCrosswordRanking(crosswordData) {
        const rankingContainer = document.getElementById('crossword-ranking');
        if (!rankingContainer) return;

        const topScores = [...crosswordData]
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 5);

        if (topScores.length === 0) {
            rankingContainer.innerHTML = '<p class="no-data">Nenhuma cruzada realizada</p>';
            return;
        }

        rankingContainer.innerHTML = topScores.map((score, index) => `
            <div class="ranking-item">
                <span class="rank">#${index + 1}</span>
                <span class="player">${Utils.sanitizeHTML(score.playerName || 'Anônimo')}</span>
                <span class="score">${score.score || 0}pts</span>
            </div>
        `).join('');
    }

    createWordsearchRanking(wordsearchData) {
        const rankingContainer = document.getElementById('wordsearch-ranking');
        if (!rankingContainer) return;

        const topTimes = [...wordsearchData]
            .sort((a, b) => (a.time || Infinity) - (b.time || Infinity))
            .slice(0, 5);

        if (topTimes.length === 0) {
            rankingContainer.innerHTML = '<p class="no-data">Nenhum caça palavras realizado</p>';
            return;
        }

        rankingContainer.innerHTML = topTimes.map((result, index) => `
            <div class="ranking-item">
                <span class="rank">#${index + 1}</span>
                <span class="player">${Utils.sanitizeHTML(result.playerName || 'Anônimo')}</span>
                <span class="time">${this.formatTime(result.time || 0)}</span>
            </div>
        `).join('');
    }

    createAcrosticRanking(acrosticData) {
        const rankingContainer = document.getElementById('acrostic-ranking');
        if (!rankingContainer) return;

        const topAcrostics = [...acrosticData]
            .sort((a, b) => (b.votes || 0) - (a.votes || 0))
            .slice(0, 5);

        if (topAcrostics.length === 0) {
            rankingContainer.innerHTML = '<p class="no-data">Nenhum acróstico criado</p>';
            return;
        }

        rankingContainer.innerHTML = topAcrostics.map((acrostic, index) => `
            <div class="ranking-item">
                <span class="rank">#${index + 1}</span>
                <span class="player">${Utils.sanitizeHTML(acrostic.playerName || 'Anônimo')}</span>
                <span class="votes">${acrostic.votes || 0} votos</span>
            </div>
        `).join('');
    }

    updateSummary(quizData, crosswordData, wordsearchData, acrosticData) {
        const totalQuizzes = document.getElementById('total-quizzes');
        const totalCrosswords = document.getElementById('total-crosswords');
        const totalWordsearches = document.getElementById('total-wordsearches');
        const totalAcrostics = document.getElementById('total-acrostics');

        if (totalQuizzes) totalQuizzes.textContent = quizData.length;
        if (totalCrosswords) totalCrosswords.textContent = crosswordData.length;
        if (totalWordsearches) totalWordsearches.textContent = wordsearchData.length;
        if (totalAcrostics) totalAcrostics.textContent = acrosticData.length;
    }

    refreshAllCharts() {
        // Destroy existing charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};

        // Reload all data
        this.loadAllData();
        
        window.app?.showNotification('Gráficos atualizados com sucesso!', 'success');
    }

    exportData() {
        try {
            const data = StorageManager.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `educacao-sexual-dados-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
            window.app?.showNotification('Dados exportados com sucesso!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            window.app?.showNotification('Erro ao exportar dados.', 'error');
        }
    }

    clearAllData() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            const cleared = StorageManager.clearAllData();
            
            if (cleared > 0) {
                window.app?.showNotification(`${cleared} tipos de dados foram limpos.`, 'success');
                this.refreshAllCharts();
            } else {
                window.app?.showNotification('Nenhum dado foi encontrado para limpar.', 'info');
            }
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chartsContainer = document.getElementById('charts-container');
    if (chartsContainer) {
        // Wait for Chart.js to load
        if (typeof Chart !== 'undefined') {
            window.chartsManager = new ChartsManager();
        } else {
            // Retry after a short delay
            setTimeout(() => {
                if (typeof Chart !== 'undefined') {
                    window.chartsManager = new ChartsManager();
                } else {
                    console.error('Chart.js library not available');
                }
            }, 1000);
        }
    }
});

// Export for use in other modules
window.ChartsManager = ChartsManager;
