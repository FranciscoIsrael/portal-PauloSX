# Educação Sexual - Portal Educativo

## Overview

This is a comprehensive educational web portal focused on sexual education for schools. The application provides an interactive platform with educational games, quizzes, and informational content to improve sexual education teaching in schools. It features a modern, responsive design that works seamlessly on both desktop and mobile devices.

The portal includes multiple interactive modules: a knowledge quiz, crossword puzzles, acrostic games, word search puzzles, data visualization charts, and reference materials. All content is presented in Portuguese and designed to be age-appropriate and educationally valuable.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Core Technologies**: HTML5, CSS3, and vanilla JavaScript
- **Styling Framework**: Custom CSS with CSS variables for theming and responsive design
- **UI Components**: Modular JavaScript classes for each game/feature
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox layouts
- **Font System**: Inter font family with FontAwesome icons

### Navigation and Layout
- **Fixed Header**: Contains logo and application title with mobile hamburger menu
- **Sidebar Navigation**: Collapsible sidebar with main navigation menu
- **Page Structure**: Single-page application with separate HTML files for each section
- **Routing**: Client-side navigation using standard HTML links

### Game Modules
- **Quiz System**: Multiple choice questions with scoring and progress tracking
- **Crossword Game**: Interactive puzzle with different difficulty levels and timer
- **Acrostic Creator**: Word-building game with examples and user submissions
- **Word Search**: Grid-based word finding game with multiple difficulty settings
- **Charts & Analytics**: Data visualization using Chart.js library

### Data Management
- **Storage Layer**: Browser localStorage for persistent data storage
- **Storage Manager**: Centralized class for managing different data types
- **Data Types**: Quiz results, game scores, user settings, progress tracking
- **No Backend**: Entirely client-side application with no server dependencies

### UI/UX Design Patterns
- **Design System**: Consistent color scheme with CSS custom properties
- **Component Architecture**: Reusable CSS classes and JavaScript modules
- **Accessibility**: Semantic HTML structure with proper ARIA labels
- **Performance**: Optimized images and lazy loading for better performance

## External Dependencies

### CSS Libraries
- **FontAwesome 6.0.0**: Icon library via CDN for consistent iconography
- **Google Fonts**: Inter font family for typography

### JavaScript Libraries
- **Chart.js**: Data visualization library for analytics and statistics charts
- **CDN Delivery**: All external libraries loaded via CDN for better performance

### Browser APIs
- **localStorage**: For client-side data persistence and user progress tracking
- **Responsive Design APIs**: CSS media queries and viewport meta tag for mobile compatibility

### Development Tools
- **No Build Process**: Direct HTML/CSS/JS development without bundlers
- **Modular Structure**: Organized file structure with separate concerns
- **Cross-browser Support**: Compatible with modern browsers supporting ES6+ features