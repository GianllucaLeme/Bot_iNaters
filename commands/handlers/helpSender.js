const { MessageMedia } = require('whatsapp-web.js');

const { lista_comandos } = require('../../config/commandList');

const { Mapa_comandos } = require('../helpers/mentionCommands');
const { Descricao_alternativos } = require('../maps/mentionAliases');

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
        '/esperanca', '/orthoptera', '/hemiptera', '/opilioes', '/gerromorpha', '/bicho_pau', '/phasma', 
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
        const config = Mapa_comandos.get(cmd_main);

        if (!config?.descricao) {
            return `* \`${cmd_main}\``;
        }
        
        if(config.descricao.startsWith('ou')){
            return `* \`${cmd_main}\` ${config.descricao}`;
        }

        return `* \`${cmd_main}\` - ${config.descricao}`;
    }).join('\n');

    return mensagem;
})();

const help2_cache = (() => {
    
    let comandos_avancados = [
        '/anura', '/bicho_pau', '/calango', '/caranguejo', '/cogumelo', '/coleoptera',
        '/cupins', '/dicotiledonea', '/diptera', '/escorpioes', '/esperança', '/gerromorpha', 
        '/hemiptera', '/lepi', '/marimbondo', '/neuroptera', '/opilioes', '/plecoptera', 
        '/pseudoescorpiao', '/scolytinae', '/staphylinidae', '/strepsiptera', 
        '/thysanoptera', '/tipulomorpha', '/zygentoma'
    ];

    let mensagem = `> Comandos Avançados - variações dos comandos básicos *[ordem alfabética]*\n`;
    
    mensagem += comandos_avancados.map(cmd_main => {
        const descricao = Descricao_alternativos.get(cmd_main);

        if (!descricao) {
            return `* \`${cmd_main}\``;
        }
        
        if(descricao.startsWith('ou')){
            return `* \`${cmd_main}\` ${descricao}`;
        }

        if(descricao.startsWith(',')){
            return `* \`${cmd_main}\`${descricao}`;
        }

        return `* \`${cmd_main}\` - ${descricao}`;
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

// Mudança de versão do bot ocorre aqui
const sobre_cache = (() => {
    let mensagem = 'O \`iMark\` foi criado para facilitar o processo de identificação de animais, plantas, fungos etc., permitindo a marcação automática de membros especializados em seus grupos taxonômicos.\n\n';

    mensagem += 'Com essa funcionalidade, elimina-se a necessidade de saber exatamente quem marcar, sendo especialmente útil para quem é novo no grupo. Além disso, esse bot promove uma interação melhor e mais dinâmica entre os membros mais antigos e novos.\n\n';
    
    mensagem += 'Sugestões mandar no privado do autor! 👇\n\n'
    
    mensagem += `Desenvolvedor: @${c.aranhas.gianlluca}\n`;
    mensagem += 'Versão atual: \`\`\`1.3.2\`\`\`\n';
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
        // try para evitar que o bot encerre caso haja algum problema ao enviar a mensagem
        try {
            await client.sendMessage(c.aranhas.gianlluca + '@c.us', 
                    `O @${usuario_tirar.id.user} quer retirar a marcação!`, 
                    { mentions: [usuario_tirar.id.user + '@c.us'] }
            );
        
        } catch (error) {
            console.error('[tirar_nome] Falha ao notificar: ', error.message);
        }
    }, 3000);
}


module.exports = {
    enviarHelp,
    enviarHelp2,
    enviarSac,
    enviarSobre,
    enviarTirarNome
};