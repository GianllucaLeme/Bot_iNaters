/*---Sincronização do bot com o WhatsApp---*/

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


/*---Funcionalidades do bot ---*/


let lista_comandos = ['/formigas', '/2', '/1'];

// Carrega o arquivo JSON
const fs = require('fs');
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

// Spam handling
let lista_spam = [];
let flag_spam = 0;

// Bot, em loop, lendo as mensagens
client.on('message_create', async message => {
    const chat = await message.getChat();
    
    let usuario = await message.getContact();

    // Spam handling antes de detectar os comandos
    if(message.author === usuario.id._serialized){
        if (lista_comandos.includes(message.body)) {
            let msg1 = message.timestamp;
            lista_spam[flag_spam] = msg1;
    
            //console.log(lista_spam + '\n');
            flag_spam++;
    
            if(flag_spam == 2){
                flag_spam = 0;
            }

            if(Math.abs(lista_spam[1] - lista_spam[0]) < 3){
                //console.log('spam detectado!');
            }else{
                await Comandos(message);
            }
        }
    }
});

// Ligar o bot
client.initialize();