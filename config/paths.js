// Permite a criação do arquivo STOP para pausar o bot
const path = require('path');

// Variáveis para pausa e reinicialização do bot
const stopPath = path.join(process.cwd(), 'STOP');
const restartPath = path.join(process.cwd(), 'RESTART_NOTICE');

module.exports = { stopPath, restartPath };