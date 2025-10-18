// TableFlow - Export Manager
class ExportManager {
    constructor() {
        this.supportedFormats = [
            { id: 'xlsx', name: 'Excel (.xlsx)', icon: 'fas fa-file-excel', color: 'text-green-600' },
            { id: 'csv', name: 'CSV (.csv)', icon: 'fas fa-file-csv', color: 'text-blue-600' },
            { id: 'json', name: 'JSON (.json)', icon: 'fas fa-file-code', color: 'text-purple-600' }
        ];
    }

    exportTable(table, format = 'xlsx') {
        if (!table || !table.data) {
            window.app?.showToast('Нет данных для экспорта', 'error');
            return;
        }

        try {
            switch (format) {
                case 'xlsx':
                    this.exportToExcel(table);
                    break;
                case 'csv':
                    this.exportToCSV(table);
                    break;
                case 'json':
                    this.exportToJSON(table);
                    break;
                default:
                    this.showExportModal(table);
            }
        } catch (error) {
            console.error('Export error:', error);
            window.app?.showToast('Ошибка при экспорте данных', 'error');
        }
    }

    showExportModal(table) {
        if (!table) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 bg-green-100 text-green-600 rounded">
                            <i class="fas fa-download"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Экспорт таблицы</h3>
                            <p class="text-sm text-gray-600">${table.name}</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="space-y-6">
                    <!-- Export Info -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div class="text-xl font-bold text-blue-600">${table.data.length}</div>
                                <div class="text-sm text-gray-600">Записей</div>
                            </div>
                            <div>
                                <div class="text-xl font-bold text-green-600">${table.schema.filter(f => !f.system).length}</div>
                                <div class="text-sm text-gray-600">Колонок</div>
                            </div>
                            <div>
                                <div class="text-xl font-bold text-purple-600">${this.calculateFileSize(table)}</div>
                                <div class="text-sm text-gray-600">Примерный размер</div>
                            </div>
                        </div>
                    </div>

                    <!-- Format Selection -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Выберите формат экспорта:</h4>
                        <div class="space-y-3">
                            ${this.supportedFormats.map(format => `
                                <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio" name="export-format" value="${format.id}" 
                                           ${format.id === 'xlsx' ? 'checked' : ''}
                                           class="text-blue-600 focus:ring-blue-500 border-gray-300">
                                    <div class="ml-3 flex items-center space-x-3 flex-1">
                                        <i class="${format.icon} ${format.color} text-xl"></i>
                                        <div>
                                            <div class="font-medium text-gray-900">${format.name}</div>
                                            <div class="text-sm text-gray-500">${this.getFormatDescription(format.id)}</div>
                                        </div>
                                    </div>
                                    <div class="text-sm text-gray-400">
                                        ${this.getFormatSize(table, format.id)}
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Export Options -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Опции экспорта:</h4>
                        <div class="space-y-3">
                            <label class="flex items-center">
                                <input type="checkbox" id="include-headers" checked 
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-700">Включить заголовки колонок</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="include-metadata" 
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-700">Включить метаданные таблицы</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="format-dates" checked 
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-700">Форматировать даты для локали</span>
                            </label>
                        </div>
                    </div>

                    <!-- Column Selection -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Выберите колонки для экспорта:</h4>
                        <div class="max-h-48 overflow-y-auto border rounded-lg">
                            <div class="p-3 border-b">
                                <label class="flex items-center">
                                    <input type="checkbox" id="select-all-columns" checked 
                                           onchange="window.exportManager.toggleAllColumns(this.checked)"
                                           class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="ml-2 text-sm font-medium text-gray-700">Выбрать все</span>
                                </label>
                            </div>
                            <div class="p-3 space-y-2">
                                ${table.schema.filter(f => !f.system).map(field => `
                                    <label class="flex items-center">
                                        <input type="checkbox" name="export-columns" value="${field.name}" checked 
                                               onchange="window.exportManager.updateColumnSelection()"
                                               class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                        <span class="ml-2 text-sm text-gray-700">${field.displayName || field.name}</span>
                                        <span class="ml-auto text-xs text-gray-400">${field.type}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center pt-6 border-t">
                    <div class="text-sm text-gray-500">
                        <i class="fas fa-info-circle mr-1"></i>
                        Файл будет загружен автоматически
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Отмена
                        </button>
                        <button onclick="window.exportManager.processExport('${table.id}'); this.closest('.fixed').remove();" 
                                class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                            <i class="fas fa-download mr-2"></i>Экспортировать
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    getFormatDescription(format) {
        const descriptions = {
            xlsx: 'Совместим с Microsoft Excel, сохраняет форматирование',
            csv: 'Универсальный текстовый формат, поддерживается всеми программами',
            json: 'Структурированные данные для программистов и API'
        };
        return descriptions[format] || '';
    }

    getFormatSize(table, format) {
        const baseSize = table.data.length * table.schema.length * 10; // Примерная оценка
        const multipliers = { xlsx: 1.5, csv: 0.8, json: 1.2 };
        const size = baseSize * (multipliers[format] || 1);
        return this.formatFileSize(size);
    }

    calculateFileSize(table) {
        const estimatedSize = table.data.length * table.schema.length * 15; // Примерная оценка
        return this.formatFileSize(estimatedSize);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Б';
        const k = 1024;
        const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    toggleAllColumns(checked) {
        document.querySelectorAll('input[name="export-columns"]').forEach(checkbox => {
            checkbox.checked = checked;
        });
    }

    updateColumnSelection() {
        const checkboxes = document.querySelectorAll('input[name="export-columns"]');
        const selectAll = document.getElementById('select-all-columns');
        
        if (selectAll) {
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            selectAll.checked = checkedCount === checkboxes.length;
            selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        }
    }

    processExport(tableId) {
        const table = window.app?.tables.find(t => t.id === tableId);
        if (!table) return;

        // Get selected format
        const format = document.querySelector('input[name="export-format"]:checked')?.value || 'xlsx';
        
        // Get selected columns
        const selectedColumns = Array.from(document.querySelectorAll('input[name="export-columns"]:checked'))
            .map(cb => cb.value);

        if (selectedColumns.length === 0) {
            window.app?.showToast('Выберите хотя бы одну колонку для экспорта', 'error');
            return;
        }

        // Get options
        const options = {
            includeHeaders: document.getElementById('include-headers')?.checked || false,
            includeMetadata: document.getElementById('include-metadata')?.checked || false,
            formatDates: document.getElementById('format-dates')?.checked || false,
            columns: selectedColumns
        };

        // Perform export
        this.exportTableWithOptions(table, format, options);
    }

    exportTableWithOptions(table, format, options) {
        try {
            // Filter data to selected columns
            const filteredSchema = table.schema.filter(field => 
                field.system || options.columns.includes(field.name)
            );
            
            const filteredData = table.data.map(row => {
                const filteredRow = {};
                filteredSchema.forEach(field => {
                    let value = row[field.name];
                    
                    // Format dates if requested
                    if (options.formatDates && (field.type === 'date' || field.type === 'datetime')) {
                        if (value) {
                            const date = new Date(value);
                            if (!isNaN(date.getTime())) {
                                value = field.type === 'date' 
                                    ? date.toLocaleDateString('ru-RU')
                                    : date.toLocaleString('ru-RU');
                            }
                        }
                    }
                    
                    filteredRow[field.name] = value;
                });
                return filteredRow;
            });

            const exportTable = {
                ...table,
                schema: filteredSchema,
                data: filteredData
            };

            switch (format) {
                case 'xlsx':
                    this.exportToExcel(exportTable, options);
                    break;
                case 'csv':
                    this.exportToCSV(exportTable, options);
                    break;
                case 'json':
                    this.exportToJSON(exportTable, options);
                    break;
            }

            // Add to history
            window.app?.addToHistory('export', `Экспортирована таблица "${table.name}" в формате ${format.toUpperCase()}`, table.id);
            window.app?.showToast(`Таблица экспортирована в формате ${format.toUpperCase()}`);

        } catch (error) {
            console.error('Export error:', error);
            window.app?.showToast('Ошибка при экспорте данных', 'error');
        }
    }

    exportToExcel(table, options = {}) {
        if (!window.XLSX) {
            window.app?.showToast('Библиотека экспорта не загружена', 'error');
            return;
        }

        const workbook = XLSX.utils.book_new();
        
        // Prepare data for export
        const exportData = [];
        
        // Add headers if requested
        if (options.includeHeaders !== false) {
            const headers = table.schema
                .filter(f => !f.system || f.name === 'id')
                .map(field => field.displayName || field.name);
            exportData.push(headers);
        }

        // Add data rows
        table.data.forEach(row => {
            const rowData = table.schema
                .filter(f => !f.system || f.name === 'id')
                .map(field => {
                    let value = row[field.name];
                    
                    // Handle different data types for Excel
                    if (field.type === 'bool') {
                        return value ? 'Да' : 'Нет';
                    } else if (field.type === 'date' || field.type === 'datetime') {
                        if (value && !options.formatDates) {
                            // Keep as date for Excel
                            return new Date(value);
                        }
                        return value;
                    }
                    
                    return value !== null && value !== undefined ? value : '';
                });
            exportData.push(rowData);
        });

        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(exportData);
        
        // Set column widths
        const colWidths = table.schema
            .filter(f => !f.system || f.name === 'id')
            .map(() => ({ wch: 15 }));
        worksheet['!cols'] = colWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Данные');

        // Add metadata sheet if requested
        if (options.includeMetadata) {
            const metadata = [
                ['Название таблицы', table.name],
                ['Описание', table.description || ''],
                ['Дата создания', new Date(table.createdAt).toLocaleString('ru-RU')],
                ['Дата обновления', new Date(table.updatedAt).toLocaleString('ru-RU')],
                ['Количество записей', table.data.length],
                ['Количество полей', table.schema.filter(f => !f.system).length],
                [''],
                ['Структура полей'],
                ['Название', 'Тип', 'Обязательное'],
                ...table.schema.filter(f => !f.system).map(field => [
                    field.displayName || field.name,
                    field.type,
                    field.required ? 'Да' : 'Нет'
                ])
            ];
            
            const metaSheet = XLSX.utils.aoa_to_sheet(metadata);
            XLSX.utils.book_append_sheet(workbook, metaSheet, 'Информация');
        }

        // Generate and download file
        const fileName = `${this.sanitizeFileName(table.name)}_${this.getDateString()}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }

    exportToCSV(table, options = {}) {
        if (!window.Papa) {
            window.app?.showToast('Библиотека экспорта не загружена', 'error');
            return;
        }

        // Prepare data
        const csvData = table.data.map(row => {
            const csvRow = {};
            table.schema
                .filter(f => !f.system || f.name === 'id')
                .forEach(field => {
                    const key = field.displayName || field.name;
                    let value = row[field.name];
                    
                    // Format values for CSV
                    if (value === null || value === undefined) {
                        value = '';
                    } else if (field.type === 'bool') {
                        value = value ? 'Да' : 'Нет';
                    } else if (field.type === 'date' || field.type === 'datetime') {
                        if (value) {
                            const date = new Date(value);
                            if (!isNaN(date.getTime())) {
                                value = field.type === 'date' 
                                    ? date.toLocaleDateString('ru-RU')
                                    : date.toLocaleString('ru-RU');
                            }
                        }
                    }
                    
                    csvRow[key] = value;
                });
            return csvRow;
        });

        // Generate CSV
        const csv = Papa.unparse(csvData, {
            header: options.includeHeaders !== false,
            delimiter: ';', // Use semicolon for better Excel compatibility in Russia
            encoding: 'utf-8'
        });

        // Add BOM for proper UTF-8 encoding in Excel
        const csvWithBOM = '\uFEFF' + csv;
        
        // Download file
        const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
        const fileName = `${this.sanitizeFileName(table.name)}_${this.getDateString()}.csv`;
        this.downloadBlob(blob, fileName);
    }

    exportToJSON(table, options = {}) {
        // Prepare data
        const jsonData = {
            table: {
                id: table.id,
                name: table.name,
                description: table.description,
                createdAt: table.createdAt,
                updatedAt: table.updatedAt,
                exportedAt: new Date().toISOString()
            },
            schema: table.schema.filter(f => !f.system || f.name === 'id'),
            data: table.data.map(row => {
                const cleanRow = {};
                table.schema
                    .filter(f => !f.system || f.name === 'id')
                    .forEach(field => {
                        cleanRow[field.name] = row[field.name];
                    });
                return cleanRow;
            }),
            meta: {
                recordCount: table.data.length,
                fieldCount: table.schema.filter(f => !f.system).length,
                exportOptions: options
            }
        };

        // Generate and download JSON
        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
        const fileName = `${this.sanitizeFileName(table.name)}_${this.getDateString()}.json`;
        this.downloadBlob(blob, fileName);
    }

    sanitizeFileName(name) {
        return name
            .replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .substring(0, 50);
    }

    getDateString() {
        const now = new Date();
        return now.toISOString().slice(0, 16).replace('T', '_').replace(/:/g, '-');
    }

    downloadBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Bulk export multiple tables
    showBulkExportModal(tables) {
        if (!tables || tables.length === 0) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 shadow-lg rounded-md bg-white">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 bg-green-100 text-green-600 rounded">
                            <i class="fas fa-download"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Массовый экспорт</h3>
                            <p class="text-sm text-gray-600">Экспорт ${tables.length} таблиц</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="space-y-6">
                    <!-- Tables List -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Таблицы для экспорта:</h4>
                        <div class="max-h-48 overflow-y-auto border rounded-lg">
                            ${tables.map(table => `
                                <div class="flex items-center justify-between p-3 border-b last:border-b-0">
                                    <div>
                                        <div class="font-medium text-gray-900">${table.name}</div>
                                        <div class="text-sm text-gray-500">${table.data?.length || 0} записей</div>
                                    </div>
                                    <div class="text-sm text-gray-400">
                                        ${this.getFormatSize(table, 'xlsx')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Export Format -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Формат экспорта:</h4>
                        <div class="grid grid-cols-3 gap-3">
                            ${this.supportedFormats.map(format => `
                                <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="bulk-format" value="${format.id}" 
                                           ${format.id === 'xlsx' ? 'checked' : ''}
                                           class="text-blue-600 focus:ring-blue-500 border-gray-300">
                                    <div class="ml-2">
                                        <i class="${format.icon} ${format.color}"></i>
                                        <span class="ml-1 text-sm font-medium">${format.name}</span>
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Archive Options -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Опции архива:</h4>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="checkbox" id="create-archive" checked 
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-700">Создать ZIP архив</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="include-summary" checked 
                                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                <span class="ml-2 text-sm text-gray-700">Включить сводку экспорта</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-6 border-t">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Отмена
                    </button>
                    <button onclick="window.exportManager.processBulkExport(${JSON.stringify(tables.map(t => t.id))}); this.closest('.fixed').remove();" 
                            class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                        <i class="fas fa-download mr-2"></i>Экспортировать все
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    processBulkExport(tableIds) {
        const tables = tableIds.map(id => window.app?.tables.find(t => t.id === id)).filter(Boolean);
        if (tables.length === 0) return;

        const format = document.querySelector('input[name="bulk-format"]:checked')?.value || 'xlsx';
        const createArchive = document.getElementById('create-archive')?.checked || false;
        const includeSummary = document.getElementById('include-summary')?.checked || false;

        // For now, export each table separately
        // In a real implementation, you might want to use a ZIP library
        tables.forEach((table, index) => {
            setTimeout(() => {
                this.exportTableWithOptions(table, format, { 
                    includeHeaders: true,
                    formatDates: true 
                });
            }, index * 500); // Delay to prevent browser blocking
        });

        window.app?.showToast(`Запущен экспорт ${tables.length} таблиц в формате ${format.toUpperCase()}`);
    }

    // Quick export functions
    quickExportExcel(table) {
        this.exportToExcel(table, { includeHeaders: true, formatDates: true });
    }

    quickExportCSV(table) {
        this.exportToCSV(table, { includeHeaders: true, formatDates: true });
    }

    // Import functionality (reverse of export)
    showImportFromExportModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Импорт экспортированных данных</h3>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="space-y-4">
                    <p class="text-gray-600">Загрузите JSON файл, экспортированный из TableFlow</p>
                    
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input type="file" id="import-export-file" accept=".json" class="hidden">
                        <i class="fas fa-file-import text-4xl text-gray-400 mb-2"></i>
                        <p class="text-gray-600 mb-2">Выберите JSON файл</p>
                        <button onclick="document.getElementById('import-export-file').click()" 
                                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Выбрать файл
                        </button>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Отмена
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('import-export-file').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.importFromExportedFile(e.target.files[0]);
                modal.remove();
            }
        });
    }

    importFromExportedFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.table && data.schema && data.data) {
                    // Create table from exported data
                    const table = {
                        id: Date.now().toString(),
                        name: `${data.table.name} (импорт)`,
                        description: data.table.description || '',
                        schema: data.schema,
                        data: data.data,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        permission: 'owner'
                    };

                    window.app?.tables.push(table);
                    window.app?.saveData();
                    window.app?.addToHistory('import_export', `Импортирована таблица из экспорта: ${table.name}`);
                    window.app?.showToast(`Таблица "${table.name}" успешно импортирована!`);
                    window.app?.showSection('tables');
                } else {
                    throw new Error('Неверный формат файла');
                }
            } catch (error) {
                console.error('Import error:', error);
                window.app?.showToast('Ошибка при импорте файла. Проверьте формат данных.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize export manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.exportManager = new ExportManager();
});