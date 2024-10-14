document.addEventListener('DOMContentLoaded', function() {
    const apis = [
        'https://paxsenix.serv00.net/v1/pollinations.php?text=',
        'https://paxsenix.serv00.net/v1/magicstudio.php?text=',
        'https://paxsenix.serv00.net/v1/sdxl.php?text=',
        'https://paxsenix.serv00.net/v1/prodia.php?text=',
        'https://paxsenix.serv00.net/v1/jugger.php?text=',
        'https://paxsenix.serv00.net/v1/dalle.php?text='
    ];

    // Загрузка настроек и отображение уведомления о куки
    loadSettings();
    showCookieConsent();

    // Добавление события для кнопки согласия с куки
    document.getElementById('cookieConsentBtn').addEventListener('click', function() {
        setCookie('cookieConsent', 'true', 365);
        hideNotification();
    });

    const elements = {
        generateImageBtn: document.getElementById('generateImageBtn'),
        imagePrompt: document.getElementById('imagePrompt'),
        imageContainer: document.getElementById('imageContainer'),
        loader: document.getElementById('loader'),
        notification: document.getElementById('notification'),
        notificationIcon: document.getElementById('notificationIcon'),
        notificationMessage: document.getElementById('notificationMessage'),
        notificationAction: document.getElementById('notificationAction'),
        copyBtn: document.getElementById('copyBtn'),
        clearBtn: document.getElementById('clearBtn'),
        generateTextBtn: document.getElementById('generateTextBtn'),
        languageBtn: document.getElementById('languageBtn'),
        languageMenu: document.getElementById('languageMenu'),
        generateBtnText: document.getElementById('generateBtnText'),
        ratingContainer: document.getElementById('ratingContainer'),
        likeBtn: document.getElementById('likeBtn'),
        dislikeBtn: document.getElementById('dislikeBtn')
    };

    let currentLanguage = 'en';

    const translations = {
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
            generateBtnText: "Создать изображение",
            downloadText: "Скачать",
            successMessage: "Изображение успешно сгенерировано!",
            errorMessage: "Не удалось сгенерировать изображение. Попробуйте еще раз.",
            copySuccess: "Текст скопирован в буфер обмена!",
            copyError: "Не удалось скопировать текст",
            nothingToCopy: "Нечего копировать. Введите текст в поле ввода.",
            textCleared: "Текст удален",
            alreadyEmpty: "Поле ввода уже пустое",
            notImplemented: "Функция генерации текста будет реализована позже",
            ratingSuccess: "Спасибо за ваш отзыв!",
            ratingError: "Ошибка при отправке оценки. Пожалуйста, попробуйте еще раз.",
            switchingModel: "Ошибка: модель не отвечает, нажмите чтобы переключиться...",
            allModelsFailed: "Все модели не смогли сгенерировать изображение. Пожалуйста, попробуйте позже.",
            cookieConsentMessage: "Этот сайт использует файлы cookie для улучшения вашего опыта. Продолжая использовать этот сайт, вы соглашаетесь с использованием нами файлов cookie.",
            cookieConsentButton: "Я понимаю"
        }    
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
        elements.copyBtn.title = texts.copyTitle;
        elements.clearBtn.title = texts.clearTitle;
        elements.generateTextBtn.title = texts.generateTextTitle;
        elements.imagePrompt.placeholder = texts.inputPlaceholder;
        elements.generateBtnText.textContent = texts.generateBtnText;
    }

    function initLanguage() {
        const userLang = navigator.language || navigator.userLanguage;
        const langCode = userLang.split('-')[0];
        setLanguage(translations[langCode] ? langCode : 'en');
    }

    function showNotification(message, type) {
        elements.notification.className = `notification ${type}`;
        elements.notificationMessage.textContent = message;
        
        if (type === 'success') {
            elements.notificationIcon.className = 'fas fa-check-circle notification-icon';
            elements.notificationAction.className = 'notification-close';
            elements.notificationAction.innerHTML = '<i class="fas fa-times"></i>';
            elements.notificationAction.onclick = hideNotification;
        } else {
            elements.notificationIcon.className = 'fas fa-exclamation-circle notification-icon';
            elements.notificationAction.className = 'notification-retry';
            elements.notificationAction.innerHTML = '<i class="fas fa-redo"></i>';
            elements.notificationAction.onclick = generateImage;
        }
        
        elements.notification.classList.add('show');
        if (type === 'success') {
            setTimeout(hideNotification, 5000);
        }
    }

    function hideNotification() {
        elements.notification.classList.remove('show');
    }

    async function generateImage() {
        const query = elements.imagePrompt.value.trim();
        if (!query) {
            elements.imagePrompt.classList.add('shake');
            setTimeout(() => elements.imagePrompt.classList.remove('shake'), 820);
            return;
        }

        elements.loader.style.display = 'block';
        elements.imageContainer.innerHTML = '';
        elements.generateImageBtn.disabled = true;
        hideNotification();

        let apisCopy = [...apis];
        let success = false;

        while (apisCopy.length > 0 && !success) {
            const randomIndex = Math.floor(Math.random() * apisCopy.length);
            const api = apisCopy[randomIndex];
            
            try {
                const result = await Promise.race([
                    fetch(api + encodeURIComponent(query)),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 15000)
                    )
                ]);

                const data = await result.json();

                if (data.ok) {
                    const imageUrl = data.url;
                    const img = new Image();
                    img.onload = () => {
                        elements.loader.style.display = 'none';
                        elements.imageContainer.innerHTML = `
                            <img src="${imageUrl}" alt="Generated Image" class="fade-in">
                            <div class="download-overlay">
                                <a href="${imageUrl}" download class="download-btn">
                                    <i class="fas fa-download"></i> ${translations[currentLanguage].downloadText}
                                </a>
                            </div>
                        `;
                        elements.generateImageBtn.disabled = false;
                        showNotification(translations[currentLanguage].successMessage, 'success');
                        showRatingOptions();
                    };
                    img.src = imageUrl;
                    success = true;
                } else {
                    throw new Error('API returned error');
                }
            } catch (error) {
                console.error('Error with API:', api, error);
                apisCopy.splice(randomIndex, 1);
                if (apisCopy.length > 0) {
                    showNotification(translations[currentLanguage].switchingModel, 'info');
                }
            }
        }

        if (!success) {
            elements.loader.style.display = 'none';
            elements.generateImageBtn.disabled = false;
            showNotification(translations[currentLanguage].allModelsFailed, 'error');
        }
    }

    function copyText() {
        const text = elements.imagePrompt.value.trim();
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
        if (!elements.imagePrompt.value.trim()) {
            showNotification(translations[currentLanguage].alreadyEmpty, 'error');
            return;
        }

        elements.imagePrompt.value = '';
        showNotification(translations[currentLanguage].textCleared, 'success');
    }

    function generateText() {
        showNotification(translations[currentLanguage].notImplemented, 'error');
    }

    function showRatingOptions() {
        setTimeout(() => {
            elements.ratingContainer.style.display = 'flex';
        }, 2000);
    }

    function hideRatingOptions() {
        elements.ratingContainer.style.display = 'none';
    }

    function rateGeneration(rating) {
        const prompt = elements.imagePrompt.value;
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
            showNotification(result.success ? translations[currentLanguage].ratingSuccess : translations[currentLanguage].ratingError, result.success ? 'success' : 'error');
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification(translations[currentLanguage].ratingError, 'error');
        });

        hideRatingOptions();
    }

    // Event Listeners
    elements.generateImageBtn.addEventListener('click', generateImage);
    elements.imagePrompt.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateImage();
        }
    });
    elements.copyBtn.addEventListener('click', copyText);
    elements.clearBtn.addEventListener('click', clearText);
    elements.generateTextBtn.addEventListener('click', generateText);
    elements.languageBtn.addEventListener('click', () => {
        elements.languageMenu.style.display = elements.languageMenu.style.display === 'block' ? 'none' : 'block';
    });
    elements.languageMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            setLanguage(e.target.getAttribute('data-lang'));
            elements.languageMenu.style.display = 'none';
        }
    });
    elements.likeBtn.addEventListener('click', () => rateGeneration('like'));
    elements.dislikeBtn.addEventListener('click', () => rateGeneration('dislike'));

    // Initialize
    initLanguage();
});

