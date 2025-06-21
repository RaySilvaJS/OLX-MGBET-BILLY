const axios = require("axios");
const puppeteer = require("puppeteer");

/**
 * Acessa a URL de redirecionamento e extrai a imagem do QR code em formato base64
 * @param {string} redirectUrl - URL de redirecionamento
 * @returns {Promise<string|null>} Imagem em base64 ou null em caso de erro
 */
async function acessarImagemBase64(redirectUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.goto(redirectUrl, { waitUntil: "networkidle2", timeout: 30000 });

    // Captura a imagem base64 do QR code e o título da div
    const result = await page.evaluate(() => {
      const img = Array.from(document.querySelectorAll("img")).find((i) =>
        i.src.startsWith("data:image/png;base64")
      );

      const qrDiv = document.querySelector("#qrcode");
      const pixTitle = qrDiv ? qrDiv.getAttribute("title") : null;

      return {
        imgBase64: img ? img.src : null,
        pixTitle: pixTitle.replace(/[\r\n\t]/g, ""),
      };
    });

    return result;
  } catch (error) {
    console.error("Erro:", error.message);
    return { imgBase64: null, pixTitle: null, error };
  } finally {
    await browser.close();
  }
}

/**
 * Envia requisição para gerar QR Code e retorna o base64
 */
async function gerarQRCode() {
  const url = "https://www.br8bet.com/wps/relay/MCSFE_depositByLaunchUrl";

  const headers = {
    "Content-Type": "application/json",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    Authorization: "4b82e6ee-a86e-4534-8171-3a90ecbaa016",
    Language: "PT",
    Merchant: "goal11brl",
    ModuleId: "DPSTBAS3",
    Origin: "https://www.br8bet.com",
    Referer: "https://www.br8bet.com/promotions",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "X-Requested-With": "XMLHttpRequest",
    "X-Timestamp": Date.now().toString(),
    "sec-ch-ua":
      '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
  };

  const config = require("../public/config.json")

  const data = 

{
    targetUsername: "Predestinado7",
    amount: config.preco,
    bankCode: "0155",
    bankType: "PGMT",
    vendorId: "4574387",
    mcsBankCode: "U2CPAYBRLWL",
    token: "4b82e6ee-a86e-4534-8171-3a90ecbaa016",
  };

  try {
    const response = await axios.post(url, data, { headers });
    const redirectUrl = response.data?.value?.redirectUrl;

    if (!redirectUrl) {
      console.log("URL de redirecionamento não encontrada.");
      return null;
    }

    const result = await acessarImagemBase64(redirectUrl);

    if (result.imgBase64) {
      console.log(
        "✅ Base64 da imagem:",
        result.imgBase64?.slice(0, 100) + "..."
      );
    }

    if (result.pixTitle) {
      console.log("✅ PIX Title:", result.pixTitle);
    }

    return result;
  } catch (error) {
    console.error("Erro geral:", error.message);
    return {error};
  }
}

module.exports = {
  gerarQRCode
};
