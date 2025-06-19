// Dados dos produtos
const products = [
    {
        id: 1,
        title: "iPhone 14 Pro Max 256GB",
        price: 4999.99,
        category: "eletronicos",
        image: "https://via.placeholder.com/300x200/ff6600/ffffff?text=iPhone+14+Pro",
        description: "iPhone 14 Pro Max com 256GB, câmera profissional e tela Super Retina XDR."
    },
    {
        id: 2,
        title: "Notebook Dell Inspiron 15",
        price: 2899.99,
        category: "eletronicos",
        image: "https://via.placeholder.com/300x200/4a90e2/ffffff?text=Dell+Notebook",
        description: "Notebook Dell com processador Intel i7, 16GB RAM e SSD 512GB."
    },
    {
        id: 3,
        title: "Sofá 3 Lugares Reclinável",
        price: 1299.99,
        category: "casa",
        image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Sofá+Reclinável",
        description: "Sofá confortável de 3 lugares com função reclinável e tecido de alta qualidade."
    },
    {
        id: 4,
        title: "Tênis Nike Air Max",
        price: 299.99,
        category: "moda",
        image: "https://via.placeholder.com/300x200/ffc107/ffffff?text=Nike+Air+Max",
        description: "Tênis Nike Air Max para corrida e uso casual, com tecnologia de amortecimento."
    },
    {
        id: 5,
        title: "Bicicleta Mountain Bike",
        price: 899.99,
        category: "esportes",
        image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Mountain+Bike",
        description: "Bicicleta mountain bike com 21 marchas e suspensão dianteira."
    },
    {
        id: 6,
        title: "Smart TV 55\" 4K",
        price: 1999.99,
        category: "eletronicos",
        image: "https://via.placeholder.com/300x200/6610f2/ffffff?text=Smart+TV+4K",
        description: "Smart TV 55 polegadas com resolução 4K e sistema Android TV."
    },
    {
        id: 7,
        title: "Mesa de Jantar 6 Lugares",
        price: 799.99,
        category: "casa",
        image: "https://via.placeholder.com/300x200/fd7e14/ffffff?text=Mesa+Jantar",
        description: "Mesa de jantar em madeira maciça para 6 pessoas."
    },
    {
        id: 8,
        title: "Perfume Importado 100ml",
        price: 149.99,
        category: "moda",
        image: "https://via.placeholder.com/300x200/e83e8c/ffffff?text=Perfume+100ml",
        description: "Perfume importado masculino com fragrância marcante e duradoura."
    },
    {
        id: 9,
        title: "Kit Halteres 20kg",
        price: 199.99,
        category: "esportes",
        image: "https://via.placeholder.com/300x200/20c997/ffffff?text=Kit+Halteres",
        description: "Kit de halteres ajustáveis de 20kg para treino em casa."
    },
    {
        id: 10,
        title: "Honda Civic 2020",
        price: 89999.99,
        category: "veiculos",
        image: "https://via.placeholder.com/300x200/6f42c1/ffffff?text=Honda+Civic",
        description: "Honda Civic 2020, automático, completo, baixa quilometragem."
    }
];

// Variáveis globais
let filteredProducts = [...products];
let currentFilters = {
    search: '',
    category: '',
    price: ''
};

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const productsGrid = document.getElementById('productsGrid');
const resultsCount = document.getElementById('resultsCount');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setTimeout(() => {
        loadingState.style.display = 'none';
        displayProducts(filteredProducts);
        updateResultsCount();
    }, 1000); // Simula carregamento
}

function setupEventListeners() {
    // Filtros
    searchInput.addEventListener('input', handleSearch);
    categoryFilter.addEventListener('change', handleCategoryFilter);
    priceFilter.addEventListener('change', handlePriceFilter);
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Menu mobile
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navList.contains(event.target)) {
            navList.classList.remove('active');
        }
    });
    
    // Responsive: fechar menu ao redimensionar
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navList.classList.remove('active');
        }
    });
}

function handleSearch() {
    currentFilters.search = searchInput.value.toLowerCase().trim();
    applyFilters();
}

function handleCategoryFilter() {
    currentFilters.category = categoryFilter.value;
    applyFilters();
}

function handlePriceFilter() {
    currentFilters.price = priceFilter.value;
    applyFilters();
}

function applyFilters() {
    filteredProducts = products.filter(product => {
        // Filtro de busca
        const matchesSearch = !currentFilters.search || 
            product.title.toLowerCase().includes(currentFilters.search) ||
            product.description.toLowerCase().includes(currentFilters.search);
        
        // Filtro de categoria
        const matchesCategory = !currentFilters.category || 
            product.category === currentFilters.category;
        
        // Filtro de preço
        let matchesPrice = true;
        if (currentFilters.price) {
            const price = product.price;
            switch (currentFilters.price) {
                case '0-50':
                    matchesPrice = price <= 50;
                    break;
                case '50-100':
                    matchesPrice = price > 50 && price <= 100;
                    break;
                case '100-500':
                    matchesPrice = price > 100 && price <= 500;
                    break;
                case '500+':
                    matchesPrice = price > 500;
                    break;
            }
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    displayProducts(filteredProducts);
    updateResultsCount();
}

function displayProducts(products) {
    if (products.length === 0) {
        productsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    productsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Adicionar event listeners aos cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.addEventListener('click', () => showProductDetails(products[index]));
    });
}

function createProductCard(product) {
    const categoryNames = {
        'eletronicos': 'Eletrônicos',
        'casa': 'Casa e Jardim',
        'moda': 'Moda e Beleza',
        'esportes': 'Esportes',
        'veiculos': 'Veículos'
    };
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x200/f0f0f0/666666?text=Imagem+Indisponível'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <span class="product-category">${categoryNames[product.category] || product.category}</span>
            </div>
        </div>
    `;
}

function updateResultsCount() {
    const count = filteredProducts.length;
    const text = count === 1 ? 'produto encontrado' : 'produtos encontrados';
    resultsCount.textContent = `${count} ${text}`;
}

function clearAllFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    priceFilter.value = '';
    
    currentFilters = {
        search: '',
        category: '',
        price: ''
    };
    
    filteredProducts = [...products];
    displayProducts(filteredProducts);
    updateResultsCount();
}

function toggleMobileMenu() {
    navList.classList.toggle('active');
}

function showProductDetails(product) {
    const categoryNames = {
        'eletronicos': 'Eletrônicos',
        'casa': 'Casa e Jardim',
        'moda': 'Moda e Beleza',
        'esportes': 'Esportes',
        'veiculos': 'Veículos'
    };
    
    alert(`
🛍️ ${product.title}

💰 Preço: R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

📂 Categoria: ${categoryNames[product.category] || product.category}

📝 Descrição: ${product.description}

ℹ️ Para mais informações ou para comprar este produto, entre em contato conosco!
    `);
}

// Funções utilitárias
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce na busca para melhor performance
const debouncedSearch = debounce(handleSearch, 300);
searchInput.removeEventListener('input', handleSearch);
searchInput.addEventListener('input', debouncedSearch);
