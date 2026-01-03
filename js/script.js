document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const textInput = document.getElementById('textInput');
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    const rotationInput = document.getElementById('rotation');
    const rotationDisplay = document.getElementById('rotationDisplay');
    const textColorInput = document.getElementById('textColor');
    const textColorHex = document.getElementById('textColorHex');
    const posYInput = document.getElementById('posY');
    const posYDisplay = document.getElementById('posYDisplay');
    const posXInput = document.getElementById('posX');
    const posXDisplay = document.getElementById('posXDisplay');
    
    const textOverlay = document.getElementById('textOverlay');
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    // --- State Management ---
    
    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        if (htmlEl.classList.contains('dark')) {
            htmlEl.classList.remove('dark');
            htmlEl.classList.add('light');
            localStorage.setItem('theme', 'light');
            updateThemeIcons(false);
        } else {
            htmlEl.classList.remove('light');
            htmlEl.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            updateThemeIcons(true);
        }
    });

    function updateThemeIcons(isDark) {
        const sun = document.getElementById('sunIcon');
        const moon = document.getElementById('moonIcon');
        if (isDark) {
            sun.classList.remove('hidden');
            moon.classList.add('hidden');
        } else {
            sun.classList.add('hidden');
            moon.classList.remove('hidden');
        }
    }

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.classList.add('dark');
        updateThemeIcons(true);
    } else {
        updateThemeIcons(false);
    }

    // --- Text Updates ---
    
    // Main Text
    textInput.addEventListener('input', (e) => {
        const val = e.target.value;
        // Convert newlines to breaks or handle whitespace pre-wrap (CSS handles pre-wrap)
        textOverlay.textContent = val;
    });

    // Font Size
    fontSizeInput.addEventListener('input', (e) => {
        const val = e.target.value;
        textOverlay.style.fontSize = `${val}px`;
        fontSizeDisplay.textContent = `${val}px`;
    });

    // Rotation
    rotationInput.addEventListener('input', (e) => {
        const val = e.target.value;
        updateTransform();
        rotationDisplay.textContent = `${val}°`;
    });

    // Color
    textColorInput.addEventListener('input', (e) => {
        const val = e.target.value;
        textOverlay.style.color = val;
        textColorHex.textContent = val;
    });

    // Position Y
    posYInput.addEventListener('input', (e) => {
        const val = e.target.value;
        textOverlay.style.top = `${val}%`;
        posYDisplay.textContent = `${val}%`;
    });

    // Position X
    posXInput.addEventListener('input', (e) => {
        const val = e.target.value;
        textOverlay.style.left = `${val}%`;
        posXDisplay.textContent = `${val}%`;
    });

    function updateTransform() {
        const rot = rotationInput.value;
        // Note: Translate is handled by CSS positioning props + transform translate(-50%, -50%).
        // Adding rotation requires composition.
        textOverlay.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
    }
});
