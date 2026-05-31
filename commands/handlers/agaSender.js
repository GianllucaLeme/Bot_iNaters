const c = require('../../config/contacts_load');
const { MessageMedia } = require('whatsapp-web.js');

const { embaralharContatos, mencionarUsuario } = require('../../lib/utils');

const { mapa_audios } = require('../helpers/agaCommands');

// Funções para mapear as pessoas e os seus respectivos áudios
function mapear_clbc(pessoa) {
    if (mapa_audios.has(pessoa)) {
        return mapa_audios.get(pessoa);
    }
    
    return `clbc_${pessoa}.mp3`;
}

async function enviarAudioaga(client, message, pessoa) {
    try {
        const media = MessageMedia.fromFilePath(`./pictures/aga/${mapear_clbc(pessoa)}`);
        await client.sendMessage(message.from, media);
    } catch {}
}

// Funções para enviar as marcações
async function enviarTrueaga(client, message) {
    const true_aga = [c.formigas.davi, c.aranhas.gianlluca, c.mariposas.luis_eduardo, 
                      c.formigas.maycon, c.formigas.felipe_santos, c.formigas.gabriel_rogerio, 
                      c.formigas.gomide, c.staph.pedro_staph, c.aranhas.ryan, c.vankan, c.bot, 
                      c.sobral, c.inacio, c.emy, c.mariposas.fischer];

    const ex_aga = [c.aga.kleber, c.aga.felix, c.aga.didobola, c.aga.sofia, 
                    c.aga.maria, c.aga.vini, c.aga.barata, c.aga.laz, c.aga.meta];

    let lista = true_aga.map(user => `${user}@c.us`);
    let pessoas = `@${true_aga.join(', @')}`;

    await client.sendMessage(message.from, pessoas + ex_aga.join(', '), {mentions: lista});
}

async function enviarPertubacao(client, message) {
    let true_aga = [c.formigas.davi, c.aranhas.gianlluca, c.mariposas.luis_eduardo, 
                    c.formigas.maycon, c.formigas.felipe_santos, c.formigas.gabriel_rogerio, 
                    c.formigas.gomide, c.staph.pedro_staph, c.aranhas.ryan, c.vankan, c.bot];

    true_aga = embaralharContatos(true_aga).slice(0, 1);

    let lista = true_aga.map(user => `${user}@c.us`);
    let pessoas = `@${true_aga.join(', @')}`;

    for (let i = 0; i < 9; i++) {
        pessoas = mencionarUsuario(lista, pessoas, true_aga[0], 1);
    }

    await client.sendMessage(message.from, pessoas, { mentions: lista});
}

module.exports = { mapear_clbc, enviarAudioaga, enviarTrueaga, enviarPertubacao};