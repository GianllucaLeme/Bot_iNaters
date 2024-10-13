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


let lista_comandos = ['/help', '/aranhas', '/aranhas2', '/borboletas', '/formigas', '/mariposas', '/opiliões'];

// Carrega o arquivo JSON
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('contacts.json', 'utf-8'));

// Função que determina a chance do usuário ser marcado
async function chanceUsuario(usuario, chance) {
    if (Math.random() < chance) {
        return usuario;
    } else {
        return null;
    }
}

// Função que adiciona o usuário para ser propriamente mencionado na mensagem
async function mencionarUsuario(lista, pessoas, usuario, chance) {
    const marcacao = await chanceUsuario(usuario, chance);
    if(marcacao){
        lista.push(marcacao + '@c.us');
        return pessoas + `, @${marcacao}`;
    }else{
        return pessoas;
    }
}

async function Comandos(message) {
    if (message.body === '/help'){
        const comandos = lista_comandos.map(comando => `* ${comando}`).join('\n');
        await client.sendMessage(message.from, 
            `Olá! Esses são os comandos disponíveis até o momento:\n${comandos}`);
    }

    if (message.body === '/aranhas'){
        const aranhas = [c.aranhas.celio, c.aranhas.fernando, c.aranhas.gianlluca, c.aranhas.isaac, c.aranhas.jean, c.aranhas.leonardo, c.aranhas.lucas_gusso, c.aranhas.ryan, c.aranhas.victor];
        let lista = aranhas.map(user => `${user}@c.us`);
        let pessoas = aranhas.map(user => `@${user}`).join(', ');
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);

        await client.sendMessage(message.from, pessoas, { mentions: lista});
    }

    if (message.body === '/aranhas2'){
        const aranhas2 = [c.aranhas2.adolfo, c.aranhas2.claudia, c.aranhas2.dayvson, c.aranhas2.gabriel_costa, c.aranhas2.michelotto, c.aranhas2.pedro_martins, c.aranhas2.piva];
        let lista = aranhas2.map(user => `${user}@c.us`);
        let pessoas = aranhas2.map(user => `@${user}`).join(', ');
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);

        await client.sendMessage(message.from, pessoas, { mentions: lista});
    }

    if (message.body === '/borboletas'){
        const borboletas =  [c.borboletas.andre_nog, c.borboletas.pedro_souza, c.borboletas.rafaela, c.borboletas.tiago];
        let lista = borboletas.map(user => `${user}@c.us`);
        let pessoas = borboletas.map(user => `@${user}`).join(', ');
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/formigas'){
        const formigas = [c.formigas.davi, c.formigas.didobola, c.formigas.felipe_santos, c.formigas.gabriel_rogerio, c.formigas.guilherme_cardoso, c.formigas.joao_paulo, c.formigas.maycon, c.formigas.vankan];
        let lista = formigas.map(user => `${user}@c.us`);
        let pessoas = formigas.map(user => `@${user}`).join(', ');
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/mariposas'){
        const mariposas = [c.mariposas.fischer, c.mariposas.luis_eduardo, c.mariposas.yasmin];
        let lista = mariposas.map(user => `${user}@c.us`);
        let pessoas = mariposas.map(user => `@${user}`).join(', ');
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/opiliões') {
        const opilioes = [c.opilioes.lohan, c.opilioes.luis_cla];
        let lista = opilioes.map(user => `${user}@c.us`);
        let pessoas = opilioes.map(user => `@${user}`).join(', ');
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
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
    
            flag_spam++;
    
            if(flag_spam == 2){
                flag_spam = 0;
            }

            if(Math.abs(lista_spam[1] - lista_spam[0]) < 3){
            }else{
                await Comandos(message);
            }
        }
    }
});

// Ligar o bot
client.initialize();