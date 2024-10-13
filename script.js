document.addEventListener('DOMContentLoaded', function() {
    const apis = [
        'https://paxsenix.serv00.net/v1/pollinations.php?text=',
        'https://paxsenix.serv00.net/v1/magicstudio.php?text=',
        'https://paxsenix.serv00.net/v1/sdxl.php?text=',
        'https://paxsenix.serv00.net/v1/prodia.php?text=',
        'https://paxsenix.serv00.net/v1/jugger.php?text=',
        'https://paxsenix.serv00.net/v1/dalle.php?text='
    ];

    const generateImageBtn = document.getElementById('generateImageBtn');
    const imagePrompt = document.getElementById('imagePrompt');
    const imageContainer = document.getElementById('imageContainer');
    const loader = document.getElementById('loader');
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationMessage = document.getElementById('notificationMessage');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const languageBtn = document.getElementById('languageBtn');
    const languageMenu = document.getElementById('languageMenu');
    const generateBtnText = document.getElementById('generateBtnText');

    let currentLanguage = 'en';

    const translations = {
        en: {
            title: "Cyber Generator",
            copyTitle: "Copy",
            clearTitle: "Clear",
            inputPlaceholder: "Enter prompt",
            generateBtnText: "Generate image",
            downloadText: "Download",
            successMessage: "Image successfully generated!",
            errorMessage: "Failed to generate image. Please try again.",
            copySuccess: "Text copied to clipboard!",
            copyError: "Failed to copy text",
            nothingToCopy: "Nothing to copy. Enter text in the input field.",
            textCleared: "Text cleared",
            alreadyEmpty: "Input field is already empty"
        },
        // Добавьте переводы для других языков здесь
    };

    function setLanguage(lang) {
        currentLanguage = lang;
        document.documentElement.lang = lang;
        updateTexts();
    }

    function updateTexts() {
        const texts = translations[currentLanguage];
        document.title = texts.title;
        document.querySelector('.glitch').textContent = texts.title;
        document.querySelector('.glitch').setAttribute('data-text', texts.title);
        copyBtn.title = texts.copyTitle;
        clearBtn.title = texts.clearTitle;
        imagePrompt.placeholder = texts.inputPlaceholder;
        generateBtnText.textContent = texts.generateBtnText;
    }

    generateImageBtn.addEventListener('click', generateImage);
    imagePrompt.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateImage();
        }
    });

    copyBtn.addEventListener('click', copyText);
    clearBtn.addEventListener('click', clearText);

    function showNotification(message, type) {
        notification.className = `notification ${type}`;
        notificationMessage.textContent = message;
        notificationIcon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        notification.style.display = 'flex';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    async function generateImage() {
        const query = imagePrompt.value.trim();
        if (!query) {
            imagePrompt.classList.add('shake');
            setTimeout(() => imagePrompt.classList.remove('shake'), 820);
            return;
        }

        loader.style.display = 'block';
        imageContainer.innerHTML = '';
        generateImageBtn.disabled = true;

        const randomApi = apis[Math.floor(Math.random() * apis.length)] + encodeURIComponent(query);

        try {
            const response = await fetch(randomApi);
            const data = await response.json();

            if (data.ok) {
                const imageUrl = data.url;
                const img = new Image();
                img.onload = () => {
                    loader.style.display = 'none';
                    imageContainer.innerHTML = `
                        <img src="${imageUrl}" alt="Generated Image" class="fade-in">
                        <div class="download-overlay">
                            <a href="${imageUrl}" download class="download-btn">
                                <i class="fas fa-download"></i> ${translations[currentLanguage].downloadText}
                            </a>
                        </div>
                    `;
                    generateImageBtn.disabled = false;
                    showNotification(translations[currentLanguage].successMessage, 'success');
                };
                img.src = imageUrl;
            } else {
                throw new Error('Error generating image');
            }
        } catch (error) {
            console.error('Error:', error);
            loader.style.display = 'none';
            generateImageBtn.disabled = false;
            showNotification(translations[currentLanguage].errorMessage, 'error');
        }
    }

    function copyText() {
        const text = imagePrompt.value.trim();
        if (!text) {
            showNotification(translations[currentLanguage].nothingToCopy, 'error');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showNotification(translations[currentLanguage].copySuccess, 'success');
        }).catch(() => {
            showNotification(translations[currentLanguage].copyError, 'error');
        });
    }

    function clearText() {
        if (!imagePrompt.value.trim()) {
            showNotification(translations[currentLanguage].alreadyEmpty, 'error');
            return;
        }

        imagePrompt.value = '';
        showNotification(translations[currentLanguage].textCleared, 'success');
    }

    // Инициализация языка
    function initLanguage() {
        const userLang = navigator.language || navigator.userLanguage;
        const langCode = userLang.split('-')[0];
        if (translations[langCode]) {
            setLanguage(langCode);
        } else {
            setLanguage('en');
        }
    }

    initLanguage();

    // Инициализация системы оценки
    class RatingSystem {
        constructor() {
            this.ratingContainer = document.getElementById('ratingContainer');
            this.likeBtn = document.getElementById('likeBtn');
            this.dislikeBtn = document.getElementById('dislikeBtn');
            this.imagePrompt = document.getElementById('imagePrompt');

            this.initEventListeners();
        }

        initEventListeners() {
            this.likeBtn.addEventListener('click', () => this.rateGeneration('like'));
            this.dislikeBtn.addEventListener('click', () => this.rateGeneration('dislike'));
        }

        rateGeneration(rating) {
            const prompt = this.imagePrompt.value;
            const data = {
                prompt: prompt,
                rating: rating
            };

            fetch('report.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                showNotification(result.message, result.success ? 'success' : 'error');
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred while sending your rating', 'error');
            });

            // Скрываем блок оценки после отправки
            this.hideRatingOptions();
        }

        hideRatingOptions() {
            this.ratingContainer.style.display = 'none';
        }
    }

    // Инициализация системы рейтинга
    window.ratingSystem = new RatingSystem();
});
