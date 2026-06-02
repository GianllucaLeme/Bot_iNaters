const { mencionarUsuario, embaralharContatos } = require('../../lib/utils');

// Função responsável por enviar as marcações envolvendo 
// os membros da área e membros mais ativos do grupo (prioridade)
async function enviarMarcacoes({
    client, message, contato_comando,

    membros = [], prioridade = [], adicionais = [],

    embaralhar = false, limite_membros = null,

    erro = '> Não há mais ninguém da área para marcar.'
}) {
    
    // Variável para evitar que o usuário que mandou o comando seja marcado no próprio comando
    const caller = contato_comando.id.user;

    membros = membros.filter(user => user !== caller);
    prioridade = prioridade.filter(user => user !== caller);

    // Condicional para limitar quantas pessoas serão marcadas
    // (Auxilia em comandos com muitos membros)
    if (embaralhar) {
        membros = embaralharContatos([...membros]);

        if (limite_membros) {
            membros = membros.slice(0, limite_membros);
        }
    }

    // Condicional para enviar uma mensagem customizada caso não 
    // tenha outros especialistas além de você dentro do comando
    if (membros.length === 0 && prioridade.length === 0 && 
        adicionais.every(a => a.usuario === caller)) {

        await client.sendMessage(message.from, erro);
        return;
    }


    let lista = membros.map(user => `${user}@c.us`);
    let pessoas = `@${membros.join(', @')}`;

    // Loop para percorrer os membros mais ativos
    for (const usuario of prioridade) {
        pessoas = mencionarUsuario(lista, pessoas, usuario, 1);
    }

    // Loop para percorrer membros extras
    for (const adicional of adicionais) {
        if (caller !== adicional.usuario) {
            pessoas = mencionarUsuario(lista, pessoas, adicional.usuario, adicional.chance);
        }
    }

    await client.sendMessage(message.from, pessoas, { mentions: lista });
}


module.exports = { enviarMarcacoes };