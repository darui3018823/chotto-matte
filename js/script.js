document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const fontSizeSlider = document.getElementById('fontSize');
    const fontSizeInput = document.getElementById('fontSizeInput');
    const rotationInput = document.getElementById('rotation');
    const rotationDisplay = document.getElementById('rotationDisplay');
    const textColorInput = document.getElementById('textColor');
    const textColorHex = document.getElementById('textColorHex');
    const posYInput = document.getElementById('posY');
    const posYDisplay = document.getElementById('posYDisplay');
    const posXInput = document.getElementById('posX');
    const posXDisplay = document.getElementById('posXDisplay');

    const letterSpacingSlider = document.getElementById('letterSpacing');
    const letterSpacingInput = document.getElementById('letterSpacingInput');
    const lineHeightSlider = document.getElementById('lineHeight');
    const lineHeightInput = document.getElementById('lineHeightInput');
    const textWidthSlider = document.getElementById('textWidth');
    const textWidthInput = document.getElementById('textWidthInput');
    const autoLineBreakToggle = document.getElementById('autoLineBreakToggle');

    const fontSelect = document.getElementById('fontSelect');
    const weightContainer = document.getElementById('weightContainer');
    const weightSelect = document.getElementById('weightSelect');
    const customFontContainer = document.getElementById('customFontContainer');
    const customFontInput = document.getElementById('customFontInput');
    const fontMessage = document.getElementById('fontMessage');

    const textOverlay = document.getElementById('textOverlay');
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    const previewImage = document.getElementById('previewImage');
    const customImageInput = document.getElementById('customImageInput');
    const downloadBtn = document.getElementById('downloadBtn');

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
            weights: [],
            isFixed: true
        },
        custom: {
            name: 'Google Fonts (Custom)',
            weights: [],
            isCustom: true
        }
    };

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

        weightContainer.classList.add('hidden');
        customFontContainer.classList.add('hidden');
        fontMessage.classList.add('hidden');
        fontMessage.textContent = '';
        textOverlay.style.fontFamily = '';

        textOverlay.classList.remove('font-hiragino', 'font-mplus', 'font-noto', 'font-system');

        if (selectedFontKey === 'custom') {
            customFontContainer.classList.remove('hidden');
            if (customFontInput.value) {
                applyCustomFont(customFontInput.value);
            }
            return;
        }

        if (fontConfig.checkAvailability) {
            const available = isFontAvailable('Hiragino Kaku Gothic ProN') || isFontAvailable('Hiragino Sans');
            if (!available) {
                fontMessage.textContent = 'Hiragino font not detected on this device. Fallback may occur.';
                fontMessage.classList.remove('hidden');
            }
            textOverlay.classList.add('font-hiragino');
        } else if (selectedFontKey === 'system') {
            textOverlay.classList.add('font-system');
            // Detect and display the actual system font
            setTimeout(() => {
                const computedFont = getComputedStyle(textOverlay).fontFamily;
                const fontName = computedFont.split(',')[0].replace(/['"]/g, '').trim();
                fontMessage.textContent = `Using: ${fontName}`;
                fontMessage.classList.remove('hidden');
                fontMessage.classList.remove('text-amber-500', 'dark:text-amber-400', 'bg-amber-50', 'dark:bg-amber-900/20');
                fontMessage.classList.add('text-gray-500', 'dark:text-gray-400', 'bg-gray-100', 'dark:bg-gray-800');
            }, 50);
        } else {
            textOverlay.classList.add(`font-${selectedFontKey}`);
        }

        if (fontConfig.weights && fontConfig.weights.length > 0) {
            weightContainer.classList.remove('hidden');
            weightSelect.innerHTML = ''; // Clear
            fontConfig.weights.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w.value;
                opt.textContent = w.label;
                weightSelect.appendChild(opt);
            });
            const defaultW = fontConfig.defaultWeight || (selectedFontKey === 'hiragino' ? '800' : '700');
            weightSelect.value = defaultW;
            textOverlay.style.fontWeight = defaultW;
        } else {
            textOverlay.style.fontWeight = '';
        }

    }

    function applyCustomFont(fontName) {
        if (!fontName) return;
        const linkId = 'custom-google-font';
        let link = document.getElementById(linkId);
        if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        const safeName = fontName.trim().replace(/ /g, '+');
        link.href = `https://fonts.googleapis.com/css2?family=${safeName}&display=swap`;

        textOverlay.style.fontFamily = `"${fontName}", sans-serif`;
    }

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

    customFontInput.addEventListener('input', debounce((e) => {
        applyCustomFont(e.target.value);
    }, 500));

    textInput.addEventListener('input', (e) => {
        textOverlay.textContent = e.target.value;
    });

    function updateFontSize(val) {
        textOverlay.style.fontSize = `${val}px`;
        fontSizeSlider.value = val;
        fontSizeInput.value = val;
    }
    fontSizeSlider.addEventListener('input', (e) => updateFontSize(e.target.value));
    fontSizeInput.addEventListener('input', (e) => updateFontSize(e.target.value));

    function updateLetterSpacing(val) {
        textOverlay.style.letterSpacing = `${val}px`;
        letterSpacingSlider.value = val;
        letterSpacingInput.value = val;
    }
    letterSpacingSlider.addEventListener('input', (e) => updateLetterSpacing(e.target.value));
    letterSpacingInput.addEventListener('input', (e) => updateLetterSpacing(e.target.value));

    function updateLineHeight(val) {
        textOverlay.style.lineHeight = `${val}%`;
        lineHeightSlider.value = val;
        lineHeightInput.value = val;
    }
    lineHeightSlider.addEventListener('input', (e) => updateLineHeight(e.target.value));
    lineHeightInput.addEventListener('input', (e) => updateLineHeight(e.target.value));

    function updateTextWidth(val) {
        textOverlay.style.width = `${val}%`;
        textWidthSlider.value = val;
        textWidthInput.value = val;
    }
    textWidthSlider.addEventListener('input', (e) => updateTextWidth(e.target.value));
    textWidthInput.addEventListener('input', (e) => updateTextWidth(e.target.value));

    let autoLineBreakEnabled = true;
    function updateAutoLineBreak() {
        const toggleBtn = autoLineBreakToggle;
        const label = toggleBtn.querySelector('span');
        const track = toggleBtn.querySelector('div');
        const thumb = track.querySelector('div');

        if (autoLineBreakEnabled) {
            textOverlay.style.whiteSpace = 'pre-wrap';
            textOverlay.style.wordBreak = 'break-word';
            label.textContent = 'Enabled';
            track.classList.add('bg-primary-500');
            track.classList.remove('bg-gray-300', 'dark:bg-gray-600');
            thumb.classList.add('right-0.5');
            thumb.classList.remove('left-0.5');
        } else {
            textOverlay.style.whiteSpace = 'pre';
            textOverlay.style.wordBreak = 'normal';
            label.textContent = 'Disabled';
            track.classList.remove('bg-primary-500');
            track.classList.add('bg-gray-300', 'dark:bg-gray-600');
            thumb.classList.remove('right-0.5');
            thumb.classList.add('left-0.5');
        }
    }
    autoLineBreakToggle.addEventListener('click', () => {
        autoLineBreakEnabled = !autoLineBreakEnabled;
        updateAutoLineBreak();
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

    textColorInput.value = DEFAULTS.color;
    textColorHex.textContent = DEFAULTS.color;
    textOverlay.style.color = DEFAULTS.color;

    updateFontOptions();

    // Custom Image Upload
    customImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                previewImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Download (placeholder - shows alert for now)
    downloadBtn.addEventListener('click', () => {
        alert('Right-click the image and select "Save Image As" to download.\\n\\nFor proper download with text overlay, html2canvas integration is needed.');
    });

});
