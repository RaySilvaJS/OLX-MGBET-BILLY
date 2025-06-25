// ==========================================
// CENTRAL DE AJUDA OLX - JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSearchFunctionality();
    initializeFAQ();
    initializeContactForm();
    initializeCategoryFilters();
});

// ==========================================
// FUNCIONALIDADE DE BUSCA
// ==========================================
function initializeSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // Busca ao pressionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Busca ao clicar no botão
    searchBtn.addEventListener('click', performSearch);
    
    // Busca em tempo real (opcional)
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length > 2) {
            filterFAQs(query);
        } else {
            showAllFAQs();
        }
    });
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query.length === 0) {
        showMessage('Por favor, digite sua dúvida para buscar.', 'warning');
        return;
    }
    
    // Filtrar FAQs com base na busca
    filterFAQs(query);
    
    // Scroll para a seção de FAQs
    document.getElementById('faqSection').scrollIntoView({
        behavior: 'smooth'
    });
    
    // Se não encontrar resultados, mostrar formulário de contato
    setTimeout(() => {
        const visibleFAQs = document.querySelectorAll('.faq-item:not([style*="display: none"])');
        if (visibleFAQs.length === 0) {
            showMessage('Não encontramos respostas para sua busca. Que tal enviar sua dúvida diretamente?', 'info');
            document.querySelector('.contact-section').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Preencher automaticamente o campo de mensagem
            const messageField = document.getElementById('message');
            if (messageField.value === '') {
                messageField.value = `Gostaria de saber sobre: ${searchInput.value}`;
                messageField.focus();
            }
        }
    }, 100);
}

function filterFAQs(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    let foundResults = false;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(query) || answer.includes(query)) {
            item.style.display = 'block';
            foundResults = true;
            
            // Destacar texto encontrado
            highlightText(item, query);
        } else {
            item.style.display = 'none';
        }
    });
    
    return foundResults;
}

function showAllFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.style.display = 'block';
        removeHighlight(item);
    });
}

function highlightText(element, query) {
    // Remove highlight anterior
    removeHighlight(element);
    
    const questionSpan = element.querySelector('.faq-question span');
    const answerP = element.querySelector('.faq-answer p');
    
    [questionSpan, answerP].forEach(el => {
        if (el) {
            const regex = new RegExp(`(${query})`, 'gi');
            el.innerHTML = el.textContent.replace(regex, '<mark>$1</mark>');
        }
    });
}

function removeHighlight(element) {
    const marked = element.querySelectorAll('mark');
    marked.forEach(mark => {
        mark.outerHTML = mark.innerHTML;
    });
}

// ==========================================
// FUNCIONALIDADE FAQ
// ==========================================
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFaq(this);
        });
    });
}

function toggleFaq(questionElement) {
    const faqItem = questionElement.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = questionElement.querySelector('i');
    
    // Fechar outras FAQs abertas (opcional)
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(item => {
        if (item !== faqItem) {
            const otherAnswer = item.querySelector('.faq-answer');
            const otherQuestion = item.querySelector('.faq-question');
            const otherIcon = item.querySelector('.faq-question i');
            
            otherAnswer.classList.remove('active');
            otherQuestion.classList.remove('active');
        }
    });
    
    // Toggle da FAQ atual
    answer.classList.toggle('active');
    questionElement.classList.toggle('active');
}

// ==========================================
// FILTROS DE CATEGORIA
// ==========================================
function initializeCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('onclick').match(/'(.+)'/)[1];
            showCategory(category);
        });
    });
}

