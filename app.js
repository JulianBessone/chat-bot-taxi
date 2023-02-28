// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const dialogflow = require ("./dialogflow");
const uuid = require("uuid");
const sessionIds = new Map(); ///Sesiones ID
const excelJS = require('exceljs'); /// EXCEL PARA CHATS
const moment = require('moment'); /// Para cotrolar el tiempo
const fs = require('fs'); /// Para nose
const xlsx = require ('xlsx');
const pkg = require('pkg');
const enviarTracking = require('./utils')
const {leerExcel, excelNumberOrder, excelClientName, excelModel, excelPhone} = require('./utils')


venom
  .create({
    session: 'session-name', //name of session
    multidevice: true, // for version not multidevice use false.(default: true)
    headless: false
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {

  leerExcel();
  //carritoAbandonado(client);
  //enviarConfirmacion(client); // Para enviar confirmación del pedido a los clientes
  //enviarTracking(client); // Para enviar trackings a clientes sin numero de pedido
  

  /*
  client.onMessage( async (message) => {


      setSessionAndUser(message.from); /// Funcion para crear un ID único 

      let session = sessionIds.get(message.from); // Obtengo la credenciales
      let payload = await dialogflow.sendToDialogFlow(message.body,session); // Mando el texto que mando el usuario a Diaglogflow
      let responses = payload.fulfillmentMessages;

      for (const response of responses) {
        await sendMessageToWhatsapp(client, message, response); // Funcion para enviar mensajes
        saveHistorial(message.from,message.body); // Función para guardar la conversación
      }  
  });
  */
}

///FUNCION PARA ENVIAR MENSAJES

function sendMessageToWhatsapp(client, message, response) {
  return new Promise((resolve, reject) => { 
    client
    .sendText(message.from, response.text.text[0])
    .then((result) => {
      console.log('Result: ', result); //return object success
      resolve(result);
    })
    .catch((erro) => {
      console.error('Error when sending: ', erro);
      reject(erro)
    });
  });
}

///FUNCION PARA CREAR LA SESION PRIVADA PARA CADA CLIENTE-NUM

async function setSessionAndUser(senderId) {
  try {
    if (!sessionIds.has(senderId)) {
      sessionIds.set(senderId, uuid.v1());
    }
  } catch (error) {
    throw error;
  }
}

//// FUNCION PARA GUARDAR LOS CHATS EN EXCEL ///

const saveHistorial = (number, message) => {
  const pathChat = `./chats/${number}.xlsx`;
  const workbook = new excelJS.Workbook();
  const today = moment().format('DD-MM-YYYY hh:mm');

  /*** Chequea si hay excels guardados con ese numero de telefono ***/

  if (fs.existsSync(pathChat)) {
      workbook.xlsx.readFile(pathChat)
      .then(() => {
          const worksheet = workbook.getWorksheet(1);
          const lastRow = worksheet.lastRow;
          let getRowInsert = worksheet.getRow(++(lastRow.number))
          getRowInsert.getCell('A').value = today;
          getRowInsert.getCell('B').value = message;
          getRowInsert.commit();
          workbook.xlsx.writeFile(pathChat) ///Escribe el mensaje
      })
  } else {
      ///para crear
      const worksheet = workbook.addWorksheet('Chats');
      worksheet.columns = [
          { header: 'Fecha', key: 'date' },
          { header: 'Mensaje', key: 'message' },
      ]
      ////AGREGA LOS MENSAJES
      worksheet.addRow([today, message])
      workbook.xlsx.writeFile(pathChat)
          .then( () => {
              console.log('Historial Creado!!');
          })
          .catch( () => {
              console.log('Hay un ERROR!!');
          })
  }

};



/// Mensaje automatico carrito abandonado

const carritoAbandonado = async (client) => {
  for (let index = 0; index < excelNumberOrder.length; index++) {
    const element = excelNumberOrder[index];
    const numberPhone = excelPhone[index];
    const name = excelClientName[index];
    const modelo = excelModel[index];

    
    await client.sendText(`34${numberPhone}@c.us`,`Estimado/a ${name},\n
    \n
    Lamentablemente, experimentamos una situación inesperada que nos impidió cumplir con nuestras fechas de envío habituales. Quiero disculparme sinceramente por el retraso en el envío de su producto. Entiendo lo frustrante que puede ser esperar por algo que se ha pagado y esperado con ilusión.\n
    \n
    Hemos tomado medidas para asegurarnos de que esto no vuelva a ocurrir en el futuro y estamos trabajando para garantizar que nuestros procesos de envío sean más eficientes.
    \n
    Como una forma de remediar la situación, hemos decidido ofreserte un cupón de descuento de 15€ en tus proximas 3 compras. Y a su vez contestar toda duda o inquietud sobre tu actual pedido que en los siguientes días su situación sera normalizada.
    \n
    Esperamos que esta solución sea satisfactoria y que podamos seguir teniendo una buena relación comercial. Gracias por su comprensión y paciencia en este asunto.
    \n
    Atentamente, El equipo de TaxiZapas`)
  }
}