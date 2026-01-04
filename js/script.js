document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const fontSizeSlider = document.getElementById('fontSize');
    const fontSizeInput = document.getElementById('fontSizeInput');
    const rotationInput = document.getElementById('rotation');
    const rotationDisplay = document.getElementById('rotationDisplay');
    const textColorInput = document.getElementById('textColor');
    const textColorHex = document.getElementById('textColorHex');
    const posYSlider = document.getElementById('posY');
    const posYNumberInput = document.getElementById('posYInput');
    const posXSlider = document.getElementById('posX');
    const posXNumberInput = document.getElementById('posXInput');

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
    const fontInfoContainer = document.getElementById('fontInfoContainer');
    const fontInfoDisplay = document.getElementById('fontInfoDisplay');
    const customFontContainer = document.getElementById('customFontContainer');
    const customFontInput = document.getElementById('customFontInput');
    const fontMessage = document.getElementById('fontMessage');

    const textOverlay = document.getElementById('textOverlay');
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    const previewImage = document.getElementById('previewImage');
    const customImageInput = document.getElementById('customImageInput');
    const downloadBtn = document.getElementById('downloadBtn');

    // Settings Code elements
    const settingsCodeDisplay = document.getElementById('settingsCodeDisplay');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const importCodeInput = document.getElementById('importCodeInput');
    const applyCodeBtn = document.getElementById('applyCodeBtn');
    const clearCodeBtn = document.getElementById('clearCodeBtn');

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
        fontInfoContainer.classList.add('hidden');
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
            fontInfoContainer.classList.remove('hidden');
            setTimeout(() => {
                const computedFont = getComputedStyle(textOverlay).fontFamily;
                const fontName = computedFont.split(',')[0].replace(/['"]/g, '').trim();
                fontInfoDisplay.textContent = fontName;
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

    // Position Y (slider + number input sync)
    function updatePosY(val) {
        textOverlay.style.top = `${val}%`;
        posYSlider.value = val;
        posYNumberInput.value = val;
    }
    posYSlider.addEventListener('input', (e) => updatePosY(e.target.value));
    posYNumberInput.addEventListener('input', (e) => updatePosY(e.target.value));

    // Position X (slider + number input sync)
    function updatePosX(val) {
        textOverlay.style.left = `${val}%`;
        posXSlider.value = val;
        posXNumberInput.value = val;
    }
    posXSlider.addEventListener('input', (e) => updatePosX(e.target.value));
    posXNumberInput.addEventListener('input', (e) => updatePosX(e.target.value));

    function updateTransform() {
        const rot = rotationInput.value;
        textOverlay.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
    }

    textColorInput.value = DEFAULTS.color;
    textColorHex.textContent = DEFAULTS.color;
    textOverlay.style.color = DEFAULTS.color;

    updateFontOptions();

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

    downloadBtn.addEventListener('click', () => {
        alert('Right-click the image and select "Save Image As" to download.\\n\\nFor proper download with text overlay, html2canvas integration is needed.');
    });

    function generateSettingsCode() {
        const settings = {
            m: btoa(unescape(encodeURIComponent(textInput.value))), // Base64 encoded message
            f: fontSelect.value,
            w: weightSelect.value || '',
            cf: customFontInput.value || '',
            sz: fontSizeSlider.value,
            ls: letterSpacingSlider.value,
            lh: lineHeightSlider.value,
            tw: textWidthSlider.value,
            lb: autoLineBreakToggle.querySelector('span').textContent === 'Enabled' ? '1' : '0',
            c: textColorInput.value,
            r: rotationInput.value,
            x: posXSlider.value,
            y: posYSlider.value
        };
        return Object.entries(settings).map(([k, v]) => `${k}:${v}`).join('|');
    }

    function updateSettingsCodeDisplay() {
        settingsCodeDisplay.textContent = generateSettingsCode();
    }

    function parseSettingsCode(code) {
        const settings = {};
        code.split('|').forEach(part => {
            const [key, ...valueParts] = part.split(':');
            settings[key] = valueParts.join(':'); // Handle colons in values
        });
        return settings;
    }

    function applySettings(settings) {
        try {
            // Message (Base64 decoded)
            if (settings.m) {
                const msg = decodeURIComponent(escape(atob(settings.m)));
                textInput.value = msg;
                textOverlay.textContent = msg;
            }

            // Font and Weight - apply weight AFTER font options are updated
            if (settings.f) {
                fontSelect.value = settings.f;
                updateFontOptions();

                // Apply weight after font is set (need slight delay for options to populate)
                if (settings.w) {
                    setTimeout(() => {
                        weightSelect.value = settings.w;
                        textOverlay.style.fontWeight = settings.w;
                    }, 100);
                }
            }

            // Custom Font
            if (settings.cf && settings.f === 'custom') {
                customFontInput.value = settings.cf;
                applyCustomFont(settings.cf);
            }

            // Size
            if (settings.sz) updateFontSize(settings.sz);

            // Letter Spacing
            if (settings.ls) updateLetterSpacing(settings.ls);

            // Line Height
            if (settings.lh) updateLineHeight(settings.lh);

            // Text Width
            if (settings.tw) updateTextWidth(settings.tw);

            // Auto Line Break - update shared state variable and call existing function
            if (settings.lb !== undefined) {
                autoLineBreakEnabled = settings.lb === '1';
                updateAutoLineBreak();
            }

            // Color
            if (settings.c) {
                textColorInput.value = settings.c;
                textOverlay.style.color = settings.c;
                textColorHex.textContent = settings.c;
            }

            // Rotation
            if (settings.r !== undefined) {
                rotationInput.value = settings.r;
                rotationDisplay.textContent = `${settings.r}°`;
            }

            // Position
            if (settings.x) updatePosX(settings.x);
            if (settings.y) updatePosY(settings.y);

            // Always update transform after position and rotation are set
            updateTransform();

            updateSettingsCodeDisplay();
            return true;
        } catch (e) {
            console.error('Failed to apply settings:', e);
            return false;
        }
    }

    copyCodeBtn.addEventListener('click', () => {
        const code = settingsCodeDisplay.textContent;
        navigator.clipboard.writeText(code).then(() => {
            const originalText = copyCodeBtn.innerHTML;
            copyCodeBtn.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!';
            copyCodeBtn.classList.add('text-green-500');
            setTimeout(() => {
                copyCodeBtn.innerHTML = originalText;
                copyCodeBtn.classList.remove('text-green-500');
            }, 2000);
        });
    });

    applyCodeBtn.addEventListener('click', () => {
        const code = importCodeInput.value.trim();
        if (!code) return;

        const settings = parseSettingsCode(code);
        if (applySettings(settings)) {
            importCodeInput.value = '';
        } else {
            alert('Invalid settings code');
        }
    });

    clearCodeBtn.addEventListener('click', () => {
        importCodeInput.value = '';
    });
    const allInputs = [textInput, fontSizeSlider, fontSizeInput, letterSpacingSlider, letterSpacingInput,
        lineHeightSlider, lineHeightInput, textWidthSlider, textWidthInput, textColorInput,
        rotationInput, posXSlider, posXNumberInput, posYSlider, posYNumberInput];
    allInputs.forEach(input => {
        if (input) input.addEventListener('input', updateSettingsCodeDisplay);
    });
    fontSelect.addEventListener('change', updateSettingsCodeDisplay);
    weightSelect.addEventListener('change', updateSettingsCodeDisplay);
    autoLineBreakToggle.addEventListener('click', () => setTimeout(updateSettingsCodeDisplay, 50));
    customFontInput.addEventListener('input', debounce(updateSettingsCodeDisplay, 500));

    updateSettingsCodeDisplay();

    // Font License Modal
    const fontInfoBtn = document.getElementById('fontInfoBtn');
    const fontLicenseModal = document.getElementById('fontLicenseModal');
    const closeFontModal = document.getElementById('closeFontModal');
    const tabLineSeed = document.getElementById('tabLineSeed');
    const tabGoogleFonts = document.getElementById('tabGoogleFonts');
    const contentLineSeed = document.getElementById('contentLineSeed');
    const contentGoogleFonts = document.getElementById('contentGoogleFonts');
    let lineSeedLicenseLoaded = false;

    fontInfoBtn.addEventListener('click', () => {
        fontLicenseModal.classList.remove('hidden');

        // Load LINE Seed license from file if not already loaded
        if (!lineSeedLicenseLoaded) {
            fetch('/fonts/OFL.txt')
                .then(response => response.text())
                .then(text => {
                    contentLineSeed.textContent = text;
                    lineSeedLicenseLoaded = true;
                })
                .catch(err => {
                    contentLineSeed.textContent = 'Failed to load license file.';
                    console.error('Failed to load OFL.txt:', err);
                });
        }
    });

    closeFontModal.addEventListener('click', () => {
        fontLicenseModal.classList.add('hidden');
    });

    fontLicenseModal.addEventListener('click', (e) => {
        if (e.target === fontLicenseModal) {
            fontLicenseModal.classList.add('hidden');
        }
    });

    // Tab switching
    tabLineSeed.addEventListener('click', () => {
        tabLineSeed.classList.add('text-primary-600', 'border-b-2', 'border-primary-500');
        tabLineSeed.classList.remove('text-gray-500');
        tabGoogleFonts.classList.remove('text-primary-600', 'border-b-2', 'border-primary-500');
        tabGoogleFonts.classList.add('text-gray-500');
        contentLineSeed.classList.remove('hidden');
        contentGoogleFonts.classList.add('hidden');
    });

    tabGoogleFonts.addEventListener('click', () => {
        tabGoogleFonts.classList.add('text-primary-600', 'border-b-2', 'border-primary-500');
        tabGoogleFonts.classList.remove('text-gray-500');
        tabLineSeed.classList.remove('text-primary-600', 'border-b-2', 'border-primary-500');
        tabLineSeed.classList.add('text-gray-500');
        contentGoogleFonts.classList.remove('hidden');
        contentLineSeed.classList.add('hidden');
    });

});
