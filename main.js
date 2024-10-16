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


let lista_comandos = ['/help', '/aranhas', '/bicho', '/borboletas', '/formigas', '/mariposas', '/opiliões'];

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

// Função para embaralhar a lista de contatos
async function embaralharContatos(contatos) {
    for (let i = contatos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [contatos[i], contatos[j]] = [contatos[j], contatos[i]];  // Troca os elementos
    }
    return contatos;
}

async function Comandos(message) {
    if (message.body === '/help'){
        const comandos = lista_comandos.map(comando => `* ${comando}`).join('\n');
        await client.sendMessage(message.from, 
            `Olá! Esses são os comandos disponíveis até o momento:\n${comandos}`);
    }

    if (message.body === '/bicho'){
        const bicho = [c.enrico, c.aranhas.celio, c.phasma.edgar];
        let lista = bicho.map(user => `${user}@c.us`);
        let pessoas = `@${bicho.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/aranhas'){
        let aranhas = [c.aranhas.adolfo, c.aranhas.claudia, c.aranhas.dayvson, c.aranhas.fernando, c.aranhas.gabriel_costa, c.aranhas.isaac, c.aranhas.leonardo, c.aranhas.lucas_gusso, c.aranhas.michelotto, c.aranhas.pedro_martins, c.aranhas.piva, c.aranhas.victor];
        let prioridade = [c.aranhas.celio, c.aranhas.gianlluca, c.aranhas.jean, c.aranhas.ryan];

        aranhas = (await embaralharContatos(aranhas)).slice(0, 3);

        let lista = aranhas.map(user => `${user}@c.us`);
        let pessoas = `@${aranhas.join(', @')}`;
        
        for (let i = 0; i < prioridade.length; i++) {
            pessoas = await mencionarUsuario(lista, pessoas, prioridade[i], 0.633975);
        }

        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);

        await client.sendMessage(message.from, pessoas, { mentions: lista});
    }

    if (message.body === '/borboletas'){
        const borboletas =  [c.borboletas.andre_nog, c.borboletas.pedro_souza, c.borboletas.rafaela, c.borboletas.tiago];
        let lista = borboletas.map(user => `${user}@c.us`);
        let pessoas = `@${borboletas.join(', @')}`;
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.fischer, 0.15);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/formigas'){
        let formigas = [c.formigas.davi, c.formigas.vankan];
        let prioridade = [c.formigas.felipe_santos, c.formigas.gabriel_rogerio, c.formigas.joao_paulo, c.formigas.maycon];

        let lista = formigas.map(user => `${user}@c.us`);
        let pessoas = `@${formigas.join(', @')}`;
        
        for (let i = 0; i < prioridade.length; i++) {
            pessoas = await mencionarUsuario(lista, pessoas, prioridade[i], 0.577896);
        }

        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        pessoas = await mencionarUsuario(lista, pessoas, c.formigas.didobola, 0.25);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/mariposas'){
        const mariposas = [c.mariposas.fischer, c.mariposas.luis_eduardo, c.mariposas.yasmin];
        let lista = mariposas.map(user => `${user}@c.us`);
        let pessoas = `@${mariposas.join(', @')}`;
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/opiliões') {
        const opilioes = [c.opilioes.lohan, c.opilioes.luis_cla];
        let lista = opilioes.map(user => `${user}@c.us`);
        let pessoas = `@${opilioes.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        
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