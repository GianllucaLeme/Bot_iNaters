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

let lista_comandos = ['/formigas', '/2', '/1'];

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

let lista_spam = [];
let flag_spam = 0;

// Listening to all incoming messages
client.on('message_create', async message => {
    const chat = await message.getChat();
    
    let usuario = await message.getContact();

    if(message.author === usuario.id._serialized){
        if (lista_comandos.includes(message.body)) {
            let msg1 = message.timestamp;
            lista_spam[flag_spam] = msg1;
    
            console.log(lista_spam + '\n');
            flag_spam++;
    
            if(flag_spam == 2){
                flag_spam = 0;
            }

            if(Math.abs(lista_spam[1] - lista_spam[0]) < 3){
                console.log('spam detectado!');
            }else{
                await Comandos(message);
            }
        }
    }
});

// Start your client
client.initialize();