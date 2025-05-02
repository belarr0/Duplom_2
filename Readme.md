# Чат-бот на FastAPI + Docker

Цей проєкт — чат-бот для підтримки психічного здоров’я, розгорнутий на FastAPI з використанням Docker.

---

## Структура проєкту

```
project/
├── main.py                 # FastAPI сервер
├── templates/
│   └── index.html         # HTML-шаблон з Tailwind
├── static/
│   └── script.js          # JavaScript логіка чату
├── Dockerfile             # Docker-інструкція
├── docker-compose.yml     # Компонування контейнера
└── requirements.txt       # Пакети Python
```

---

## Швидкий старт

### 1. Побудова та запуск контейнера
```bash
docker compose up --build
```

### 2. Відкрий у браузері:
```
http://localhost:8000
```

---

## Функціонал
- Темна/світла тема 
- Аватарки з вибором 
- Збереження історії чату в localStorage 
- FastAPI backend з інтеграцією до моделі Ollama

---

## Команди

### Зупинка контейнера:
```bash
docker compose down
```

### Перезапуск:
```bash
docker compose restart
```

---

## Залежності
Усі залежності в `requirements.txt`:
```
fastapi
uvicorn
jinja2
ollama
```
