const fs = require('fs');
const { pausedGroupsPath } = require('../config/paths');

// Função que determina a chance do usuário ser marcado
function chanceUsuario(usuario, chance) {
    if (Math.random() < chance) {
        return usuario;
    } else {
        return null;
    }
}

// Função que adiciona o usuário para ser propriamente mencionado na mensagem
function mencionarUsuario(lista, pessoas, usuario, chance) {
    const marcacao = chanceUsuario(usuario, chance);
    
    if(marcacao){
        lista.push(marcacao + '@c.us');
        return pessoas + `, @${marcacao}`;
    }else{
        return pessoas;
    }
}

// Função para embaralhar a lista de contatos
function embaralharContatos(contatos) {
    for (let i = contatos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [contatos[i], contatos[j]] = [contatos[j], contatos[i]];  // Troca os elementos
    }
    return contatos;
}

// Função para remover acentos de uma string
function removerAcentos(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Função para extrair o comando de mensagens que contenham um URL
function extrairComandodeURL(message) {
    if (!message) return null;

    // Divide a mensagem em linhas
    const linhas = message.split('\n');

    for (let linha of linhas) {
        linha = linha.trim();

        // Procura algo que comece com "/"
        const match = linha.match(/^\/[\p{L}0-9_?]+$/u);

        if (match) {
            return match[0];
        }
    }

    return null;
}

// Função para tratar variações de comandos do usuário, como pluralização, espaços, acentos etc.

// Evitar a remoção do "s" para certos comandos
const excecoes = new Set([
        '/brocas', '/cupins', '/escorpioes', '/louva_deus', 
        '/mantis', '/nos', '/opilioes', '/pseudoescorpioes',
        '/blois','/douglas','/kratos','/luis'
]);

function normalizarComando(message) {
    if (!message) return null;

    let comando = message.toLowerCase().trim();

    comando = removerAcentos(comando);

    // Ignora comandos entre aspas ou com "> " ou do tipo "/comando [frase aleatória]"
    if (/^["'~].*["'~]$/.test(comando) || comando.startsWith('>')) {
        return null;
    }

    // Remove caracteres especiais no começo e no fim (asteriscos, crases etc)
    comando = comando.replace(/^[^a-z0-9/]+|[^a-z0-9]+$/gi, '');

    if (!excecoes.has(comando) && comando.endsWith('s')) {
        comando = comando.slice(0, -1);
    }

    return comando;
}

// Funções auxiliares de pausa/retomada do bot
function carregarGruposPausados() {
    try {
        if (!fs.existsSync(pausedGroupsPath)) {
            return {};
        }

        const conteudo = fs.readFileSync(pausedGroupsPath, 'utf-8');
        return JSON.parse(conteudo);

    } catch (err) {
        console.error('[ERRO] Falha ao carregar pausedGroups.json:', err);
        return {};
    }
}

function salvarGruposPausados(grupos) {
    try {
        fs.writeFileSync(pausedGroupsPath, JSON.stringify(grupos, null, 4));

    } catch (err) {
        console.error('[ERRO] Falha ao salvar pausedGroups.json:', err);
    }
}


module.exports = {
    mencionarUsuario,
    embaralharContatos,
    
    extrairComandodeURL,
    normalizarComando,

    carregarGruposPausados,
    salvarGruposPausados
};