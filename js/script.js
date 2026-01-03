document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
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

    // New Font Controls
    const fontSelect = document.getElementById('fontSelect');
    const weightContainer = document.getElementById('weightContainer');
    const weightSelect = document.getElementById('weightSelect');
    const customFontContainer = document.getElementById('customFontContainer');
    const customFontInput = document.getElementById('customFontInput');
    const fontMessage = document.getElementById('fontMessage');

    const textOverlay = document.getElementById('textOverlay');
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    // --- Configuration ---
    const DEFAULTS = {
        color: '#28123d',
        font: 'hiragino',
        weight: '800' // W8
    };

    const FONTS = {
        hiragino: {
            name: 'Hiragino Kaku Gothic',
            weights: [
                { label: 'W6 (SemiBold)', value: '600' },
                { label: 'W7 (Bold)', value: '700' },
                { label: 'W8 (ExtraBold)', value: '800' },
                { label: 'W9 (Black)', value: '900' }
            ],
            checkAvailability: true
        },
        mplus: {
            name: 'M PLUS 1p',
            weights: [
                { label: 'Medium (500)', value: '500' },
                { label: 'Bold (700)', value: '700' },
                { label: 'ExtraBold (800)', value: '800' },
                { label: 'Black (900)', value: '900' }
            ],
            defaultWeight: '700'
        },
        noto: {
            name: 'Noto Sans JP',
            weights: [
                { label: 'Medium (500)', value: '500' },
                { label: 'SemiBold (600)', value: '600' },
                { label: 'Bold (700)', value: '700' },
                { label: 'ExtraBold (800)', value: '800' },
                { label: 'Black (900)', value: '900' }
            ],
            defaultWeight: '700'
        },
        system: {
            name: 'System Default',
            weights: [], // Fixed
            isFixed: true
        },
        custom: {
            name: 'Google Fonts (Custom)',
            weights: [], // User defined effectively, but we won't offer a weight select for custom import unless requested.
            isCustom: true
        }
    };

    // --- State Management ---

    // Theme
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

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.classList.add('dark');
        updateThemeIcons(true);
    } else {
        updateThemeIcons(false);
    }

    // --- Font Logic ---

    // Simple check for font availability (Canvas strategy)
    function isFontAvailable(fontName) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const text = 'abcdefghijklmnopqrstuvwxyz0123456789';

        context.font = '72px monospace';
        const baselineSize = context.measureText(text).width;

        context.font = `72px "${fontName}", monospace`;
        const newSize = context.measureText(text).width;

        return newSize !== baselineSize;
    }

    function updateFontOptions() {
        const selectedFontKey = fontSelect.value;
        const fontConfig = FONTS[selectedFontKey];

        // Reset UI
        weightContainer.classList.add('hidden');
        customFontContainer.classList.add('hidden');
        fontMessage.classList.add('hidden');
        fontMessage.textContent = '';
        textOverlay.style.fontFamily = ''; // Clear inline to let classes work, or set specific

        // Remove old font classes
        textOverlay.classList.remove('font-hiragino', 'font-mplus', 'font-noto', 'font-system');

        if (selectedFontKey === 'custom') {
            customFontContainer.classList.remove('hidden');
            // If custom font is already typed, apply it
            if (customFontInput.value) {
                applyCustomFont(customFontInput.value);
            }
            return;
        }

        if (fontConfig.checkAvailability) {
            // Check Hiragino
            // Note: Canvas check isn't perfect but decent. 
            // Better to try/apply and maybe warn? 
            // User requested: "存在しない場合はできないという旨を表示"
            // We'll check "Hiragino Kaku Gothic ProN" specifically as the base
            const available = isFontAvailable('Hiragino Kaku Gothic ProN') || isFontAvailable('Hiragino Sans');
            if (!available) {
                fontMessage.textContent = 'Hiragino font not detected on this device. Fallback may occur.';
                fontMessage.classList.remove('hidden');
            }
            textOverlay.classList.add('font-hiragino');
        } else if (selectedFontKey === 'system') {
            textOverlay.classList.add('font-system');
        } else {
            // M Plus or Noto
            textOverlay.classList.add(`font-${selectedFontKey}`);
        }

        // Weights
        if (fontConfig.weights && fontConfig.weights.length > 0) {
            weightContainer.classList.remove('hidden');
            weightSelect.innerHTML = ''; // Clear
            fontConfig.weights.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w.value;
                opt.textContent = w.label;
                weightSelect.appendChild(opt);
            });
            // Set default
            const defaultW = fontConfig.defaultWeight || (selectedFontKey === 'hiragino' ? '800' : '700');
            weightSelect.value = defaultW;
            textOverlay.style.fontWeight = defaultW;
        } else {
            // Reset weight for System/Custom if needed, or leave inherited?
            // User said SysDefault unselectable.
            textOverlay.style.fontWeight = '';
        }

    }

    function applyCustomFont(fontName) {
        if (!fontName) return;
        // Inject Google Font
        const linkId = 'custom-google-font';
        let link = document.getElementById(linkId);
        if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        // Basic sanitization
        const safeName = fontName.trim().replace(/ /g, '+');
        link.href = `https://fonts.googleapis.com/css2?family=${safeName}&display=swap`;

        textOverlay.style.fontFamily = `"${fontName}", sans-serif`;
    }

    // Debounce function to limit API calls while typing
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    fontSelect.addEventListener('change', updateFontOptions);
    weightSelect.addEventListener('change', (e) => {
        textOverlay.style.fontWeight = e.target.value;
    });

    // Use 'input' with debounce for immediate but safe feedback
    customFontInput.addEventListener('input', debounce((e) => {
        applyCustomFont(e.target.value);
    }, 500));


    // --- Other Inputs ---

    textInput.addEventListener('input', (e) => {
        textOverlay.textContent = e.target.value;
    });

    fontSizeInput.addEventListener('input', (e) => {
        const val = e.target.value;
        textOverlay.style.fontSize = `${val}px`;
        fontSizeDisplay.textContent = `${val}px`;
    });

    rotationInput.addEventListener('input', (e) => {
        const val = e.target.value;
        updateTransform();
        rotationDisplay.textContent = `${val}°`;
    });

    textColorInput.addEventListener('input', (e) => {
        const val = e.target.value;
        textOverlay.style.color = val;
        textColorHex.textContent = val;
    });

    posYInput.addEventListener('input', (e) => {
        const val = e.target.value;
        textOverlay.style.top = `${val}%`;
        posYDisplay.textContent = `${val}%`;
    });

    posXInput.addEventListener('input', (e) => {
        const val = e.target.value;
        textOverlay.style.left = `${val}%`;
        posXDisplay.textContent = `${val}%`;
    });

    function updateTransform() {
        const rot = rotationInput.value;
        textOverlay.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
    }

    // --- Init ---
    // Set Defaults
    textColorInput.value = DEFAULTS.color;
    textColorHex.textContent = DEFAULTS.color;
    textOverlay.style.color = DEFAULTS.color;

    // Trigger font init
    updateFontOptions();

});
