// TableFlow - Templates Manager
class TemplatesManager {
    constructor() {
        this.templates = [
            {
                id: 'warehouse',
                name: 'Склад товаров',
                description: 'Управление складскими остатками и товарами',
                icon: 'fas fa-warehouse',
                category: 'Логистика',
                schema: [
                    { name: 'id', displayName: 'ID', type: 'text', required: true, system: true },
                    { name: 'product_code', displayName: 'Код товара', type: 'text', required: true },
                    { name: 'product_name', displayName: 'Название товара', type: 'text', required: true },
                    { name: 'category', displayName: 'Категория', type: 'text', required: false },
                    { name: 'quantity', displayName: 'Количество', type: 'number', required: true },
                    { name: 'unit', displayName: 'Единица измерения', type: 'text', required: false },
                    { name: 'purchase_price', displayName: 'Цена закупки', type: 'number', required: false },
                    { name: 'sale_price', displayName: 'Цена продажи', type: 'number', required: false },
                    { name: 'supplier', displayName: 'Поставщик', type: 'text', required: false },
                    { name: 'location', displayName: 'Место хранения', type: 'text', required: false },
                    { name: 'expiry_date', displayName: 'Срок годности', type: 'date', required: false },
                    { name: 'last_updated', displayName: 'Последнее обновление', type: 'datetime', required: false }
                ],
                sampleData: [
                    {
                        id: 'wh_001',
                        product_code: 'PROD-001',
                        product_name: 'Ноутбук ASUS X515',
                        category: 'Электроника',
                        quantity: 25,
                        unit: 'шт.',
                        purchase_price: 35000,
                        sale_price: 42000,
                        supplier: 'ТехПоставка',
                        location: 'A-1-15',
                        expiry_date: null,
                        last_updated: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: 'wh_002',
                        product_code: 'PROD-002',
                        product_name: 'Мышь Logitech M705',
                        category: 'Периферия',
                        quantity: 150,
                        unit: 'шт.',
                        purchase_price: 2500,
                        sale_price: 3200,
                        supplier: 'КомТех',
                        location: 'B-2-08',
                        expiry_date: null,
                        last_updated: '2024-01-14T16:45:00Z'
                    },
                    {
                        id: 'wh_003',
                        product_code: 'FOOD-001',
                        product_name: 'Печенье "Юбилейное"',
                        category: 'Продукты питания',
                        quantity: 200,
                        unit: 'упак.',
                        purchase_price: 85,
                        sale_price: 120,
                        supplier: 'АгроТорг',
                        location: 'C-1-03',
                        expiry_date: '2024-06-15',
                        last_updated: '2024-01-10T09:20:00Z'
                    }
                ]
            },
            {
                id: 'orders',
                name: 'Заказы',
                description: 'Система управления заказами клиентов',
                icon: 'fas fa-shopping-cart',
                category: 'Продажи',
                schema: [
                    { name: 'id', displayName: 'ID', type: 'text', required: true, system: true },
                    { name: 'order_number', displayName: 'Номер заказа', type: 'text', required: true },
                    { name: 'customer_name', displayName: 'Имя клиента', type: 'text', required: true },
                    { name: 'customer_email', displayName: 'Email клиента', type: 'text', required: false },
                    { name: 'customer_phone', displayName: 'Телефон клиента', type: 'text', required: false },
                    { name: 'order_date', displayName: 'Дата заказа', type: 'datetime', required: true },
                    { name: 'delivery_date', displayName: 'Дата доставки', type: 'date', required: false },
                    { name: 'status', displayName: 'Статус', type: 'text', required: true },
                    { name: 'payment_status', displayName: 'Статус оплаты', type: 'text', required: true },
                    { name: 'total_amount', displayName: 'Сумма заказа', type: 'number', required: true },
                    { name: 'delivery_address', displayName: 'Адрес доставки', type: 'rich_text', required: false },
                    { name: 'notes', displayName: 'Примечания', type: 'rich_text', required: false },
                    { name: 'is_urgent', displayName: 'Срочный заказ', type: 'bool', required: false }
                ],
                sampleData: [
                    {
                        id: 'ord_001',
                        order_number: 'ORD-2024-001',
                        customer_name: 'Иван Петров',
                        customer_email: 'ivan.petrov@email.com',
                        customer_phone: '+7 912 345-67-89',
                        order_date: '2024-01-15T14:30:00Z',
                        delivery_date: '2024-01-18',
                        status: 'В обработке',
                        payment_status: 'Оплачено',
                        total_amount: 15600,
                        delivery_address: 'г. Москва, ул. Тверская, д. 12, кв. 45',
                        notes: 'Доставить после 18:00',
                        is_urgent: false
                    },
                    {
                        id: 'ord_002',
                        order_number: 'ORD-2024-002',
                        customer_name: 'Анна Сидорова',
                        customer_email: 'anna.sidorova@company.ru',
                        customer_phone: '+7 905 123-45-67',
                        order_date: '2024-01-16T10:15:00Z',
                        delivery_date: '2024-01-17',
                        status: 'Готов к отправке',
                        payment_status: 'Ожидает оплаты',
                        total_amount: 8900,
                        delivery_address: 'г. СПб, Невский пр-т, д. 85, офис 12',
                        notes: 'Корпоративный заказ',
                        is_urgent: true
                    },
                    {
                        id: 'ord_003',
                        order_number: 'ORD-2024-003',
                        customer_name: 'Михаил Козлов',
                        customer_email: null,
                        customer_phone: '+7 903 987-65-43',
                        order_date: '2024-01-16T16:45:00Z',
                        delivery_date: '2024-01-20',
                        status: 'Новый',
                        payment_status: 'Не оплачено',
                        total_amount: 4250,
                        delivery_address: 'г. Казань, ул. Баумана, д. 58, кв. 12',
                        notes: '',
                        is_urgent: false
                    }
                ]
            },
            {
                id: 'contacts',
                name: 'Контакты',
                description: 'База данных контактов и клиентов',
                icon: 'fas fa-address-book',
                category: 'CRM',
                schema: [
                    { name: 'id', displayName: 'ID', type: 'text', required: true, system: true },
                    { name: 'first_name', displayName: 'Имя', type: 'text', required: true },
                    { name: 'last_name', displayName: 'Фамилия', type: 'text', required: true },
                    { name: 'middle_name', displayName: 'Отчество', type: 'text', required: false },
                    { name: 'company', displayName: 'Компания', type: 'text', required: false },
                    { name: 'position', displayName: 'Должность', type: 'text', required: false },
                    { name: 'email', displayName: 'Email', type: 'text', required: false },
                    { name: 'phone', displayName: 'Телефон', type: 'text', required: false },
                    { name: 'mobile', displayName: 'Мобильный', type: 'text', required: false },
                    { name: 'address', displayName: 'Адрес', type: 'rich_text', required: false },
                    { name: 'birthday', displayName: 'День рождения', type: 'date', required: false },
                    { name: 'category', displayName: 'Категория', type: 'text', required: false },
                    { name: 'is_client', displayName: 'Клиент', type: 'bool', required: false },
                    { name: 'notes', displayName: 'Заметки', type: 'rich_text', required: false },
                    { name: 'created_date', displayName: 'Дата создания', type: 'datetime', required: false }
                ],
                sampleData: [
                    {
                        id: 'cnt_001',
                        first_name: 'Алексей',
                        last_name: 'Смирнов',
                        middle_name: 'Владимирович',
                        company: 'ИТ Решения',
                        position: 'Директор по продажам',
                        email: 'a.smirnov@itresheniya.ru',
                        phone: '+7 495 123-45-67',
                        mobile: '+7 916 234-56-78',
                        address: 'г. Москва, Красная площадь, д. 1, стр. 1',
                        birthday: '1985-03-15',
                        category: 'VIP клиент',
                        is_client: true,
                        notes: 'Постоянный клиент, предпочитает звонки утром',
                        created_date: '2023-12-01T09:00:00Z'
                    },
                    {
                        id: 'cnt_002',
                        first_name: 'Мария',
                        last_name: 'Волкова',
                        middle_name: 'Сергеевна',
                        company: 'Стройинвест',
                        position: 'Закупщик',
                        email: 'maria.volkova@stroyinvest.com',
                        phone: '+7 812 987-65-43',
                        mobile: '+7 921 345-67-89',
                        address: 'г. Санкт-Петербург, Дворцовая набережная, д. 18',
                        birthday: '1990-07-22',
                        category: 'Корпоративный клиент',
                        is_client: true,
                        notes: 'Заинтересована в оптовых поставках',
                        created_date: '2024-01-05T14:30:00Z'
                    },
                    {
                        id: 'cnt_003',
                        first_name: 'Дмитрий',
                        last_name: 'Новиков',
                        middle_name: 'Андреевич',
                        company: null,
                        position: null,
                        email: 'dmitry.novikov@gmail.com',
                        phone: null,
                        mobile: '+7 903 111-22-33',
                        address: 'г. Екатеринбург, пр. Ленина, д. 45',
                        birthday: '1988-11-10',
                        category: 'Потенциальный клиент',
                        is_client: false,
                        notes: 'Обратился по рекламе, интересуется услугами',
                        created_date: '2024-01-10T11:20:00Z'
                    }
                ]
            },
            {
                id: 'employees',
                name: 'Сотрудники',
                description: 'База данных сотрудников компании',
                icon: 'fas fa-users',
                category: 'HR',
                schema: [
                    { name: 'id', displayName: 'ID', type: 'text', required: true, system: true },
                    { name: 'employee_id', displayName: 'Табельный номер', type: 'text', required: true },
                    { name: 'full_name', displayName: 'ФИО', type: 'text', required: true },
                    { name: 'department', displayName: 'Отдел', type: 'text', required: true },
                    { name: 'position', displayName: 'Должность', type: 'text', required: true },
                    { name: 'hire_date', displayName: 'Дата найма', type: 'date', required: true },
                    { name: 'salary', displayName: 'Зарплата', type: 'number', required: false },
                    { name: 'email', displayName: 'Email', type: 'text', required: false },
                    { name: 'phone', displayName: 'Телефон', type: 'text', required: false },
                    { name: 'manager', displayName: 'Руководитель', type: 'text', required: false },
                    { name: 'is_active', displayName: 'Активен', type: 'bool', required: true },
                    { name: 'contract_type', displayName: 'Тип договора', type: 'text', required: false }
                ],
                sampleData: [
                    {
                        id: 'emp_001',
                        employee_id: 'EMP-001',
                        full_name: 'Петров Иван Сергеевич',
                        department: 'IT',
                        position: 'Разработчик',
                        hire_date: '2022-03-01',
                        salary: 120000,
                        email: 'i.petrov@company.ru',
                        phone: '+7 916 123-45-67',
                        manager: 'Смирнов А.В.',
                        is_active: true,
                        contract_type: 'Трудовой договор'
                    },
                    {
                        id: 'emp_002',
                        employee_id: 'EMP-002',
                        full_name: 'Сидорова Анна Михайловна',
                        department: 'Продажи',
                        position: 'Менеджер по продажам',
                        hire_date: '2023-06-15',
                        salary: 85000,
                        email: 'a.sidorova@company.ru',
                        phone: '+7 905 987-65-43',
                        manager: 'Козлов П.И.',
                        is_active: true,
                        contract_type: 'Трудовой договор'
                    }
                ]
            },
            {
                id: 'tasks',
                name: 'Задачи',
                description: 'Система управления задачами и проектами',
                icon: 'fas fa-tasks',
                category: 'Управление',
                schema: [
                    { name: 'id', displayName: 'ID', type: 'text', required: true, system: true },
                    { name: 'task_title', displayName: 'Название задачи', type: 'text', required: true },
                    { name: 'description', displayName: 'Описание', type: 'rich_text', required: false },
                    { name: 'project', displayName: 'Проект', type: 'text', required: false },
                    { name: 'assignee', displayName: 'Исполнитель', type: 'text', required: false },
                    { name: 'priority', displayName: 'Приоритет', type: 'text', required: true },
                    { name: 'status', displayName: 'Статус', type: 'text', required: true },
                    { name: 'created_date', displayName: 'Дата создания', type: 'datetime', required: true },
                    { name: 'due_date', displayName: 'Срок выполнения', type: 'datetime', required: false },
                    { name: 'completed_date', displayName: 'Дата завершения', type: 'datetime', required: false },
                    { name: 'estimated_hours', displayName: 'Оценка (часы)', type: 'number', required: false },
                    { name: 'actual_hours', displayName: 'Фактически (часы)', type: 'number', required: false }
                ],
                sampleData: [
                    {
                        id: 'tsk_001',
                        task_title: 'Разработать систему авторизации',
                        description: 'Реализовать систему входа пользователей с проверкой прав доступа',
                        project: 'CRM система',
                        assignee: 'Петров И.С.',
                        priority: 'Высокий',
                        status: 'В работе',
                        created_date: '2024-01-10T09:00:00Z',
                        due_date: '2024-01-20T18:00:00Z',
                        completed_date: null,
                        estimated_hours: 40,
                        actual_hours: 25
                    },
                    {
                        id: 'tsk_002',
                        task_title: 'Провести тестирование модуля отчетов',
                        description: 'Протестировать все функции генерации отчетов',
                        project: 'CRM система',
                        assignee: 'Сидорова А.М.',
                        priority: 'Средний',
                        status: 'Готово',
                        created_date: '2024-01-08T14:00:00Z',
                        due_date: '2024-01-15T17:00:00Z',
                        completed_date: '2024-01-14T16:30:00Z',
                        estimated_hours: 16,
                        actual_hours: 18
                    }
                ]
            },
            {
                id: 'inventory',
                name: 'Инвентарь',
                description: 'Учет оборудования и инвентаря',
                icon: 'fas fa-laptop',
                category: 'Учет',
                schema: [
                    { name: 'id', displayName: 'ID', type: 'text', required: true, system: true },
                    { name: 'inventory_number', displayName: 'Инвентарный номер', type: 'text', required: true },
                    { name: 'item_name', displayName: 'Название', type: 'text', required: true },
                    { name: 'category', displayName: 'Категория', type: 'text', required: true },
                    { name: 'brand', displayName: 'Бренд', type: 'text', required: false },
                    { name: 'model', displayName: 'Модель', type: 'text', required: false },
                    { name: 'serial_number', displayName: 'Серийный номер', type: 'text', required: false },
                    { name: 'purchase_date', displayName: 'Дата покупки', type: 'date', required: false },
                    { name: 'purchase_price', displayName: 'Цена покупки', type: 'number', required: false },
                    { name: 'current_user', displayName: 'Текущий пользователь', type: 'text', required: false },
                    { name: 'location', displayName: 'Местоположение', type: 'text', required: false },
                    { name: 'condition', displayName: 'Состояние', type: 'text', required: true },
                    { name: 'warranty_until', displayName: 'Гарантия до', type: 'date', required: false }
                ],
                sampleData: [
                    {
                        id: 'inv_001',
                        inventory_number: 'INV-001',
                        item_name: 'Ноутбук рабочий',
                        category: 'Компьютерная техника',
                        brand: 'Lenovo',
                        model: 'ThinkPad E15',
                        serial_number: 'PC123456',
                        purchase_date: '2023-05-15',
                        purchase_price: 65000,
                        current_user: 'Петров И.С.',
                        location: 'Офис 201',
                        condition: 'Хорошее',
                        warranty_until: '2025-05-15'
                    },
                    {
                        id: 'inv_002',
                        inventory_number: 'INV-002',
                        item_name: 'Принтер лазерный',
                        category: 'Офисная техника',
                        brand: 'HP',
                        model: 'LaserJet Pro M404n',
                        serial_number: 'PR789012',
                        purchase_date: '2023-08-10',
                        purchase_price: 25000,
                        current_user: null,
                        location: 'Общий офис',
                        condition: 'Отличное',
                        warranty_until: '2025-08-10'
                    }
                ]
            }
        ];
    }

