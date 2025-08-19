// Carousel functionality for the hero section
class Carousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoplayDuration = 5000; // 5 seconds
        
        this.init();
    }

    init() {
        if (this.slides.length === 0) return;
        
        this.createIndicators();
        this.bindEvents();
        this.startAutoplay();
        
        // Show first slide
        this.showSlide(0);
    }

    createIndicators() {
        const indicatorsContainer = this.container.querySelector('.carousel-indicators');
        if (!indicatorsContainer) return;
        
        indicatorsContainer.innerHTML = '';
        
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            indicatorsContainer.appendChild(indicator);
        });
        
        this.indicators = indicatorsContainer.querySelectorAll('.indicator');
    }

    bindEvents() {
        const prevBtn = this.container.querySelector('#prevBtn');
        const nextBtn = this.container.querySelector('#nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        // Pause on hover
        this.container.addEventListener('mouseenter', () => {
            this.pauseAutoplay();
        });

        this.container.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });

        // Touch/swipe support for mobile
        this.addTouchSupport();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Pause autoplay when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.startAutoplay();
            }
        });
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        }, { passive: true });
    }

    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Remove active class from all indicators
        if (this.indicators) {
            this.indicators.forEach(indicator => {
                indicator.classList.remove('active');
            });
        }

        // Add active class to current slide and indicator
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        if (this.indicators && this.indicators[index]) {
            this.indicators[index].classList.add('active');
        }

        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
            this.restartAutoplay();
        }
    }

    startAutoplay() {
        if (this.slides.length <= 1) return;
        
        this.pauseAutoplay();
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDuration);
    }

    pauseAutoplay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    restartAutoplay() {
        this.startAutoplay();
    }

    // Method to add new slides dynamically
    addSlide(slideHTML) {
        const slideElement = document.createElement('div');
        slideElement.classList.add('carousel-slide');
        slideElement.innerHTML = slideHTML;
        
        this.container.querySelector('.carousel').appendChild(slideElement);
        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.createIndicators();
    }

    // Method to remove a slide
    removeSlide(index) {
        if (this.slides[index]) {
            this.slides[index].remove();
            this.slides = this.container.querySelectorAll('.carousel-slide');
            
            if (this.currentSlide >= this.slides.length) {
                this.currentSlide = 0;
            }
            
            this.createIndicators();
            this.showSlide(this.currentSlide);
        }
    }

    // Method to update autoplay duration
    setAutoplayDuration(duration) {
        this.autoplayDuration = duration;
        this.restartAutoplay();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.getElementById('carousel');
    if (carouselContainer) {
        window.carousel = new Carousel('carousel');
    }
});

// Export for use in other modules
window.Carousel = Carousel;
