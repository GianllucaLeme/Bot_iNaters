const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

// Funções para auxiliar nos comandos de easter egg
async function enviarStickerAleatorio(client, message, config) {
    const random = Math.floor(Math.random() * config.max);

    const media = MessageMedia.fromFilePath(`${config.pasta}/${config.prefixo}${random}.png`);

    if (config.descricao) {
        await client.sendMessage(message.from, media, config.descricao);
    } else {
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }
}

async function enviarTexto(client, message, config) {
    if (config.conhecimento) {
        const texto = await fs.promises.readFile(config.conhecimento,'utf-8');
        await client.sendMessage(message.from, texto);
        
    } else {
        await client.sendMessage(message.from, config.mensagem);
    }
}

async function enviarMedia(client, message, config) {
    let arquivo;

    if (config.max) {
        const random = Math.floor(Math.random() * config.max);

        arquivo = `${config.prefixo}${random}.${config.ext}`;
    } else {
        arquivo = `${config.prefixo}.${config.ext}`;
    }

    const media = MessageMedia.fromFilePath(`${config.pasta}/${arquivo}`);

    await client.sendMessage(message.from, media);
}

async function enviarMentions(client, message, usuarios) {
    const lista = usuarios.map(user => `${user}@c.us`);
    const pessoas = `@${usuarios.join(', @')}`;

    await client.sendMessage(message.from, pessoas, { mentions: lista });
}


module.exports = { enviarStickerAleatorio, enviarTexto, enviarMedia, enviarMentions };