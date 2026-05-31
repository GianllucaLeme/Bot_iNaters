const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const c = require('../config/contacts_load');

const { easterCommands, easterCommands_custom, lista_easter_set } = require('./helpers/easterCommands');
const { easterAliases } = require('./maps/easterAliases');

const { enviarStickerAleatorio, enviarTexto, enviarMedia, enviarMentions } = require('./handlers/easterSender');

const { lista_easter } = require('../config/commandList');


// Função para os comandos Easter Eggs
async function ComandosEasterEgg(client, message, mensagem_normalizada){
    let comando = mensagem_normalizada;

    if (easterAliases.has(mensagem_normalizada)) {
        comando = easterAliases.get(mensagem_normalizada);
    }

    const comando_custom = easterCommands_custom.get(comando);

    if (comando_custom) {
        await comando_custom(client, message);
        return;
    }

    const config = easterCommands.get(comando);

    if (config) {
        switch (config.tipo) {
            case 'mention':
                await enviarMentions(client, message, config.usuarios);
                break;
    
            case 'random_sticker':
                await enviarStickerAleatorio(client, message, config);
                break;
    
            case 'text':
                await enviarTexto(client, message, config);
                break;
            
            case 'media':
                await enviarMedia(client, message, config);
                break;
        }
    }
}


module.exports = { ComandosEasterEgg };