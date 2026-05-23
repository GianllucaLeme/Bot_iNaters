const c = require('./contacts_load');

// Lista de grupos permitidos para leitura dos comandos
const gruposPermitidos = [
    `${c.grupo_iNaturalisters}@g.us`,
    `${c.grupo_bot_iNaters}@g.us`,
    `${c.grupo_teste}@g.us`,
    `${c.grupo_aga}@g.us`,
    `${c.grupo_nepsilon}@g.us`
];

module.exports = { gruposPermitidos };