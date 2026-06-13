const c = require('../../config/contacts_load');

const agaAliases = new Map([
    ['/true_h', '/true_aga'],

    ['/clbc', '/cala'],
    ['/random_clbc', '/cala'],

    ['/ping', '/pertubacao'],
    ['/alou', '/pertubacao'],

    ['/dickao', '/dicka'],

    ['/grupo_certo', '/certo'],

    [`/${c.aga.dido_audio}`, '/dido'],
    [`/${c.aga.dido_audio2}`, '/dido'],

    [`/${c.aga.kleber_audio}`, '/kleber'],
    [`/${c.aga.kleber_audio2}`, '/kleber'],

    [`/${c.aga.laz_audio}`, '/laz'],

    [`/${c.aga.henrique_audio}`, '/henrique'],

    ['/mayconu7', '/maycon'],

    ['/bot2', '/calabot'],

    ['/sophia', '/sofia'],
    ['/carrasco', '/sofia'],

    ['/cristina', '/maria'],

    ['/gia', '/gian'],

    ['/barata2', '/safira']
]);

module.exports = { agaAliases };