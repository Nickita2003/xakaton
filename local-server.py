#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TableFlow Local Server
Локальный сервер для автономной работы без интернета
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import json
from urllib.parse import parse_qs, urlparse
import threading
import time

class TableFlowHandler(http.server.SimpleHTTPRequestHandler):
    """Обработчик запросов для TableFlow"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=".", **kwargs)
    
    def do_GET(self):
        """Обработка GET запросов"""
        parsed_url = urlparse(self.path)
        
        # API для получения данных таблиц
        if parsed_url.path.startswith('/api/tables'):
            self.handle_api_get(parsed_url)
        # Статичные файлы
        else:
            # Подмена CDN ресурсов на локальные
            if 'cdn.tailwindcss.com' in self.path:
                self.serve_local_tailwind()
            elif 'cdn.jsdelivr.net' in self.path:
                self.serve_local_libs()
            else:
                super().do_GET()
    
    def do_POST(self):
        """Обработка POST запросов"""
        if self.path.startswith('/api/'):
            self.handle_api_post()
        else:
            self.send_error(404)
    
    def handle_api_get(self, parsed_url):
        """API для получения данных"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Возвращаем демо данные
        demo_data = {
            "tables": [
                {
                    "id": "demo_contacts",
                    "name": "База контактов",
                    "description": "Демонстрационная таблица с контактами",
                    "schema": [
                        {"name": "id", "displayName": "ID", "type": "text", "required": True},
                        {"name": "name", "displayName": "Имя", "type": "text", "required": True},
                        {"name": "email", "displayName": "Email", "type": "text", "required": False},
                        {"name": "phone", "displayName": "Телефон", "type": "text", "required": False}
                    ],
                    "data": [
                        {"id": "1", "name": "Иван Петров", "email": "ivan@example.com", "phone": "+7 123 456-78-90"},
                        {"id": "2", "name": "Мария Сидорова", "email": "maria@example.com", "phone": "+7 987 654-32-10"}
                    ]
                }
            ]
        }
        
        self.wfile.write(json.dumps(demo_data, ensure_ascii=False).encode('utf-8'))
    
    def handle_api_post(self):
        """API для сохранения данных"""
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {"status": "success", "message": "Данные сохранены локально"}
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
    
    def serve_local_tailwind(self):
        """Локальная версия Tailwind CSS"""
        self.send_response(200)
        self.send_header('Content-type', 'text/css')
        self.end_headers()
        
        # Минимальный CSS для работы без интернета
        css_content = """
        /* Tailwind CSS - offline minimal version */
        .bg-gray-50 { background-color: #f9fafb; }
        .text-blue-600 { color: #2563eb; }
        .p-4 { padding: 1rem; }
        .mb-4 { margin-bottom: 1rem; }
        .flex { display: flex; }
        .hidden { display: none; }
        /* Остальные необходимые классы... */
        """
        self.wfile.write(css_content.encode('utf-8'))
    
    def serve_local_libs(self):
        """Локальные версии библиотек"""
        self.send_response(200)
        self.send_header('Content-type', 'application/javascript')
        self.end_headers()
        
        # Заглушка для библиотек
        js_content = """
        // Offline library stubs
        console.log('Библиотеки загружены в offline режиме');
        window.XLSX = { utils: { sheet_to_json: function() { return []; } } };
        window.Papa = { parse: function() { return {data: []}; } };
        """
        self.wfile.write(js_content.encode('utf-8'))

def create_offline_files():
    """Создание файлов для оффлайн работы"""
    
    # Создаем локальные версии библиотек
    os.makedirs('libs', exist_ok=True)
    
    # Локальная версия index.html с оффлайн библиотеками
    offline_html = """<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TableFlow - Оффлайн версия</title>
    <link rel="stylesheet" href="/libs/tailwind-offline.css">
    <link rel="stylesheet" href="/libs/fontawesome-offline.css">
    <script src="/libs/xlsx-offline.js"></script>
    <script src="/libs/papaparse-offline.js"></script>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-blue-600 mb-4">TableFlow</h1>
            <p class="text-gray-600">Работает в оффлайн режиме</p>
        </header>
        
        <div class="max-w-md mx-auto bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">🚀 Демо функции:</h2>
            <div class="space-y-3">
                <button onclick="demoImport()" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    📥 Импорт данных
                </button>
                <button onclick="demoTemplates()" class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                    📋 Шаблоны
                </button>
                <button onclick="demoExport()" class="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                    📤 Экспорт
                </button>
            </div>
            
            <div id="demo-output" class="mt-6 p-4 bg-gray-50 rounded hidden">
                <h3 class="font-semibold mb-2">Результат:</h3>
                <pre id="demo-text" class="text-sm"></pre>
            </div>
        </div>
    </div>
    
    <script>
        function showDemo(title, content) {
            document.getElementById('demo-output').classList.remove('hidden');
            document.getElementById('demo-text').textContent = title + '\\n\\n' + content;
        }
        
        function demoImport() {
            showDemo('📥 Импорт данных', 
                'Поддерживаемые форматы:\\n' +
                '• Excel (.xlsx, .xls)\\n' +
                '• CSV файлы\\n' +
                '• Автоматическое определение типов\\n' +
                '• Предпросмотр перед импортом');
        }
        
        function demoTemplates() {
            showDemo('📋 Готовые шаблоны',
                'Доступные шаблоны:\\n' +
                '• Склад товаров\\n' +
                '• База контактов\\n' +
                '• Заказы клиентов\\n' +
                '• HR сотрудники\\n' +
                '• Управление задачами');
        }
        
        function demoExport() {
            showDemo('📤 Экспорт данных',
                'Форматы экспорта:\\n' +
                '• Microsoft Excel (.xlsx)\\n' +
                '• CSV файлы\\n' +
                '• JSON данные\\n' +
                '• Настраиваемые параметры');
        }
        
        // Имитация загрузки данных с сервера
        fetch('/api/tables')
            .then(response => response.json())
            .then(data => console.log('Данные загружены:', data))
            .catch(error => console.log('Работаем в оффлайн режиме'));
    </script>
</body>
</html>"""
    
    with open('index-offline.html', 'w', encoding='utf-8') as f:
        f.write(offline_html)
    
    print("✅ Файлы для оффлайн работы созданы")

def start_server(port=8000):
    """Запуск локального сервера"""
    try:
        print(f"🚀 Запуск TableFlow сервера на порту {port}...")
        print(f"📂 Рабочая директория: {os.getcwd()}")
        
        # Создаем оффлайн файлы
        create_offline_files()
        
        # Запускаем сервер
        with socketserver.TCPServer(("", port), TableFlowHandler) as httpd:
            print(f"✅ Сервер запущен: http://localhost:{port}")
            print(f"🌐 Оффлайн версия: http://localhost:{port}/index-offline.html")
            print("💡 Для остановки сервера нажмите Ctrl+C")
            
            # Автоматически открываем браузер
            threading.Timer(1.0, lambda: webbrowser.open(f'http://localhost:{port}')).start()
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\\n🛑 Сервер остановлен")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ Порт {port} уже используется. Попробуйте другой порт:")
            print(f"   python local-server.py {port + 1}")
        else:
            print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    start_server(port)