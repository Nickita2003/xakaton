// TableFlow - Main Application Logic
class TableFlowApp {
    constructor() {
        this.currentUser = {
            id: 'admin',
            name: 'Администратор',
            role: 'owner'
        };
        this.currentTable = null;
        this.currentTableData = [];
        this.tables = JSON.parse(localStorage.getItem('tableflow_tables') || '[]');
        this.history = JSON.parse(localStorage.getItem('tableflow_history') || '[]');
        
        this.init();
    }

    init() {
        // Initialize demo data if no tables exist
        this.initializeDemoData();
        
        this.updateStats();
        this.renderRecentTables();
        this.setupEventListeners();
        this.showSection('dashboard');
        
        // Show onboarding for new users
        this.checkOnboarding();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.remove('text-blue-600');
                    l.classList.add('text-gray-500');
                });
                link.classList.add('text-blue-600');
                link.classList.remove('text-gray-500');
            });
        });

        // Search functionality
        const tableSearch = document.getElementById('table-search');
        if (tableSearch) {
            tableSearch.addEventListener('input', () => this.filterTables(tableSearch.value));
        }

        const recordSearch = document.getElementById('record-search');
        if (recordSearch) {
            recordSearch.addEventListener('input', () => this.filterRecords(recordSearch.value));
        }

        // Sort functionality
        const sortField = document.getElementById('sort-field');
        const sortOrder = document.getElementById('sort-order');
        if (sortField && sortOrder) {
            sortField.addEventListener('change', () => this.sortRecords());
            sortOrder.addEventListener('change', () => this.sortRecords());
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('text-blue-600');
            link.classList.add('text-gray-500');
        });

        // Activate current navigation item
        const navMapping = {
            'dashboard': 0,
            'tables': 1, 
            'templates': 2
        };
        
        if (navMapping[sectionName] !== undefined) {
            const navLinks = document.querySelectorAll('.nav-link');
            if (navLinks[navMapping[sectionName]]) {
                navLinks[navMapping[sectionName]].classList.remove('text-gray-500');
                navLinks[navMapping[sectionName]].classList.add('text-blue-600');
            }
        }

        // Load section data
        switch (sectionName) {
            case 'dashboard':
                this.updateStats();
                this.renderRecentTables();
                break;
            case 'tables':
                this.renderTables();
                break;
            case 'templates':
                window.templatesManager?.renderTemplates();
                break;
            case 'table-view':
                // Use enhanced rendering with selection if available
                if (window.tablesManager?.renderTableWithSelection) {
                    window.tablesManager.renderTableWithSelection();
                } else {
                    this.renderCurrentTable();
                }
                break;
        }
    }

    updateStats() {
        const totalTables = this.tables.length;
        const totalRecords = this.tables.reduce((sum, table) => sum + (table.data?.length || 0), 0);
        const importsToday = this.getImportsToday();

        document.getElementById('total-tables').textContent = totalTables;
        document.getElementById('total-records').textContent = totalRecords;
        document.getElementById('imports-today').textContent = importsToday;
    }

    getImportsToday() {
        const today = new Date().toDateString();
        return this.history.filter(h => 
            h.type === 'import' && 
            new Date(h.timestamp).toDateString() === today
        ).length;
    }

    renderRecentTables() {
        const container = document.getElementById('recent-tables');
        if (!container) return;

        if (this.tables.length === 0) {
            container.innerHTML = `
                <div class="text-gray-500 text-center py-8">
                    <i class="fas fa-table text-4xl mb-4"></i>
                    <p>Пока нет созданных таблиц</p>
                    <button onclick="window.app.openImportModal()" class="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                        Создать первую таблицу
                    </button>
                </div>
            `;
            return;
        }

        const recentTables = this.tables
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);

        container.innerHTML = recentTables.map(table => `
            <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                 onclick="window.app.openTable('${table.id}')">
                <div class="flex items-center space-x-4">
                    <div class="p-2 bg-blue-100 text-blue-600 rounded">
                        <i class="fas fa-table"></i>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">${table.name}</h4>
                        <p class="text-sm text-gray-500">${table.data?.length || 0} записей • ${this.formatDate(table.updatedAt)}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        ${table.permission || 'owner'}
                    </span>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                </div>
            </div>
        `).join('');
    }

    renderTables() {
        const grid = document.getElementById('tables-grid');
        const noTables = document.getElementById('no-tables');
        
        if (!grid || !noTables) return;

        if (this.tables.length === 0) {
            grid.classList.add('hidden');
            noTables.classList.remove('hidden');
            return;
        }

        grid.classList.remove('hidden');
        noTables.classList.add('hidden');

        grid.innerHTML = this.tables.map(table => `
            <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 bg-blue-100 text-blue-600 rounded">
                            <i class="fas fa-table"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">${table.name}</h3>
                            <p class="text-sm text-gray-500">${table.description || 'Нет описания'}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="window.app.editTable('${table.id}')" 
                                class="text-gray-400 hover:text-gray-600" title="Редактировать">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="window.app.deleteTable('${table.id}')" 
                                class="text-gray-400 hover:text-red-600" title="Удалить">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-500">Записей:</span>
                        <span class="font-medium">${table.data?.length || 0}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-500">Полей:</span>
                        <span class="font-medium">${table.schema?.length || 0}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-500">Обновлено:</span>
                        <span class="font-medium">${this.formatDate(table.updatedAt)}</span>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        ${table.permission || 'owner'}
                    </span>
                    <button onclick="window.app.openTable('${table.id}')" 
                            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        Открыть
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterTables(searchTerm) {
        const filteredTables = this.tables.filter(table =>
            table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (table.description || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        const grid = document.getElementById('tables-grid');
        if (!grid) return;

        grid.innerHTML = filteredTables.map(table => `
            <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="p-2 bg-blue-100 text-blue-600 rounded">
                            <i class="fas fa-table"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-900">${table.name}</h3>
                            <p class="text-sm text-gray-500">${table.description || 'Нет описания'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-500">Записей:</span>
                        <span class="font-medium">${table.data?.length || 0}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-500">Полей:</span>
                        <span class="font-medium">${table.schema?.length || 0}</span>
                    </div>
                </div>

                <button onclick="window.app.openTable('${table.id}')" 
                        class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Открыть
                </button>
            </div>
        `).join('');
    }

    openTable(tableId) {
        const table = this.tables.find(t => t.id === tableId);
        if (!table) return;

        this.currentTable = table;
        this.currentTableData = [...(table.data || [])];
        
        document.getElementById('current-table-name').textContent = table.name;
        document.getElementById('current-table-info').textContent = 
            `${table.data?.length || 0} записей • Обновлено ${this.formatDate(table.updatedAt)}`;

        // Setup sort options
        this.setupSortOptions(table.schema);
        
        this.showSection('table-view');
        
        // Setup enhanced table features
        setTimeout(() => {
            if (window.tablesManager) {
                window.tablesManager.setupAdvancedFilters(table);
                window.tablesManager.setupBulkOperations();
            }
        }, 100);
    }

    setupSortOptions(schema) {
        const sortField = document.getElementById('sort-field');
        if (!sortField || !schema) return;

        sortField.innerHTML = '<option value="">Сортировать по...</option>' +
            schema.map(field => `<option value="${field.name}">${field.displayName || field.name}</option>`).join('');
    }

    renderCurrentTable() {
        if (!this.currentTable) return;

        const tableHeader = document.querySelector('#data-table thead');
        const tableBody = document.getElementById('data-table-body');
        const noRecords = document.getElementById('no-records');
        const recordsCount = document.getElementById('records-count');

        if (!tableHeader || !tableBody) return;

        // Render table headers
        tableHeader.innerHTML = `
            <tr>
                ${this.currentTable.schema.map(field => `
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ${field.displayName || field.name}
                        <span class="ml-1 text-gray-400">(${field.type})</span>
                    </th>
                `).join('')}
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                </th>
            </tr>
        `;

        if (this.currentTableData.length === 0) {
            tableBody.innerHTML = '';
            noRecords.classList.remove('hidden');
            recordsCount.textContent = '0';
            return;
        }

        noRecords.classList.add('hidden');
        recordsCount.textContent = this.currentTableData.length;

        // Render table data
        tableBody.innerHTML = this.currentTableData.map((record, index) => `
            <tr class="hover:bg-gray-50">
                ${this.currentTable.schema.map(field => `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${this.formatCellValue(record[field.name], field.type)}
                    </td>
                `).join('')}
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="window.app.editRecord(${index})" 
                            class="text-blue-600 hover:text-blue-800 mr-3">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="window.app.deleteRecord(${index})" 
                            class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    formatCellValue(value, type) {
        if (value === null || value === undefined || value === '') {
            return '<span class="text-gray-400 italic">—</span>';
        }

        switch (type) {
            case 'date':
                return new Date(value).toLocaleDateString('ru-RU');
            case 'datetime':
                return new Date(value).toLocaleString('ru-RU');
            case 'bool':
                return value ? '<span class="text-green-600">✓</span>' : '<span class="text-red-600">✗</span>';
            case 'number':
                return typeof value === 'number' ? value.toLocaleString('ru-RU') : value;
            default:
                return String(value).length > 50 ? String(value).substring(0, 50) + '...' : String(value);
        }
    }

    filterRecords(searchTerm) {
        if (!this.currentTable) return;

        const allData = this.currentTable.data || [];
        
        if (!searchTerm.trim()) {
            this.currentTableData = [...allData];
        } else {
            this.currentTableData = allData.filter(record => {
                return this.currentTable.schema.some(field => {
                    const value = record[field.name];
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                });
            });
        }

        this.renderCurrentTable();
    }

    sortRecords() {
        const sortField = document.getElementById('sort-field')?.value;
        const sortOrder = document.getElementById('sort-order')?.value || 'asc';

        if (!sortField || !this.currentTable) return;

        this.currentTableData.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            // Handle null/undefined values
            if (aVal === null || aVal === undefined) aVal = '';
            if (bVal === null || bVal === undefined) bVal = '';

            // Convert to comparable types
            const field = this.currentTable.schema.find(f => f.name === sortField);
            if (field?.type === 'number') {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
            } else if (field?.type === 'date' || field?.type === 'datetime') {
                aVal = new Date(aVal).getTime() || 0;
                bVal = new Date(bVal).getTime() || 0;
            } else {
                aVal = String(aVal).toLowerCase();
                bVal = String(bVal).toLowerCase();
            }

            if (sortOrder === 'desc') {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            } else {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            }
        });

        this.renderCurrentTable();
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    saveData() {
        localStorage.setItem('tableflow_tables', JSON.stringify(this.tables));
        localStorage.setItem('tableflow_history', JSON.stringify(this.history));
    }

    addToHistory(type, description, tableId = null) {
        this.history.unshift({
            id: Date.now().toString(),
            type,
            description,
            tableId,
            user: this.currentUser.name,
            timestamp: new Date().toISOString()
        });

        // Keep only last 100 history records
        if (this.history.length > 100) {
            this.history = this.history.slice(0, 100);
        }

        this.saveData();
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `flex items-center p-4 mb-4 text-sm rounded-lg ${
            type === 'success' ? 'text-green-800 bg-green-50 border border-green-200' :
            type === 'error' ? 'text-red-800 bg-red-50 border border-red-200' :
            'text-blue-800 bg-blue-50 border border-blue-200'
        } transform translate-x-full opacity-0 transition-all duration-300`;

        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.remove()" class="ml-4 text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // Modal management
    openImportModal() {
        window.importManager?.showImportModal();
    }

    openAddRecordModal() {
        if (!this.currentTable) return;
        this.showRecordModal();
    }

    editRecord(index) {
        if (!this.currentTable || !this.currentTableData[index]) return;
        this.showRecordModal(this.currentTableData[index], index);
    }

    deleteRecord(index) {
        if (!this.currentTable || !this.currentTableData[index]) return;

        if (confirm('Вы уверены, что хотите удалить эту запись?')) {
            // Remove from current view
            this.currentTableData.splice(index, 1);
            
            // Remove from original table data
            const originalIndex = this.currentTable.data.findIndex(record => 
                JSON.stringify(record) === JSON.stringify(this.currentTableData[index])
            );
            if (originalIndex !== -1) {
                this.currentTable.data.splice(originalIndex, 1);
            }

            this.currentTable.updatedAt = new Date().toISOString();
            this.saveData();
            this.renderCurrentTable();
            this.addToHistory('delete_record', `Удалена запись из таблицы "${this.currentTable.name}"`, this.currentTable.id);
            this.showToast('Запись удалена');
        }
    }

    showRecordModal(record = null, index = null) {
        if (!this.currentTable) return;

        const isEdit = record !== null;
        const modalId = 'record-modal';

        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">
                        ${isEdit ? 'Редактировать запись' : 'Добавить запись'}
                    </h3>
                    <button onclick="document.getElementById('${modalId}').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form id="record-form" class="space-y-4">
                    ${this.currentTable.schema.map(field => `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                ${field.displayName || field.name}
                                ${field.required ? '<span class="text-red-500">*</span>' : ''}
                            </label>
                            ${this.renderFieldInput(field, record)}
                        </div>
                    `).join('')}

                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" onclick="document.getElementById('${modalId}').remove()" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Отмена
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            ${isEdit ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup form submission
        document.getElementById('record-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveRecord(modal, isEdit, index);
        });
    }

    renderFieldInput(field, record = null) {
        const value = record ? (record[field.name] || '') : '';
        const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

        switch (field.type) {
            case 'text':
                return `<input type="text" name="${field.name}" value="${value}" class="${inputClass}" ${field.required ? 'required' : ''}>`;
            case 'number':
                return `<input type="number" name="${field.name}" value="${value}" class="${inputClass}" ${field.required ? 'required' : ''}>`;
            case 'date':
                return `<input type="date" name="${field.name}" value="${value}" class="${inputClass}" ${field.required ? 'required' : ''}>`;
            case 'datetime':
                const datetimeValue = value ? new Date(value).toISOString().slice(0, 16) : '';
                return `<input type="datetime-local" name="${field.name}" value="${datetimeValue}" class="${inputClass}" ${field.required ? 'required' : ''}>`;
            case 'bool':
                return `
                    <select name="${field.name}" class="${inputClass}" ${field.required ? 'required' : ''}>
                        <option value="">Выберите значение</option>
                        <option value="true" ${value === true || value === 'true' ? 'selected' : ''}>Да</option>
                        <option value="false" ${value === false || value === 'false' ? 'selected' : ''}>Нет</option>
                    </select>
                `;
            case 'rich_text':
                return `<textarea name="${field.name}" rows="4" class="${inputClass}" ${field.required ? 'required' : ''}>${value}</textarea>`;
            default:
                return `<input type="text" name="${field.name}" value="${value}" class="${inputClass}" ${field.required ? 'required' : ''}>`;
        }
    }

    saveRecord(modal, isEdit, index) {
        const formData = new FormData(document.getElementById('record-form'));
        const record = {};

        // Process form data
        this.currentTable.schema.forEach(field => {
            let value = formData.get(field.name);
            
            if (value === '') value = null;
            else if (field.type === 'number') value = parseFloat(value) || null;
            else if (field.type === 'bool') value = value === 'true';
            else if (field.type === 'date' || field.type === 'datetime') {
                value = value ? new Date(value).toISOString() : null;
            }

            record[field.name] = value;
        });

        // Add system fields
        if (!isEdit) {
            record.id = Date.now().toString();
            record.created_at = new Date().toISOString();
        }
        record.updated_at = new Date().toISOString();

        // Save record
        if (isEdit && index !== null) {
            this.currentTableData[index] = record;
            // Update in original data
            const originalIndex = this.currentTable.data.findIndex(r => r.id === record.id);
            if (originalIndex !== -1) {
                this.currentTable.data[originalIndex] = record;
            }
            this.addToHistory('update_record', `Обновлена запись в таблице "${this.currentTable.name}"`, this.currentTable.id);
            this.showToast('Запись обновлена');
        } else {
            this.currentTableData.unshift(record);
            this.currentTable.data = this.currentTable.data || [];
            this.currentTable.data.unshift(record);
            this.addToHistory('add_record', `Добавлена запись в таблицу "${this.currentTable.name}"`, this.currentTable.id);
            this.showToast('Запись добавлена');
        }

        this.currentTable.updatedAt = new Date().toISOString();
        this.saveData();
        this.renderCurrentTable();
        modal.remove();
    }

    editTable(tableId) {
        const table = this.tables.find(t => t.id === tableId);
        if (!table) return;

        // Simple edit modal for table name and description
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Редактировать таблицу</h3>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form id="edit-table-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Название таблицы</label>
                        <input type="text" name="name" value="${table.name}" 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                        <textarea name="description" rows="3" 
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">${table.description || ''}</textarea>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" onclick="this.closest('.fixed').remove()" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Отмена
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('edit-table-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            table.name = formData.get('name');
            table.description = formData.get('description');
            table.updatedAt = new Date().toISOString();

            this.saveData();
            this.renderTables();
            this.addToHistory('update_table', `Обновлена таблица "${table.name}"`, table.id);
            this.showToast('Таблица обновлена');
            modal.remove();
        });
    }

    deleteTable(tableId) {
        const table = this.tables.find(t => t.id === tableId);
        if (!table) return;

        if (confirm(`Вы уверены, что хотите удалить таблицу "${table.name}"? Это действие нельзя отменить.`)) {
            this.tables = this.tables.filter(t => t.id !== tableId);
            this.saveData();
            this.renderTables();
            this.addToHistory('delete_table', `Удалена таблица "${table.name}"`);
            this.showToast('Таблица удалена');
        }
    }

    exportCurrentTable() {
        window.exportManager?.exportTable(this.currentTable);
    }

    showHistoryModal() {
        this.showHistoryModalImpl(this.currentTable?.id);
    }

    showHistoryModalImpl(tableId) {
        const tableHistory = this.history.filter(h => !tableId || h.tableId === tableId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 50); // Show last 50 entries

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">
                        История изменений ${tableId ? `- ${this.currentTable?.name}` : ''}
                    </h3>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="max-h-96 overflow-y-auto">
                    ${tableHistory.length > 0 ? `
                        <div class="space-y-3">
                            ${tableHistory.map(entry => `
                                <div class="flex items-start space-x-3 p-3 border rounded hover:bg-gray-50">
                                    <div class="flex-shrink-0">
                                        <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                            <i class="fas ${this.getHistoryIcon(entry.type)} text-xs"></i>
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="text-sm font-medium text-gray-900">${entry.description}</div>
                                        <div class="text-xs text-gray-500 mt-1">
                                            ${entry.user} • ${this.formatDate(entry.timestamp)} в ${new Date(entry.timestamp).toLocaleTimeString('ru-RU')}
                                        </div>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                            ${this.getHistoryTypeName(entry.type)}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-12 text-gray-500">
                            <i class="fas fa-history text-4xl mb-4"></i>
                            <h4 class="text-lg font-semibold mb-2">Нет истории</h4>
                            <p>История изменений пока пуста</p>
                        </div>
                    `}
                </div>

                <div class="flex justify-between items-center pt-4 border-t">
                    <div class="text-sm text-gray-500">
                        Показано записей: ${Math.min(tableHistory.length, 50)}
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Закрыть
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    getHistoryIcon(type) {
        const icons = {
            import: 'fa-file-import',
            create_template: 'fa-plus',
            add_record: 'fa-plus-circle',
            update_record: 'fa-edit',
            delete_record: 'fa-trash',
            duplicate_record: 'fa-copy',
            bulk_delete: 'fa-trash-alt',
            export: 'fa-download',
            update_table: 'fa-table',
            delete_table: 'fa-times-circle'
        };
        return icons[type] || 'fa-info';
    }

    getHistoryTypeName(type) {
        const names = {
            import: 'Импорт',
            create_template: 'Создание',
            add_record: 'Добавление',
            update_record: 'Изменение',
            delete_record: 'Удаление',
            duplicate_record: 'Дублирование',
            bulk_delete: 'Массовое удаление',
            export: 'Экспорт',
            update_table: 'Обновление',
            delete_table: 'Удаление таблицы'
        };
        return names[type] || type;
    }

    initializeDemoData() {
        // Only initialize if no data exists
        if (this.tables.length === 0) {
            // Create a sample table with contacts
            const demoTable = {
                id: 'demo_contacts_' + Date.now(),
                name: 'Демо: База контактов',
                description: 'Пример таблицы с контактной информацией для демонстрации возможностей системы',
                schema: [
                    { name: 'id', displayName: 'ID', type: 'text', required: true, system: true },
                    { name: 'full_name', displayName: 'ФИО', type: 'text', required: true },
                    { name: 'company', displayName: 'Компания', type: 'text', required: false },
                    { name: 'position', displayName: 'Должность', type: 'text', required: false },
                    { name: 'email', displayName: 'Email', type: 'text', required: false },
                    { name: 'phone', displayName: 'Телефон', type: 'text', required: false },
                    { name: 'city', displayName: 'Город', type: 'text', required: false },
                    { name: 'is_client', displayName: 'Клиент', type: 'bool', required: false },
                    { name: 'last_contact', displayName: 'Последний контакт', type: 'date', required: false },
                    { name: 'notes', displayName: 'Заметки', type: 'rich_text', required: false }
                ],
                data: [
                    {
                        id: 'demo_1',
                        full_name: 'Иванов Алексей Петрович',
                        company: 'ООО "ТехноСофт"',
                        position: 'Директор по развитию',
                        email: 'a.ivanov@technosoft.ru',
                        phone: '+7 495 123-45-67',
                        city: 'Москва',
                        is_client: true,
                        last_contact: '2024-01-15',
                        notes: 'Заинтересован в долгосрочном сотрудничестве'
                    },
                    {
                        id: 'demo_2',
                        full_name: 'Петрова Мария Сергеевна',
                        company: 'ЗАО "Инновации"',
                        position: 'Менеджер закупок',
                        email: 'm.petrova@innovations.ru',
                        phone: '+7 812 987-65-43',
                        city: 'Санкт-Петербург',
                        is_client: false,
                        last_contact: '2024-01-12',
                        notes: 'Потенциальный клиент, требует дополнительную презентацию'
                    },
                    {
                        id: 'demo_3',
                        full_name: 'Сидоров Дмитрий Владимирович',
                        company: 'ИП Сидоров Д.В.',
                        position: 'Предприниматель',
                        email: 'd.sidorov@gmail.com',
                        phone: '+7 903 456-78-90',
                        city: 'Екатеринбург',
                        is_client: true,
                        last_contact: '2024-01-10',
                        notes: 'Постоянный клиент, работаем с 2022 года'
                    },
                    {
                        id: 'demo_4',
                        full_name: 'Козлова Елена Андреевна',
                        company: 'АО "СтройИнвест"',
                        position: 'Главный инженер',
                        email: 'e.kozlova@stroyinvest.com',
                        phone: '+7 343 111-22-33',
                        city: 'Екатеринбург',
                        is_client: false,
                        last_contact: '2024-01-08',
                        notes: 'Рекомендована партнерами, назначена встреча'
                    },
                    {
                        id: 'demo_5',
                        full_name: 'Новиков Сергей Игоревич',
                        company: 'ООО "Логистика Плюс"',
                        position: 'Логист',
                        email: 's.novikov@logplus.ru',
                        phone: '+7 921 333-44-55',
                        city: 'Новосибирск',
                        is_client: true,
                        last_contact: '2024-01-05',
                        notes: 'Работаем по договору на год, продление в марте'
                    }
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                permission: 'owner'
            };

            this.tables.push(demoTable);
            this.addToHistory('demo_init', 'Созданы демонстрационные данные для знакомства с системой');
            this.saveData();
        }
    }

    checkOnboarding() {
        const hasSeenOnboarding = localStorage.getItem('tableflow_onboarding_seen');
        if (!hasSeenOnboarding) {
            setTimeout(() => this.showOnboardingModal(), 1000);
        }
    }

    showOnboardingModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">🎉</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">Добро пожаловать в TableFlow!</h3>
                    <p class="text-gray-600">Превратите хаос Excel в порядок данных</p>
                </div>

                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="text-center p-4 bg-blue-50 rounded-lg">
                            <div class="text-3xl text-blue-600 mb-2">
                                <i class="fas fa-file-upload"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-1">Импорт данных</h4>
                            <p class="text-sm text-gray-600">Загружайте Excel и CSV файлы с автоматическим определением типов</p>
                        </div>

                        <div class="text-center p-4 bg-green-50 rounded-lg">
                            <div class="text-3xl text-green-600 mb-2">
                                <i class="fas fa-table"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-1">Управление данными</h4>
                            <p class="text-sm text-gray-600">Редактируйте, фильтруйте и сортируйте записи в удобном интерфейсе</p>
                        </div>

                        <div class="text-center p-4 bg-purple-50 rounded-lg">
                            <div class="text-3xl text-purple-600 mb-2">
                                <i class="fas fa-layer-group"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-1">Готовые шаблоны</h4>
                            <p class="text-sm text-gray-600">Используйте шаблоны для склада, заказов, контактов и других задач</p>
                        </div>

                        <div class="text-center p-4 bg-yellow-50 rounded-lg">
                            <div class="text-3xl text-yellow-600 mb-2">
                                <i class="fas fa-download"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-1">Экспорт результатов</h4>
                            <p class="text-sm text-gray-600">Выгружайте данные в Excel, CSV или JSON для дальнейшей работы</p>
                        </div>
                    </div>

                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 mb-2">🚀 Быстрый старт:</h4>
                        <ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                            <li>Изучите демонстрационную таблицу с контактами</li>
                            <li>Попробуйте создать таблицу из готового шаблона</li>
                            <li>Импортируйте свои данные из Excel или CSV файла</li>
                            <li>Настройте фильтры и попробуйте экспорт данных</li>
                        </ol>
                    </div>
                </div>

                <div class="flex justify-between items-center pt-6 border-t">
                    <label class="flex items-center">
                        <input type="checkbox" id="dont-show-again" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        <span class="ml-2 text-sm text-gray-600">Больше не показывать</span>
                    </label>
                    <div class="flex space-x-3">
                        <button onclick="window.app.skipOnboarding()" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Пропустить
                        </button>
                        <button onclick="window.app.startOnboarding()" 
                                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            <i class="fas fa-rocket mr-2"></i>Начать знакомство
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.onboardingModal = modal;
    }

    skipOnboarding() {
        if (document.getElementById('dont-show-again')?.checked) {
            localStorage.setItem('tableflow_onboarding_seen', 'true');
        }
        this.onboardingModal?.remove();
    }

    startOnboarding() {
        localStorage.setItem('tableflow_onboarding_seen', 'true');
        this.onboardingModal?.remove();
        
        // Navigate to demo table
        const demoTable = this.tables.find(t => t.name.startsWith('Демо:'));
        if (demoTable) {
            this.showSection('tables');
            setTimeout(() => {
                this.openTable(demoTable.id);
                this.showToast('Добро пожаловать! Это демонстрационная таблица с примерами данных.', 'info');
            }, 500);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TableFlowApp();
});