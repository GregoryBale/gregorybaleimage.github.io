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

        // Выбор случайного API для генерации
        const randomApi = apis[Math.floor(Math.random() * apis.length)] + encodeURIComponent(query);

        try {
            const response = await Promise.race([
                fetch(randomApi),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000)) // 10 секунд на ответ
            ]);
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
                };
                img.src = imageUrl;
                showNotification(translations[currentLanguage].successMessage, 'success');
            } else {
                throw new Error(translations[currentLanguage].errorMessage);
            }
        } catch (error) {
            loader.style.display = 'none';
            showNotification(error.message || translations[currentLanguage].errorMessage, 'error');
        } finally {
            generateImageBtn.disabled = false;
        }
    }

    function copyText() {
        const textToCopy = imagePrompt.value.trim();
        if (!textToCopy) {
            showNotification(translations[currentLanguage].nothingToCopy, 'error');
            return;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
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
