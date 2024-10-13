document.addEventListener('DOMContentLoaded', function() {
    const apis = [
        'https://paxsenix.serv00.net/v1/pollinations.php?text=',
        'https://paxsenix.serv00.net/v1/magicstudio.php?text='
    ];

    const generateImageBtn = document.getElementById('generateImageBtn');
    const imagePrompt = document.getElementById('imagePrompt');
    const imageContainer = document.getElementById('imageContainer');
    const loader = document.getElementById('loader');
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationAction = document.getElementById('notificationAction');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const generateTextBtn = document.getElementById('generateTextBtn');
    const languageBtn = document.getElementById('languageBtn');
    const languageMenu = document.getElementById('languageMenu');
    const generateBtnText = document.getElementById('generateBtnText');

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
            notImplemented: "Text generation function will be implemented later"
        },
        uk: {
            title: "Кібер Генератор",
            copyTitle: "Копіювати",
            clearTitle: "Очистити",
            generateTextTitle: "Згенерувати текст",
            inputPlaceholder: "Введіть запит",
            generateBtnText: "Створити зображення",
            downloadText: "Завантажити",
            successMessage: "Зображення успішно згенеровано!",
            errorMessage: "Не вдалося згенерувати зображення. Спробуйте ще раз.",
            copySuccess: "Текст скопійовано до буфера обміну!",
            copyError: "Не вдалося скопіювати текст",
            nothingToCopy: "Нічого копіювати. Введіть текст у поле вводу.",
            textCleared: "Текст видалено",
            alreadyEmpty: "Поле вводу вже порожнє",
            notImplemented: "Функція генерації тексту буде реалізована пізніше"
        },
        ru: {
            title: "Кибер Генератор",
            copyTitle: "Копировать",
            clearTitle: "Стереть",
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
            notImplemented: "Функция генерации текста будет реализована позже"
        },
        hy: {
            title: "Կիբեր Գեներատոր",
            copyTitle: "Պատճենել",
            clearTitle: "Ջնջել",
            generateTextTitle: "Գեներացնել տեքստ",
            inputPlaceholder: "Մուտքագրեք հարցում",
            generateBtnText: "Ստեղծել պատկեր",
            downloadText: "Ներբեռնել",
            successMessage: "Պատկերը հաջողությամբ գեներացվեց!",
            errorMessage: "Չհաջողվեց գեներացնել պատկեր: Խնդրում ենք կրկին փորձել:",
            copySuccess: "Տեքստը պատճենվեց սեղմատախտակին!",
            copyError: "Չհաջողվեց պատճենել տեքստը",
            nothingToCopy: "Պատճենելու ոչինչ չկա: Մուտքագրեք տեքստը դաշտում:",
            textCleared: "Տեքստը ջնջվեց",
            alreadyEmpty: "Մուտքագրման դաշտն արդեն դատարկ է",
            notImplemented: "Տեքստի գեներացման գործառույթը կիրականացվի ավելի ուշ"
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
        copyBtn.title = texts.copyTitle;
        clearBtn.title = texts.clearTitle;
        generateTextBtn.title = texts.generateTextTitle;
        imagePrompt.placeholder = texts.inputPlaceholder;
        generateBtnText.textContent = texts.generateBtnText;
    }

    function initLanguage() {
        const userLang = navigator.language || navigator.userLanguage;
        const langCode = userLang.split('-')[0];
        if (translations[langCode]) {
            setLanguage(langCode);
        } else {
            setLanguage('en');
        }
    }

    languageBtn.addEventListener('click', () => {
        languageMenu.style.display = languageMenu.style.display === 'block' ? 'none' : 'block';
    });

    languageMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            setLanguage(e.target.getAttribute('data-lang'));
            languageMenu.style.display = 'none';
        }
    });

    generateImageBtn.addEventListener('click', generateImage);
    imagePrompt.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateImage();
        }
    });

    copyBtn.addEventListener('click', copyText);
    clearBtn.addEventListener('click', clearText);
    generateTextBtn.addEventListener('click', generateText);

    function showNotification(message, type) {
        notification.className = `notification ${type}`;
        notificationMessage.textContent = message;
        
        if (type === 'success') {
            notificationIcon.className = 'fas fa-check-circle notification-icon';
            notificationAction.className = 'notification-close';
            notificationAction.innerHTML = '<i class="fas fa-times"></i>';
            notificationAction.onclick = hideNotification;
        } else {
            notificationIcon.className = 'fas fa-exclamation-circle notification-icon';
            notificationAction.className = 'notification-retry';
            notificationAction.innerHTML = '<i class="fas fa-redo"></i>';
            notificationAction.onclick = generateImage;
        }
        
        notification.classList.add('show');
        if (type === 'success') {
            setTimeout(hideNotification, 5000);
        }
    }

    function hideNotification() {
        notification.classList.remove('show');
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
        hideNotification();

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

                    // Показываем рейтинг после успешной генерации изображения
                    window.ratingSystem.showRatingOptions();
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

    function generateText() {
        showNotification(translations[currentLanguage].notImplemented, 'error');
    }

    initLanguage();
}); 

class RatingSystem {
    constructor() {
        this.ratingContainer = document.getElementById('ratingContainer');
        this.likeBtn = document.getElementById('likeBtn');
        this.dislikeBtn = document.getElementById('dislikeBtn');
        this.imagePrompt = document.getElementById('imagePrompt');
        this.generateImageBtn = document.getElementById('generateImageBtn');

        this.initEventListeners();
    }

    initEventListeners() {
        this.likeBtn.addEventListener('click', () => this.rateGeneration('like'));
        this.dislikeBtn.addEventListener('click', () => this.rateGeneration('dislike'));
        this.generateImageBtn.addEventListener('click', () => this.showRatingOptions());
    }

    showRatingOptions() {
        // Добавляем небольшую задержку, чтобы дать время на генерацию изображения
        setTimeout(() => {
            this.ratingContainer.style.display = 'flex';
        }, 2000);  // Задержка в 1 секунду, можно настроить по необходимости
    }

    hideRatingOptions() {
        this.ratingContainer.style.display = 'none';
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
            this.showNotification(result.message, result.success ? 'success' : 'error');
        })
        .catch(error => {
            console.error('Error:', error);
            this.showNotification('Произошла ошибка при отправке оценки', 'error');
        });

        // Скрываем блок оценки после отправки оценки
        this.hideRatingOptions();
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');
        const notificationIcon = document.getElementById('notificationIcon');

        notificationMessage.textContent = message;
        notificationIcon.className = type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-triangle';
        notification.className = `notification ${type}`;
        notification.style.display = 'flex';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Инициализация системы оценки при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.ratingSystem = new RatingSystem();
});