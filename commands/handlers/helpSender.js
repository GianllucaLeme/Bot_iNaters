const { MessageMedia } = require('whatsapp-web.js');

const { lista_comandos } = require('../core');

const c = require('../../config/contacts_load');


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
        '/all', '/serpente', '/cupins', '/isoptera', '/escorpioes', '/gafanhoto', 
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
        } else if (cmd_main === '/barbeiro') {
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
        '/anura', '/bichopau', '/calango', '/caranguejo', '/cogumelo', 
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


// Funções para auxiliar nos comandos de ajuda
async function enviarHelp(client, message) {

    const usuario_duvida = message.author || message.from;

    await client.sendMessage(usuario_duvida, help_cache);
}

async function enviarHelp2(client, message) {

    const usuario_duvida = message.author || message.from;

    await client.sendMessage(usuario_duvida, help2_cache);
}

async function enviarSac(client, message) {
    if (!(Math.random() < 0.01)) {
        await client.sendMessage(message.from, sac_cache);

    } else {
        const media = MessageMedia.fromFilePath('./pictures/bloisinhos/blois2.png');
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }
}

async function enviarSobre(client, message) {
    const usuario_curioso = message.author || message.from;
    await client.sendMessage(usuario_curioso, sobre_cache, { mentions: [c.aranhas.gianlluca + '@c.us'] });
}

async function enviarTirarNome(client, message) {
    const usuario_tirar = await message.getContact();

    await client.sendMessage(message.from, '> Pedido enviado.');

    setTimeout(async () => {
        await client.sendMessage(c.aranhas.gianlluca + '@c.us', `O @${usuario_tirar.id.user} quer retirar a marcação!`, {mentions: usuario_tirar.id.user + '@c.us'});
    }, 3000);
}


module.exports = {
    enviarHelp,
    enviarHelp2,
    enviarSac,
    enviarSobre,
    enviarTirarNome
};