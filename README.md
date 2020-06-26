# лэндинг Виктора Вилисова apollonia.today/ubi»

Сам лэндинг хостится через gh-pages на https://the-sociophobic.github.io/Vilisov-BBD/.
На wordpress лежат файлы из /php. Это proxy-сервер, который показывает сайт с gh-pages, а также заменяет og:image для персональных ссылок.
og-image генерируются на локалке Express-сервером из /og-image-generator. Сгенерированные изображения затем помещаются на wordpress в /og-images рядом с .php файлами.
