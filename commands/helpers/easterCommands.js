const c = require('../../config/contacts_load');

const easterCommands = new Map([
    ['/aga', {
        tipo: 'mention',
        
        usuarios: [c.formigas.davi, c.aranhas.gianlluca, c.mariposas.luis_eduardo, 
                   c.formigas.maycon, c.formigas.felipe_santos, c.formigas.gabriel_rogerio, 
                   c.formigas.gomide, c.staph.pedro_staph, c.aranhas.ryan, c.vankan, c.bot]
    }],

    ['/bot', {
        tipo: 'random_sticker',
        pasta: './pictures/bot_patadas',
        prefixo: 'patada',
        max: 3
    }],
    
    ['/bloisinho', {
        tipo: 'random_sticker',
        pasta: './pictures/bloisinhos',
        prefixo: 'blois',
        max: 10
    }],

    ['/caf', {
        tipo: 'media',
        pasta: './pictures/certidao_caf',
        prefixo: 'caf',
        max: 1
    }],

    ['/cladofsm', {
        tipo: 'mention',
        
        usuarios: [c.mariposas.fischer, c.sapo.shiva, c.formigas.maycon]
    }],

    ['/curse', {
        tipo: 'media',
        pasta: './pictures/curses',
        prefixo: 'curse',
        max: 2
    }],

    ['/dicka', {
        tipo: 'media',
        pasta: './pictures/aga/dickas',
        prefixo: 'dicka',
        max: 7
    }],

    ['/douglas', {
        tipo: 'media',
        pasta: './pictures/douglas',
        prefixo: 'douglas',
        max: 7
    }],

    ['/meriva', {
        tipo: 'media',
        pasta: './pictures/merivas',
        prefixo: 'meriva',
        max: 15
    }],

    ['/metaflora', {
        tipo: 'text',
        mensagem: 'Qual a planta do dia? 👀\n\nhttps://flora.metazooa.com'
    }],

    ['/metazooa', {
        tipo: 'text',
        mensagem: 'Qual o bicho do dia? 👀\n\nhttps://metazooa.com'
    }],

    ['/planklep', {
        tipo: 'media',
        pasta: './pictures/plankoidea',
        prefixo: 'plank',
        max: 1
    }],

    ['/prancheta', {
        tipo: 'media',
        pasta: './pictures/pranchetas',
        prefixo: 'prancha',
        max: 2
    }],

    ['/vermoidea', {
        tipo: 'mention',
        
        usuarios: [c.mariposas.fischer, c.sapo.shiva, c.formigas.davi, 
                   c.aranhas.adolfo, c.sobral, c.inacio]
    }],
]);

const lista_easter_set = new Set(easterCommands.keys());

module.exports = { easterCommands, lista_easter_set };