const { MessageMedia } = require('whatsapp-web.js');

const { easterCommands, easterCommands_custom } = require('./helpers/easterCommands');
const { easterAliases } = require('./maps/easterAliases');

const { enviarStickerAleatorio, enviarTexto, enviarMedia, enviarMentions } = require('./handlers/easterSender');


// Função para os comandos Easter Eggs
async function ComandosEasterEgg(client, message, mensagem_normalizada){
    let comando = mensagem_normalizada;

    if (easterAliases.has(mensagem_normalizada)) {
        comando = easterAliases.get(mensagem_normalizada);
    }

    const comando_custom = easterCommands_custom.get(comando);

    if (comando_custom) {
        await comando_custom(client, message);
        return true;
    }

    const config = easterCommands.get(comando);

    if (config) {
        switch (config.tipo) {
            case 'mention':
                await enviarMentions(client, message, config.usuarios);
                return true;
    
            case 'random_sticker':
                await enviarStickerAleatorio(client, message, config);
                return true;
    
            case 'text':
                await enviarTexto(client, message, config);
                return true;
            
            case 'media':
                await enviarMedia(client, message, config);
                return true;
        }
    }

    return false;
}


module.exports = { ComandosEasterEgg };