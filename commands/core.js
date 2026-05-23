// Módulos necessários
const fs = require('fs');
const path = require('path');

const { MessageMedia } = require('whatsapp-web.js');
const c = require('../config/contacts_load');
const { embaralharContatos, mencionarUsuario } = require('../lib/utils');

const { stopPath } = require('../config/paths');


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
// "contato_comando" = variável para evitar que o usuário que mandou o comando seja marcado no próprio comando
async function Comandos(client, message, mensagem_normalizada, contato_comando) {
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

module.exports = { Comandos, lista_comandos };