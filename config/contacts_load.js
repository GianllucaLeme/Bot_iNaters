// Carrega o arquivo JSON
const fs = require('fs');

const c = JSON.parse(fs.readFileSync('contacts.json', 'utf-8'));

module.exports = c;