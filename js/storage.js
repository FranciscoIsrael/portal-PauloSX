// Local Storage Manager for the Sexual Education App
class StorageManager {
    static KEYS = {
        QUIZ_RESULTS: 'educacao_sexual_quiz_results',
        CROSSWORD_SCORES: 'educacao_sexual_crossword_scores',
        ACROSTIC_ENTRIES: 'educacao_sexual_acrostic_entries',
        WORDSEARCH_SCORES: 'educacao_sexual_wordsearch_scores',
        USER_SETTINGS: 'educacao_sexual_settings',
        USER_PROGRESS: 'educacao_sexual_progress',
        HIGH_SCORES: 'educacao_sexual_high_scores'
    };

    // Generic storage methods
    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    static getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    static removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    // Quiz Results Management
    static saveQuizResult(result) {
        const results = this.getQuizResults();
        result.id = Date.now().toString();
        result.timestamp = new Date().toISOString();
        results.push(result);
        
        // Keep only last 50 results
        if (results.length > 50) {
            results.splice(0, results.length - 50);
        }
        
        return this.setItem(this.KEYS.QUIZ_RESULTS, results);
    }

    static getQuizResults() {
        return this.getItem(this.KEYS.QUIZ_RESULTS, []);
    }

    static getLatestQuizResult() {
        const results = this.getQuizResults();
        return results.length > 0 ? results[results.length - 1] : null;
    }

    static clearQuizResults() {
        return this.removeItem(this.KEYS.QUIZ_RESULTS);
    }

    // Crossword Scores Management
    static saveCrosswordScore(score) {
        const scores = this.getCrosswordScores();
        score.id = Date.now().toString();
        score.timestamp = new Date().toISOString();
        scores.push(score);
        
        // Sort by score (descending) and keep top 50
        scores.sort((a, b) => b.score - a.score);
        if (scores.length > 50) {
            scores.splice(50);
        }
        
        return this.setItem(this.KEYS.CROSSWORD_SCORES, scores);
    }

    static getCrosswordScores() {
        return this.getItem(this.KEYS.CROSSWORD_SCORES, []);
    }

    static getTopCrosswordScores(limit = 10) {
        const scores = this.getCrosswordScores();
        return scores.slice(0, limit);
    }

    // Acrostic Entries Management
    static saveAcrosticEntry(entry) {
        const entries = this.getAcrosticEntries();
        entry.id = Date.now().toString();
        entry.timestamp = new Date().toISOString();
        entry.votes = entry.votes || 0;
        entries.push(entry);
        
        // Keep last 100 entries
        if (entries.length > 100) {
            entries.splice(0, entries.length - 100);
        }
        
        return this.setItem(this.KEYS.ACROSTIC_ENTRIES, entries);
    }

    static getAcrosticEntries() {
        return this.getItem(this.KEYS.ACROSTIC_ENTRIES, []);
    }

    static getTopAcrosticEntries(limit = 10) {
        const entries = this.getAcrosticEntries();
        return entries
            .sort((a, b) => b.votes - a.votes)
            .slice(0, limit);
    }

    static voteAcrosticEntry(entryId, vote) {
        const entries = this.getAcrosticEntries();
        const entry = entries.find(e => e.id === entryId);
        if (entry) {
            entry.votes = (entry.votes || 0) + (vote ? 1 : -1);
            return this.setItem(this.KEYS.ACROSTIC_ENTRIES, entries);
        }
        return false;
    }

    // Word Search Scores Management
    static saveWordSearchScore(score) {
        const scores = this.getWordSearchScores();
        score.id = Date.now().toString();
        score.timestamp = new Date().toISOString();
        scores.push(score);
        
        // Sort by time (ascending - faster is better) and keep top 50
        scores.sort((a, b) => a.time - b.time);
        if (scores.length > 50) {
            scores.splice(50);
        }
        
        return this.setItem(this.KEYS.WORDSEARCH_SCORES, scores);
    }

    static getWordSearchScores() {
        return this.getItem(this.KEYS.WORDSEARCH_SCORES, []);
    }

