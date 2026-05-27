const c = require('../../config/contacts_load');

// Objetos auxiliares para os comandos do grupo "aga"
const clbc_aga = new Set([
    'dido', 'felipe', 'gabriel', 'gomide', 'henrique', 'kleber', 'laz', 'luis', 
    'maycon', 'mayconu7', 'meta', 'pedro', 'pinguim', 'ryan', 'calabot', 'bot2', 
    'sophia', 'sofia', 'carrasco', 'maria', 'cristina', 'vini', 'gian', 'gia', 
    'barata2', 'safira',
    
    c.aga.kleber_audio, c.aga.kleber_audio2, c.aga.dido_audio, c.aga.dido_audio2, 
    c.aga.laz_audio
]);

const lista_easter_aga = new Set([
    '/true_aga', '/true_h', '/cala', '/clbc', '/random_clbc', '/pertubacao', '/ping', 
    '/alou', '/dicka', '/dickao', '/certo', '/grupo_certo'
]);

for (const comando of clbc_aga) {
    lista_easter_aga.add(`/${comando}`);
}

const mapa_audios = new Map([
    [new Set(['calabot', 'bot2']),                'clbc_bot.mp3'],
    [new Set(['sophia', 'sofia', 'carrasco']),    'clbc_sofia.mp3'],
    [new Set(['maria', 'cristina']),              'clbc_maria.mp3'],
    [new Set(['mayconu7']),                       'clbc_maycon.mp3'],
    [new Set(['gian', 'gia']),                    'fale_mais_gian.mp3'],
    [new Set(['barata2']),                        'clbc_safira.mp3'],

    [new Set([c.aga.dido_audio, c.aga.dido_audio2]), 'clbc_dido.mp3'],
    [new Set([c.aga.kleber_audio, c.aga.kleber_audio2]), 'clbc_kleber.mp3'],
    [new Set([c.aga.laz_audio]), 'clbc_laz.mp3'],
]);


module.exports = { clbc_aga, lista_easter_aga, mapa_audios };