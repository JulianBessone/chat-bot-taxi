// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');
const dialogflow = require ("./dialogflow");
const uuid = require("uuid");
const sessionIds = new Map(); ///Sesiones ID
const excelJS = require('exceljs'); /// EXCEL PARA CHATS
const moment = require('moment'); /// Para cotrolar el tiempo
const fs = require('fs'); /// Filesystem
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
  carritoAbandonado(client);
  //enviarConfirmacion(client); // Para enviar confirmación del pedido a los clientes
  //enviarTracking(client); // Para enviar trackings a clientes sin numero de pedido
  

  /*console.log(client)
  client.onMessage( async (message) => {


      setSessionAndUser(message.from); /// Funcion para crear un ID único 

      let session = sessionIds.get(message.from); // Obtengo la credenciales
      console.log(session)
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
  for (let index = 31; index < excelNumberOrder.length; index++) {
    const element = excelNumberOrder[index];
    const numberPhone = excelPhone[index];
    const name = excelClientName[index];
    const modelo = excelModel[index];

    
    await client.sendText(`34${numberPhone}@c.us`,`Buenas ${name} que tal?\n
    \n
    Lamentamos la demora que arrastra tu pedido, se ha debido a un fallo puntual en fábrica que por fin está solucionado y recibirás las zapatillas en un plazo de 8 días hábiles.
    \n
    Para compensarte queremos ofrecerte un descuento del 30% en tu próxima compra así como la total libertad de devolver el pedido cuando te llegue y recibir el reembolso del mismo.
    \n
    Gracias por tu comprensión y de nuevo disculpa!`)
  }
}