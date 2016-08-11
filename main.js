/**
 * Created by Вероника on 11.08.2016.
 */
"use strict";

//После загрузки страницы
window.addEventListener('load', () => {
    // Поле для ввода и контейнер для подсказок
    let inputField = document.querySelector('#enterSomething'),
        container = document.querySelector('#container');

    // Создаем "обещание"
    let Prom = new Promise(function (resolve, reject) {
        // Ajax запрос и url, куда будет отправлен запрос
        let request = new XMLHttpRequest(),
            url = "https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json";

        // Инициируем звпрос с методом GET
        request.open("GET", url);
        // Определяем тип возвращаемых данных
        request.responseType = "json";

        // Если запрос успешен - меняем состояние "обещания" на "выполнено"
        request.addEventListener('load', () => resolve(request.response));
        // Если произошла ошибка - меняем состояние "обещания" на "отклонено"
        request.addEventListener('error', () => reject());

        // Отправляем запрос
        request.send();
    });

    // Вызываем обработчик для "обещания"
    Prom.then(function (response) {
        let names = [];

        for ({name} of response) {
            names.push(name);
        }

        return names.sort();
    }).then(function (names) {
        // С помощью шаблонизатора выводим список городов
        let mainTemplate = document.querySelector('#main-template'),
            source = mainTemplate.innerHTML,
            templateFn = Handlebars.compile(source);

        container.innerHTML = templateFn({ list: names });

        inputField.addEventListener("input", () => {
            // Скрываем города, в которых нет введенного значения
            for (let i = 0; i < names.length; i++) {
                let paragraph = document.querySelector(`.${names[i]}`);
                if (names[i].toLowerCase().indexOf(inputField.value.toLowerCase()) == -1) {
                    paragraph.style.visibility="hidden";
                }
                else paragraph.style.visibility="visible";
            }
        });
    });
});
