# Central de Ajuda OLX

Uma página completa de Central de Ajuda inspirada no design e cores oficiais da OLX, com funcionalidade de envio de dúvidas via WhatsApp.

## 🎯 Funcionalidades

### ✨ Design e Interface
- **Design autêntico OLX**: Cores roxas (#7C2CBF) e laranjas (#FF8500) oficiais
- **Layout responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Animações suaves**: Transições e efeitos visuais modernos
- **Interface intuitiva**: Navegação fácil e experiência do usuário otimizada

### 🔍 Sistema de Busca
- **Busca em tempo real**: Filtra as FAQs conforme o usuário digita
- **Busca inteligente**: Procura tanto nas perguntas quanto nas respostas
- **Destaque de resultados**: Marca os termos encontrados
- **Scroll automático**: Leva o usuário direto aos resultados

### ❓ FAQ Dinâmico
- **Perguntas frequentes organizadas**: Categorizadas por temas
- **Expansão/colapso**: Sistema accordion responsivo
- **Filtros por categoria**: Comprar, Vender, Conta, Segurança
- **Respostas detalhadas**: Informações completas para cada dúvida

### 📧 Formulário de Contato
- **Integração WhatsApp**: Envia dúvidas diretamente para seu WhatsApp
- **Validação completa**: Campos obrigatórios e validação de email
- **Categorização**: Organiza as dúvidas por tipo
- **Feedback visual**: Modais de sucesso e mensagens de erro

### 📱 Ações Rápidas
- **Chat online**: Link para chat em tempo real
- **Telefone**: Número de contato direto
- **WhatsApp**: Redirecionamento para WhatsApp
- **E-mail**: Contato via email

## 🚀 Como Usar

### 1. Acessar a página
```
http://localhost:3000/pag/central-ajuda.html
```

### 2. Buscar uma dúvida
- Digite sua dúvida na barra de pesquisa
- Use palavras-chave como "pagamento", "anúncio", "conta"
- Os resultados são filtrados automaticamente

### 3. Explorar categorias
- Clique em uma das 4 categorias principais:
  - **Comprar no OLX**: Dúvidas sobre compras e pagamentos
  - **Vender no OLX**: Como criar anúncios e gerenciar vendas
  - **Minha Conta**: Perfil e configurações
  - **Segurança**: Como se proteger de golpes

### 4. Enviar uma dúvida
Se não encontrar a resposta:
1. Role até a seção "Não encontrou o que procurava?"
2. Preencha o formulário com seus dados
3. Selecione a categoria da sua dúvida
4. Descreva detalhadamente o problema
5. Clique em "Enviar Mensagem"
6. Sua dúvida será enviada via WhatsApp para o administrador

## 🛠️ Configuração Técnica

### Arquivos criados:
- `public/pag/central-ajuda.html` - Página principal
- `public/css/central-ajuda.css` - Estilos CSS
- `public/js/central-ajuda.js` - Funcionalidades JavaScript

### Endpoint adicionado:
- `POST /api/enviar-duvida-ajuda` - Processa e envia dúvidas via WhatsApp

### Dependências:
Utiliza as dependências já existentes do projeto:
- Express.js para o servidor
- Baileys para integração WhatsApp
- CSS e JavaScript puros (sem frameworks externos)

## 📋 Formato da Mensagem WhatsApp

Quando um usuário envia uma dúvida, a mensagem chegará no WhatsApp formatada assim:

```
🆘 NOVA DÚVIDA - CENTRAL DE AJUDA

📅 Data: 25/06/2025 14:30:15

👤 DADOS DO CLIENTE:
• Nome: João Silva
• E-mail: joao@email.com
• Telefone: (11) 99999-9999

📂 CATEGORIA: PAGAMENTO

💬 DÚVIDA/MENSAGEM:
Como funciona o estorno do OLX Pay? Fiz uma compra mas o vendedor não entregou o produto.

---
Enviado automaticamente pela Central de Ajuda OLX
```

## 🎨 Personalizações

### Cores (já configuradas com as cores OLX):
- **Roxo principal**: #7C2CBF
- **Laranja**: #FF8500
- **Branco**: #FFFFFF
- **Cinza claro**: #F8F9FA

### Modificar categorias:
Edite o arquivo `central-ajuda.js` na seção `categoryQuestions` para adicionar/remover categorias.

### Alterar FAQs:
Modifique o HTML da seção `.faq-container` para adicionar novas perguntas e respostas.

### Personalizar campos do formulário:
Ajuste os campos no HTML e a validação no JavaScript conforme necessário.

## 📱 Responsividade

A página se adapta automaticamente a diferentes tamanhos de tela:
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Elementos reorganizados para melhor usabilidade
- **Mobile**: Interface otimizada para toque, com navegação simplificada

## 🔧 Manutenção

### Adicionar novas FAQs:
1. Abra `central-ajuda.html`
2. Localize a seção `.faq-container`
3. Adicione um novo `.faq-item` seguindo o padrão existente

### Modificar informações de contato:
1. Edite a seção `.quick-actions` no HTML
2. Atualize os links e informações conforme necessário

### Personalizar mensagens:
1. Modifique os textos no arquivo JavaScript
2. Ajuste as mensagens de validação e feedback

## 🚨 Importante

- Certifique-se de que o WhatsApp esteja conectado no servidor
- O `groupDestino` no `config.json` define onde as mensagens chegam
- Teste a funcionalidade em diferentes dispositivos
- Monitore o console para debugar possíveis erros

## 📞 Suporte

Para dúvidas sobre implementação ou personalização desta Central de Ajuda, entre em contato através dos canais configurados no sistema.
