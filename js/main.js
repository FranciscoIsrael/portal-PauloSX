// Main application JavaScript
class EducacaoSexualApp {
    constructor() {
        this.initializeApp();
        this.bindEvents();
        this.loadSettings();
    }

    initializeApp() {
        console.log('Inicializando Aplicação Educação Sexual...');
        this.setupSidebar();
        this.setupNavigation();
    }

    setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        const navToggle = document.getElementById('nav-toggle');
        const mainContent = document.querySelector('.main-content');
        
        if (navToggle && sidebar) {
            navToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                if (window.innerWidth <= 768) {
                    mainContent.classList.toggle('sidebar-open');
                }
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !navToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    mainContent.classList.remove('sidebar-open');
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                mainContent.classList.remove('sidebar-open');
            }
        });
    }

    setupNavigation() {
        // Highlight active menu item
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const menuLinks = document.querySelectorAll('.sidebar-menu a');
        
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes(currentPage) || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    bindEvents() {
        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });

        // Add fade-in animation to elements as they come into view
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all content cards and game cards
        document.querySelectorAll('.content-card, .game-card').forEach(card => {
            observer.observe(card);
        });
    }

    loadSettings() {
        // Load user preferences from localStorage
        const settings = StorageManager.getSettings();
        this.applySettings(settings);
    }

    applySettings(settings) {
        // Apply theme
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }

        // Apply font size
        if (settings.fontSize) {
            document.documentElement.style.fontSize = settings.fontSize;
        }

        // Apply reduced motion preference
        if (settings.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
    }

    // Utility method to show notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        
        // Insert at top of main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(notification, mainContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    // Method to update progress tracking
    updateProgress(section, completed = true) {
        const progress = StorageManager.getProgress();
        progress[section] = {
            completed: completed,
            timestamp: new Date().toISOString()
        };
        StorageManager.setProgress(progress);
    }
}

// Utility functions
const Utils = {
    // Format date to Brazilian format
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Sanitize HTML to prevent XSS
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    // Debounce function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EducacaoSexualApp();
});

// Handle service worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for use in other modules
window.Utils = Utils;
