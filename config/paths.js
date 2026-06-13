// Permite a criação do arquivo STOP para pausar o bot
const path = require('path');

// Variáveis para pausa e reinicialização do bot
const pausedGroupsPath = path.join(process.cwd(), 'pausedGroups.json');
const restartPath = path.join(process.cwd(), 'RESTART_NOTICE');

module.exports = { pausedGroupsPath, restartPath };