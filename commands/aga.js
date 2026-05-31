const { MessageMedia } = require('whatsapp-web.js');
const c = require('../config/contacts_load');

const { mencionarUsuario, embaralharContatos} = require('../lib/utils');

const { agaAliases } = require('./maps/agaAliases');
const { clbc_aga } = require('../config/commandList');
const { enviarAudioaga, enviarTrueAGA, enviarPertubacao } = require('./handlers/agaSender');


// Função para o grupo "aga"
async function Comandosaga(client, message, mensagem_normalizada){
    let comando = mensagem_normalizada;

    if (agaAliases.has(mensagem_normalizada)) {
        comando = agaAliases.get(mensagem_normalizada);
    }

    if (comando === '/true_aga') {
        await enviarTrueAGA(client, message);
        return true;
    }

    if (comando === '/cala') {
        random_clbc_aga = [...clbc_aga][Math.floor(Math.random() * clbc_aga.size)];

        enviarAudioaga(client, message, random_clbc_aga);
        return true;
    }

    if (clbc_aga.has(comando.slice(1))) {
        enviarAudioaga(client, message, comando.slice(1));
        return true;
    }

    if (comando === '/pertubacao') {
        enviarPertubacao(client, message);
        return true;
    }

    if (comando === '/certo') {
        const media = MessageMedia.fromFilePath(`./pictures/aga/grupo_certo.mp3`);
        await client.sendMessage(message.from, media);
        return true;
    }

    return false;
}

module.exports = { Comandosaga };