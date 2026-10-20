# Лаванда — доска объявлений (React + TypeScript)

## Что есть в проекте
- 3 экрана: список объявлений, форма публикации, подробная страница объявления.
- Поиск, фильтр по категориям, сортировка по цене.
- Избранное, карточки объявлений, контакты продавца.
- Нежная пастельная цветовая палитра.
- Vite + React + TypeScript. Babel отдельно не используется.
- GitHub Actions собирает проект и публикует его в GitHub Pages из `main`; ветка `gh-pages` не нужна.

## 1. Открыть проект
1. Распакуй ZIP.
2. Открой папку `pastel-bulletin-board` в VS Code.
3. В терминале VS Code выполни:
   ```bash
   npm install
   npm run dev
   ```
4. Открой адрес, который покажет терминал (обычно `http://localhost:5173`).

## 2. Подключить backend
Важно: в доступном контексте не нашёлся подтверждённый URL и точный endpoint backend именно для доски объявлений. В проекте оставлен стандартный REST endpoint `/ads`, но его нужно сверить с прошлым заданием/API преподавателя. Если он отличается, сайт честно покажет демо-данные, а не будет выдавать их за ответ сервера.

1. Скопируй `.env.example` и назови копию `.env`.
2. В `.env` укажи:
   ```
   VITE_API_BASE_URL=https://АДРЕС-ТВОЕГО-BACKEND
   VITE_ADS_ENDPOINT=/ads
   ```
3. Если API использует другой путь — замени `/ads` на правильный endpoint.
4. Перезапусти `npm run dev`.

Ожидаемый формат GET: массив объявлений или объект с полем `ads`, `content` либо `items`.
Ожидаемые поля: `id`, `title`, `description`, `price`, `category`, `location`, `image`, `author`, `phone`.
Форма отправляет POST на тот же endpoint с JSON-объектом объявления. Если backend преподавателя не поддерживает POST, список и просмотр могут работать, но публикацию нужно согласовать с API.

**Важно для GitHub Pages:** переменные `.env` из локального компьютера не передаются в GitHub Actions автоматически. Чтобы API подключился на опубликованном сайте, добавь адрес backend в `vite.config.ts`/`src/api.ts` или настрой GitHub Actions build variables. Не помещай в frontend секретные ключи.

## 3. Опубликовать на GitHub Pages через GitHub Actions
1. Создай на GitHub новый пустой репозиторий. Например `pastel-bulletin-board`.
2. В VS Code открой терминал в папке проекта и выполни:
   ```bash
   git init
   git add .
   git commit -m "Create React TypeScript bulletin board"
   git branch -M main
   git remote add origin https://github.com/ТВОЙ-ЛОГИН/pastel-bulletin-board.git
   git push -u origin main
   ```
   Если Git уже был настроен, не повторяй `git init`; достаточно добавить файлы, сделать commit и push в `main`.
3. На GitHub открой **Settings → Pages** и выбери **Source: GitHub Actions**.
4. Открой вкладку **Actions** и дождись зелёного статуса у workflow `Build and deploy to GitHub Pages`.
5. Открой ссылку, которую покажет завершённый deployment. Обычно это `https://ТВОЙ-ЛОГИН.github.io/pastel-bulletin-board/`.
6. Проверь не только главную страницу: поиск, фильтр, открытие карточки, форму, мобильный экран. Если backend подключён — проверь также запросы во вкладке Network.

## 4. Важно для сдачи
- Репозиторий должен содержать исходники в `main`.
- Отдельная ветка `gh-pages` не создаётся.
- Деплой делает GitHub Actions из папки `dist`.
- В ответ преподавателю отправляй ссылку на опубликованный сайт GitHub Pages, а не только ссылку на репозиторий.
