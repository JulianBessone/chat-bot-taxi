const xlsx = require ('xlsx');

//// Leer el excel de numeros de pedido 

const excelNumberOrder = [];
const excelPhone = [];
const excelModel = [];
const excelClientName = [];

const leerExcel = () => {
  const pathNumeros = `./numero-pedidos/numeros.xlsx`;
  const workbook = xlsx.readFile(pathNumeros);
  const workbookSheets = workbook.SheetNames;
  const sheet = workbookSheets[0];

  /* TRANSFORMAMOS LAS TABLAS A UN ARCHIVO TIPO .JSON */

  const dataExcel = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);

  /* ITERAMOS LOS ELEMENTOS DEL ATRIBUTO NUMBER ORDER Y LOS ENVIAMOS AL ARREGLO PARA ALMACENARLO */

  for (const orders of dataExcel){

      excelNumberOrder.push(orders['Number Order']);
      excelPhone.push(orders['Phone'])
      excelModel.push(orders['Model'])
      excelClientName.push(orders['Name'])
  }

  /* ITERAMOS LOS ELEMENTOS DEL ATRIBUTO PHONE Y LOS ENVIAMOS AL ARREGLO PARA ALMACENARLO */

  
  console.log(excelNumberOrder, excelPhone, excelClientName, excelModel)
}

/// Enviar tracking a pedidos sin un numero de pedido específico

const enviarTracking = (client) => {
  for (let index = 0; index < excelNumberOrder.length; index++) {
    const element = excelNumberOrder[index];
    const numberPhone = excelPhone[index]
  
    client.sendText(`34${numberPhone}@c.us`,`Aquí le dejamos su numero de rastreo!\n
    \n
    Puede rastrear su pedido en todo momento entrando al siguiente link, si el idioma esta mal hay un botón para que puedas traducirlo.\n
    Si su localizador no tiene información aun es porque es reciente y aun no esta la web actualizada. Inténtelo en un par de días y si sigue así contáctenos de nuevo.\n
    \n
    Haz click aquí!
    \n
    https://t.17track.net/es#nums=${element}`);
  
    console.log(`${index}) Al cliente sin numero de pedido: Ya tiene su mensaje de Tracking (${element}) !, Phone: ${numberPhone}`)
    
    
  }
}

/// MANDAR MENSAJE DE CONFIRMACION DE PEDIDO

const enviarConfirmacion = (client) => {
  for (let index = 0; index < excelNumberOrder.length; index++) {
    const element = excelNumberOrder[index];
    const numberPhone = excelPhone[index]
  
    client.sendText(`34${numberPhone}@c.us`,`Hola gracias por comprar en *Taxi Zapas*🐼🐼!\nHemos recibido tu pedido correctamente y ya lo estamos preparando!!\nTu numero de pedido es *${element}* \nRecuerda que los pedidos tardan de 2 a 4 días en salir de fabrica, en cuanto salgan te enviaremos un mail con la información de envío del mismo y dentro de el un link de seguimiento de tu pedido. \nCualquier duda o consulta no dudes en comunicarte con nosotros vía WhatsApp`);
  
    console.log(`${index}) Al cliente del pedido: ${element} ya tiene su mensaje de Bienvenida!, Phone: ${numberPhone}`)
    
    
  }
}


module.exports = {
    enviarTracking,
    excelNumberOrder,
    excelPhone,
    excelModel,
    excelClientName,
    leerExcel,
    enviarConfirmacion,
}