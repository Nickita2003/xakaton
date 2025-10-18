#!/usr/bin/env python3
"""
Скрипт для автоматической упаковки проекта TableFlow
Создает архив со всеми необходимыми файлами для автономного развертывания
"""

import os
import zipfile
import shutil
import json
from datetime import datetime

def create_project_package():
    """Создает полный пакет проекта TableFlow"""
    
    print("🚀 Упаковка проекта TableFlow...")
    
    # Создаем временную папку для проекта
    project_name = "tableflow-complete"
    if os.path.exists(project_name):
        shutil.rmtree(project_name)
    
    os.makedirs(project_name)
    os.makedirs(f"{project_name}/css")
    os.makedirs(f"{project_name}/js")
    os.makedirs(f"{project_name}/docs")
    
    # Список файлов для копирования
    files_to_copy = [
        ("index.html", "index.html"),
        ("css/style.css", "css/style.css"),
        ("js/app.js", "js/app.js"),
        ("js/import.js", "js/import.js"),
        ("js/tables.js", "js/tables.js"),
        ("js/templates.js", "js/templates.js"),
        ("js/export.js", "js/export.js"),
        ("local-server.py", "local-server.py"),
        ("tableflow-standalone.html", "tableflow-standalone.html"),
        ("generate-project.html", "generate-project.html"),
        ("README.md", "docs/README.md"),
        ("DEPLOYMENT_GUIDE.md", "docs/DEPLOYMENT_GUIDE.md"),
        ("INSTALLATION.md", "docs/INSTALLATION.md"),
        ("OFFLINE_SETUP.md", "docs/OFFLINE_SETUP.md"),
        ("DEMO_SCENARIO.md", "docs/DEMO_SCENARIO.md"),
        ("BUSINESS_OVERVIEW.md", "docs/BUSINESS_OVERVIEW.md"),
        ("TECHNICAL_SPEC.md", "docs/TECHNICAL_SPEC.md"),
        ("PORTABLE_GUIDE.md", "docs/PORTABLE_GUIDE.md")
    ]
    
    # Копируем файлы
    for source, destination in files_to_copy:
        dest_path = f"{project_name}/{destination}"
        if os.path.exists(source):
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.copy2(source, dest_path)
            print(f"✅ Скопирован: {source} -> {destination}")
        else:
            print(f"⚠️  Файл не найден: {source}")
    
    # Создаем package.json для удобства
    package_info = {
        "name": "tableflow",
        "version": "1.0.0",
        "description": "Универсальный конструктор таблиц для конвертации Excel в веб-базы данных",
        "main": "index.html",
        "scripts": {
            "start": "python local-server.py",
            "serve": "python -m http.server 8000",
            "standalone": "open tableflow-standalone.html"
        },
        "dependencies": {
            "python": ">=3.6"
        },
        "keywords": ["excel", "csv", "database", "table", "crud", "web-app", "hackathon"],
        "author": "TableFlow Team",
        "license": "MIT",
        "created": datetime.now().isoformat()
    }
    
    with open(f"{project_name}/package.json", "w", encoding="utf-8") as f:
        json.dump(package_info, f, indent=2, ensure_ascii=False)
    
    # Создаем файл запуска для Windows
    bat_content = """@echo off
echo Запуск TableFlow сервера...
python local-server.py
pause"""
    
    with open(f"{project_name}/start.bat", "w", encoding="cp1251") as f:
        f.write(bat_content)
    
    # Создаем файл запуска для Linux/Mac
    sh_content = """#!/bin/bash
echo "Запуск TableFlow сервера..."
python3 local-server.py"""
    
    with open(f"{project_name}/start.sh", "w") as f:
        f.write(sh_content)
    
    # Делаем скрипт исполняемым
    os.chmod(f"{project_name}/start.sh", 0o755)
    
    # Создаем README для быстрого старта
    quick_start = """# TableFlow - Быстрый старт

## 🚀 Варианты запуска

### Вариант 1: Автономный (без интернета)
Просто откройте файл `tableflow-standalone.html` в браузере

### Вариант 2: Локальный сервер
Windows: Запустите `start.bat`
Linux/Mac: Запустите `start.sh` или `python3 local-server.py`

### Вариант 3: Простой веб-сервер
```bash
python -m http.server 8000
```
Затем откройте http://localhost:8000

## 📚 Документация
Полная документация находится в папке `docs/`

## 🎯 Для хакатона
- Используйте `tableflow-standalone.html` для демонстрации
- Или запустите `python3 local-server.py` для полного функционала

Удачи! 🎉"""

    with open(f"{project_name}/QUICKSTART.md", "w", encoding="utf-8") as f:
        f.write(quick_start)
    
    # Создаем архив
    zip_name = f"tableflow-complete-{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
    
    print(f"\n📦 Создание архива {zip_name}...")
    
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(project_name):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, project_name)
                zipf.write(file_path, arc_path)
                print(f"  📄 Добавлен в архив: {arc_path}")
    
    # Удаляем временную папку
    shutil.rmtree(project_name)
    
    file_size = os.path.getsize(zip_name) / 1024 / 1024  # MB
    
    print(f"\n✅ Проект упакован успешно!")
    print(f"📦 Файл: {zip_name}")
    print(f"📏 Размер: {file_size:.2f} МБ")
    print(f"\n🚀 Для запуска:")
    print(f"   1. Распакуйте архив: unzip {zip_name}")
    print(f"   2. Перейдите в папку: cd tableflow-complete")
    print(f"   3. Запустите: python3 local-server.py")
    print(f"   4. Откройте: http://localhost:8080")
    print(f"\n💡 Или просто откройте tableflow-standalone.html в браузере")

if __name__ == "__main__":
    create_project_package()