    renderTemplates() {
        const container = document.getElementById('templates-grid');
        if (!container) return;

        // Group templates by category
        const categorizedTemplates = this.templates.reduce((acc, template) => {
            const category = template.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(template);
            return acc;
        }, {});

        container.innerHTML = `
            ${Object.entries(categorizedTemplates).map(([category, templates]) => `
                <div class="col-span-full mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">${category}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${templates.map(template => this.renderTemplateCard(template)).join('')}
                    </div>
                </div>
            `).join('')}
            
            <div class="col-span-full">
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div class="flex items-center mb-4">
                        <div class="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <i class="fas fa-lightbulb"></i>
                        </div>
                        <div class="ml-4">
                            <h3 class="text-lg font-semibold text-gray-900">Не нашли подходящий шаблон?</h3>
                            <p class="text-gray-600">Создайте собственную таблицу, импортировав данные из Excel или CSV файла</p>
                        </div>
                    </div>
                    <button onclick="window.app.openImportModal()" 
                            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        <i class="fas fa-file-upload mr-2"></i>
                        Импортировать из файла
                    </button>
                </div>
            </div>
        `;
    }

    renderTemplateCard(template) {
        return `
            <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                    <div class="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <i class="${template.icon}"></i>
                    </div>
                    <div class="ml-3">
                        <h4 class="font-semibold text-gray-900">${template.name}</h4>
                        <p class="text-sm text-gray-500">${template.category}</p>
                    </div>
                </div>
                
                <p class="text-gray-600 text-sm mb-4">${template.description}</p>
                
                <div class="space-y-3 mb-4">
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-500">Полей:</span>
                        <span class="font-medium">${template.schema.filter(f => !f.system).length}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-500">Примеров данных:</span>
                        <span class="font-medium">${template.sampleData?.length || 0}</span>
                    </div>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="text-xs text-gray-500 mb-1">Основные поля:</div>
                    <div class="flex flex-wrap gap-1">
                        ${template.schema.filter(f => !f.system).slice(0, 4).map(field => `
                            <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                ${field.displayName}
                            </span>
                        `).join('')}
                        ${template.schema.filter(f => !f.system).length > 4 ? 
                            `<span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                +${template.schema.filter(f => !f.system).length - 4}
                            </span>` : ''}
                    </div>
                </div>

                <div class="flex space-x-2">
                    <button onclick="window.templatesManager.previewTemplate('${template.id}')" 
                            class="flex-1 bg-gray-100 text-gray-700 px-3 py-2 text-sm rounded hover:bg-gray-200 transition-colors">
                        <i class="fas fa-eye mr-1"></i>
                        Предпросмотр
                    </button>
                    <button onclick="window.templatesManager.createFromTemplate('${template.id}')" 
                            class="flex-1 bg-blue-600 text-white px-3 py-2 text-sm rounded hover:bg-blue-700 transition-colors">
                        <i class="fas fa-plus mr-1"></i>
                        Создать
                    </button>
                </div>
            </div>
        `;
    }

    previewTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-4">
                        <div class="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <i class="${template.icon}"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900">${template.name}</h3>
                            <p class="text-gray-600">${template.description}</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Schema -->
                    <div>
                        <h4 class="text-lg font-medium text-gray-900 mb-4">Структура таблицы</h4>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="space-y-3 max-h-96 overflow-y-auto">
                                ${template.schema.filter(f => !f.system).map(field => `
                                    <div class="flex items-center justify-between p-3 bg-white rounded border">
                                        <div>
                                            <div class="font-medium text-gray-900">${field.displayName || field.name}</div>
                                            <div class="text-sm text-gray-500">${field.name}</div>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                                ${field.type}
                                            </span>
                                            ${field.required ? 
                                                '<i class="fas fa-asterisk text-red-500 text-xs" title="Обязательное поле"></i>' : 
                                                '<i class="fas fa-question-circle text-gray-400 text-xs" title="Необязательное поле"></i>'
                                            }
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Sample Data -->
                    <div>
                        <h4 class="text-lg font-medium text-gray-900 mb-4">Примеры данных</h4>
                        <div class="bg-gray-50 rounded-lg p-4">
                            ${template.sampleData && template.sampleData.length > 0 ? `
                                <div class="overflow-x-auto max-h-96">
                                    <table class="min-w-full text-xs">
                                        <thead class="bg-gray-100 sticky top-0">
                                            <tr>
                                                ${template.schema.filter(f => !f.system).slice(0, 4).map(field => `
                                                    <th class="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                        ${field.displayName}
                                                    </th>
                                                `).join('')}
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white">
                                            ${template.sampleData.slice(0, 5).map(row => `
                                                <tr class="border-t">
                                                    ${template.schema.filter(f => !f.system).slice(0, 4).map(field => `
                                                        <td class="px-2 py-2 text-gray-900">
                                                            ${this.formatSampleValue(row[field.name], field.type)}
                                                        </td>
                                                    `).join('')}
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                    ${template.sampleData.length > 5 ? `
                                        <div class="text-center text-xs text-gray-500 mt-2">
                                            И еще ${template.sampleData.length - 5} записей...
                                        </div>
                                    ` : ''}
                                </div>
                            ` : `
                                <div class="text-center py-8 text-gray-500">
                                    <i class="fas fa-inbox text-2xl mb-2"></i>
                                    <p>Примеры данных не предоставлены</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-6 border-t">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                        Закрыть
                    </button>
                    <button onclick="window.templatesManager.createFromTemplate('${template.id}'); this.closest('.fixed').remove();" 
                            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        <i class="fas fa-plus mr-2"></i>Создать таблицу
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    formatSampleValue(value, type) {
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
                const str = String(value);
                return str.length > 20 ? str.substring(0, 20) + '...' : str;
        }
    }

    createFromTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template || !window.app) return;

        // Create new table based on template
        const table = {
            id: Date.now().toString(),
            name: template.name,
            description: template.description,
            schema: [...template.schema], // Deep copy of schema
            data: template.sampleData ? template.sampleData.map((row, index) => ({
                ...row,
                id: `${template.id}_${Date.now()}_${index}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })) : [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            permission: 'owner',
            template: template.id
        };

        // Save table
        window.app.tables.push(table);
        window.app.saveData();
        window.app.addToHistory('create_template', `Создана таблица "${template.name}" на основе шаблона`);
        
        window.app.showToast(`Таблица "${template.name}" создана с ${table.data.length} примерами записей!`);
        
        // Navigate to the new table
        window.app.showSection('tables');
        
        // Optionally open the table immediately
        setTimeout(() => {
            window.app.openTable(table.id);
        }, 500);
    }

