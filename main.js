/*--- Módulos Principais ---*/

const { Comandos } = require('./commands/core');
const { ComandosEasterEgg } = require('./commands/easter');
const { Comandosaga } = require('./commands/aga');

const { lista_comandos, lista_easter, lista_easter_aga } = require('./config/commandList');
const { ComandosAdmin } = require('./commands/admin');
const { ComandosAjuda } = require('./commands/help');

const { gruposPermitidos } = require('./config/groups');

const { extrairComandodeURL, normalizarComando } = require('./lib/utils');

const { temInternet } = require('./lib/internet');

const { stopPath, restartPath } = require('./config/paths');

const fs = require('fs');
const c = require('./config/contacts_load');

/*--- Sincronização do bot com o WhatsApp ---*/

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process'
        ]
    }
});

// Flag que impede que múltiplos "setInterval()" sejam criados caso haja falhas de conexão constantes
let interval_unico = false;

client.once('ready', async () => {
    console.log('Client is ready!');
    
    // Loop para permitir que as pessoas do grupo permitido possam mandar os comandos no privado também
    for (const grupoId of gruposPermitidos) {
        try {
            const chat = await client.getChatById(grupoId);

            if (chat.isGroup) {
                for (const participante of chat.participants) {
                    permitidos.push(participante.id._serialized);
                }
            }
        } catch (erro) {
            console.log(`Erro ao ler participantes de ${grupoId}:`, erro);
        }
    }

    // Remove duplicados
    permitidos = [...new Set(permitidos)];

    // Reinicia o bot após uma queda de conexão inesperada
    if (!interval_unico) {
        interval_unico = true;
        let falhasInternet = 0;
        
        setInterval(async () => {
            const conectado = await temInternet();
    
            if (!conectado) {
                falhasInternet++;
    
                console.log(`[BOT] Sem internet (${falhasInternet}/3)`);
    
                if (falhasInternet >= 3) {
                    console.log('[BOT] Queda de conexão persistente, encerrando...');
                    process.exit(1);
                }
            } else {
                falhasInternet = 0;
            }
        }, 20 * 1000);
    }

    // Manda mensagem de aviso de reinicialização do bot
    if (fs.existsSync(restartPath) && !fs.existsSync(stopPath)) {
        const grupos = [
            `${c.grupo_bot_iNaters}@g.us`,
            `${c.grupo_iNaturalisters}@g.us`
        ];

        for (const grupo of grupos) {
            await client.sendMessage(grupo, '> Reiniciando o bot...');
        }

        fs.unlinkSync(restartPath);
    }
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});


/*--- Funcionalidades do bot ---*/


// Variáveis para evitar que o bot leia comandos antigos
const startTime = Date.now();
const mensagensProcessadas = new Set();

let permitidos = [...gruposPermitidos];

// Variáveis para controle de spam
const ultimoComando = new Map();
const todos_comandos = new Set([...lista_comandos, ...lista_easter, ...lista_easter_aga, '/start']);

// Bot, em loop, lendo as mensagens
client.on('message_create', async message => {
    const mensagem_normalizada = normalizarComando( extrairComandodeURL(message.body) );
    let contato = null;
    
    if (!mensagem_normalizada){
        return;
    } 

    // Ignora mensagens antigas e evita processar mensagens duplicadas
    if ((message.timestamp * 1000) < startTime) {
        //console.log('[BOT] Ignorando mensagem antiga');
        return;
    }

    // Evita que os comandos sejam mandados para pessoas de fora dos grupos
    if (!permitidos.includes(message.from)) {
        contato = await message.getContact();

        if (!permitidos.includes(contato.id._serialized)){
           return; 
        }
    }

    // Bloqueio dos comandos quando o bot estiver pausado
    if (mensagem_normalizada !== '/start' && fs.existsSync(stopPath)) {
        return;
    }

    // Comando para despausar o bot
    if (mensagem_normalizada === '/start') {
        let is_admin = contato;

        if (!is_admin) {
            is_admin = await message.getContact();
        }

        const tipo_conversa = await message.getChat();

        if (!tipo_conversa.isGroup) {
            await client.sendMessage(message.from, '> Esse comando só funciona em grupos.');
            return;
        }

        let lista_admins = tipo_conversa.participants
            .filter(p => p.isAdmin || p.isSuperAdmin)
            .map(p => p.id.user);
        
        if (!lista_admins.includes(is_admin.id.user) && is_admin.id.user !== c.aranhas.gianlluca) {
            await client.sendMessage(message.from, '> Você não tem autorização para utilizar esse comando.');
            return;
        }

        // Caso seja admin, o bot será despausado
        if (fs.existsSync(stopPath)) {
            fs.unlinkSync(stopPath); // Remove o arquivo STOP
            await client.sendMessage(message.from, '> Bot despausando...');
        } else {
            await client.sendMessage(message.from, '> O bot já está em execução.');
        }

        return;
    }
    
    // Caso não tenha obtido as informações do contato anteriormente
    if (!contato) {
        contato = await message.getContact();
    }


    const msgId = message.id._serialized;

    if (mensagensProcessadas.has(msgId)) {
        return;
    }

    mensagensProcessadas.add(msgId);

    // limpa a lista de mensagens depois de 5 minutos 
    setTimeout(() => {
        mensagensProcessadas.delete(msgId);
    }, 5 * 60 * 1000);
    

    // Spam handling antes de detectar os comandos
    if (todos_comandos.has(mensagem_normalizada)) {
        
        // Obtém o par usuário-timestamp do último comando enviado
        const usuario = message.from;
        const agora = Date.now(); // em milissegundos
        const ultimo = ultimoComando.get(usuario);

        // bloqueia apenas se a MESMA pessoa mandar outro comando em menos de 3 s
        if (ultimo && (agora - ultimo) < 3000) {
            return;
        }

        ultimoComando.set(usuario, agora);

        try {
            const isPermitido = permitidos.includes(message.from);
            const isAGA = [`${c.grupo_aga}@g.us`, `${c.aranhas.gianlluca}@c.us`].includes(message.from);

            if (isPermitido) {
                if (await Comandos(client, message, mensagem_normalizada, contato)) return;
                if (await ComandosEasterEgg(client, message, mensagem_normalizada)) return;
            }

            if (isPermitido || isAGA) {
                if (await ComandosAdmin(client, message, mensagem_normalizada, contato)) return;
                if (await ComandosAjuda(client, message, mensagem_normalizada)) return;
            }

            if (isAGA) {
                if (await Comandosaga(client, message, mensagem_normalizada)) return;
            }

        } finally {
            // limpa o usuário da lista depois de 2 s
            setTimeout(() => {
                if (ultimoComando.get(usuario) === agora) {
                    ultimoComando.delete(usuario);
                }
            }, 3000);
        }
    }
});

// Ligar o bot
client.initialize();