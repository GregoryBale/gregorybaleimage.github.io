document.addEventListener('DOMContentLoaded', () => {
    const APP = {
        apis: [
            'https://paxsenix.serv00.net/v1/pollinations.php?text=',
            'https://paxsenix.serv00.net/v1/magicstudio.php?text=',
            'https://paxsenix.serv00.net/v1/sdxl.php?text=',
            'https://paxsenix.serv00.net/v1/prodia.php?text=',
            'https://paxsenix.serv00.net/v1/jugger.php?text=',
            'https://paxsenix.serv00.net/v1/dalle.php?text='
        ],
        elements: {},
        currentLanguage: 'en',
        translations: {
            en: {
                title: "Cyber Generator",
                copyTitle: "Copy",
                clearTitle: "Clear",
                generateTextTitle: "Generate text",
                inputPlaceholder: "Enter prompt",
                generateBtnText: "Generate image",
                downloadText: "Download",
                successMessage: "Image successfully generated!",
                errorMessage: "Failed to generate image. Please try again.",
                copySuccess: "Text copied to clipboard!",
                copyError: "Failed to copy text",
                nothingToCopy: "Nothing to copy. Enter text in the input field.",
                textCleared: "Text cleared",
                alreadyEmpty: "Input field is already empty",
                notImplemented: "Text generation function will be implemented later",
                ratingSuccess: "Thank you for your feedback!",
                ratingError: "Error submitting rating. Please try again.",
                switchingModel: "Error: The model is not responding, click to switch...",
                allModelsFailed: "All models failed to generate an image. Please try again later.",
                cookieConsentMessage: "This website uses cookies to enhance your experience. By continuing to use this site, you agree to our use of cookies.",
                cookieConsentButton: "I understand"
            },
            ru: {
                title: "Кибер Генератор",
                copyTitle: "Копировать",
                clearTitle: "Очистить",
                generateTextTitle: "Сгенерировать текст",
                inputPlaceholder: "Введите запрос",
                generateBtnText: "Сгенерировать изображение",
                downloadText: "Скачать",
                successMessage: "Изображение успешно сгенерировано!",
                errorMessage: "Не удалось сгенерировать изображение. Пожалуйста, попробуйте еще раз.",
                copySuccess: "Текст скопирован в буфер обмена!",
                copyError: "Не удалось скопировать текст",
                nothingToCopy: "Нечего копировать. Введите текст в поле ввода.",
                textCleared: "Текст очищен",
                alreadyEmpty: "Поле ввода уже пустое",
                notImplemented: "Функция генерации текста будет реализована позже",
                ratingSuccess: "Спасибо за ваш отзыв!",
                ratingError: "Ошибка при отправке оценки. Пожалуйста, попробуйте еще раз.",
                switchingModel: "Ошибка: модель не отвечает, нажмите, чтобы переключиться...",
                allModelsFailed: "Все модели не смогли сгенерировать изображение. Пожалуйста, попробуйте позже.",
                cookieConsentMessage: "Этот сайт использует файлы cookie для улучшения вашего опыта. Продолжая использовать этот сайт, вы соглашаетесь с использованием нами файлов cookie.",
                cookieConsentButton: "Я понимаю"
            }
        },
        notificationQueue: [],
        isNotificationShowing: false,

        init() {
            this.cacheElements();
            this.loadSettings();
            this.showCookieConsent();
            this.bindEvents();
            this.initLanguage();
        },

        cacheElements() {
            const ids = [
                'generateImageBtn', 'imagePrompt', 'imageContainer', 'loader',
                'notification', 'notificationIcon', 'notificationMessage',
                'notificationAction', 'copyBtn', 'clearBtn', 'generateTextBtn',
                'languageBtn', 'languageMenu', 'generateBtnText', 'ratingContainer',
                'likeBtn', 'dislikeBtn', 'cookieConsentBtn', 'musicBtn'
            ];
            ids.forEach(id => this.elements[id] = document.getElementById(id));
        },

        bindEvents() {
            this.elements.generateImageBtn.addEventListener('click', () => this.generateImage());
            this.elements.imagePrompt.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.generateImage();
            });
            this.elements.copyBtn.addEventListener('click', () => this.copyText());
            this.elements.clearBtn.addEventListener('click', () => this.clearText());
            this.elements.generateTextBtn.addEventListener('click', () => this.generateText());
            this.elements.languageBtn.addEventListener('click', () => this.toggleLanguageMenu());
            this.elements.languageMenu.addEventListener('click', (e) => this.handleLanguageSelection(e));
            this.elements.likeBtn.addEventListener('click', () => this.rateGeneration('like'));
            this.elements.dislikeBtn.addEventListener('click', () => this.rateGeneration('dislike'));
            this.elements.cookieConsentBtn.addEventListener('click', () => this.handleCookieConsent());
            this.elements.musicBtn.addEventListener('click', () => this.toggleMusic());
        },

        setLanguage(lang) {
            this.currentLanguage = lang;
            document.documentElement.lang = lang;
            this.updateTexts();
            this.saveSettings();
        },

        updateTexts() {
            const texts = this.translations[this.currentLanguage];
            document.title = texts.title;
            document.querySelector('.glitch').textContent = texts.title;
            document.querySelector('.glitch').setAttribute('data-text', texts.title);
            this.elements.copyBtn.title = texts.copyTitle;
            this.elements.clearBtn.title = texts.clearTitle;
            this.elements.generateTextBtn.title = texts.generateTextTitle;
            this.elements.imagePrompt.placeholder = texts.inputPlaceholder;
            this.elements.generateBtnText.textContent = texts.generateBtnText;
        },

        initLanguage() {
            const userLang = navigator.language || navigator.userLanguage;
            const langCode = userLang.split('-')[0];
            this.setLanguage(this.translations[langCode] ? langCode : 'en');
        },

        async generateImage() {
            const query = this.elements.imagePrompt.value.trim();
            if (!query) {
                this.elements.imagePrompt.classList.add('shake');
                setTimeout(() => this.elements.imagePrompt.classList.remove('shake'), 820);
                return;
            }

            this.elements.loader.style.display = 'block';
            this.elements.imageContainer.innerHTML = '';
            this.elements.generateImageBtn.disabled = true;
            this.hideNotification();

            let apisCopy = [...this.apis];
            let success = false;

            while (apisCopy.length > 0 && !success) {
                const api = apisCopy.splice(Math.floor(Math.random() * apisCopy.length), 1)[0];
                try {
                    const result = await this.fetchWithTimeout(api + encodeURIComponent(query), 15000);
                    const data = await result.json();

                    if (data.ok) {
                        await this.displayGeneratedImage(data.url);
                        success = true;
                    } else {
                        throw new Error('API returned error');
                    }
                } catch (error) {
                    console.error('Error with API:', api, error);
                    if (apisCopy.length > 0) {
                        this.showNotification(this.translations[this.currentLanguage].switchingModel, 'info');
                    }
                }
            }

            if (!success) {
                this.elements.loader.style.display = 'none';
                this.elements.generateImageBtn.disabled = false;
                this.showNotification(this.translations[this.currentLanguage].allModelsFailed, 'error');
            }
        },

        async fetchWithTimeout(url, timeout) {
            return Promise.race([
                fetch(url),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
            ]);
        },

        async displayGeneratedImage(imageUrl) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.elements.loader.style.display = 'none';
                    this.elements.imageContainer.innerHTML = `
                        <img src="${imageUrl}" alt="Generated Image" class="fade-in">
                        <div class="download-overlay">
                            <a href="${imageUrl}" download class="download-btn">
                                <i class="fas fa-download"></i> ${this.translations[this.currentLanguage].downloadText}
                            </a>
                        </div>
                    `;
                    this.elements.generateImageBtn.disabled = false;
                    this.showNotification(this.translations[this.currentLanguage].successMessage, 'success');
                    this.showRatingOptions();
                    resolve();
                };
                img.src = imageUrl;
            });
        },

        copyText() {
            const text = this.elements.imagePrompt.value.trim();
            if (!text) {
                this.showNotification(this.translations[this.currentLanguage].nothingToCopy, 'error');
                return;
            }

            navigator.clipboard.writeText(text)
                .then(() => this.showNotification(this.translations[this.currentLanguage].copySuccess, 'success'))
                .catch(() => this.showNotification(this.translations[this.currentLanguage].copyError, 'error'));
        },

        clearText() {
            if (!this.elements.imagePrompt.value.trim()) {
                this.showNotification(this.translations[this.currentLanguage].alreadyEmpty, 'error');
                return;
            }

            this.elements.imagePrompt.value = '';
            this.showNotification(this.translations[this.currentLanguage].textCleared, 'success');
        },

        generateText() {
            this.showNotification(this.translations[this.currentLanguage].notImplemented, 'error');
        },

        showRatingOptions() {
            setTimeout(() => {
                this.elements.ratingContainer.style.display = 'flex';
            }, 2000);
        },

        hideRatingOptions() {
            this.elements.ratingContainer.style.display = 'none';
        },

        async rateGeneration(rating) {
            const prompt = this.elements.imagePrompt.value;
            const data = { prompt, rating };

            try {
                const response = await fetch('report.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                this.showNotification(
                    result.success ? this.translations[this.currentLanguage].ratingSuccess : this.translations[this.currentLanguage].ratingError,
                    result.success ? 'success' : 'error'
                );
            } catch (error) {
                console.error('Error:', error);
                this.showNotification(this.translations[this.currentLanguage].ratingError, 'error');
            }

            this.hideRatingOptions();
        },

        toggleLanguageMenu() {
            this.elements.languageMenu.style.display = 
                this.elements.languageMenu.style.display === 'block' ? 'none' : 'block';
        },

        handleLanguageSelection(e) {
            if (e.target.tagName === 'BUTTON') {
                this.setLanguage(e.target.getAttribute('data-lang'));
                this.elements.languageMenu.style.display = 'none';
            }
        },

        showNotification(message, type) {
            this.notificationQueue.push({ message, type });
            if (!this.isNotificationShowing) {
                this.displayNextNotification();
            }
        },

        displayNextNotification() {
            if (this.notificationQueue.length === 0) {
                this.isNotificationShowing = false;
                return;
            }

            this.isNotificationShowing = true;
            const { message, type } = this.notificationQueue.shift();

            this.elements.notification.className = `notification ${type}`;
            this.elements.notificationMessage.textContent = message;
            
            if (type === 'success') {
                this.elements.notificationIcon.className = 'fas fa-check-circle notification-icon';
                this.elements.notificationAction.className = 'notification-close';
                this.elements.notificationAction.innerHTML = '<i class="fas fa-times"></i>';
                this.elements.notificationAction.onclick = () => this.hideNotification();
            } else {
                this.elements.notificationIcon.className = 'fas fa-exclamation-circle notification-icon';
                this.elements.notificationAction.className = 'notification-retry';
                this.elements.notificationAction.innerHTML = '<i class="fas fa-redo"></i>';
                this.elements.notificationAction.onclick = () => this.generateImage();
            }
            
            this.elements.notification.classList.add('show');
            if (type === 'success') {
                setTimeout(() => this.hideNotification(), 5000);
            }
        },

        hideNotification() {
            this.elements.notification.classList.remove('show');
            setTimeout(() => {
                this.displayNextNotification();
            }, 300);
        },

        setCookie(name, value, days) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        },

        getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },

        saveSettings() {
            this.setCookie('language', this.currentLanguage, 30);
            this.setCookie('musicEnabled', this.elements.musicBtn.classList.contains('active'), 30);
        },

        loadSettings() {
            const savedLanguage = this.getCookie('language');
            if (savedLanguage) {
                this.setLanguage(savedLanguage);
            }

            const musicEnabled = this.getCookie('musicEnabled');
            if (musicEnabled === 'true') {
                this.elements.musicBtn.classList.add('active');
                this.playBackgroundMusic();
            }
        },

        toggleMusic() {
            this.elements.musicBtn.classList.toggle('active');
            if (this.elements.musicBtn.classList.contains('active')) {
                this.playBackgroundMusic();
            } else {
                this.pauseBackgroundMusic();
            }
            this.saveSettings();
        },

        playBackgroundMusic() {
            // Implement music playback logic here
        },

        pauseBackgroundMusic() {
            // Implement music pause logic here
        },

        showCookieConsent() {
            if (!this.getCookie('cookieConsent')) {
                this.showNotification(this.translations[this.currentLanguage].cookieConsentMessage, 'info');
            }
        },

        handleCookieConsent() {
            this.setCookie('cookieConsent', 'true', 365);
            this.hideNotification();
        }
    };

    APP.init();
});
