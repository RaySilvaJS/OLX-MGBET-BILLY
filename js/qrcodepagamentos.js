const axios = require('axios');
const QRCode = require('qrcode');

async function fetchPixData() {
  try {
    const url = 'https://mg.paymgbet.com/pay/paysubmit/5091';

    const params = {
      siteCode: '5091',
      token: '8a7f74c9845ed44162771750172864796044310',
      currency: 'BRL',
      language: 'pt',
      platformType: '5',
      amount: '189.90',
      username: '146861377',
      time: '1750526139',
      currencyCode: 'BRL',
      source: 'web',
      version: '4',
      pnt: 'NORMAL',
      mr: '0',
      tk: '8a7f74c9845ed44162771750172864796044310',
      fp: 'GEE3-01-8a6148f37b02d09856a6dced136ce3c0620df9b99819f6228aa9df61df351968',
      xDevice: '1-1',
      ld: '4dfc216f-9e73-465f-b12a-cb411e3db68a',
      payplatformids: '2220562,3960562,3810562,3450568,3120568',
      id: '2220562',
      merchCode: 'fygjbrlpay,fygjbrlpay,unispay,brlnewglobalpay,xingogopay',
      sign: 'f4e58a8555fc0902e02516a03fa78b20',
      webUrl: 'mgbet.com',
      signKey: 'c896',
      webVersion: '1750472258000'
    };

    const headers = {
      'x-request-id': '3cc4feb1-3e71-4d0b-b6bd-140e7a74bb71',
      'webauthnDomain': 'mgbet.com',
      'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
      'browserfingerid': 'GEE3-01-8a6148f37b02d09856a6dced136ce3c0620df9b99819f6228aa9df61df351968',
      'sec-ch-ua-mobile': '?0',
      'device': '4dfc216f-9e73-465f-b12a-cb411e3db68a',
      'nonce': '3cc4feb1-3e71-4d0b-b6bd-140e7a74bb71',
      'physicalDeviceModel': 'unknown',
      'Web-Version': '1750472258000',
      'platformType': '5',
      'Accept': 'application/json, text/plain, */*',
      'x-data-mode': 'plain',
      'token': '8a7f74c9845ed44162771750172864796044310',
      'domain': 'mgbet.com',
      'x-version': '6.1.102',
      'sign': 'psdxNPO+eN2H/ewvthy98HbcFISFOH3UWcbxmC3uQvvE8FrU0A21EDA/8+Kd9pa7',
      'browserType': 'Chrome v137.0.0.0',
      'accept-language': 'pt',
      'Referer': 'https://mgbet.com/',
      'currency': 'BRL',
      'devicetype': '3',
      'operatingSystem': 'Windows',
      'deviceModel': 'Chrome v137.0.0.0',
      'x-custom-referer': 'https://mgbet.com/',
      'language': 'pt',
      'sec-ch-ua-platform': '"Windows"',
      'timestamp': '1750526146',
      'appSystem': 'Windows 11',
      'auth': 'Q5Ftr6B5fgh0QOlysJkGUW6vHqne_Ez9D7zsxrLP94HUP_kWmWDFE7g470U9Acg0wdMDD-a7ueS99rAP8QPUAr40jfNW4OIJ-3UlW7_UfkiMg7aEQOFW_VSX3RJZKGxXgooljDYqDexv1i2R71yIyrquAez4fVNEchgk1qxXXxGdiGTxnQVwx1_jfLcaQADs9Qg9fhwMkRG92pZJXi_MSBSFq9d9ueD3Bi567Esf8kFia0ulmhdqzi4FHm8B-_bcffsxVPmVfJiSQsbN5qbSAeW6kE3SrStQ0QIpGqEAKpliIvIcb0UjA8vk4W5eVhdVO0rMdZoxbCCKsbrurNDW2A',
      'appVersion': 'v6.1.102',
      'Sign-key': 'c896',
      'x-object-id': '{"uid":146861377,"browserLanguage":"pt-BR","init":{"device":"4dfc216f-9e73-465f-b12a-cb411e3db68a","created":1750526102878,"version":1750472258000}}',
      'siteCode': '5091',
      'deviceBrand': 'unknown',
      'clienttimezone': '-3',
      'newJwt': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODE3MDg4NjQsImV4dEluZm8iOnsiYnJvd3NlcmZpbmdlcmlkIjoiR0VFMy0wMS04YTYxNDhmMzdiMDJkMDk4NTZhNmRjZWQxMzZjZTNjMDYyMGRmOWI5OTgxOWY2MjI4YWE5ZGY2MWRmMzUxOTY4IiwiY2xpZW50aXAiOiIxNzcuMTkwLjIzNS4yMzQiLCJkZXZpY2UiOiI0ZGZjMjE2Zi05ZTczLTQ2NWYtYjEyYS1jYjQxMWUzZGI2OGEiLCJkZXZpY2V0eXBlIjoiMyIsIngtZGV2aWNlIjoiMS0xIn0sInUiOiIxNDY4NjEzNzciLCJ2IjoiMTc1MDE3Mjg2NCJ9.P9hrazB7xfhXtt39fdhOvQg50w9hGoF-DLYTWNOWVH0',
      'x-device': '1-1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      'UserId': '146861377'
    };

    const response = await axios.get(url, { params, headers });
// return console.log(response.data);
    if (!response.data.success) throw new Error('Resposta da API não foi sucesso');

    // const pixTitle = response.data.data.qrCode;
    const pixPayload = response.data.data.qrCode;

    if (!pixPayload) throw new Error('Payload PIX não encontrado');

    const qrCodeBase64 = await QRCode.toDataURL(pixPayload);

    return { pixTitle: pixPayload, imgBase64: qrCodeBase64 };

  } catch (error) {
    console.error('Erro:', error.message);
    if (error.response) console.error('Resposta da API:', error.response.data);
    throw error;
  }
}

// fetchPixData()
//   .then((a) => {
    
//     console.log('QR Code Base64:', a);
//   })
//   .catch(console.error);

module.exports = fetchPixData