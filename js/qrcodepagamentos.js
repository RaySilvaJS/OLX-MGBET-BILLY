const axios = require('axios');
const QRCode = require('qrcode');

async function fetchPixData() {
  try {
    let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://xv4fembxv4femb.mgbetpay.com/pay/paysubmit/5091?siteCode=5091&token=7cf09e0927e6058cc2d11752517441498534567&currency=BRL&language=pt&platformType=5&amount=129.90&username=146861377&time=1752517515&currencyCode=BRL&source=web&version=4&pnt=NORMAL&mr=0&tk=7cf09e0927e6058cc2d11752517441498534567&fp=GEE3-01-8a6148f37b02d09856a6dced136ce3c0620df9b99819f6228aa9df61df351968&xDevice=1-1&ld=4dfc216f-9e73-465f-b12a-cb411e3db68a&payplatformids=3960562,2220562,4230562,3240572,3450568,4020562&id=3960562&merchCode=fygjbrlpay,fygjbrlpay,brlunivepay,brlunivepay,brlnewglobalpay,betcatpay&sign=4eae3b26a93d541107ea6fbb0ec48b6c&webUrl=mgbet.com&signKey=c896&webVersion=1752282825000',
  headers: { 
    'accept-language': 'pt', 
    'appsystem': 'Windows 11', 
    'appversion': 'v6.2.75', 
    'auth': 'YctuGOGCSX8kHU1NOJjbq2bqUiN9XQlydMm_2W4y8jjtNC05NbDsCBfF9yddoo5DnE3llie-HdW7ZKZGIQv_piuOIOtn-_05O5oJzELtwcW-2ON9algkDs6Ho6xXiJcuTqyh2PLXbctk54OT-t1YZ6Rge84uIKLMQ7HftIzeFfcBz6lk53YqOURwEXY39cuqFwliP4K-gy-b8CMr75I7BxbAD6pE4JYWG1sJA1QCLds2TA5SG6DjT9JDm86Jz9SiFsMJQ8pCGJVXyhnyMQqclkzjD6ewfsNLlrisAUQv6ceTYSeEdqG72QT6DJdBP9VqSfGEDXJiVoioBuvtEcyUFA', 
    'browserfingerid': 'GEE3-01-8a6148f37b02d09856a6dced136ce3c0620df9b99819f6228aa9df61df351968', 
    'browsertype': 'Chrome v137.0.0.0', 
    'cache': '1', 
    'clienttimezone': '-3', 
    'currency': 'BRL', 
    'device': '4dfc216f-9e73-465f-b12a-cb411e3db68a', 
    'device_id': '4dfc216f-9e73-465f-b12a-cb411e3db68a', 
    'devicebrand': 'unknown', 
    'devicemodel': 'Chrome v137.0.0.0', 
    'devicetype': '3', 
    'domain': 'mgbet.com', 
    'fingerprint': 'GEE3-01-8a6148f37b02d09856a6dced136ce3c0620df9b99819f6228aa9df61df351968', 
    'language': 'pt', 
    'newjwt': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODQwNTM0NDEsImV4dEluZm8iOnsiYnJvd3NlcmZpbmdlcmlkIjoiR0VFMy0wMS04YTYxNDhmMzdiMDJkMDk4NTZhNmRjZWQxMzZjZTNjMDYyMGRmOWI5OTgxOWY2MjI4YWE5ZGY2MWRmMzUxOTY4IiwiY2xpZW50aXAiOiIxNzcuMTkwLjIzNS4yMzQiLCJkZXZpY2UiOiI0ZGZjMjE2Zi05ZTczLTQ2NWYtYjEyYS1jYjQxMWUzZGI2OGEiLCJkZXZpY2V0eXBlIjoiMyIsIngtZGV2aWNlIjoiMS0xIn0sInUiOiIxNDY4NjEzNzciLCJ2IjoiMTc1MjUxNzQ0MSJ9.b23UIPY8I6YfWNV2XX2qXLbrZDv5n5YAk5fhplZav3I', 
    'nonce': '4fd76be6-1b5e-4222-a406-8f024db7c09e', 
    'operatingsystem': 'Windows', 
    'origin': 'https://mgbet.com', 
    'physicaldevicemodel': 'unknown', 
    'platformtype': '5', 
    'priority': 'u=1, i', 
    'referer': 'https://mgbet.com/', 
    'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'cross-site', 
    'sign': 'tykBJY5k46Xr3U0cEG9XTa8x488CYx7sML7QFb8bSKJl1WCJxnwQfiRxtzfqpR4S', 
    'sign-key': 'c896', 
    'sitecode': '5091', 
    'timestamp': '1752517522', 
    'token': '7cf09e0927e6058cc2d11752517441498534567', 
    'userid': '146861377', 
    'web-version': '1752282825000', 
    'webauthndomain': 'mgbet.com', 
    'x-custom-referer': 'https://mgbet.com/', 
    'x-data-mode': 'plain', 
    'x-device': '1-1', 
    'x-object-id': '{"uid":146861377,"browserLanguage":"pt-BR","init":{"device":"4dfc216f-9e73-465f-b12a-cb411e3db68a","created":1752517413274,"version":1752282825000}}', 
    'x-request-id': '4fd76be6-1b5e-4222-a406-8f024db7c09e', 
    'x-version': '6.2.75'
  }
};
    
   const response = await axios.request(config)
    
      if (!response.data.success) throw new Error('Resposta da API não foi sucesso');
    
      // const pixTitle = response.data.data.qrCode;
      const pixPayload = response.data.data.qrCode;
    
      if (!pixPayload) throw new Error('Payload PIX não encontrado');
    
      const qrCodeBase64 = await QRCode.toDataURL(pixPayload);
    
      // console.log({ pixTitle: pixPayload, imgBase64: qrCodeBase64 })
      return { pixTitle: pixPayload, imgBase64: qrCodeBase64 };
  } catch (error) {
    console.error('Erro:', error.message);
    if (error.response) console.error('Resposta da API:', error.response.data);
    throw error;
  }
}

module.exports = fetchPixData