// TableFlow - Tables Manager
class TablesManager {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 50;
        this.currentFilters = {};
        this.currentSort = { field: null, order: 'asc' };
    }

    // Advanced filtering for records
    setupAdvancedFilters(table) {
        if (!table || !table.schema) return;

        const filtersContainer = document.createElement('div');
        filtersContainer.id = 'advanced-filters';
        filtersContainer.className = 'bg-white rounded-lg shadow-sm border p-4 mb-4 space-y-4';
        
        filtersContainer.innerHTML = `
            <div class="flex items-center justify-between">
                <h5 class="font-medium text-gray-900">Фильтры</h5>
                <div class="flex items-center space-x-2">
                    <button onclick="window.tablesManager.clearFilters()" 
                            class="text-sm text-gray-600 hover:text-gray-800">
                        Очистить все
                    </button>
                    <button onclick="window.tablesManager.toggleFilters()" 
                            class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-filter"></i>
                    </button>
                </div>
            </div>
            
            <div id="filters-content" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 hidden">
                ${table.schema.filter(field => !field.system).map(field => `
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-gray-700">${field.displayName || field.name}</label>
                        ${this.renderFilterInput(field)}
                    </div>
                `).join('')}
                
                <div class="col-span-full flex justify-end space-x-2">
                    <button onclick="window.tablesManager.applyFilters()" 
                            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Применить
                    </button>
                    <button onclick="window.tablesManager.clearFilters()" 
                            class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
                        Сбросить
                    </button>
                </div>
            </div>
        `;

        // Insert filters after table controls
        const tableControls = document.querySelector('.bg-white.rounded-lg.shadow-sm.border.p-4.mb-4');
        if (tableControls) {
            tableControls.parentNode.insertBefore(filtersContainer, tableControls.nextSibling);
        }
    }

    renderFilterInput(field) {
        const fieldId = `filter-${field.name}`;
        const baseClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

        switch (field.type) {
            case 'text':
            case 'rich_text':
                return `<input type="text" id="${fieldId}" placeholder="Содержит..." class="${baseClass}">`;
            
            case 'number':
                return `
                    <div class="flex space-x-2">
                        <input type="number" id="${fieldId}-min" placeholder="Мин" class="${baseClass}">
                        <input type="number" id="${fieldId}-max" placeholder="Макс" class="${baseClass}">
                    </div>
                `;
            
            case 'date':
            case 'datetime':
                return `
                    <div class="flex space-x-2">
                        <input type="date" id="${fieldId}-from" class="${baseClass}">
                        <input type="date" id="${fieldId}-to" class="${baseClass}">
                    </div>
                `;
            
            case 'bool':
                return `
                    <select id="${fieldId}" class="${baseClass}">
                        <option value="">Все</option>
                        <option value="true">Да</option>
                        <option value="false">Нет</option>
                    </select>
                `;
            
            default:
                return `<input type="text" id="${fieldId}" placeholder="Содержит..." class="${baseClass}">`;
        }
    }

    toggleFilters() {
        const filtersContent = document.getElementById('filters-content');
        if (filtersContent) {
            filtersContent.classList.toggle('hidden');
        }
    }

    applyFilters() {
        if (!window.app?.currentTable) return;

        const filters = {};
        const table = window.app.currentTable;

        table.schema.filter(field => !field.system).forEach(field => {
            const fieldId = `filter-${field.name}`;
            
            switch (field.type) {
                case 'text':
                case 'rich_text':
                    const textValue = document.getElementById(fieldId)?.value;
                    if (textValue) {
                        filters[field.name] = { type: 'text', value: textValue };
                    }
                    break;
                
                case 'number':
                    const minValue = document.getElementById(`${fieldId}-min`)?.value;
                    const maxValue = document.getElementById(`${fieldId}-max`)?.value;
                    if (minValue || maxValue) {
                        filters[field.name] = { 
                            type: 'number', 
                            min: minValue ? parseFloat(minValue) : null,
                            max: maxValue ? parseFloat(maxValue) : null
                        };
                    }
                    break;
                
                case 'date':
                case 'datetime':
                    const fromDate = document.getElementById(`${fieldId}-from`)?.value;
                    const toDate = document.getElementById(`${fieldId}-to`)?.value;
                    if (fromDate || toDate) {
                        filters[field.name] = { 
                            type: 'date', 
                            from: fromDate ? new Date(fromDate) : null,
                            to: toDate ? new Date(toDate) : null
                        };
                    }
                    break;
                
                case 'bool':
                    const boolValue = document.getElementById(fieldId)?.value;
                    if (boolValue) {
                        filters[field.name] = { type: 'bool', value: boolValue === 'true' };
                    }
                    break;
            }
        });

        this.currentFilters = filters;
        this.filterAndRenderTable();
    }

    clearFilters() {
        if (!window.app?.currentTable) return;

        // Clear filter inputs
        const table = window.app.currentTable;
        table.schema.filter(field => !field.system).forEach(field => {
            const fieldId = `filter-${field.name}`;
            
            switch (field.type) {
                case 'text':
                case 'rich_text':
                case 'bool':
                    const input = document.getElementById(fieldId);
                    if (input) input.value = '';
                    break;
                
                case 'number':
                    const minInput = document.getElementById(`${fieldId}-min`);
                    const maxInput = document.getElementById(`${fieldId}-max`);
                    if (minInput) minInput.value = '';
                    if (maxInput) maxInput.value = '';
                    break;
                
                case 'date':
                case 'datetime':
                    const fromInput = document.getElementById(`${fieldId}-from`);
                    const toInput = document.getElementById(`${fieldId}-to`);
                    if (fromInput) fromInput.value = '';
                    if (toInput) toInput.value = '';
                    break;
            }
        });

        this.currentFilters = {};
        this.filterAndRenderTable();
    }

    filterAndRenderTable() {
        if (!window.app?.currentTable) return;

        let filteredData = [...(window.app.currentTable.data || [])];

        // Apply filters
        Object.entries(this.currentFilters).forEach(([fieldName, filter]) => {
            filteredData = filteredData.filter(record => {
                const value = record[fieldName];
                
                switch (filter.type) {
                    case 'text':
                        if (value === null || value === undefined) return false;
                        return String(value).toLowerCase().includes(filter.value.toLowerCase());
                    
                    case 'number':
                        const numValue = parseFloat(value);
                        if (isNaN(numValue)) return false;
                        
                        if (filter.min !== null && numValue < filter.min) return false;
                        if (filter.max !== null && numValue > filter.max) return false;
                        return true;
                    
                    case 'date':
                        const dateValue = new Date(value);
                        if (isNaN(dateValue.getTime())) return false;
                        
                        if (filter.from && dateValue < filter.from) return false;
                        if (filter.to && dateValue > filter.to) return false;
                        return true;
                    
                    case 'bool':
                        return value === filter.value;
                    
                    default:
                        return true;
                }
            });
        });

        // Apply search if exists
        const searchTerm = document.getElementById('record-search')?.value;
        if (searchTerm && searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filteredData = filteredData.filter(record => {
                return window.app.currentTable.schema.some(field => {
                    const value = record[field.name];
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(term);
                });
            });
        }

        // Apply sorting
        if (this.currentSort.field) {
            const field = window.app.currentTable.schema.find(f => f.name === this.currentSort.field);
            filteredData.sort((a, b) => {
                let aVal = a[this.currentSort.field];
                let bVal = b[this.currentSort.field];

                // Handle null/undefined values
                if (aVal === null || aVal === undefined) aVal = '';
                if (bVal === null || bVal === undefined) bVal = '';

                // Convert to comparable types
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

                if (this.currentSort.order === 'desc') {
                    return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
                } else {
                    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                }
            });
        }

        window.app.currentTableData = filteredData;
        window.app.renderCurrentTable();
        this.updateFilterBadges();
    }

    updateFilterBadges() {
        // Show active filter count
        const filterCount = Object.keys(this.currentFilters).length;
        const filterButton = document.querySelector('button[onclick="window.tablesManager.toggleFilters()"]');
        
        if (filterButton) {
            if (filterCount > 0) {
                filterButton.innerHTML = `<i class="fas fa-filter"></i> <span class="ml-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">${filterCount}</span>`;
            } else {
                filterButton.innerHTML = '<i class="fas fa-filter"></i>';
            }
        }
    }

    // Bulk operations
    setupBulkOperations() {
        const tableControls = document.querySelector('.bg-white.rounded-lg.shadow-sm.border.p-4.mb-4 .flex.flex-wrap.items-center.justify-between');
        if (!tableControls) return;

        const bulkActionsHTML = `
            <div id="bulk-actions" class="flex items-center space-x-2 hidden">
                <span class="text-sm text-gray-600">Выбрано: <span id="selected-count">0</span></span>
                <button onclick="window.tablesManager.bulkDelete()" 
                        class="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">
                    <i class="fas fa-trash mr-1"></i>Удалить
                </button>
                <button onclick="window.tablesManager.bulkExport()" 
                        class="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700">
                    <i class="fas fa-download mr-1"></i>Экспорт
                </button>
                <button onclick="window.tablesManager.clearSelection()" 
                        class="text-gray-600 hover:text-gray-800">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        const firstChild = tableControls.querySelector('div:first-child');
        if (firstChild) {
            firstChild.insertAdjacentHTML('afterend', bulkActionsHTML);
        }
    }

    // Enhanced table rendering with selection
    renderTableWithSelection() {
        if (!window.app?.currentTable) return;

        const tableHeader = document.querySelector('#data-table thead');
        const tableBody = document.getElementById('data-table-body');
        const noRecords = document.getElementById('no-records');
        const recordsCount = document.getElementById('records-count');

        if (!tableHeader || !tableBody) return;

        // Render table headers with selection
        tableHeader.innerHTML = `
            <tr>
                <th class="px-6 py-3 text-left">
                    <input type="checkbox" id="select-all" onchange="window.tablesManager.toggleSelectAll(this.checked)"
                           class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                </th>
                ${window.app.currentTable.schema.map(field => `
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onclick="window.tablesManager.sortBy('${field.name}')">
                        <div class="flex items-center">
                            ${field.displayName || field.name}
                            <span class="ml-1 text-gray-400">(${field.type})</span>
                            ${this.currentSort.field === field.name ? 
                                `<i class="fas fa-sort-${this.currentSort.order === 'asc' ? 'up' : 'down'} ml-2"></i>` : 
                                '<i class="fas fa-sort ml-2 text-gray-300"></i>'
                            }
                        </div>
                    </th>
                `).join('')}
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                </th>
            </tr>
        `;

        if (window.app.currentTableData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="${window.app.currentTable.schema.length + 2}" class="px-6 py-12 text-center">
                        <div class="text-gray-500">
                            <i class="fas fa-inbox text-4xl mb-4"></i>
                            <h3 class="text-lg font-semibold mb-2">Нет данных</h3>
                            <p class="mb-4">В этой таблице пока нет записей или они не соответствуют фильтрам</p>
                            <button onclick="window.app.openAddRecordModal()" 
                                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <i class="fas fa-plus mr-2"></i>Добавить запись
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            recordsCount.textContent = '0';
            return;
        }

        recordsCount.textContent = window.app.currentTableData.length;

        // Render table data with selection
        tableBody.innerHTML = window.app.currentTableData.map((record, index) => `
            <tr class="hover:bg-gray-50 ${this.isSelected(record.id) ? 'bg-blue-50' : ''}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" value="${record.id}" onchange="window.tablesManager.toggleRowSelection(this)"
                           class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" ${this.isSelected(record.id) ? 'checked' : ''}>
                </td>
                ${window.app.currentTable.schema.map(field => `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${window.app.formatCellValue(record[field.name], field.type)}
                    </td>
                `).join('')}
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                        <button onclick="window.app.editRecord(${index})" 
                                class="text-blue-600 hover:text-blue-800" title="Редактировать">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="window.tablesManager.duplicateRecord(${index})" 
                                class="text-green-600 hover:text-green-800" title="Дублировать">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button onclick="window.app.deleteRecord(${index})" 
                                class="text-red-600 hover:text-red-800" title="Удалить">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    selectedRows = new Set();

    isSelected(recordId) {
        return this.selectedRows.has(recordId);
    }

    toggleRowSelection(checkbox) {
        if (checkbox.checked) {
            this.selectedRows.add(checkbox.value);
        } else {
            this.selectedRows.delete(checkbox.value);
        }
        this.updateBulkActionsVisibility();
    }

    toggleSelectAll(checked) {
        if (checked) {
            window.app.currentTableData.forEach(record => {
                this.selectedRows.add(record.id);
            });
        } else {
            this.selectedRows.clear();
        }
        
        // Update checkboxes
        document.querySelectorAll('#data-table-body input[type="checkbox"]').forEach(cb => {
            cb.checked = checked;
        });
        
        this.updateBulkActionsVisibility();
    }

    clearSelection() {
        this.selectedRows.clear();
        document.getElementById('select-all').checked = false;
        document.querySelectorAll('#data-table-body input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        this.updateBulkActionsVisibility();
        this.renderTableWithSelection(); // Re-render to remove selection highlighting
    }

    updateBulkActionsVisibility() {
        const bulkActions = document.getElementById('bulk-actions');
        const selectedCount = document.getElementById('selected-count');
        
        if (bulkActions && selectedCount) {
            if (this.selectedRows.size > 0) {
                bulkActions.classList.remove('hidden');
                selectedCount.textContent = this.selectedRows.size;
            } else {
                bulkActions.classList.add('hidden');
            }
        }
    }

    sortBy(fieldName) {
        if (this.currentSort.field === fieldName) {
            this.currentSort.order = this.currentSort.order === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.field = fieldName;
            this.currentSort.order = 'asc';
        }

        // Update sort dropdown to match
        const sortField = document.getElementById('sort-field');
        const sortOrder = document.getElementById('sort-order');
        if (sortField) sortField.value = fieldName;
        if (sortOrder) sortOrder.value = this.currentSort.order;

        this.filterAndRenderTable();
    }

    duplicateRecord(index) {
        if (!window.app?.currentTable || !window.app.currentTableData[index]) return;

        const originalRecord = window.app.currentTableData[index];
        const duplicateRecord = { ...originalRecord };
        
        // Generate new ID and timestamps
        duplicateRecord.id = `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        duplicateRecord.created_at = new Date().toISOString();
        duplicateRecord.updated_at = new Date().toISOString();

        // Add to table data
        window.app.currentTableData.unshift(duplicateRecord);
        window.app.currentTable.data.unshift(duplicateRecord);
        
        window.app.currentTable.updatedAt = new Date().toISOString();
        window.app.saveData();
        window.app.addToHistory('duplicate_record', `Дублирована запись в таблице "${window.app.currentTable.name}"`, window.app.currentTable.id);
        
        this.renderTableWithSelection();
        window.app.showToast('Запись дублирована');
    }

    bulkDelete() {
        if (this.selectedRows.size === 0) return;

        if (confirm(`Вы уверены, что хотите удалить ${this.selectedRows.size} записей? Это действие нельзя отменить.`)) {
            // Remove from current view
            window.app.currentTableData = window.app.currentTableData.filter(record => 
                !this.selectedRows.has(record.id)
            );
            
            // Remove from original table data
            window.app.currentTable.data = window.app.currentTable.data.filter(record => 
                !this.selectedRows.has(record.id)
            );

            window.app.currentTable.updatedAt = new Date().toISOString();
            window.app.saveData();
            window.app.addToHistory('bulk_delete', `Удалено ${this.selectedRows.size} записей из таблицы "${window.app.currentTable.name}"`, window.app.currentTable.id);
            
            this.selectedRows.clear();
            this.renderTableWithSelection();
            window.app.showToast(`Удалено ${this.selectedRows.size} записей`);
        }
    }

    bulkExport() {
        if (this.selectedRows.size === 0) return;

        const selectedRecords = window.app.currentTableData.filter(record => 
            this.selectedRows.has(record.id)
        );

        const exportTable = {
            ...window.app.currentTable,
            data: selectedRecords,
            name: `${window.app.currentTable.name} (выборка)`
        };

        window.exportManager?.exportTable(exportTable);
    }

    // Pagination
    setupPagination() {
        if (!window.app?.currentTable) return;

        const totalRecords = window.app.currentTableData.length;
        const totalPages = Math.ceil(totalRecords / this.pageSize);

        if (totalPages <= 1) return; // No pagination needed

        const paginationHTML = `
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button onclick="window.tablesManager.previousPage()" ${this.currentPage <= 1 ? 'disabled' : ''}
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                        Назад
                    </button>
                    <button onclick="window.tablesManager.nextPage()" ${this.currentPage >= totalPages ? 'disabled' : ''}
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                        Далее
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            Показано с <span class="font-medium">${(this.currentPage - 1) * this.pageSize + 1}</span>
                            по <span class="font-medium">${Math.min(this.currentPage * this.pageSize, totalRecords)}</span>
                            из <span class="font-medium">${totalRecords}</span> записей
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button onclick="window.tablesManager.previousPage()" ${this.currentPage <= 1 ? 'disabled' : ''}
                                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            ${this.renderPageNumbers(totalPages)}
                            <button onclick="window.tablesManager.nextPage()" ${this.currentPage >= totalPages ? 'disabled' : ''}
                                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        `;

        // Add pagination after table
        const table = document.getElementById('data-table').closest('.bg-white');
        if (table) {
            table.insertAdjacentHTML('afterend', paginationHTML);
        }
    }

    renderPageNumbers(totalPages) {
        let pages = '';
        const showPages = 5; // Show 5 page numbers max
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + showPages - 1);

        if (endPage - startPage < showPages - 1) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === this.currentPage;
            pages += `
                <button onclick="window.tablesManager.goToPage(${i})" 
                        class="relative inline-flex items-center px-4 py-2 border ${
                            isActive 
                                ? 'bg-blue-50 border-blue-500 text-blue-600' 
                                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium">
                    ${i}
                </button>
            `;
        }

        return pages;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderPaginatedTable();
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderPaginatedTable();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(window.app.currentTableData.length / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderPaginatedTable();
        }
    }

    renderPaginatedTable() {
        if (!window.app?.currentTable) return;

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const paginatedData = window.app.currentTableData.slice(startIndex, endIndex);

        // Temporarily replace current data for rendering
        const originalData = window.app.currentTableData;
        window.app.currentTableData = paginatedData;
        
        this.renderTableWithSelection();
        
        // Restore original data
        window.app.currentTableData = originalData;

        // Remove existing pagination and add new
        document.querySelectorAll('.bg-white.px-4.py-3.flex.items-center.justify-between').forEach(el => {
            if (el.textContent.includes('Показано с')) {
                el.remove();
            }
        });
        
        this.setupPagination();
    }

    // Column management
    showColumnManager() {
        if (!window.app?.currentTable) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 shadow-lg rounded-md bg-white">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Управление колонками</h3>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="space-y-4">
                    <p class="text-gray-600">Настройте видимость и порядок колонок в таблице</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Visible Columns -->
                        <div>
                            <h4 class="font-medium text-gray-900 mb-3">Видимые колонки</h4>
                            <div id="visible-columns" class="space-y-2 bg-gray-50 p-3 rounded min-h-32">
                                ${window.app.currentTable.schema.filter(field => !field.system).map(field => `
                                    <div class="flex items-center justify-between p-2 bg-white rounded shadow-sm cursor-move" 
                                         draggable="true" data-field="${field.name}">
                                        <div class="flex items-center">
                                            <i class="fas fa-grip-vertical text-gray-400 mr-2"></i>
                                            <span>${field.displayName || field.name}</span>
                                        </div>
                                        <button onclick="window.tablesManager.hideColumn('${field.name}')" 
                                                class="text-red-600 hover:text-red-800">
                                            <i class="fas fa-eye-slash"></i>
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Hidden Columns -->
                        <div>
                            <h4 class="font-medium text-gray-900 mb-3">Скрытые колонки</h4>
                            <div id="hidden-columns" class="space-y-2 bg-gray-50 p-3 rounded min-h-32">
                                <div class="text-gray-500 text-center py-4">Нет скрытых колонок</div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t pt-4">
                        <h4 class="font-medium text-gray-900 mb-3">Действия</h4>
                        <div class="flex flex-wrap gap-3">
                            <button onclick="window.tablesManager.addNewColumn()" 
                                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                <i class="fas fa-plus mr-2"></i>Добавить колонку
                            </button>
                            <button onclick="window.tablesManager.resetColumnOrder()" 
                                    class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                                <i class="fas fa-undo mr-2"></i>Сбросить порядок
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Закрыть
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }
}

// Initialize tables manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tablesManager = new TablesManager();
});