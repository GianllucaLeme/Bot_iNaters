/*--- Sincronização do bot com o WhatsApp ---*/

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');

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

// Verifica se há conexão com a internet [para conexões instáveis e host local]
const https = require('https');
function temInternet() {
    return new Promise((resolve) => {
        const req = https.get('https://www.google.com', (res) => {
            resolve(res.statusCode >= 200 && res.statusCode < 400);
        });

        req.on('error', () => resolve(false));

        req.setTimeout(5000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

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


const lista_comandos = new Set([
    '/help', '/help2', '/admin', '/bicho', '/milicia', '/sac', '/sobre', '/tirar_nome', 
    
    '/rbn', '/aranha', '/abelha', '/ave', '/barata', '/barbeiro?', '/barbeiro', '/besouro', '/bichopau', 
    '/bicho_pau', '/phasma', '/borboleta', '/cigarra', '/cigarrinha','/cobra', '/serpente', '/cupim', 
    '/cupins', '/isoptera', '/diplopoda', '/escorpiao', '/escorpioes', '/formiga', '/formiga_leao', 
    '/fungo', '/cogumelo', '/fungi', '/neuroptera', '/geoplanaria', '/grilo', '/gafanhoto', '/esperanca', 
    '/orthoptera', '/hemi', '/hemiptera', '/lagarta', '/lepi', '/lepidoptera', '/lagarto', '/calango', 
    '/gekkota', '/louva', '/louva_deus', '/mantis', '/mantodea', '/marinho', '/mollusca', '/molusco', '/concha', 
    '/caracol', '/caramujo', '/caranguejo', '/gastropoda', '/mariposa', '/morcego', '/mosca', '/diptera', '/mosquito', 
    '/opiliao', '/opilioes', '/percevejo', '/percevejo_aq', '/gerromorpha', '/planta', '/plec', '/plecoptera', 
    '/monocot', '/monocotiledonea', '/dicot', '/dicotiledonea', '/pseudo', '/pseudoescorpiao', '/pseudoescorpioes', 
    '/sapo', '/anura', '/scoly', '/scolytinae', '/brocas', '/soldadinho', '/membracidae', '/staph', '/staphylinidae', 
    '/strep', '/strepsiptera', '/tipula', '/tipulomorpha', '/traca', '/zygentoma', '/tripe', '/thysanoptera', 
    '/vespa', '/vespidae', '/maribondo', '/marimbondo',
    
    '/stop', '/all']);

const lista_easter = new Set([
    '/aga', '/alex', '/nos', '/noz', '/naturalista', '/bloisinho', '/blois', '/bloisin', 
    '/crispinin', '/bot', '/caf', '/cladofsm', '/curse', '/trader', '/golpe', '/davi', 
    '/douglas', '/gareli', '/garelli', '/garelao', '/kratos', '/kratosrbn', '/kratos_rbn', 
    '/lycan', '/lycantropia', '/mateiro', '/melga', '/melguinha', '/melgaco', '/adolfo', 
    '/meriva', '/sorteio', '/metaflora', '/metazooa', '/metazoa', '/plankoidea', 
    '/planklep', '/prancheta', '/prancha', '/26', '/reh_csif', '/rehcsif', '/dobra', 
    '/tarrafer', '/fischer', '/vem', '/vermoidea', 

    '/true_aga', '/true_h', '/cala', '/clbc', '/random_clbc', '/pertubacao', '/ping', 
    '/alou', '/dicka', '/dickao', '/certo', '/grupo_certo']);

// Carrega o arquivo JSON
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('contacts.json', 'utf-8'));

// Variáveis para evitar que o bot leia comandos antigos
const startTime = Date.now();
const mensagensProcessadas = new Set();

// Permite a criação do arquivo STOP para pausar o bot
const path = require('path');

// Variáveis para pausa e reinicialização do bot
const stopPath = path.join(process.cwd(), 'STOP');
const restartPath = path.join(process.cwd(), 'RESTART_NOTICE');

// Lista de grupos permitidos para leitura dos comandos
const gruposPermitidos = [
    `${c.grupo_iNaturalisters}@g.us`,
    `${c.grupo_bot_iNaters}@g.us`,
    `${c.grupo_teste}@g.us`,
    `${c.grupo_aga}@g.us`,
    `${c.grupo_nepsilon}@g.us`
];

let permitidos = [...gruposPermitidos];

// Objetos auxiliares para os comandos do grupo "aga"
const clbc_aga = new Set([
    'dido', 'felipe', 'gabriel', 'gomide', 'henrique', 'kleber', 'laz', 'luis', 
    'maycon', 'mayconu7', 'meta', 'pedro', 'pinguim', 'ryan', 'calabot', 'bot2', 
    'sophia', 'sofia', 'carrasco', 'maria', 'cristina', 'vini', 'gian', 'gia', 
    'barata2', 'safira',
    
    c.aga.kleber_audio, c.aga.kleber_audio2, c.aga.dido_audio, c.aga.dido_audio2
]);

for (const cmd of clbc_aga) {
    lista_easter.add(`/${cmd}`);
}

const mapa_audios = new Map([
    [new Set(['calabot', 'bot2']),                'clbc_bot.mp3'],
    [new Set(['sophia', 'sofia', 'carrasco']),    'clbc_sofia.mp3'],
    [new Set(['maria', 'cristina']),              'clbc_maria.mp3'],
    [new Set(['mayconu7']),                       'clbc_maycon.mp3'],
    [new Set(['gian', 'gia']),                    'fale_mais_gian.mp3'],
    [new Set(['barata2']),                        'clbc_safira.mp3'],

    [new Set([c.aga.dido_audio, c.aga.dido_audio2]), 'clbc_dido.mp3'],
    [new Set([c.aga.kleber_audio, c.aga.kleber_audio2]), 'clbc_kleber.mp3'],
    [new Set([c.aga.laz_audio]), 'clbc_laz.mp3'],
]);

// Função para mapear as pessoas e os seus respectivos áudios
function mapear_clbc(pessoa) {
    for (const [pessoas, arquivo] of mapa_audios) {
        if (pessoas.has(pessoa)) {
            return `./pictures/aga/${arquivo}`;
        }
    }

    return `./pictures/aga/clbc_${pessoa}.mp3`;
}


// Função que determina a chance do usuário ser marcado
function chanceUsuario(usuario, chance) {
    if (Math.random() < chance) {
        return usuario;
    } else {
        return null;
    }
}

// Função que adiciona o usuário para ser propriamente mencionado na mensagem
function mencionarUsuario(lista, pessoas, usuario, chance) {
    const marcacao = chanceUsuario(usuario, chance);
    
    if(marcacao){
        lista.push(marcacao + '@c.us');
        return pessoas + `, @${marcacao}`;
    }else{
        return pessoas;
    }
}

// Função para embaralhar a lista de contatos
function embaralharContatos(contatos) {
    for (let i = contatos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [contatos[i], contatos[j]] = [contatos[j], contatos[i]];  // Troca os elementos
    }
    return contatos;
}

// Função para remover acentos de uma string
function removerAcentos(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Função para extrair o comando de mensagens que contenham um URL
function extrairComandodeURL(message) {
    if (!message) return null;

    // Divide a mensagem em linhas
    const linhas = message.split('\n');

    for (let linha of linhas) {
        linha = linha.trim();

        // Procura algo que comece com "/"
        const match = linha.match(/^\/[\p{L}0-9_?]+$/u);

        if (match) {
            return match[0];
        }
    }

    return null;
}

// Função para tratar variações de comandos do usuário, como pluralização, espaços, acentos etc.
function normalizarComando(message) {
    if (!message) return null;

    let comando = message.toLowerCase().trim();

    // Ignora comandos entre aspas ou com "> " ou do tipo "/comando [frase aleatória]"
    if (/^["'~].*["'~]$/.test(comando) || comando.startsWith('>')) {
        return null;
    }

    // Remove caracteres especiais no começo e no fim (asteriscos, crases etc)
    comando = comando.replace(/^[^a-z0-9/]+|[^a-z0-9]+$/gi, '');
    
    comando = removerAcentos(comando);

    // Evitar a remoção do "s" para certos comandos
    const excecoes = [
        '/brocas',
        '/cupins',
        '/escorpioes',
        '/louva_deus',
        '/mantis',
        '/nos', 
        '/opilioes',
        '/pseudoescorpioes',
        '/blois',
        '/douglas',
        '/kratos',
        '/luis'
    ];

    if (!excecoes.includes(comando) && comando.endsWith('s')) {
        comando = comando.slice(0, -1);
    }

    return comando;
}

// Funções para guardar partes imutáveis do "/help", "/help2", "/sac" e "/sobre"
// (Immediately Invoked Function Expression)
// Assim a mensagem é construída apenas uma vez quando o bot inicia
const help_cache = (() => {
    
    const comandosAjuda = [
        { comando: '/help', descricao: 'Mostra os comandos atuais do bot;' },
        { comando: '/help2', descricao: 'Mostra comandos mais avançados;' },
        { comando: '/admin', descricao: 'Marca dois admins aleatórios;' },
        { comando: '/bicho', descricao: 'Usar quando não souber quem marcar;' },
        { comando: '/milicia', descricao: 'Usar quando precisar de ajuda para virar IDs no iNat;' },
        { comando: '/sac', descricao: 'Fornece o link para o *SAC - iNaturalist*;' },
        { comando: '/sobre', descricao: 'Mostra informações sobre o bot;'},
        { comando: '/tirar_nome', descricao: 'Abre um requerimento para retirar seu nome das marcações.'}
    ];
    
    const comandos_removidos = new Set([
        '/help', '/help2', '/admin', '/bicho', '/milicia', '/sac', '/sobre', '/tirar_nome', '/stop', 
        '/all', '/barbeiro', '/serpente', '/cupins', '/isoptera', '/escorpioes', '/gafanhoto', 
        '/esperanca', '/orthoptera', '/hemiptera', '/opilioes', '/gerromorpha', '/bichopau', '/phasma', 
        '/pseudoescorpiao', '/pseudoescorpioes', '/lepi', '/lepidoptera', '/calango', '/gekkota', 
        '/louva_deus', '/mantis', '/mantodea', '/concha', '/caranguejo', '/mollusca', '/molusco', '/caracol', 
        '/caramujo', '/gastropoda', '/neuroptera', '/cogumelo', '/fungi', '/soldadinho', '/membracidae', 
        '/scolytinae', '/brocas', '/staphylinidae', '/strepsiptera', '/tipulomorpha', '/plecoptera', 
        '/monocotiledonea', '/dicotiledonea', '/anura', '/thysanoptera', '/vespidae', '/maribondo', 
        '/marimbondo', '/zygentoma', '/diptera'
    ]);
    
    const comandosPrincipais = [...lista_comandos].filter(comando => !comandos_removidos.has(comando));

    let mensagem = `Olá! Esses são os comandos disponíveis até o momento:\n\n`;

    mensagem += `> Comandos de Ajuda\n`;
    mensagem += comandosAjuda.map(cmd_help => `* \`${cmd_help.comando}\` - ${cmd_help.descricao}`).join('\n') + '\n\n';

    mensagem += `> Comandos Principais - marcam os membros que trabalham em seus respectivos grupos *[ordem alfabética]*\n`;
    mensagem += comandosPrincipais.map(cmd_main => {
        if (cmd_main === '/rbn') {
            return `* \`${cmd_main}\` - Rede Brasileira de Naturalistas`;
        } else if (cmd_main === '/barbeiro?') {
            return `* \`${cmd_main}\` - *percevejo de importância médica*`;
        } else if (cmd_main === '/bicho_pau'){
            return `* \`${cmd_main}\` ou \`/phasma\``;
        } else if (cmd_main === '/cigarrinha') {
            return `* \`${cmd_main}\` - soldadinhos e membracídeos`;
        } else if (cmd_main === '/cobra') {
            return `* \`${cmd_main}\` ou \`/serpente\``;
        } else if (cmd_main === '/diplopoda') {
            return `* \`${cmd_main}\` - piolho-de-cobra`;
        } else if (cmd_main === '/formiga_leao') {
            return `* \`${cmd_main}\` - ou coisas parecidas`;
        } else if (cmd_main === '/fungo') {
            return `* \`${cmd_main}\` - cogumelos e afins`;
        } else if (cmd_main === '/geoplanaria') {
            return `* \`${cmd_main}\` - planária terrestre`;
        } else if (cmd_main === '/grilo') {
            return `* \`${cmd_main}\` - inclui gafanhotos e esperanças tbm`;
        } else if (cmd_main === '/hemi') {
            return `* \`${cmd_main}\` - cigarrinhas, percevejos, afídeos e afins`;
        } else if (cmd_main === '/lagarta') {
            return `* \`${cmd_main}\` - dúvida entre borboleta ou mariposa`;
        } else if (cmd_main === '/lagarto') {
            return `* \`${cmd_main}\` - calangos e afins`;
        } else if (cmd_main === '/louva') {
            return `* \`${cmd_main}\` ou  \`/mantis\``;
        } else if (cmd_main === '/marinho') {
            return `* \`${cmd_main}\` - inclui animais marinhos e similares`;
        } else if (cmd_main === '/percevejo_aq') {
            return `* \`${cmd_main}\` - percevejos aquáticos`;
        } else if (cmd_main === '/plec') {
            return `* \`${cmd_main}\` - plecoptera`;
        } else if (cmd_main === '/pseudo') {
            return `* \`${cmd_main}\` - pseudoescorpiões`;
        } else if (cmd_main === '/monocot'){
            return `* \`${cmd_main}\` - monocotiledôneas`;
        } else if (cmd_main === '/dicot'){
            return `* \`${cmd_main}\` - dicotiledôneas`;
        } else if (cmd_main === '/sapo'){
            return `* \`${cmd_main}\` - sapos, rãs ou pererecas`;
        } else if (cmd_main === '/scoly') {
            return `* \`${cmd_main}\` - scolytinae (tipo de gorgulho)`;
        } else if (cmd_main === '/staph') {
            return `* \`${cmd_main}\` - staphylinidae`;
        } else if (cmd_main === '/strep') {
            return `* \`${cmd_main}\` - strepsiptera`;
        } else if (cmd_main === '/tipula') {
            return `* \`${cmd_main}\` - tipulomorpha`;
        } else if (cmd_main === '/traça') {
            return `* \`${cmd_main}\` - zygentoma`;
        } else if (cmd_main === '/tripe') {
            return `* \`${cmd_main}\` - thysanoptera`;
        } else if (cmd_main === '/vespa') {
            return `* \`${cmd_main}\` ou \`/maribondo\``;
        } else {
            return `* \`${cmd_main}\``;
        }
    }).join('\n');

    return mensagem;
})();

const help2_cache = (() => {
    
    let comandos_avancados = [
        '/anura', '/barbeiro', '/bichopau', '/calango', '/caranguejo', '/cogumelo', 
        '/cupins', '/dicotiledonea', '/diptera', '/escorpioes', '/esperança', '/gerromorpha', 
        '/hemiptera', '/lepi', '/marimbondo', '/neuroptera', '/opilioes', '/plecoptera', 
        '/pseudoescorpiao', '/scolytinae', '/staphylinidae', '/strepsiptera', 
        '/thysanoptera', '/tipulomorpha', '/zygentoma'
    ];

    let mensagem = `> Comandos Avançados - variações dos comandos básicos *[ordem alfabética]*\n`;
    mensagem += comandos_avancados.map(cmd_main => {
        if (cmd_main === '/anura') {
            return `* \`${cmd_main}\` - sapos e pererecas`;
        } else if (cmd_main === '/calango') {
            return `* \`${cmd_main}\` ou \`/gekkota\``;
        } else if (cmd_main === '/caranguejo') {
            return `* \`${cmd_main}\`, \`/mollusca\`, \`/molusco\`, \`/concha\`, \`/caracol\`, \`/caramujo\`, ou \`/gastropoda\``;
        } else if (cmd_main === '/cogumelo') {
            return `* \`${cmd_main}\` ou \`/fungi\``;
        } else if (cmd_main === '/cupins') {
            return `* \`${cmd_main}\` ou \`/isoptera\``;
        } else if (cmd_main === '/dicotiledonea') {
            return `* \`${cmd_main}\` ou \`/monocotiledonea\``;
        } else if (cmd_main === '/esperança') {
            return `* \`${cmd_main}\`, \`/gafanhoto\` ou \`/orthoptera\``;
        } else if (cmd_main === '/gerromorpha') {
            return `* \`${cmd_main}\` - percevejos aquáticos`;
        } else if (cmd_main === '/lepi') {
            return `* \`${cmd_main}\` ou \`/lepidoptera\``;
        } else if (cmd_main === '/marimbondo') {
            return `* \`${cmd_main}\` ou \`/vespidae\``;
        } else if (cmd_main === '/pseudoescorpiao') {
            return `* \`${cmd_main}\` ou \`/pseudoescorpioes\``;
        } else if (cmd_main === '/scolytinae') {
            return `* \`${cmd_main}\` ou \`/brocas\``;
        } else if (cmd_main === '/thysanoptera') {
            return `* \`${cmd_main}\` - tripes`;
        } else if (cmd_main === '/tipulomorpha') {
            return `* \`${cmd_main}\` - típulas e afins`;
        } else if (cmd_main === '/zygentoma') {
            return `* \`${cmd_main}\` - traças`;
        } else {
            return `* \`${cmd_main}\``;
        }
    }).join('\n');
    
    return mensagem;
})();

const sac_cache = (() => {
    let sac_inat = 'Viu algo fora de ordem?\n';

    sac_inat += 'Táxon ausente, desatualizado ou bagunçado?\n\n';
    
    sac_inat += 'Envie seu pedido para o *SAC - iNaturalist* e algum dos curadores poderá corrigir isso futuramente 🙂‍↕️👇\n\n'

    sac_inat += 'https://docs.google.com/spreadsheets/d/16rAPrTKesmjMDcxU4GoRyCTU9eHIgkGHZVUw3m5p0zY/edit?usp=sharing';
    
    return sac_inat;
})();

const sobre_cache = (() => {
    let mensagem = 'O \`iMark\` foi criado para facilitar o processo de identificação de animais, plantas, fungos etc., permitindo a marcação automática de membros especializados em seus grupos taxonômicos.\n\n';

    mensagem += 'Com essa funcionalidade, elimina-se a necessidade de saber exatamente quem marcar, sendo especialmente útil para quem é novo no grupo. Além disso, esse bot promove uma interação melhor e mais dinâmica entre os membros mais antigos e novos.\n\n';
    
    mensagem += 'Sugestões mandar no privado do autor! 👇\n\n'
    
    mensagem += `Desenvolvedor: @${c.aranhas.gianlluca}\n`;
    mensagem += 'Versão atual: \`\`\`1.2.2\`\`\`\n';
    mensagem += 'GitHub: https://github.com/GianllucaLeme/Bot_iNaters';
    
    return mensagem;
})();

// Função que rege os comandos principais
async function Comandos(message, mensagem_normalizada) {
    // Evita que o usuário que mandou o comando seja marcado no próprio comando
    const contato_comando = await message.getContact();

    /*--- Comandos Ajuda ---*/
    
    if (mensagem_normalizada === '/help') {
        const usuario_duvida = message.author || message.from;

        await client.sendMessage(usuario_duvida, help_cache);
        return;
    }
    
    if (mensagem_normalizada === '/help2') {
        const usuario_duvida = message.author || message.from;

        await client.sendMessage(usuario_duvida, help2_cache);
        return;
    }

    if (mensagem_normalizada === '/admin') {
        const tipo_conversa = await message.getChat();

        // Evita que o bot quebre caso o comando seja utilizado em uma conversa privada
        if (!tipo_conversa.isGroup) {
            await client.sendMessage(message.from, '> Esse comando só funciona em grupos.');
            return;
        }

        // Detecta os admins atuais do grupo
        let adminsGrupo = tipo_conversa.participants
            .filter(p => p.isAdmin || p.isSuperAdmin)
            .map(p => p.id.user);

        // Exceções para admins não oficiais
        const extras = [
            c.aranhas.gianlluca
        ];

        // Remoção de participantes duplicados
        let admins = [...new Set([...adminsGrupo, ...extras])];
        
        admins = admins.filter(user => user !== contato_comando.id.user);

        if (admins.length === 0) {
            await client.sendMessage(message.from, '> Só há você de admin no grupo.');
            return;
        }

        // Embaralha e pega 2 admins aleatórios para marcar
        const admins_filtered = (await embaralharContatos(admins)).slice(0, 2);

        let lista = admins_filtered.map(user => `${user}@c.us`);
        let pessoas = `@${admins_filtered.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/bicho'){
        let bicho = [c.enrico, c.aranhas.celio, c.phasma.edgar];

        bicho = bicho.filter(user => user !== contato_comando.id.user);
        
        // Caso não haja mais ninguém para marcar
        if (bicho.length === 0) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = bicho.map(user => `${user}@c.us`);
        let pessoas = `@${bicho.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/milicia'){
        let ajudantes = [c.aranhas.celio, c.aranhas.gianlluca, c.mariposas.fischer, 
                         c.mariposas.luis_eduardo, c.formigas.davi, c.formigas.gabriel_rogerio, 
                         c.formigas.maycon, c.phasma.edgar, c.enrico, c.sapo.shiva, c.aves.jose_valerio];
        
        ajudantes = ajudantes.filter(user => user !== contato_comando.id.user);
        
        if (ajudantes.length === 0) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        ajudantes = (await embaralharContatos(ajudantes)).slice(0, 5);

        let lista = ajudantes.map(user => `${user}@c.us`);
        let pessoas = `@${ajudantes.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/sac') {
        if (!(Math.random() < 0.01)) {
            await client.sendMessage(message.from, sac_cache);
        } else {
            const media = MessageMedia.fromFilePath(`./pictures/bloisinhos/blois${2}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        }
        return;
    }

    if (mensagem_normalizada === '/sobre') {
        const usuario_curioso = message.author || message.from;

        await client.sendMessage(usuario_curioso, sobre_cache, {mentions: c.aranhas.gianlluca + '@c.us'});
        return;
    }

    if (mensagem_normalizada === '/tirar_nome') {
        let usuario_tirar = await message.getContact();

        await client.sendMessage(message.from, '> Pedido enviado.');
        
        setTimeout(async () => {
            await client.sendMessage(c.aranhas.gianlluca + '@c.us', `O @${usuario_tirar.id.user} quer retirar a marcação!`, {mentions: usuario_tirar.id.user + '@c.us'});
        }, 3000);
        return;
    }
    
    /*--- Comandos Principais ---*/

    if (mensagem_normalizada === '/abelha') {
        let abelhas = [c.abelhas.bruno_abelha, c.abelhas.bruno_aranda, 
                       c.abelhas.beatriz, c.staph.pedro_staph];

        abelhas = abelhas.filter(user => user !== contato_comando.id.user);
        
        if (abelhas.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = abelhas.map(user => `${user}@c.us`);
        let pessoas = `@${abelhas.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.3);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/aranha'){
        let aranhas = [c.aranhas.adolfo, c.aranhas.alfredo, c.aranhas.claudia, c.aranhas.dayvson, 
                       c.aranhas.fernando, c.aranhas.gabriel_costa, c.aranhas.gabriel_vianna, 
                       c.aranhas.isaac, c.aranhas.lucas_gusso, c.aranhas.pedro_martins, c.aranhas.victor];
        
        let prioridade = [c.aranhas.celio, c.aranhas.gianlluca, c.aranhas.jean, c.aranhas.ryan, c.aranhas.michelotto];
        
        aranhas = aranhas.filter(user => user !== contato_comando.id.user);
        prioridade = prioridade.filter(user => user !== contato_comando.id.user);

        if (aranhas.length === 0 && prioridade.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        aranhas = (await embaralharContatos(aranhas)).slice(0, 3);

        let lista = aranhas.map(user => `${user}@c.us`);
        let pessoas = `@${aranhas.join(', @')}`;
        
        for (let i = 0; i < prioridade.length; i++) {
            pessoas = await mencionarUsuario(lista, pessoas, prioridade[i], 0.633975);
        }

        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        }

        await client.sendMessage(message.from, pessoas, { mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/ave') {
        let aves = [c.plantas.edvandro, c.aves.jose_valerio, c.aves.matheus_santos, 
                    c.borboletas.pedro_souza, c.aves.ruan];

        let prioridade = [c.aves.leticia_keiko, c.aves.miguel_malta, c.aves.henrique_stranz];
       
        aves = aves.filter(user => user !== contato_comando.id.user);
        prioridade = prioridade.filter(user => user !== contato_comando.id.user);
        
        const semEspecialistas = aves.length === 0 && prioridade.length === 0;
        const semAdicionais = [c.enrico, c.aves.victor_aves].includes(contato_comando.id.user);

        if (semEspecialistas && semAdicionais) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        aves = (await embaralharContatos(aves)).slice(0, 3);
        prioridade = (await embaralharContatos(prioridade));
        
        let lista = aves.map(user => `${user}@c.us`);
        let pessoas = `@${aves.join(', @')}`;

        for (let i = 0; i < prioridade.length; i++) {
            pessoas = await mencionarUsuario(lista, pessoas, prioridade[i], 1);
        }
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.95);
        }

        if (contato_comando.id.user !== c.aves.victor_aves) {
            pessoas = await mencionarUsuario(lista, pessoas, c.aves.victor_aves, 0.3);
        }
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/barata') {
        let baratas = [c.mariposas.fischer, c.baratas.matheus_dora, c.phasma.pedro_alvaro];

        baratas = baratas.filter(user => user !== contato_comando.id.user);

        const semAdicionais = [c.enrico, c.louva.lorena].includes(contato_comando.id.user);

        if (baratas.length === 0 && semAdicionais) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = baratas.map(user => `${user}@c.us`);
        let pessoas = `@${baratas.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.3);
        }
        if (contato_comando.id.user !== c.louva.lorena) {
            pessoas = await mencionarUsuario(lista, pessoas, c.louva.lorena, 0.2);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/barbeiro?', '/barbeiro'].includes(mensagem_normalizada)) {
        let barbeiro = [c.carlos_adm, c.aranhas.celio];
        
        barbeiro = barbeiro.filter(user => user !== contato_comando.id.user);

        if (barbeiro.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = barbeiro.map(user => `${user}@c.us`);
        let pessoas = `@${barbeiro.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.6);
        }
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/besouro') {
        let besouros = [c.besouros.glauco, c.besouros.lorenne, 
                          c.besouros.vincenzo, c.besouros.bruno_begha];
        
        besouros = besouros.filter(user => user !== contato_comando.id.user);

        if (besouros.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = besouros.map(user => `${user}@c.us`);
        let pessoas = `@${besouros.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.336);
        }
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/bichopau', '/bicho_pau', '/phasma'].includes(mensagem_normalizada)) {
        let phasma = [c.phasma.edgar, c.phasma.pedro_alvaro, 
                        c.phasma.pedro_sisnando, c.phasma.phil];

        phasma = phasma.filter(user => user !== contato_comando.id.user);

        if (phasma.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = phasma.map(user => `${user}@c.us`);
        let pessoas = `@${phasma.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.01);
        }
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/borboleta'){
        let borboletas = [c.borboletas.andre_nog, c.mariposas.jhonatan, 
                          c.borboletas.pedro_souza, c.borboletas.rafaela, 
                          c.borboletas.tiago];

        borboletas = borboletas.filter(user => user !== contato_comando.id.user);

        const semAdicionais = [c.enrico, c.mariposas.fischer, 
                               c.borboletas.guilherme_augusto].includes(contato_comando.id.user);

        if (borboletas.length === 0 && semAdicionais) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = borboletas.map(user => `${user}@c.us`);
        let pessoas = `@${borboletas.join(', @')}`;
        
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        }

        if (contato_comando.id.user !== c.mariposas.fischer) {
            pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.fischer, 0.15);
        }

        if (contato_comando.id.user !== c.borboletas.guilherme_augusto) {
            pessoas = await mencionarUsuario(lista, pessoas, c.borboletas.guilherme_augusto, 0.1);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/cigarra') {
        let cigarras = [c.cigarras.bruno];
        
        cigarras = cigarras.filter(user => user !== contato_comando.id.user);

        const semAdicionais = [c.enrico, c.mariposas.fischer].includes(contato_comando.id.user);

        if (cigarras.length === 0 && semAdicionais) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = cigarras.map(user => `${user}@c.us`);
        let pessoas = `@${cigarras.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        }

        if (contato_comando.id.user !== c.mariposas.fischer) {
            pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.fischer, 0.15);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/cigarrinha', '/soldadinho', '/membracidae'].includes(mensagem_normalizada)) {
        let cigarrinha = [c.cigarrinha.aline, c.cigarrinha.andre_cigarrinha, 
                          c.cigarrinha.eduardo_henrique];
        
        cigarrinha = cigarrinha.filter(user => user !== contato_comando.id.user);

        if (cigarrinha.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = cigarrinha.map(user => `${user}@c.us`);
        let pessoas = `@${cigarrinha.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.4);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/cobra', '/serpente'].includes(mensagem_normalizada)) {
        let cobras = [c.enrico, c.aves.jose_valerio, 
                      c.cobras.leonardo_conversano];
        
        cobras = cobras.filter(user => user !== contato_comando.id.user);

        if (cobras.length === 0) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = cobras.map(user => `${user}@c.us`);
        let pessoas = `@${cobras.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/cupim', '/cupins', '/isoptera'].includes(mensagem_normalizada)) {
        let cupim = [c.cupim.gustavo, c.cupim.karina_lima];
        
        cupim = cupim.filter(user => user !== contato_comando.id.user);

        if (cupim.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = cupim.map(user => `${user}@c.us`);
        let pessoas = `@${cupim.join(', @')}`;

        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.4);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/diplopoda') {
        let diplopoda = [c.diplopoda.rodrigo_bouzan];

        if (diplopoda.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = diplopoda.map(user => `${user}@c.us`);
        let pessoas = `@${diplopoda.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/escorpiao', '/escorpioes'].includes(mensagem_normalizada)){
        let escorpioes = [c.aranhas.adolfo, c.aranhas.fernando, c.aranhas.gianlluca, 
                          c.aranhas.lucas_gusso, c.aranhas.pedro_martins];
        let prioridade = [c.aranhas.celio, c.aranhas.jean, c.aranhas.michelotto];

        escorpioes = escorpioes.filter(user => user !== contato_comando.id.user);
        prioridade = prioridade.filter(user => user !== contato_comando.id.user);

        if (escorpioes.length === 0 && prioridade.length === 0 && contato_comando.id.user == c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        escorpioes = (await embaralharContatos(escorpioes)).slice(0, 3);

        let lista = escorpioes.map(user => `${user}@c.us`);
        let pessoas = `@${escorpioes.join(', @')}`;
        
        for (let i = 0; i < prioridade.length; i++) {
            pessoas = await mencionarUsuario(lista, pessoas, prioridade[i], 0.2);
        }

        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        }

        await client.sendMessage(message.from, pessoas, { mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/formiga'){
        let formigas = [c.formigas.davi, c.formigas.felipe_santos, 
                        c.formigas.gabriel_rogerio, c.formigas.maycon];

        formigas = formigas.filter(user => user !== contato_comando.id.user);

        const semAdicionais = [c.formigas.joao_paulo, c.formigas.diego, 
                               c.formigas.vankan, c.enrico].includes(contato_comando.id.user);

        if (formigas.length === 0 && semAdicionais) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = formigas.map(user => `${user}@c.us`);
        let pessoas = `@${formigas.join(', @')}`;
        

        if (contato_comando.id.user !== c.formigas.joao_paulo) {
            pessoas = await mencionarUsuario(lista, pessoas, c.formigas.joao_paulo, 0.1);
        }

        if (contato_comando.id.user !== c.formigas.diego) {
            pessoas = await mencionarUsuario(lista, pessoas, c.formigas.diego, 0.05);
        }

        if (contato_comando.id.user !== c.formigas.vankan) {
            pessoas = await mencionarUsuario(lista, pessoas, c.formigas.vankan, 0.03);
        }


        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.05);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        
        return;
    }

    if (['/formiga_leao', '/neuroptera'].includes(mensagem_normalizada)) {
        let formiga_leao = [c.formiga_leao.leon, c.formiga_leao.maria_girelli];

        formiga_leao = formiga_leao.filter(user => user !== contato_comando.id.user);

        if (formiga_leao.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = formiga_leao.map(user => `${user}@c.us`);
        let pessoas = `@${formiga_leao.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.3);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/fungo','/cogumelo', '/fungi'].includes(mensagem_normalizada)) {
        let fungos = [c.fungos.mateus_ribeiro];
        
        if (fungos.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = fungos.map(user => `${user}@c.us`);
        let pessoas = `@${fungos.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/geoplanaria') {
        let geoplanaria = [c.geoplanaria.piter];
        
        if (geoplanaria.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = geoplanaria.map(user => `${user}@c.us`);
        let pessoas = `@${geoplanaria.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/grilo', '/gafanhoto', '/esperanca', '/orthoptera'].includes(mensagem_normalizada)) {
        let grilos = [c.phasma.phil];
        
        if (grilos.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = grilos.map(user => `${user}@c.us`);
        let pessoas = `@${grilos.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/hemi', '/hemiptera'].includes(mensagem_normalizada)) {
        let hemi = [c.cigarrinha.aline, c.cigarrinha.andre_cigarrinha, 
                    c.cigarrinha.eduardo_henrique, c.percevejos.guilherme_lopez];

        hemi = hemi.filter(user => user !== contato_comando.id.user);

        if (hemi.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = hemi.map(user => `${user}@c.us`);
        let pessoas = `@${hemi.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/lagarta', '/lepi', '/lepidoptera'].includes(mensagem_normalizada)) {
        let lagarta = [c.borboletas.tiago, c.borboletas.pedro_souza, 
                       c.mariposas.fischer, c.mariposas.luis_eduardo, c.mariposas.nicolas];

        lagarta = lagarta.filter(user => user !== contato_comando.id.user);

        if (lagarta.length === 0) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = lagarta.map(user => `${user}@c.us`);
        let pessoas = `@${lagarta.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/lagarto', '/calango', '/gekkota'].includes(mensagem_normalizada)) {
        let lagarto = [c.lagartos.dani_alcantara, c.lagartos.joao_alcantara];

        lagarto = lagarto.filter(user => user !== contato_comando.id.user);

        if (lagarto.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = lagarto.map(user => `${user}@c.us`);
        let pessoas = `@${lagarto.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.6);
        }
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/louva', '/louva_deus', '/mantis', '/mantodea'].includes(mensagem_normalizada)) {
        let louva = [c.louva.bruno_louva, c.louva.cesar, c.louva.gabriel_gomes, c.louva.leo, 
                     c.louva.lorena, c.louva.lorram, c.louva.savio];

        louva = louva.filter(user => user !== contato_comando.id.user);

        const semAdicionais = [c.enrico, c.louva.gabriel_gomes].includes(contato_comando.id.user);

        if (louva.length === 0 && semAdicionais) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        louva = (await embaralharContatos(louva)).slice(0, 4);

        let lista = louva.map(user => `${user}@c.us`);
        let pessoas = `@${louva.join(', @')}`;
            
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.02);
        }

        if(!pessoas.includes('@' + c.louva.gabriel_gomes) && contato_comando.id.user !== c.louva.gabriel_gomes) { 
            pessoas = await mencionarUsuario(lista, pessoas, c.louva.gabriel_gomes, 1);
        }
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/mariposa'){
        let mariposas = [c.mariposas.jhonatan, c.mariposas.miguel, 
                         c.phasma.pedro_alvaro, c.mariposas.pedro_lafin];
        
        let prioridade = [c.mariposas.fischer, c.mariposas.laila, 
                          c.mariposas.luis_eduardo, c.mariposas.nicolas];
        
        mariposas = mariposas.filter(user => user !== contato_comando.id.user);
        prioridade = prioridade.filter(user => user !== contato_comando.id.user);

        const semEspecialistas = mariposas.length === 0 && prioridade.length === 0;
        const semAdicionais = [c.mariposas.fischer, c.enrico].includes(contato_comando.id.user);

        if (semEspecialistas && semAdicionais) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        mariposas = (await embaralharContatos(mariposas)).slice(0, 3);
        prioridade = (await embaralharContatos(prioridade)).slice(0, 3);

        let lista = mariposas.map(user => `${user}@c.us`);
        let pessoas = `@${mariposas.join(', @')}`;


        for (const usuario of prioridade) {
            pessoas = await mencionarUsuario(lista, pessoas, usuario, 1);
        }

        if(!pessoas.includes('@' + c.mariposas.fischer) && contato_comando.id.user !== c.mariposas.fischer){
            pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.fischer, 1);
        }


        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        }
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/marinho', '/mollusca', '/molusco', '/concha', '/caracol', 
        '/caramujo', '/caranguejo', '/gastropoda'].includes(mensagem_normalizada)) {
        
        let marinho = [c.marinho.carlos_sigma, c.aranhas.celio, 
                       c.marinho.rafael_masson, c.mosquitos.walther];
        
        marinho = marinho.filter(user => user !== contato_comando.id.user);

        if (marinho.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = marinho.map(user => `${user}@c.us`);
        let pessoas = `@${marinho.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.4);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/morcego') {
        let morcegos = [c.aranhas.lucas_gusso];
        
        if (morcegos.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = morcegos.map(user => `${user}@c.us`);
        let pessoas = `@${morcegos.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/mosca', '/diptera'].includes(mensagem_normalizada)) {
        let moscas = [c.moscas.daniel_schelesky, c.moscas.lais, 
                      c.moscas.leonardo_breder, c.moscas.luan, 
                      c.moscas.matheus, c.moscas.rodrigo];
        
        moscas = moscas.filter(user => user !== contato_comando.id.user);

        if (moscas.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = moscas.map(user => `${user}@c.us`);
        let pessoas = `@${moscas.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.1);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/mosquito') {
        let mosquitos = [c.mosquitos.walther];

        if (mosquitos.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = mosquitos.map(user => `${user}@c.us`);
        let pessoas = `@${mosquitos.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/opiliao', '/opilioes'].includes(mensagem_normalizada)) {
        let opilioes = [c.opilioes.lohan, c.opilioes.luis_cla, c.opilioes.thales];
        
        opilioes = opilioes.filter(user => user !== contato_comando.id.user);

        if (opilioes.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = opilioes.map(user => `${user}@c.us`);
        let pessoas = `@${opilioes.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/percevejo') {
        let percevejos = [c.percevejos.guilherme_lopez];

        if (percevejos.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = percevejos.map(user => `${user}@c.us`);
        let pessoas = `@${percevejos.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.8);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/percevejo_aq', '/gerromorpha'].includes(mensagem_normalizada)) {
        let aquatico = [c.percevejos.taoso];
        
        if (aquatico.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = aquatico.map(user => `${user}@c.us`);
        let pessoas = `@${aquatico.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.8);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/planta') {
        let plantas = [c.plantas.edvandro, c.mariposas.fischer, c.plantas.thomaz_ricardo];

        plantas = plantas.filter(user => user !== contato_comando.id.user);

        if (plantas.length === 0) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = plantas.map(user => `${user}@c.us`);
        let pessoas = `@${plantas.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/plec', '/plecoptera'].includes(mensagem_normalizada)) {
        let plec = [c.plecoptera.christian];

        if (plec.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = plec.map(user => `${user}@c.us`);
        let pessoas = `@${plec.join(', @')}`;

        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.8);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/pseudo', '/pseudoescorpiao', '/pseudoescorpioes'].includes(mensagem_normalizada)) {
        let pseudo = [c.aranhas.dayvson];

        if (pseudo.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = pseudo.map(user => `${user}@c.us`);
        let pessoas = `@${pseudo.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/monocot', '/monocotiledonea'].includes(mensagem_normalizada)) {
        let monocot = [c.mariposas.fischer, c.formigas.joao_paulo, c.plantas.marcos];
        
        monocot = monocot.filter(user => user !== contato_comando.id.user);

        if (monocot.length === 0) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = monocot.map(user => `${user}@c.us`);
        let pessoas = `@${monocot.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/dicot', '/dicotiledonea'].includes(mensagem_normalizada)) {
        const dicot = [c.plantas.angelo_correa, c.plantas.bruno_santos, 
                       c.plantas.edvandro, c.opilioes.luis_cla];
        
        dicot = dicot.filter(user => user !== contato_comando.id.user);

        if (dicot.length === 0) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = dicot.map(user => `${user}@c.us`);
        let pessoas = `@${dicot.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (mensagem_normalizada === '/rbn') {
        let rbn = [c.borboletas.andre_nog, c.abelhas.bruno_aranda, c.aranhas.celio,
                   c.phasma.edgar, c.enrico, c.aves.jose_valerio, c.rbn.tiago_rbn];
        
        rbn = rbn.filter(user => user !== contato_comando.id.user);

        if (rbn.length === 0) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = rbn.map(user => `${user}@c.us`);
        let pessoas = `@${rbn.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/sapo', '/anura'].includes(mensagem_normalizada)) {
        let sapo = [c.sapo.allanis, c.sapo.catarina, c.sapo.shiva];

        sapo = sapo.filter(user => user !== contato_comando.id.user);

        if (sapo.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = sapo.map(user => `${user}@c.us`);
        let pessoas = `@${sapo.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/scoly', '/scolytinae', '/brocas'].includes(mensagem_normalizada)) {
        let scoly = [c.formigas.gabriel_rogerio];

        if (scoly.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = scoly.map(user => `${user}@c.us`);
        let pessoas = `@${scoly.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/staph', '/staphylinidae'].includes(mensagem_normalizada)) {
        let staph = [c.staph.pedro_staph];

        if (staph.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = staph.map(user => `${user}@c.us`);
        let pessoas = `@${staph.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/strep', '/strepsiptera'].includes(mensagem_normalizada)) {
        let strep = [c.formigas.gabriel_rogerio];

        if (strep.length === 0) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = strep.map(user => `${user}@c.us`);
        let pessoas = `@${strep.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/tipula', '/tipulomorpha'].includes(mensagem_normalizada)) {
        let tipula = [c.mosquitos.walther];

        if (tipula.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = tipula.map(user => `${user}@c.us`);
        let pessoas = `@${tipula.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/traca', '/zygentoma'].includes(mensagem_normalizada)) {
        let traca = [c.sapo.shiva];

        if (traca.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = traca.map(user => `${user}@c.us`);
        let pessoas = `@${traca.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.1);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/tripe', '/thysanoptera'].includes(mensagem_normalizada)) {
        let tripe = [c.tripe.marina];

        if (tripe.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }
        
        let lista = tripe.map(user => `${user}@c.us`);
        let pessoas = `@${tripe.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.1);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/vespa', '/vespidae', '/maribondo', '/marimbondo'].includes(mensagem_normalizada)) {
        let vespa = [c.aranhas.celio, c.mariposas.laila, c.phasma.pedro_alvaro];
        
        vespa = vespa.filter(user => user !== contato_comando.id.user);

        if (vespa.length === 0 && contato_comando.id.user === c.enrico) {
            await client.sendMessage(message.from, '> Não há mais ninguém da área para marcar.');
            return;
        }

        let lista = vespa.map(user => `${user}@c.us`);
        let pessoas = `@${vespa.join(', @')}`;
    
        if (contato_comando.id.user !== c.enrico) {
            pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.3);
        }

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    /*--- Comandos Admin ---*/

    if (mensagem_normalizada === '/stop') {
        let is_admin = contato_comando;
        const tipo_conversa = await message.getChat();

        if (!tipo_conversa.isGroup) {
            await client.sendMessage(message.from, '> Esse comando só funciona em grupos.');
            return;
        }

        let lista_admins = tipo_conversa.participants
            .filter(p => p.isAdmin || p.isSuperAdmin)
            .map(p => p.id.user); 

        if (lista_admins.includes(is_admin.id.user) || is_admin.id.user === c.aranhas.gianlluca) {
            fs.writeFileSync(stopPath, 'stopped');

            await client.sendMessage(message.from, '> Bot pausado. Use /start para reativá-lo.');
    
        } else {
            await client.sendMessage(message.from, '> Você não tem autorização para utilizar esse comando.');
        }

        return;
    }
    
    if (mensagem_normalizada === '/all') {
        let is_admin = contato_comando;
        const tipo_conversa = await message.getChat();
        
        if (!tipo_conversa.isGroup) {
            await client.sendMessage(message.from, '> Esse comando só funciona em grupos.');
            return;
        }
        
        let lista_admins = tipo_conversa.participants
            .filter(p => p.isAdmin || p.isSuperAdmin)
            .map(p => p.id.user);

        if (lista_admins.includes(is_admin.id.user) || is_admin.id.user === c.aranhas.gianlluca) {
            let mentions = [];
        
            for (let participantes of tipo_conversa.participants) {
                mentions.push(`${participantes.id.user}@c.us`);
            }

            mentions = mentions.filter(user => user !== `${contato_comando.id.user}@c.us`);
        
            await tipo_conversa.sendMessage('> Marcando todo mundo...', {mentions});
        } else {
            await client.sendMessage(message.from, '> Você não tem autorização para utilizar esse comando.');
        }
        
        return;
    }
}

// Função para os comandos Easter Eggs
async function ComandosEasterEgg(message, mensagem_normalizada){

    if (['/aga', '/h'].includes(mensagem_normalizada)) {
        const aga = [c.formigas.davi, c.aranhas.gianlluca, c.mariposas.luis_eduardo, 
                     c.formigas.maycon, c.formigas.felipe_santos, c.formigas.gabriel_rogerio, 
                     c.formigas.gomide, c.staph.pedro_staph, c.aranhas.ryan, c.vankan, c.bot];

        let lista = aga.map(user => `${user}@c.us`);
        let pessoas = `@${aga.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});

        return;
    }

    if (['/alex', '/nos', '/noz', '/naturalista'].includes(mensagem_normalizada)){
        let random_alex = Math.floor(Math.random()*7);
        
        if(random_alex < 6){
            const media = MessageMedia.fromFilePath(`./pictures/alexes/alex${random_alex}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        } else {
            let texto_alex = `> é noz! 😉😉😉`;
            await client.sendMessage(message.from, texto_alex);
        }
        
        return;
    }

    if (['/bloisinho', '/blois', '/bloisin', '/crispinin'].includes(mensagem_normalizada)){
        let random_blois = Math.floor(Math.random()*10);
        const media = MessageMedia.fromFilePath(`./pictures/bloisinhos/blois${random_blois}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        return;
    }
    
    if (mensagem_normalizada === '/bot'){
        let random_patada = Math.floor(Math.random()*3);
        const media = MessageMedia.fromFilePath(`./pictures/bot_patadas/patada${random_patada}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        return;
    }

    if (mensagem_normalizada === '/caf'){
        let random_certidao = Math.floor(Math.random()*1);
        const media = MessageMedia.fromFilePath(`./pictures/certidao_caf/caf${random_certidao}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/cladofsm') {
        const clado_fsm = [c.mariposas.fischer, c.sapo.shiva, c.formigas.maycon];
        let lista = clado_fsm.map(user => `${user}@c.us`);
        let pessoas = `@${clado_fsm.join(', @')}`;
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/curse', '/trader', '/golpe'].includes(mensagem_normalizada)){
        let random_curse = Math.floor(Math.random()*2);
        const media = MessageMedia.fromFilePath(`./pictures/curses/curse${random_curse}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/davi'){
        const media = MessageMedia.fromFilePath(`./pictures/aga/clbc_davi.mp3`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (['/dicka', '/dickao'].includes(mensagem_normalizada)) {
        let random_dicka = Math.floor(Math.random()*7);
        const media = MessageMedia.fromFilePath(`./pictures/aga/dickas/dicka${random_dicka}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/douglas'){
        let random_douglas = Math.floor(Math.random()*7);
        const media = MessageMedia.fromFilePath(`./pictures/douglas/douglas${random_douglas}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (['/kratos', '/kratosrbn', '/kratos_rbn'].includes(mensagem_normalizada)){
        let random_kratos = Math.floor(Math.random()*2);

        if(random_kratos == 1){
            let texto_kratos = `> Sereessss! 💪\n`;
            texto_kratos += `> Doem para a vila 🏘️ e o templo 🏛️ da RBN ⚔️, fomentem 💵 tudo e todos 🙌, vamos saudar 🙇 nossa senhora RBN 🩸🛡️, vamos seres ⚔️, ajudem com tudo 👊👊!!`

            await client.sendMessage(message.from, texto_kratos);
        } else {
            const media = MessageMedia.fromFilePath(`./pictures/kratos_rbn/kratos${random_kratos}.mp3`);
            await client.sendMessage(message.from, media);
        }
        return;
    }

    if (['/lycantropia', '/lycan'].includes(mensagem_normalizada)){
        let random_lycan = Math.floor(Math.random()*5);

        if (random_lycan !== 0) {
            const media = MessageMedia.fromFilePath(`./pictures/lycans/lycan${random_lycan}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        } else {
            await client.sendMessage(message.from, media);
        }
        
        return;
    }

    if (mensagem_normalizada === '/mateiro'){
        const hoje = new Date();

        const natal = (
            hoje.getMonth() === 11 &&
            hoje.getDate() >= 24 &&
            hoje.getDate() <= 25
        );

        if(natal){
            const media = MessageMedia.fromFilePath(`./pictures/mateiros/mateiro${7}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        } else {
            let random_malta = Math.floor(Math.random()*20);
            const media = MessageMedia.fromFilePath(`./pictures/mateiros/mateiro${random_malta}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        }
        return;
    }

    if (['/melga', '/melguinha', '/melgaco', '/adolfo'].includes(mensagem_normalizada)){
        let random_melga = Math.floor(Math.random()*14);
        const media = MessageMedia.fromFilePath(`./pictures/melgas/melga${random_melga}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true , 
                                                        stickerAuthor: "AracnoGian", 
                                                        stickerName: "🤗 Irrita_Melgaço.exe 🤗" });
        return;
    }

    if (['/meriva', '/sorteio'].includes(mensagem_normalizada)){
        let random_meriva = Math.floor(Math.random()*15);
        const media = MessageMedia.fromFilePath(`./pictures/merivas/meriva${random_meriva}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/metaflora') {
        let mensagem_flora = 'Qual a planta do dia? 👀\n\n';

        mensagem_flora += 'https://flora.metazooa.com';

        await client.sendMessage(message.from, mensagem_flora);
        return;
    }

    if (['/metazooa', '/metazoa'].includes(mensagem_normalizada)) {
        let mensagem_zooa = 'Qual o bicho do dia? 👀\n\n';

        mensagem_zooa += 'https://metazooa.com';

        await client.sendMessage(message.from, mensagem_zooa);
        return;
    }

    if (['/plankoidea', '/planklep'].includes(mensagem_normalizada)){
        let random_plank = Math.floor(Math.random()*1);
        const media = MessageMedia.fromFilePath(`./pictures/plankoidea/plank${random_plank}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (['/prancheta', '/prancha', '/26'].includes(mensagem_normalizada)){
        let random_prancha = Math.floor(Math.random()*2);
        const media = MessageMedia.fromFilePath(`./pictures/pranchetas/prancha${random_prancha}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (['/reh_csif', '/rehcsif', '/dobra'].includes(mensagem_normalizada)){
        let random_reh = Math.floor(Math.random()*1);

        const caminho = `./pictures/reh_csif/conhecimento${random_reh}.txt`;
        let texto_conhecimento = await fs.promises.readFile(caminho, 'utf-8');
        
        await client.sendMessage(message.from, texto_conhecimento);
        return;
    }

    if (['/tarrafer', '/fischer'].includes(mensagem_normalizada)){
        let random_tarrafer = Math.floor(Math.random()*17);

        if(random_tarrafer < 9){ //aumentar em cascata caso tenha mais .pngs
            const media = MessageMedia.fromFilePath(`./pictures/tarraferes/tarrafer${random_tarrafer}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        } else if([10, 11, 12].includes(random_tarrafer)){
            const contatinho = [`${c.mariposas.fischer}@c.us`];

            let texto_sabio = `Quote do dia do nosso amigo @${c.mariposas.fischer}:\n`;

            const quotes = [
                `> _Ah claro, como poderia me esquecer de Reh Csif, famoso escriba e colecionador privado do Segundo Período Intermédio do Egito_`,
                `> _Jahpawt jau jau spaghetti hte rau_`,
                `> _Zwibbly wobble flibbertigibbet snozzwanger snazzlepop blibber-blubber jibber-jabber!_`,
            ];
            
            texto_sabio += quotes[random_tarrafer - 10];

            await client.sendMessage(message.from, texto_sabio, {mentions: contatinho});
        } else if([13, 14, 15, 16].includes(random_tarrafer)){
            const contatinho = [`${c.mariposas.fischer}@c.us`];

            let texto_sabio2 = `Áudio supremo do nosso amigo @${c.mariposas.fischer}:`;

            await client.sendMessage(message.from, texto_sabio2, {mentions: contatinho});
            
            const media = MessageMedia.fromFilePath(`./pictures/tarraferes/tarrafer${random_tarrafer}.mp3`);
            await client.sendMessage(message.from, media);
        }
        return;
    }

    if (mensagem_normalizada === '/vem'){
        const media = MessageMedia.fromFilePath(`./pictures/aga/clbc_vem.mp3`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/vermoidea'){
        const vermoidea = [c.mariposas.fischer, c.sapo.shiva, c.formigas.davi, 
                           c.aranhas.adolfo, c.sobral, c.inacio];
        let lista = vermoidea.map(user => `${user}@c.us`);
        let pessoas = `@${vermoidea.join(', @')}`;
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }
}

// Função para o grupo "aga"
async function Comandosaga(message, mensagem_normalizada){
    
    if (['/true_aga', '/true_h'].includes(mensagem_normalizada)) {
        const true_aga = [c.formigas.davi, c.aranhas.gianlluca, c.mariposas.luis_eduardo, 
                          c.formigas.maycon, c.formigas.felipe_santos, c.formigas.gabriel_rogerio, 
                          c.formigas.gomide, c.staph.pedro_staph, c.aranhas.ryan, c.vankan, c.bot, 
                          c.sobral, c.inacio, c.emy, c.mariposas.fischer];

        const ex_aga = [c.aga.kleber, c.aga.felix, c.aga.didobola, c.aga.sofia, 
                        c.aga.maria, c.aga.vini, c.aga.barata, c.aga.laz, c.aga.meta];

        let lista = true_aga.map(user => `${user}@c.us`);
        let pessoas = `@${true_aga.join(', @')}`;

        await client.sendMessage(message.from, pessoas + ex_aga.join(', '), {mentions: lista});

        return;
    }

    if (['/cala', '/clbc', '/random_clbc'].includes(mensagem_normalizada)) {
        random_clbc_aga = [...clbc_aga][Math.floor(Math.random() * clbc_aga.size)];

        const media = MessageMedia.fromFilePath(mapear_clbc(random_clbc_aga));
        await client.sendMessage(message.from, media);

        return;
    }

    const comando_clbc = mensagem_normalizada.slice(1);
    if (clbc_aga.has(comando_clbc)) {

        try {
            const media = MessageMedia.fromFilePath(mapear_clbc(comando_clbc));
            await client.sendMessage(message.from, media);
        } catch {}

        return;
    }

    if (['/pertubacao', '/ping', '/alou'].includes(mensagem_normalizada)) {
        let true_aga = [c.formigas.davi, c.aranhas.gianlluca, c.mariposas.luis_eduardo, 
                        c.formigas.maycon, c.formigas.felipe_santos, c.formigas.gabriel_rogerio, 
                        c.formigas.gomide, c.staph.pedro_staph, c.aranhas.ryan, c.vankan, c.bot];

        true_aga = (await embaralharContatos(true_aga)).slice(0, 1);

        let lista = true_aga.map(user => `${user}@c.us`);
        let pessoas = `@${true_aga.join(', @')}`;

        for (let i = 0; i < 9; i++) {
            pessoas = await mencionarUsuario(lista, pessoas, true_aga[0], 1);
        }

        await client.sendMessage(message.from, pessoas, { mentions: lista});
        return;
    }

    if (['/certo', '/grupo_certo'].includes(mensagem_normalizada)) {
        const media = MessageMedia.fromFilePath(`./pictures/aga/grupo_certo.mp3`);
        await client.sendMessage(message.from, media);
        return;
    }
}

// Spam handling
const ultimoComando = new Map();

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
        let is_admin = await message.getContact();
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
    const todos_comandos = new Set([...lista_comandos, ...lista_easter, '/start']);

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
            if (permitidos.includes(message.from)) {
                await Comandos(message, mensagem_normalizada);
                await ComandosEasterEgg(message, mensagem_normalizada);
            }

            if ([`${c.grupo_aga}@g.us`, `${c.aranhas.gianlluca}@c.us`].includes(message.from)) {
                await Comandosaga(message, mensagem_normalizada);
            }
        } finally {
            // limpa o usuário da lista depois de 2 s
            setTimeout(() => {
                if (ultimoComando.get(usuario) === agora) {
                    ultimoComando.delete(usuario);
                }
            }, 2000);
        }
    }
});

// Ligar o bot
client.initialize();