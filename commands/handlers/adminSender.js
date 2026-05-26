const c = require('../../config/contacts_load');

// Funções para auxiliar nos comandos de administrador
async function obterChatGrupo(client, message) {
    const chat = await message.getChat();

    if (!chat.isGroup) {
        await client.sendMessage(message.from, '> Esse comando só funciona em grupos.');
        return null;
    }

    return chat;
}

function obterAdmins(chat) {
    return chat.participants
        .filter(p => p.isAdmin || p.isSuperAdmin)
        .map(p => p.id.user);
}

function ehAdmin(chat, contato) {

    const admins = obterAdmins(chat);

    return (
        admins.includes(contato.id.user) ||
        contato.id.user === c.aranhas.gianlluca
    );
}


module.exports = { obterChatGrupo, obterAdmins, ehAdmin };