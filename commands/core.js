// Módulos necessários
const fs = require('fs');

const { MessageMedia } = require('whatsapp-web.js');
const c = require('../config/contacts_load');
const { embaralharContatos, mencionarUsuario } = require('../lib/utils');

const { Mapa_comandos } = require('./helpers/mentionCommands');
const { Nomes_alternativos } = require('./maps/mentionAliases');

const { enviarMarcacoes } = require('./handlers/mentionSender');

const { lista_comandos } = require('../config/commandList');


// Função que rege os comandos principais
// "contato_comando" = variável para evitar que o usuário que mandou o comando seja marcado no próprio comando
async function Comandos(client, message, mensagem_normalizada, contato_comando) {
    let comando = mensagem_normalizada;

    // Condicional para buscar no mapa de nomes extras para um mesmo comando
    if (Nomes_alternativos.has(mensagem_normalizada)) {
        comando = Nomes_alternativos.get(mensagem_normalizada);
    }

    // Puxa os membros e constrói a mensagem
    const config = Mapa_comandos.get(comando);

    if (config) {
        await enviarMarcacoes({ client, message, contato_comando, ...config });
        return;
    }

}


module.exports = { Comandos };