// Cookie handling functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to save settings
function saveSettings() {
    setCookie('language', currentLanguage, 30);
    setCookie('musicEnabled', document.getElementById('musicBtn').classList.contains('active'), 30);
}

// Function to load settings
function loadSettings() {
    const savedLanguage = getCookie('language');
    if (savedLanguage) {
        setLanguage(savedLanguage);
    }

    const musicEnabled = getCookie('musicEnabled');
    if (musicEnabled === 'true') {
        document.getElementById('musicBtn').classList.add('active');
        playBackgroundMusic();
    }
}

// Modify existing functions to save settings
function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    updateTexts();
    saveSettings();
}

// Modify music toggle function
function toggleMusic() {
    const musicBtn = document.getElementById('musicBtn');
    musicBtn.classList.toggle('active');
    if (musicBtn.classList.contains('active')) {
        playBackgroundMusic();
    } else {
        pauseBackgroundMusic();
    }
    saveSettings();
}

// Notification queue
let notificationQueue = [];
let isNotificationShowing = false;

function showNotification(message, type) {
    notificationQueue.push({ message, type });
    if (!isNotificationShowing) {
        displayNextNotification();
    }
}

function displayNextNotification() {
    if (notificationQueue.length === 0) {
        isNotificationShowing = false;
        return;
    }

    isNotificationShowing = true;
    const { message, type } = notificationQueue.shift();

    elements.notification.className = `notification ${type}`;
    elements.notificationMessage.textContent = message;
    
    if (type === 'success') {
        elements.notificationIcon.className = 'fas fa-check-circle notification-icon';
        elements.notificationAction.className = 'notification-close';
        elements.notificationAction.innerHTML = '<i class="fas fa-times"></i>';
        elements.notificationAction.onclick = hideNotification;
    } else {
        elements.notificationIcon.className = 'fas fa-exclamation-circle notification-icon';
        elements.notificationAction.className = 'notification-retry';
        elements.notificationAction.innerHTML = '<i class="fas fa-redo"></i>';
        elements.notificationAction.onclick = generateImage;
    }
    
    elements.notification.classList.add('show');
    if (type === 'success') {
        setTimeout(hideNotification, 5000);
    }
}

function hideNotification() {
    elements.notification.classList.remove('show');
    setTimeout(() => {
        displayNextNotification();
    }, 300);
}

// Cookie consent
function showCookieConsent() {
    if (!getCookie('cookieConsent')) {
        showNotification(translations[currentLanguage].cookieConsentMessage, 'info');
    }
}
