const fs = require('fs');
const path = require('path');

const { MessageMedia } = require('whatsapp-web.js');
const c = require('../config/contacts_load');

const { obterChatGrupo, obterAdmins, ehAdmin } = require('./handlers/adminSender');

const { embaralharContatos } = require('../lib/utils');

const { stopPath } = require('../config/paths');

// Função para os comandos de administrador
async function ComandosAdmin(client, message, mensagem_normalizada, contato_comando){
    if (mensagem_normalizada === '/admin') {
        // Evita que o bot quebre caso o comando seja utilizado em uma conversa privada
        const chat = await obterChatGrupo(client, message);

        if (!chat) {
            return true;
        }

        let admins = obterAdmins(chat);

        // Exceções para admins não oficiais
        admins.push(c.aranhas.gianlluca);

        admins = [...new Set(admins)];

        admins = admins.filter(user => user !== contato_comando.id.user);

        if (admins.length === 0) {
            await client.sendMessage(message.from, '> Só há você de admin no grupo.');
            return true;
        }

        // Embaralha e pega 2 admins aleatórios para marcar
        admins = embaralharContatos(admins).slice(0, 2);

        const lista = admins.map(user => `${user}@c.us`);
        const pessoas = `@${admins.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return true;
    }

    if (mensagem_normalizada === '/stop') {
        const chat = await obterChatGrupo(client, message);

        if (!chat) {
            return true;
        }

        if (!ehAdmin(chat, contato_comando)) {
            await client.sendMessage(message.from, '> Você não tem autorização para utilizar esse comando.');
            return true;
        }

        fs.writeFileSync(stopPath, 'stopped');
        await client.sendMessage(message.from, '> Bot pausado. Use /start para reativá-lo.');

        return true;
    }

    if (mensagem_normalizada === '/all') {
        const chat = await obterChatGrupo(client, message);

        if (!chat) {
            return true;
        }

        if (!ehAdmin(chat, contato_comando)) {
            await client.sendMessage(message.from, '> Você não tem autorização para utilizar esse comando.');
            return true;
        }

        let mentions = chat.participants.map(p => `${p.id.user}@c.us`);

        mentions = mentions.filter(user => user !== `${contato_comando.id.user}@c.us`);

        await chat.sendMessage('> Marcando todo mundo...', { mentions });

        return true;
    }

    return false;
}


module.exports = { ComandosAdmin };