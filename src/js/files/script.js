function indents() {
    const header = document.querySelector('.header');
    const page = document.querySelector('.page');

    //Оступ от шапки
    let hHeader = window.getComputedStyle(header, false).height;
    hHeader = Number(hHeader.slice(0, hHeader.length - 2));
    if (page) {
        page.style.paddingTop = hHeader + 'px';
    }
}

window.addEventListener('scroll', () => {
    indents();
});

window.addEventListener('resize', () => {
    indents();
});

indents();

//========================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
    // Находим все блоки ввода телефона
    const phoneBlocks = document.querySelectorAll('.form__select');

    // Инициализируем каждый блок
    phoneBlocks.forEach(block => {
        const selectTrigger = block.querySelector('.country-select-trigger');
        const phoneInput = block.querySelector('.phone-input');
        const dropdown = block.querySelector('.form__body');
        const flagImg = selectTrigger.querySelector('.flag');
        let currentCode = '+49'; // Начальный код страны

        // Установка начального значения
        phoneInput.value = currentCode;

        // Открытие/закрытие выпадающего списка
        selectTrigger.addEventListener('click', function (e) {
            e.stopPropagation();
            // Закрываем все другие открытые списки
            document.querySelectorAll('.form__select').forEach(b => {
                if (b !== block) b.classList.remove('active');
            });
            block.classList.toggle('active');
        });

        // Обработчик выбора страны
        block.querySelectorAll('.country-option').forEach(option => {
            option.addEventListener('click', function () {
                const code = this.getAttribute('data-code');
                const flag = this.querySelector('.flag').src;

                // Сохраняем предыдущий ввод (без старого кода страны)
                const userInput = phoneInput.value.replace(currentCode, '').trim();

                // Обновляем код страны
                currentCode = code;
                flagImg.src = flag;
                phoneInput.value = code + (userInput ? ' ' + userInput : '');

                // Закрываем список
                block.classList.remove('active');
                phoneInput.focus();
            });
        });

        // Защита кода страны от изменений
        phoneInput.addEventListener('keydown', function (e) {
            const cursorPos = this.selectionStart;

            // Разрешаем: backspace, delete, стрелки и т.д.
            if ([8, 46, 37, 38, 39, 40].includes(e.keyCode)) {
                // Запрещаем удаление кода страны
                if ((e.keyCode === 8 || e.keyCode === 46) && cursorPos <= currentCode.length) {
                    e.preventDefault();
                }
                return;
            }

            // Разрешаем ввод только после кода страны
            if (cursorPos < currentCode.length) {
                e.preventDefault();
            }
        });

        // Обработчик ввода - разрешаем только цифры
        phoneInput.addEventListener('input', function () {
            // Получаем введенные пользователем цифры (без кода страны)
            const userInput = this.value.slice(currentCode.length).replace(/\D/g, '');

            // Обновляем значение, сохраняя код страны
            this.value = currentCode + (userInput ? ' ' + userInput : '');
        });

        // Защита от вставки
        phoneInput.addEventListener('paste', function (e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const digitsOnly = pastedText.replace(/\D/g, '');

            // Вставляем только после кода страны
            const startPos = this.selectionStart;
            if (startPos >= currentCode.length) {
                const before = this.value.substring(0, startPos);
                const after = this.value.substring(this.selectionEnd);
                this.value = before + digitsOnly + after;

                // Устанавливаем курсор после вставленного текста
                const newPos = startPos + digitsOnly.length;
                this.setSelectionRange(newPos, newPos);
            }
        });
    });

    // Закрытие всех списков при клике вне их
    document.addEventListener('click', function () {
        document.querySelectorAll('.form__select').forEach(block => {
            block.classList.remove('active');
        });
    });
});

//========================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
    const videoBody = document.querySelector('.video__body');
    const videoElement = videoBody.querySelector('.video__element');
    const playButton = videoBody.querySelector('.video__play');

    // Функция для переключения состояния видео (play/pause)
    function toggleVideo() {
        if (videoElement.paused) {
            videoElement.play();
            playButton.style.display = 'none'; // Скрываем кнопку при воспроизведении
        } else {
            videoElement.pause();
            playButton.style.display = 'block'; // Показываем кнопку при паузе
        }
    }

    // Обработчик клика по кнопке play
    playButton.addEventListener('click', function (e) {
        e.stopPropagation(); // Предотвращаем всплытие события
        toggleVideo();
    });

    // Обработчик клика по всему видео (опционально)
    videoBody.addEventListener('click', function () {
        toggleVideo();
    });

    // Показываем кнопку play при остановке видео
    videoElement.addEventListener('pause', function () {
        playButton.style.display = 'block';
    });
});

//========================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
    // Находим все радиокнопки
    const radioButtons = document.querySelectorAll('.options__input');

    // Находим все колонки с ценами
    const pricingColumns = document.querySelectorAll('.pricing__column');

    // Добавляем обработчик событий для каждой радиокнопки
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            // Удаляем класс _active у всех колонок
            pricingColumns.forEach(column => {
                column.classList.remove('_active');
            });

            // Если радиокнопка выбрана, находим соответствующую колонку и добавляем класс _active
            if (this.checked) {
                const targetCategory = this.getAttribute('data-filter');
                const targetColumn = document.querySelector(`.pricing__column[data-categore="${targetCategory}"]`);
                if (targetColumn) {
                    targetColumn.classList.add('_active');
                }
            }
        });
    });
});

//========================================================================================================================================================

document.querySelector('.footer__arrow').addEventListener('click', function (e) {
    e.preventDefault(); 
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});