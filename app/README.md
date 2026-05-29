# Веб-приложение учебника ЕГЭ Информатика 2026

Статический сайт на [Astro](https://astro.build) с теорией, решениями и трекером прогресса.

## Локальный запуск

```bash
cd app
npm install
npm run dev
```

Сайт откроется на `http://localhost:4321/spbpu-inf-course/`.

## Сборка

```bash
npm run build
npm run preview
```

Перед сборкой скрипт `scripts/build-index.mjs` индексирует папки `Задание_*` в родительской директории и генерирует `src/data/content-index.json`.

## Деплой

GitHub Actions (`.github/workflows/deploy-pages.yml`) публикует `app/dist` на GitHub Pages при push в ветку `2026` или `main`.

URL: https://mueqee.github.io/spbpu-inf-course/

## Структура

| Путь | Назначение |
|:---|:---|
| `data/taxonomy.json` | 6 блоков заданий (как в README) |
| `data/external-courses.json` | «Другие курсы» |
| `scripts/build-index.mjs` | Индексация README и `.py` |
| `src/pages/` | Страницы приложения |
| `public/progress.js` | Трекер в localStorage |

## Добавление контента

1. Добавьте папку `Задание_N_...` с `README.md` и `Решение/*.py` в корень репозитория.
2. При необходимости обновите `data/taxonomy.json`.
3. Запустите `npm run index` или `npm run build`.
