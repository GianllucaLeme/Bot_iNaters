const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth()
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

const fs = require('fs');

// Carrega o arquivo JSON
const c = JSON.parse(fs.readFileSync('contacts.json', 'utf-8'));

async function Comandos(message) {
    if (message.body === '/2'){
        await client.sendMessage(message.from, `@${c.aranhas.melga}`, 
            { mentions: [c.aranhas.melga + '@c.us'] });
    }

    if (message.body === '/formigas'){
        await client.sendMessage(message.from, `@${c.borboletas.andre}, @${c.formigas.maycon}, @${c.borboletas.fischer}, @${c.enrico}`, 
            {mentions: [c.borboletas.andre + '@c.us', c.formigas.maycon + '@c.us', 
                c.borboletas.fischer + '@c.us', c.enrico + '@c.us']});
    }

    if (message.body === '/1'){
        await client.sendMessage(message.from, 'teste de mensagem');
    }
}

let lista_spam = new Array(2);
let flag_spam = 0;
if(Object.seal) {
  // fill array with some value because
  // empty slots can not be changed after calling Object.seal
  lista_spam.fill(999);

  Object.seal(lista_spam);
  // now lista_spam is a fixed-size array with mutable entries
}


// Listening to all incoming messages
client.on('message_create', async message => {
	//console.log(message.body);
    const chat = await message.getChat();

    await Comandos(message);

    let usuario = await message.getContact();

    if(message.author === usuario.id._serialized){  // modificar parametros para tratar somente na lista de comandos
        //console.log('Contato de quem mandou a mensagem: ' + message.author);
        
        let msg1 = message.timestamp;
        lista_spam[flag_spam] = msg1;

        console.log(lista_spam + '\n');
        flag_spam++;

        if(flag_spam == 2){
            flag_spam = 0;
        }

        if (lista_spam.includes(999)) {
            
            if(lista_spam[1] - lista_spam[0] <= 2){
                console.log('spam detectado!');

            }
        }
    }
    
});

// Start your client
client.initialize();