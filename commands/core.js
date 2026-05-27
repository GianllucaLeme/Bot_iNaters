// Módulos necessários
const fs = require('fs');

const { MessageMedia } = require('whatsapp-web.js');
const c = require('../config/contacts_load');
const { embaralharContatos, mencionarUsuario } = require('../lib/utils');

const { Mapa_comandos } = require('./maps/mentionCommands');
const { Nomes_alternativos } = require('./maps/mentionAliases');

const { enviarMarcacoes } = require('./handlers/mentionSender');


const lista_comandos = new Set([
    '/help', '/help2', '/admin', '/bicho', '/milicia', '/sac', '/sobre', '/tirar_nome', 
    
    '/rbn', '/aranha', '/abelha', '/ave', '/barata', '/barbeiro', '/besouro', '/bichopau', 
    '/bicho_pau', '/phasma', '/borboleta', '/cigarra', '/cigarrinha','/cobra', '/serpente', '/cupim', 
    '/cupins', '/isoptera', '/diplopoda', '/escorpiao', '/escorpioes', '/formiga', '/formiga_leao', 
    '/fungo', '/cogumelo', '/fungi', '/neuroptera', '/geoplanaria', '/grilo', '/gafanhoto', '/esperanca', 
    '/orthoptera', '/hemi', '/hemiptera', '/lagarta', '/lepi', '/lepidoptera', '/lagarto', '/calango', 
    '/gekkota', '/louva', '/louva_deus', '/mantis', '/mantodea', '/marinho', '/mollusca', '/molusco', '/concha', 
    '/caracol', '/caramujo', '/caranguejo', '/gastropoda', '/mariposa', '/morcego', '/mosca', '/diptera', '/mosquito', 
    '/opiliao', '/opilioes', '/percevejo', '/percevejo_aq', '/gerromorpha', '/planta', '/plec', '/plecoptera', 
    '/monocot', '/monocotiledonea', '/dicot', '/dicotiledonea', '/pseudo', '/pseudoescorpiao', '/pseudoescorpioes', 
    '/sapo', '/anura', '/scoly', '/scolytinae', '/brocas', '/soldadinho', '/membracidae', '/staph', '/staphylinidae', 
    '/strep', '/strepsiptera', '/tipula', '/tipulomorpha', '/traca', '/zygentoma', '/tripe', '/thysanoptera', 
    '/vespa', '/vespidae', '/maribondo', '/marimbondo',
    
    '/stop', '/all']);


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

module.exports = { Comandos, lista_comandos };