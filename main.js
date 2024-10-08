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


let lista_comandos = ['/aranhas', '/aranhas2', '/formigas', '/1'];

// Carrega o arquivo JSON
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('contacts.json', 'utf-8'));

async function Comandos(message) {
    if (message.body === '/aranhas'){
        await client.sendMessage(message.from, 
            `@${c.aranhas.celio}, @${c.aranhas.fernando}, @${c.aranhas.gianlluca}, @${c.aranhas.isaac}, @${c.aranhas.jean}, @${c.aranhas.leonardo}, @${c.aranhas.lucas_gusso}, @${c.aranhas.ryan}, @${c.aranhas.victor}`, 
    
            { mentions: [
                c.aranhas.celio + '@c.us', 
                c.aranhas.fernando + '@c.us', 
                c.aranhas.gianlluca + '@c.us',
                c.aranhas.isaac + '@c.us',
                c.aranhas.jean + '@c.us',
                c.aranhas.leonardo + '@c.us',
                c.aranhas.lucas_gusso + '@c.us',
                c.aranhas.ryan + '@c.us',
                c.aranhas.victor + '@c.us'
            ]});
    }

    if (message.body === '/aranhas2'){
        await client.sendMessage(message.from, 
            `@${c.aranhas2.adolfo}, @${c.aranhas2.claudia}, @${c.aranhas2.dayvson}, @${c.aranhas2.gabriel_costa}, @${c.aranhas2.michelotto}, @${c.aranhas2.pedro_martins}, @${c.aranhas2.piva}`, 
            
            { mentions: [
                c.aranhas2.adolfo + '@c.us',
                c.aranhas2.claudia + '@c.us',
                c.aranhas2.dayvson + '@c.us',
                c.aranhas2.gabriel_costa + '@c.us',
                c.aranhas2.michelotto + '@c.us',
                c.aranhas2.pedro_martins + '@c.us',
                c.aranhas2.piva + '@c.us'
            ]});
    }

    if (message.body === '/formigas'){
        await client.sendMessage(message.from, `@${c.formigas.felipe_santos}, @${c.formigas.gabriel_rogerio}, @${c.formigas.guilherme_cardoso}, @${c.formigas.joao_paulo}, @${c.formigas.maycon}`, 
            
            {mentions: [
                c.formigas.felipe_santos + '@c.us',
                c.formigas.gabriel_rogerio + '@c.us',
                c.formigas.guilherme_cardoso + '@c.us',
                c.formigas.joao_paulo + '@c.us',
                c.formigas.maycon + '@c.us',
            ]});
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