const { enviarHelp, enviarHelp2, enviarSac,
        enviarSobre, enviarTirarNome
} = require('./handlers/helpSender');


// Função para os comandos de ajuda
async function ComandosAjuda(client, message, mensagem_normalizada) {

    if (mensagem_normalizada === '/help') {
        await enviarHelp(client, message);
        return true;
    }

    if (mensagem_normalizada === '/help2') {
        await enviarHelp2(client, message);
        return true;
    }

    if (mensagem_normalizada === '/sac') {
        await enviarSac(client, message);
        return true;
    }

    if (mensagem_normalizada === '/sobre') {
        await enviarSobre(client, message);
        return true;
    }

    if (mensagem_normalizada === '/tirar_nome') {
        await enviarTirarNome(client, message);
        return true;
    }

    return false;
}


module.exports = { ComandosAjuda };