    // Custom template creator
    showCustomTemplateModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50';
        
        modal.innerHTML = `
            <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 shadow-lg rounded-md bg-white">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Создать пользовательский шаблон</h3>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form id="custom-template-form" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Название шаблона</label>
                            <input type="text" name="name" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                            <input type="text" name="category" 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                        <textarea name="description" rows="2" 
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">Поля таблицы</label>
                        <div id="custom-fields" class="space-y-3">
                            <div class="field-row flex items-center space-x-3 p-3 border rounded">
                                <input type="text" placeholder="Название поля" 
                                       class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                                <select class="px-2 py-1 border border-gray-300 rounded text-sm">
                                    <option value="text">Текст</option>
                                    <option value="number">Число</option>
                                    <option value="date">Дата</option>
                                    <option value="bool">Да/Нет</option>
                                    <option value="rich_text">Длинный текст</option>
                                </select>
                                <label class="flex items-center">
                                    <input type="checkbox" class="mr-1">
                                    <span class="text-sm">Обязательное</span>
                                </label>
                                <button type="button" onclick="this.closest('.field-row').remove()" 
                                        class="text-red-600 hover:text-red-800">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" onclick="window.templatesManager.addCustomField()" 
                                class="mt-3 bg-gray-100 text-gray-700 px-3 py-2 text-sm rounded hover:bg-gray-200">
                            <i class="fas fa-plus mr-1"></i>Добавить поле
                        </button>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4 border-t">
                        <button type="button" onclick="this.closest('.fixed').remove()" 
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Отмена
                        </button>
                        <button type="submit" 
                                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            Создать шаблон
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('custom-template-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createCustomTemplate(modal);
        });
    }

    addCustomField() {
        const container = document.getElementById('custom-fields');
        if (!container) return;

        const fieldRow = document.createElement('div');
        fieldRow.className = 'field-row flex items-center space-x-3 p-3 border rounded';
        fieldRow.innerHTML = `
            <input type="text" placeholder="Название поля" 
                   class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
            <select class="px-2 py-1 border border-gray-300 rounded text-sm">
                <option value="text">Текст</option>
                <option value="number">Число</option>
                <option value="date">Дата</option>
                <option value="bool">Да/Нет</option>
                <option value="rich_text">Длинный текст</option>
            </select>
            <label class="flex items-center">
                <input type="checkbox" class="mr-1">
                <span class="text-sm">Обязательное</span>
            </label>
            <button type="button" onclick="this.closest('.field-row').remove()" 
                    class="text-red-600 hover:text-red-800">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(fieldRow);
    }

    createCustomTemplate(modal) {
        const formData = new FormData(document.getElementById('custom-template-form'));
        
        // Collect field data
        const fieldRows = document.querySelectorAll('.field-row');
        const schema = [
            { name: 'id', displayName: 'ID', type: 'text', required: true, system: true }
        ];

        fieldRows.forEach(row => {
            const nameInput = row.querySelector('input[type="text"]');
            const typeSelect = row.querySelector('select');
            const requiredCheckbox = row.querySelector('input[type="checkbox"]');

            if (nameInput.value.trim()) {
                schema.push({
                    name: this.sanitizeFieldName(nameInput.value),
                    displayName: nameInput.value.trim(),
                    type: typeSelect.value,
                    required: requiredCheckbox.checked
                });
            }
        });

        if (schema.length < 2) {
            window.app?.showToast('Добавьте хотя бы одно поле', 'error');
            return;
        }

        // Create template
        const template = {
            id: `custom_${Date.now()}`,
            name: formData.get('name'),
            description: formData.get('description') || 'Пользовательский шаблон',
            icon: 'fas fa-table',
            category: formData.get('category') || 'Пользовательские',
            schema: schema,
            sampleData: [],
            custom: true
        };

        // Add to templates (could be saved to localStorage for persistence)
        this.templates.push(template);
        
        window.app?.showToast(`Шаблон "${template.name}" создан!`);
        modal.remove();
        
        // Re-render templates
        this.renderTemplates();
    }

    sanitizeFieldName(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9а-яё]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    }
}

// Initialize templates manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.templatesManager = new TemplatesManager();
});