    static getTopWordSearchScores(limit = 10) {
        const scores = this.getWordSearchScores();
        return scores.slice(0, limit);
    }

    // User Settings Management
    static saveSettings(settings) {
        const currentSettings = this.getSettings();
        const updatedSettings = { ...currentSettings, ...settings };
        return this.setItem(this.KEYS.USER_SETTINGS, updatedSettings);
    }

    static getSettings() {
        return this.getItem(this.KEYS.USER_SETTINGS, {
            theme: 'light',
            fontSize: '16px',
            reducedMotion: false,
            soundEnabled: true,
            difficulty: 'medium',
            language: 'pt-BR'
        });
    }

    static getSetting(key, defaultValue = null) {
        const settings = this.getSettings();
        return settings[key] !== undefined ? settings[key] : defaultValue;
    }

    // User Progress Tracking
    static setProgress(progress) {
        return this.setItem(this.KEYS.USER_PROGRESS, progress);
    }

    static getProgress() {
        return this.getItem(this.KEYS.USER_PROGRESS, {
            quiz_completed: false,
            crossword_levels: {},
            acrostic_created: false,
            wordsearch_completed: false,
            content_viewed: {}
        });
    }

    static updateProgress(section, data) {
        const progress = this.getProgress();
        progress[section] = { ...progress[section], ...data };
        return this.setProgress(progress);
    }

    // High Scores Management (consolidated)
    static saveHighScore(game, score) {
        const highScores = this.getHighScores();
        if (!highScores[game]) {
            highScores[game] = [];
        }
        
        score.id = Date.now().toString();
        score.timestamp = new Date().toISOString();
        highScores[game].push(score);
        
        // Sort and keep top 50 for each game
        highScores[game].sort((a, b) => {
            if (game === 'wordsearch') {
                return a.time - b.time; // Faster time is better
            }
            return b.score - a.score; // Higher score is better
        });
        
        if (highScores[game].length > 50) {
            highScores[game].splice(50);
        }
        
        return this.setItem(this.KEYS.HIGH_SCORES, highScores);
    }

    static getHighScores() {
        return this.getItem(this.KEYS.HIGH_SCORES, {});
    }

    static getGameHighScores(game, limit = 10) {
        const highScores = this.getHighScores();
        return highScores[game] ? highScores[game].slice(0, limit) : [];
    }

    // Data Export/Import
    static exportData() {
        const data = {};
        Object.values(this.KEYS).forEach(key => {
            data[key] = this.getItem(key);
        });
        return JSON.stringify(data, null, 2);
    }

    static importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            let imported = 0;
            
            Object.entries(data).forEach(([key, value]) => {
                if (Object.values(this.KEYS).includes(key) && value !== null) {
                    this.setItem(key, value);
                    imported++;
                }
            });
            
            return imported;
        } catch (error) {
            console.error('Error importing data:', error);
            return 0;
        }
    }

    // Clear all data
    static clearAllData() {
        let cleared = 0;
        Object.values(this.KEYS).forEach(key => {
            if (this.removeItem(key)) {
                cleared++;
            }
        });
        return cleared;
    }

    // Get storage usage info
    static getStorageInfo() {
        let totalSize = 0;
        let itemCount = 0;
        
        Object.values(this.KEYS).forEach(key => {
            const item = localStorage.getItem(key);
            if (item) {
                totalSize += item.length;
                itemCount++;
            }
        });
        
        return {
            itemCount,
            totalSize,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            availableSpace: this.getAvailableSpace()
        };
    }

    static getAvailableSpace() {
        try {
            // Rough estimate of available localStorage space
            let test = '';
            for (let i = 0; i < 1000000; i++) {
                test += 'a';
                try {
                    localStorage.setItem('test', test);
                } catch {
                    localStorage.removeItem('test');
                    return i;
                }
            }
            localStorage.removeItem('test');
            return 1000000;
        } catch {
            return 'unknown';
        }
    }
}

// Export for use in other modules
window.StorageManager = StorageManager;
