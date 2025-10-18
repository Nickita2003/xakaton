// TableFlow - Import Manager
class ImportManager {
    constructor() {
        this.importData = null;
        this.importHeaders = [];
        this.importPreview = [];
        this.mappedSchema = [];
        this.currentStep = 'upload';
    }

    showImportModal() {
        const modal = document.createElement('div');
        modal.id = 'import-modal';
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold text-gray-900">Импорт данных</h3>
                    <button onclick="document.getElementById('import-modal').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <!-- Progress Steps -->
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center space-x-4">
                        <div class="step-item active" data-step="upload">
                            <div class="step-number">1</div>
                            <span>Загрузка файла</span>
                        </div>
                        <div class="step-connector"></div>
                        <div class="step-item" data-step="preview">
                            <div class="step-number">2</div>
                            <span>Предпросмотр</span>
                        </div>
                        <div class="step-connector"></div>
                        <div class="step-item" data-step="mapping">
                            <div class="step-number">3</div>
                            <span>Настройка схемы</span>
                        </div>
                        <div class="step-connector"></div>
                        <div class="step-item" data-step="finish">
                            <div class="step-number">4</div>
                            <span>Завершение</span>
                        </div>
                    </div>
                </div>

                <!-- Step Content -->
                <div id="import-step-content">
                    ${this.renderUploadStep()}
                </div>

                <!-- Navigation Buttons -->
                <div class="flex justify-between mt-6 pt-4 border-t">
                    <button id="prev-step-btn" onclick="window.importManager.previousStep()" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 hidden">
                        <i class="fas fa-arrow-left mr-2"></i>Назад
                    </button>
                    <div class="flex space-x-3">
                        <button onclick="document.getElementById('import-modal').remove()" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Отмена
                        </button>
                        <button id="next-step-btn" onclick="window.importManager.nextStep()" 
                                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 hidden">
                            Далее<i class="fas fa-arrow-right ml-2"></i>
                        </button>
                        <button id="finish-import-btn" onclick="window.importManager.finishImport()" 
                                class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 hidden">
                            <i class="fas fa-check mr-2"></i>Создать таблицу
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add CSS for steps
        const style = document.createElement('style');
        style.textContent = `
            .step-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            .step-number {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #e5e7eb;
                color: #6b7280;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .step-item.active .step-number {
                background: #3b82f6;
                color: white;
            }
            .step-item.completed .step-number {
                background: #10b981;
                color: white;
            }
            .step-connector {
                width: 60px;
                height: 2px;
                background: #e5e7eb;
                margin: 16px 0 24px 0;
            }
            .step-connector.completed {
                background: #10b981;
            }
            .file-drop-zone {
                border: 2px dashed #d1d5db;
                border-radius: 8px;
                padding: 3rem;
                text-align: center;
                background: #f9fafb;
                transition: all 0.2s;
            }
            .file-drop-zone.dragover {
                border-color: #3b82f6;
                background: #eff6ff;
            }
            .preview-table-container {
                max-height: 400px;
                overflow: auto;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);
        this.setupFileUpload();
    }

    renderUploadStep() {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <h4 class="text-lg font-medium text-gray-900 mb-2">Выберите файл для импорта</h4>
                    <p class="text-gray-600">Поддерживаются файлы Excel (.xlsx, .xls) и CSV</p>
                </div>

                <div class="file-drop-zone" id="file-drop-zone">
                    <div class="space-y-4">
                        <div class="text-4xl text-gray-400">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div>
                            <p class="text-lg font-medium text-gray-700">Перетащите файл сюда или</p>
                            <button onclick="document.getElementById('file-input').click()" 
                                    class="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <i class="fas fa-folder-open mr-2"></i>Выберите файл
                            </button>
                            <input type="file" id="file-input" class="hidden" accept=".xlsx,.xls,.csv">
                        </div>
                        <div class="text-sm text-gray-500">
                            Максимальный размер: 10 МБ
                        </div>
                    </div>
                </div>

                <div id="file-info" class="hidden bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-file-excel text-blue-600 text-2xl"></i>
                        </div>
                        <div class="ml-4 flex-1">
                            <h4 class="text-sm font-medium text-blue-900" id="file-name"></h4>
                            <p class="text-sm text-blue-600" id="file-details"></p>
                        </div>
                        <div class="flex-shrink-0">
                            <button onclick="window.importManager.removeFile()" 
                                    class="text-blue-600 hover:text-blue-800">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div id="file-processing" class="hidden text-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p class="text-gray-600">Обработка файла...</p>
                </div>
            </div>
        `;
    }

