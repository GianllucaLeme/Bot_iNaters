const { MessageMedia } = require('whatsapp-web.js');
const c = require('../config/contacts_load');

const { mencionarUsuario, embaralharContatos} = require('../lib/utils');

// Objetos auxiliares para os comandos do grupo "aga"
const clbc_aga = new Set([
    'dido', 'felipe', 'gabriel', 'gomide', 'henrique', 'kleber', 'laz', 'luis', 
    'maycon', 'mayconu7', 'meta', 'pedro', 'pinguim', 'ryan', 'calabot', 'bot2', 
    'sophia', 'sofia', 'carrasco', 'maria', 'cristina', 'vini', 'gian', 'gia', 
    'barata2', 'safira',
    
    c.aga.kleber_audio, c.aga.kleber_audio2, c.aga.dido_audio, c.aga.dido_audio2
]);

const lista_easter_aga = new Set([
    '/true_aga', '/true_h', '/cala', '/clbc', '/random_clbc', '/pertubacao', '/ping', 
    '/alou', '/dicka', '/dickao', '/certo', '/grupo_certo'
]);

for (const comando of clbc_aga) {
    lista_easter_aga.add(`/${comando}`);
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


// Função para o grupo "aga"
async function Comandosaga(client, message, mensagem_normalizada, contato_comando){
    
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

module.exports = { Comandosaga, lista_easter_aga, clbc_aga };