function showCategory(category) {
    const categoryQuestions = {
        'comprar': ['como funciona o olx pay', 'cancelar uma compra', 'pagamento'],
        'vender': ['anúncio não aparece', 'criar anúncio', 'vendas'],
        'conta': ['perfil', 'configurações', 'senha', 'conta'],
        'seguranca': ['denunciar', 'golpes', 'segurança', 'fraude']
    };
    
    const keywords = categoryQuestions[category] || [];
    
    if (keywords.length > 0) {
        // Simular busca por categoria
        const searchQuery = keywords[0];
        document.getElementById('searchInput').value = searchQuery;
        filterFAQs(searchQuery);
        
        // Scroll para FAQs
        document.getElementById('faqSection').scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// ==========================================
// FORMULÁRIO DE CONTATO
// ==========================================
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactSubmit();
    });
    
    // Máscara para telefone
    const phoneInput = document.getElementById('userPhone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length > 5) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else {
            value = value.replace(/^(\d*)/, '$1');
        }
        
        e.target.value = value;
    });
}

async function handleContactSubmit() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Coletar dados do formulário
    const formData = {
        nome: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        telefone: document.getElementById('userPhone').value,
        categoria: document.getElementById('category').value,
        mensagem: document.getElementById('message').value
    };
    
    // Validar dados
    if (!validateForm(formData)) {
        return;
    }
    
    // Mostrar loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        // Enviar para o backend
        const response = await fetch('/api/enviar-duvida-ajuda', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Mostrar modal de sucesso
            showSuccessModal();
            
            // Limpar formulário
            form.reset();
            
            // Analytics/tracking (opcional)
            trackContactSubmission(formData.categoria);
            
        } else {
            throw new Error(result.message || 'Erro ao enviar mensagem');
        }
        
    } catch (error) {
        console.error('Erro ao enviar dúvida:', error);
        showMessage('Erro ao enviar sua dúvida. Tente novamente em alguns minutos.', 'error');
    } finally {
        // Restaurar botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
    }
}

function validateForm(data) {
    const errors = [];
    
    if (!data.nome.trim()) {
        errors.push('Nome é obrigatório');
    }
    
    if (!data.email.trim() || !isValidEmail(data.email)) {
        errors.push('E-mail válido é obrigatório');
    }
    
    if (!data.categoria) {
        errors.push('Selecione uma categoria');
    }
    
    if (!data.mensagem.trim() || data.mensagem.trim().length < 10) {
        errors.push('Descreva sua dúvida com pelo menos 10 caracteres');
    }
    
    if (errors.length > 0) {
        showMessage(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==========================================
// MODAL E MENSAGENS
// ==========================================
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

function showMessage(message, type = 'info') {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.alert-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-message alert-${type}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${getIconForType(type)}"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Adicionar estilos se não existirem
    if (!document.querySelector('#alert-styles')) {
        const style = document.createElement('style');
        style.id = 'alert-styles';
        style.textContent = `
            .alert-message {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 400px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease;
            }
            .alert-content {
                padding: 15px 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                color: white;
            }
            .alert-info .alert-content { background: #17a2b8; }
            .alert-success .alert-content { background: #28a745; }
            .alert-warning .alert-content { background: #ffc107; color: #333; }
            .alert-error .alert-content { background: #dc3545; }
            .alert-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            .alert-close:hover { opacity: 1; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(alertDiv);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

function getIconForType(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'exclamation-circle'
    };
    return icons[type] || 'info-circle';
}

// ==========================================
// ANALYTICS E TRACKING
// ==========================================
function trackContactSubmission(category) {
    // Implementar tracking de analytics se necessário
    console.log('Dúvida enviada - Categoria:', category);
    
    // Exemplo com Google Analytics (descomente se usar GA)
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'contact_form_submit', {
    //         'event_category': 'Central de Ajuda',
    //         'event_label': category
    //     });
    // }
}

// ==========================================
// FUNCIONALIDADES ADICIONAIS
// ==========================================

// Scroll suave para links internos
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Lazy loading para imagens (se necessário)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Detectar modo escuro do sistema (opcional)
function detectDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }
}

// Inicializar funcionalidades adicionais
document.addEventListener('DOMContentLoaded', function() {
    // initializeLazyLoading();
    // detectDarkMode();
});

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K para focar na busca
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // ESC para fechar modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ==========================================
// SERVICE WORKER (Para PWA - opcional)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(registrationError => console.log('SW registration failed'));
    });
}