    renderPreviewStep() {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <h4 class="text-lg font-medium text-gray-900 mb-2">Предпросмотр данных</h4>
                    <p class="text-gray-600">Проверьте, что данные загружены корректно</p>
                </div>

                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div class="text-2xl font-bold text-blue-600">${this.importData ? this.importData.length : 0}</div>
                            <div class="text-sm text-gray-600">Строк данных</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-green-600">${this.importHeaders.length}</div>
                            <div class="text-sm text-gray-600">Колонок</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-purple-600">${this.getDataQuality()}%</div>
                            <div class="text-sm text-gray-600">Качество данных</div>
                        </div>
                    </div>
                </div>

                <div class="preview-table-container">
                    <table class="min-w-full preview-table">
                        <thead class="bg-gray-50 sticky top-0">
                            <tr>
                                ${this.importHeaders.map(header => `
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ${header}
                                    </th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody class="bg-white">
                            ${this.importPreview.map(row => `
                                <tr class="border-t">
                                    ${this.importHeaders.map(header => `
                                        <td class="px-3 py-2 text-sm text-gray-900">
                                            ${this.formatPreviewValue(row[header])}
                                        </td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                ${this.importData && this.importData.length > 10 ? `
                    <div class="text-center text-sm text-gray-500">
                        Показаны первые 10 строк из ${this.importData.length}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderMappingStep() {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <h4 class="text-lg font-medium text-gray-900 mb-2">Настройка схемы таблицы</h4>
                    <p class="text-gray-600">Настройте типы данных и свойства колонок</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Table Settings -->
                    <div class="space-y-4">
                        <h5 class="font-medium text-gray-900">Настройки таблицы</h5>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Название таблицы</label>
                            <input type="text" id="table-name" value="Импортированная таблица" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                            <textarea id="table-description" rows="3" 
                                      placeholder="Описание таблицы (необязательно)"
                                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>

                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" id="first-row-headers" checked 
                                       onchange="window.importManager.toggleFirstRowHeaders()"
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-700">Первая строка содержит заголовки</span>
                            </label>
                        </div>
                    </div>

                    <!-- Data Quality Issues -->
                    <div class="space-y-4">
                        <h5 class="font-medium text-gray-900">Проблемы качества данных</h5>
                        <div id="data-issues" class="space-y-2">
                            ${this.getDataIssues().map(issue => `
                                <div class="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                    <i class="fas fa-exclamation-triangle text-yellow-500 mt-0.5"></i>
                                    <div class="text-sm">
                                        <div class="font-medium text-yellow-800">${issue.type}</div>
                                        <div class="text-yellow-700">${issue.description}</div>
                                        ${issue.suggestion ? `<div class="text-yellow-600 mt-1"><strong>Рекомендация:</strong> ${issue.suggestion}</div>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Column Mapping -->
                <div class="space-y-4">
                    <h5 class="font-medium text-gray-900">Настройка колонок</h5>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Колонка</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип данных</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Обязательное</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пример значений</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${this.importHeaders.map((header, index) => `
                                    <tr>
                                        <td class="px-4 py-3">
                                            <input type="text" value="${header}" 
                                                   onchange="window.importManager.updateColumnName(${index}, this.value)"
                                                   class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                                        </td>
                                        <td class="px-4 py-3">
                                            <select onchange="window.importManager.updateColumnType(${index}, this.value)"
                                                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                                                ${this.getTypeOptions(this.detectColumnType(header)).map(option => `
                                                    <option value="${option.value}" ${option.selected ? 'selected' : ''}>${option.label}</option>
                                                `).join('')}
                                            </select>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <input type="checkbox" 
                                                   onchange="window.importManager.updateColumnRequired(${index}, this.checked)"
                                                   class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="text-sm text-gray-600">
                                                ${this.getColumnExamples(header).join(', ')}
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    renderFinishStep() {
        return `
            <div class="space-y-6">
                <div class="text-center">
                    <div class="text-6xl text-green-500 mb-4">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h4 class="text-lg font-medium text-gray-900 mb-2">Готово к импорту!</h4>
                    <p class="text-gray-600">Проверьте настройки и создайте таблицу</p>
                </div>

                <div class="bg-gray-50 rounded-lg p-6">
                    <h5 class="font-medium text-gray-900 mb-4">Сводка импорта</h5>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Название таблицы:</label>
                            <p class="text-sm text-gray-900" id="final-table-name">-</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Количество записей:</label>
                            <p class="text-sm text-gray-900">${this.importData ? this.importData.length : 0}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Количество колонок:</label>
                            <p class="text-sm text-gray-900">${this.mappedSchema.length}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Тип файла:</label>
                            <p class="text-sm text-gray-900">${this.getCurrentFileType()}</p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Схема колонок:</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            ${this.mappedSchema.map(field => `
                                <div class="flex items-center justify-between p-2 bg-white rounded border">
                                    <span class="text-sm font-medium">${field.displayName || field.name}</span>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">${field.type}</span>
                                        ${field.required ? '<i class="fas fa-asterisk text-red-500 text-xs"></i>' : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <i class="fas fa-info-circle text-blue-500"></i>
                        </div>
                        <div class="ml-3">
                            <h5 class="text-sm font-medium text-blue-800">Что произойдет при создании таблицы:</h5>
                            <ul class="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                                <li>Будет создана новая таблица с настроенной схемой</li>
                                <li>Все данные из файла будут импортированы</li>
                                <li>Вы сможете редактировать, добавлять и удалять записи</li>
                                <li>Таблица будет доступна в разделе "Мои таблицы"</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupFileUpload() {
        const fileInput = document.getElementById('file-input');
        const dropZone = document.getElementById('file-drop-zone');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFile(e.target.files[0]));
        }

        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });

            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file) this.handleFile(file);
            });
        }
    }

    handleFile(file) {
        if (!file) return;

        // Validate file type
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];

        if (!validTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(xlsx|xls|csv)$/)) {
            window.app?.showToast('Неподдерживаемый формат файла. Используйте Excel (.xlsx, .xls) или CSV файлы.', 'error');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            window.app?.showToast('Файл слишком большой. Максимальный размер: 10 МБ.', 'error');
            return;
        }

        this.showFileInfo(file);
        this.processFile(file);
    }

    showFileInfo(file) {
        const fileInfo = document.getElementById('file-info');
        const fileName = document.getElementById('file-name');
        const fileDetails = document.getElementById('file-details');
        const dropZone = document.getElementById('file-drop-zone');

        if (fileInfo && fileName && fileDetails && dropZone) {
            fileName.textContent = file.name;
            fileDetails.textContent = `${this.formatFileSize(file.size)} • ${file.type.includes('csv') ? 'CSV' : 'Excel'}`;
            
            dropZone.classList.add('hidden');
            fileInfo.classList.remove('hidden');
        }
    }

    processFile(file) {
        const processing = document.getElementById('file-processing');
        if (processing) {
            processing.classList.remove('hidden');
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                if (file.name.toLowerCase().endsWith('.csv')) {
                    this.parseCSV(e.target.result);
                } else {
                    this.parseExcel(e.target.result);
                }

                if (processing) {
                    processing.classList.add('hidden');
                }

                // Enable next button
                const nextBtn = document.getElementById('next-step-btn');
                if (nextBtn) {
                    nextBtn.classList.remove('hidden');
                }

                window.app?.showToast('Файл успешно загружен и обработан!');

            } catch (error) {
                console.error('Error processing file:', error);
                window.app?.showToast('Ошибка при обработке файла. Проверьте формат данных.', 'error');
                
                if (processing) {
                    processing.classList.add('hidden');
                }
            }
        };

        if (file.name.toLowerCase().endsWith('.csv')) {
            reader.readAsText(file, 'UTF-8');
        } else {
            reader.readAsArrayBuffer(file);
        }
    }

    parseCSV(csvText) {
        const parsed = Papa.parse(csvText, {
            header: false,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),
            transform: (value) => value.trim()
        });

        if (parsed.errors.length > 0) {
            console.warn('CSV parsing errors:', parsed.errors);
        }

        const data = parsed.data;
        if (data.length === 0) {
            throw new Error('CSV файл пуст');
        }

        this.importHeaders = data[0];
        this.importData = data.slice(1).map(row => {
            const obj = {};
            this.importHeaders.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return obj;
        });

        this.importPreview = this.importData.slice(0, 10);
        this.initializeMappedSchema();
    }

    parseExcel(arrayBuffer) {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
            header: 1,
            defval: '',
            blankrows: false
        });

        if (jsonData.length === 0) {
            throw new Error('Excel файл пуст');
        }

        this.importHeaders = jsonData[0].map(header => String(header).trim());
        this.importData = jsonData.slice(1).map(row => {
            const obj = {};
            this.importHeaders.forEach((header, index) => {
                obj[header] = row[index] !== undefined ? String(row[index]).trim() : '';
            });
            return obj;
        });

        this.importPreview = this.importData.slice(0, 10);
        this.initializeMappedSchema();
    }

    initializeMappedSchema() {
        this.mappedSchema = this.importHeaders.map(header => ({
            name: this.sanitizeColumnName(header),
            displayName: header,
            type: this.detectColumnType(header),
            required: false
        }));

        // Add ID field at the beginning
        this.mappedSchema.unshift({
            name: 'id',
            displayName: 'ID',
            type: 'text',
            required: true,
            system: true
        });
    }

    sanitizeColumnName(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    }

    detectColumnType(header) {
        if (!this.importData || this.importData.length === 0) return 'text';

        const values = this.importData
            .map(row => row[header])
            .filter(val => val !== null && val !== undefined && val !== '');

        if (values.length === 0) return 'text';

        // Check for boolean values
        const boolPatterns = /^(да|нет|true|false|1|0|yes|no)$/i;
        const boolCount = values.filter(val => boolPatterns.test(String(val))).length;
        if (boolCount / values.length > 0.7) return 'bool';

        // Check for numbers
        const numberCount = values.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).length;
        if (numberCount / values.length > 0.7) return 'number';

        // Check for dates
        const dateCount = values.filter(val => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && val.match(/[\d\-\/\.]/);
        }).length;
        if (dateCount / values.length > 0.7) return 'date';

        // Check for long text
        const longTextCount = values.filter(val => String(val).length > 100).length;
        if (longTextCount / values.length > 0.3) return 'rich_text';

        return 'text';
    }

    getTypeOptions(selectedType) {
        const types = [
            { value: 'text', label: 'Текст' },
            { value: 'number', label: 'Число' },
            { value: 'bool', label: 'Да/Нет' },
            { value: 'date', label: 'Дата' },
            { value: 'datetime', label: 'Дата и время' },
            { value: 'rich_text', label: 'Длинный текст' }
        ];

        return types.map(type => ({
            ...type,
            selected: type.value === selectedType
        }));
    }

    getColumnExamples(header) {
        if (!this.importData) return [];
        
        return this.importData
            .map(row => row[header])
            .filter(val => val !== null && val !== undefined && val !== '')
            .slice(0, 3)
            .map(val => String(val).substring(0, 30));
    }

    getDataQuality() {
        if (!this.importData || this.importData.length === 0) return 0;

        const totalCells = this.importData.length * this.importHeaders.length;
        const filledCells = this.importData.reduce((sum, row) => {
            return sum + this.importHeaders.filter(header => {
                const value = row[header];
                return value !== null && value !== undefined && value !== '';
            }).length;
        }, 0);

        return Math.round((filledCells / totalCells) * 100);
    }

    getDataIssues() {
        const issues = [];
        
        if (!this.importData || this.importData.length === 0) return issues;

        // Check for empty columns
        this.importHeaders.forEach(header => {
            const emptyCount = this.importData.filter(row => {
                const value = row[header];
                return value === null || value === undefined || value === '';
            }).length;

            if (emptyCount / this.importData.length > 0.5) {
                issues.push({
                    type: 'Много пустых значений',
                    description: `Колонка "${header}" содержит ${Math.round(emptyCount / this.importData.length * 100)}% пустых значений`,
                    suggestion: 'Рассмотрите возможность удаления этой колонки или заполнения значений по умолчанию'
                });
            }
        });

        // Check for duplicate headers
        const duplicates = this.importHeaders.filter((header, index, arr) => 
            arr.indexOf(header) !== index
        );
        
        if (duplicates.length > 0) {
            issues.push({
                type: 'Дублированные заголовки',
                description: `Найдены дублированные заголовки: ${[...new Set(duplicates)].join(', ')}`,
                suggestion: 'Переименуйте дублированные заголовки для избежания конфликтов'
            });
        }

        // Check for very long text values
        const longTextColumns = this.importHeaders.filter(header => {
            return this.importData.some(row => {
                const value = row[header];
                return value && String(value).length > 255;
            });
        });

        if (longTextColumns.length > 0) {
            issues.push({
                type: 'Очень длинные значения',
                description: `Колонки содержат очень длинный текст: ${longTextColumns.join(', ')}`,
                suggestion: 'Используйте тип "Длинный текст" для этих колонок'
            });
        }

        return issues;
    }

    formatPreviewValue(value) {
        if (value === null || value === undefined || value === '') {
            return '<span class="text-gray-400 italic">—</span>';
        }
        
        const str = String(value);
        return str.length > 30 ? str.substring(0, 30) + '...' : str;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Б';
        const k = 1024;
        const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    getCurrentFileType() {
        // This is a placeholder - in real implementation, store the file type
        return 'Excel/CSV';
    }

    removeFile() {
        this.importData = null;
        this.importHeaders = [];
        this.importPreview = [];
        this.mappedSchema = [];

        const fileInfo = document.getElementById('file-info');
        const dropZone = document.getElementById('file-drop-zone');
        const nextBtn = document.getElementById('next-step-btn');

        if (fileInfo) fileInfo.classList.add('hidden');
        if (dropZone) dropZone.classList.remove('hidden');
        if (nextBtn) nextBtn.classList.add('hidden');

        // Clear file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
    }

    toggleFirstRowHeaders() {
        // This would re-parse the data with/without first row as headers
        // For now, just show a message
        window.app?.showToast('Функция будет реализована в следующей версии', 'info');
    }

    updateColumnName(index, newName) {
        if (this.mappedSchema[index]) {
            this.mappedSchema[index].displayName = newName;
            this.mappedSchema[index].name = this.sanitizeColumnName(newName);
        }
    }

    updateColumnType(index, newType) {
        if (this.mappedSchema[index]) {
            this.mappedSchema[index].type = newType;
        }
    }

    updateColumnRequired(index, required) {
        if (this.mappedSchema[index]) {
            this.mappedSchema[index].required = required;
        }
    }

    nextStep() {
        const steps = ['upload', 'preview', 'mapping', 'finish'];
        const currentIndex = steps.indexOf(this.currentStep);
        
        if (currentIndex < steps.length - 1) {
            this.currentStep = steps[currentIndex + 1];
            this.updateStepDisplay();
        }
    }

    previousStep() {
        const steps = ['upload', 'preview', 'mapping', 'finish'];
        const currentIndex = steps.indexOf(this.currentStep);
        
        if (currentIndex > 0) {
            this.currentStep = steps[currentIndex - 1];
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        // Update step indicators
        document.querySelectorAll('.step-item').forEach((item, index) => {
            const stepName = ['upload', 'preview', 'mapping', 'finish'][index];
            const currentIndex = ['upload', 'preview', 'mapping', 'finish'].indexOf(this.currentStep);
            
            item.classList.remove('active', 'completed');
            if (index < currentIndex) {
                item.classList.add('completed');
            } else if (index === currentIndex) {
                item.classList.add('active');
            }
        });

        // Update step connectors
        document.querySelectorAll('.step-connector').forEach((connector, index) => {
            const currentIndex = ['upload', 'preview', 'mapping', 'finish'].indexOf(this.currentStep);
            connector.classList.toggle('completed', index < currentIndex);
        });

        // Update content
        const content = document.getElementById('import-step-content');
        if (content) {
            switch (this.currentStep) {
                case 'upload':
                    content.innerHTML = this.renderUploadStep();
                    this.setupFileUpload();
                    break;
                case 'preview':
                    content.innerHTML = this.renderPreviewStep();
                    break;
                case 'mapping':
                    content.innerHTML = this.renderMappingStep();
                    break;
                case 'finish':
                    content.innerHTML = this.renderFinishStep();
                    // Update final table name display
                    const tableName = document.getElementById('table-name')?.value || 'Импортированная таблица';
                    const finalName = document.getElementById('final-table-name');
                    if (finalName) finalName.textContent = tableName;
                    break;
            }
        }

        // Update navigation buttons
        const prevBtn = document.getElementById('prev-step-btn');
        const nextBtn = document.getElementById('next-step-btn');
        const finishBtn = document.getElementById('finish-import-btn');

        if (prevBtn) {
            prevBtn.classList.toggle('hidden', this.currentStep === 'upload');
        }

        if (nextBtn) {
            nextBtn.classList.toggle('hidden', this.currentStep === 'finish');
        }

        if (finishBtn) {
            finishBtn.classList.toggle('hidden', this.currentStep !== 'finish');
        }
    }

    finishImport() {
        if (!this.importData || !this.mappedSchema) {
            window.app?.showToast('Нет данных для импорта', 'error');
            return;
        }

        const tableName = document.getElementById('table-name')?.value || 'Импортированная таблица';
        const tableDescription = document.getElementById('table-description')?.value || '';

        // Create new table
        const table = {
            id: Date.now().toString(),
            name: tableName,
            description: tableDescription,
            schema: this.mappedSchema,
            data: this.importData.map((row, index) => {
                const newRow = { id: `row_${Date.now()}_${index}` };
                
                this.mappedSchema.forEach(field => {
                    if (field.system) return;
                    
                    let value = row[field.displayName] || row[field.name] || null;
                    
                    // Convert value based on type
                    if (value !== null && value !== '') {
                        switch (field.type) {
                            case 'number':
                                value = parseFloat(value) || null;
                                break;
                            case 'bool':
                                value = /^(да|true|1|yes)$/i.test(String(value));
                                break;
                            case 'date':
                            case 'datetime':
                                const date = new Date(value);
                                value = !isNaN(date.getTime()) ? date.toISOString() : null;
                                break;
                            default:
                                value = String(value);
                        }
                    }
                    
                    newRow[field.name] = value;
                });

                return newRow;
            }),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            permission: 'owner'
        };

        // Save table
        if (!window.app) return;
        
        window.app.tables.push(table);
        window.app.saveData();
        window.app.addToHistory('import', `Импортирована таблица "${tableName}" с ${this.importData.length} записями`);
        
        // Close modal and show success
        document.getElementById('import-modal')?.remove();
        window.app.showToast(`Таблица "${tableName}" успешно создана с ${this.importData.length} записями!`);
        
        // Navigate to tables section
        window.app.showSection('tables');
        
        // Reset import data
        this.importData = null;
        this.importHeaders = [];
        this.importPreview = [];
        this.mappedSchema = [];
        this.currentStep = 'upload';
    }
}

// Initialize import manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.importManager = new ImportManager();
});