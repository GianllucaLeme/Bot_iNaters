/*---Sincronização do bot com o WhatsApp---*/

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');

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


/*--- Funcionalidades do bot ---*/


let lista_comandos = ['/help', '/admin', '/bicho', '/milicia', '/aranhas', '/aves', '/besouros', '/borboletas', '/formigas', '/louva', '/mariposas', '/moscas', '/opiliões', '/phasma', '/plantas', '/stop', '/all'];
let lista_easter = ['/bloisinho', '/cladoFSM', '/cladofsm', '/cladoPCM', '/cladopcm', '/mateiro', '/meriva', '/vermoidea'];

// Carrega o arquivo JSON
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('contacts.json', 'utf-8'));

let lista_admins = [c.phasma.edgar, c.enrico, c.mariposas.fischer, c.aranhas.jean, c.aranhas.michelotto, c.aranhas.gianlluca];

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

// Função principal que rege todos os comandos
async function Comandos(message) {
    /*--- Comandos Ajuda ---*/
    
    if (message.body === '/help') {
        const usuario_duvida = message.author || message.from;
        
        const comandosAjuda = [
            { comando: '/help', descricao: 'Mostra os comandos atuais do bot;' },
            { comando: '/admin', descricao: 'Marca dois admins aleatórios;' },
            { comando: '/bicho', descricao: 'Usar quando não souber quem marcar;' },
            { comando: '/milicia', descricao: 'Usar quando precisar de ajuda para virar IDs no iNat.' }
        ];

        let comandos_removidos = ['/help', '/admin', '/bicho', '/milicia', '/stop', '/all'];
        let comandosPrincipais = lista_comandos.filter(comando => !comandos_removidos.includes(comando));

        let mensagem = `Olá! Esses são os comandos disponíveis até o momento:\n\n`;
        
        mensagem += `> Comandos de Ajuda\n`;
        mensagem += comandosAjuda.map(cmd_help => `* \`${cmd_help.comando}\` - ${cmd_help.descricao}`).join('\n') + '\n\n';

        mensagem += `> Comandos Principais - marcam os membros que trabalham em seus respectivos grupos\n`;
        mensagem += comandosPrincipais.map(cmd_main => cmd_main === '/phasma' ? `* \`${cmd_main}\` - bicho-pau` : `* \`${cmd_main}\``).join('\n');

        await client.sendMessage(usuario_duvida, mensagem);
    }

    if (message.body === '/admin'){
        lista_admins_filtered = lista_admins.filter(admin => admin !== c.aranhas.gianlluca)
        lista_admins_filtered = (await embaralharContatos(lista_admins_filtered)).slice(0, 2)

        let lista = lista_admins_filtered.map(user => `${user}@c.us`);
        let pessoas = `@${lista_admins_filtered.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/bicho'){
        const bicho = [c.enrico, c.aranhas.celio, c.phasma.edgar];
        let lista = bicho.map(user => `${user}@c.us`);
        let pessoas = `@${bicho.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/milicia'){
        let ajudantes = [c.aranhas.celio, c.aranhas.gianlluca, c.mariposas.fischer, c.mariposas.luis_eduardo, c.formigas.maycon, c.formigas.vankan, c.phasma.edgar, c.enrico, c.shiva, c.jose_valerio];
        ajudantes = (await embaralharContatos(ajudantes)).slice(0, 4)

        let lista = ajudantes.map(user => `${user}@c.us`);
        let pessoas = `@${ajudantes.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    /*--- Comandos Principais ---*/

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

    if (message.body === '/aves') {
        const aves = [c.aves.matheus_santos, c.aves.ruan];
        let lista = aves.map(user => `${user}@c.us`);
        let pessoas = `@${aves.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.95);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/besouros') {
        const besouros = [c.besouros.lorenne, c.besouros.vincenzo];
        let lista = besouros.map(user => `${user}@c.us`);
        let pessoas = `@${besouros.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.336);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
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

    if (message.body === '/louva') {
        const louva = [c.louva.cesar, c.louva.lorena, c.louva.savio];
        let lista = louva.map(user => `${user}@c.us`);
        let pessoas = `@${louva.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.02);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/mariposas'){
        const mariposas = [c.mariposas.fischer, c.mariposas.luis_eduardo, c.mariposas.nicolas];
        let lista = mariposas.map(user => `${user}@c.us`);
        let pessoas = `@${mariposas.join(', @')}`;
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.yasmin, 0.15);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/moscas') {
        const moscas = [c.moscas.matheus, c.moscas.rodrigo];
        let prioridade = [c.moscas.lais, c.moscas.laura, c.moscas.luan]

        let lista = moscas.map(user => `${user}@c.us`);
        let pessoas = `@${moscas.join(', @')}`;

        for (let i = 0; i < prioridade.length; i++) {
            pessoas = await mencionarUsuario(lista, pessoas, prioridade[i], 0.35);
        }
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.1);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/opiliões') {
        const opilioes = [c.opilioes.lohan, c.opilioes.luis_cla];
        let lista = opilioes.map(user => `${user}@c.us`);
        let pessoas = `@${opilioes.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/phasma') {
        const phasma = [c.phasma.edgar, c.phasma.pedro_alvaro, c.phasma.pedro_sisnando, c.phasma.phil];
        let lista = phasma.map(user => `${user}@c.us`);
        let pessoas = `@${phasma.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.01);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/plantas') {
        const plantas = [c.plantas.edvandro];
        let lista = plantas.map(user => `${user}@c.us`);
        let pessoas = `@${plantas.join(', @')}`;
        
        pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.fischer, 0.1);
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, -0.336);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    /*--- Comandos Admin ---*/

    if (message.body === '/stop') {
        let admin = await message.getContact();

        if (lista_admins.includes(admin.id.user)) {
            await client.sendMessage(message.from, '> Bot desligando...');
            
            // Espera 1 s para que a mensagem seja enviada no WhatsApp
            setTimeout(async () => {
                await client.destroy();
            }, 1000);
        }else{
            await client.sendMessage(message.from, '> Você não tem autorização para utilizar esse comando.');
        }
    }
    
    if (message.body === '/all') {
        let admin = await message.getContact();

        if (lista_admins.includes(admin.id.user)) {
            const chat = await message.getChat();
            let mentions = [];
        
            for (let participantes of chat.participants) {
                mentions.push(`${participantes.id.user}@c.us`);
            }
        
            await chat.sendMessage('> Marcando todo mundo...', {mentions});
        }else{
            await client.sendMessage(message.from, '> Você não tem autorização para utilizar esse comando.');
        }
    }

    /*--- Comandos Easter Eggs ---*/

    if (message.body === '/bloisinho'){
        let random_blois = Math.floor(Math.random()*3);
        const media = MessageMedia.fromFilePath(`./pictures/bloisinhos/blois${random_blois}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }

    if (['/cladoPCM', '/cladopcm'].includes(message.body)) {
        const clado_pcm = [c.aranhas.piva, c.aranhas.gabriel_costa, c.aranhas.adolfo];
        let lista = clado_pcm.map(user => `${user}@c.us`);
        let pessoas = `@${clado_pcm.join(', @')}`;
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/cladoFSM', '/cladofsm'].includes(message.body)) {
        const clado_fsm = [c.mariposas.fischer, c.shiva, c.formigas.maycon];
        let lista = clado_fsm.map(user => `${user}@c.us`);
        let pessoas = `@${clado_fsm.join(', @')}`;
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/mateiro'){
        let random_malta = Math.floor(Math.random()*3);
        const media = MessageMedia.fromFilePath(`./pictures/mateiros/mateiro${random_malta}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }

    if (message.body === '/meriva'){
        let random_meriva = Math.floor(Math.random()*11);
        const media = MessageMedia.fromFilePath(`./pictures/merivas/meriva${random_meriva}`);
        await client.sendMessage(message.from, media);
    }

    if (message.body === '/vermoidea'){
        const vermoidea = [c.mariposas.fischer, c.shiva, c.formigas.maycon, c.aranhas.piva, c.aranhas.gabriel_costa, c.aranhas.adolfo];
        let lista = vermoidea.map(user => `${user}@c.us`);
        let pessoas = `@${vermoidea.join(', @')}`;
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }
}

// Spam handling
let lista_spam = [];
let flag_spam = 0;

// Bot, em loop, lendo as mensagens
client.on('message_create', async message => {
    let usuario = await message.getContact();

    // Spam handling antes de detectar os comandos
    if(message.author === usuario.id._serialized){
        if ([...lista_comandos, ...lista_easter].includes(message.body)) {
            let msg1 = message.timestamp;
            lista_spam[flag_spam] = msg1;
    
            flag_spam++;
    
            if(flag_spam == 2){
                flag_spam = 0;
            }

            if(!(Math.abs(lista_spam[1] - lista_spam[0]) < 3)){
                await Comandos(message);
            }
        }
    }
});

// Ligar o bot
client.initialize();