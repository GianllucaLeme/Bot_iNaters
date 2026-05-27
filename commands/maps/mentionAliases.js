// Mapa para variação de comandos (x, y)
// A ordem importa: (alternativo1, nome_principal)
//                  (alternativo2, nome_principal)
const Nomes_alternativos = new Map([
    ['/bicho_pau', '/bichopau'],
    ['/phasma', '/bichopau'],

    ['/soldadinho', '/cigarrinha'],
    ['/membracidae', '/cigarrinha'],

    ['/serpente', '/cobra'],

    ['/cupins', '/cupim'],
    ['/isoptera', '/cupim'],

    ['/escorpioes', '/escorpiao'],

    ['/neuroptera', '/formiga_leao'],

    ['/cogumelo', '/fungo'],
    ['/fungi', '/fungo'],

    ['/gafanhoto', '/grilo'],
    ['/esperanca', '/grilo'],
    ['/orthoptera', '/grilo'],

    ['/hemiptera', '/hemi'],

    ['/lepi', '/lagarta'], 
    ['/lepidoptera', '/lagarta'],

    ['/calango', '/lagarto'],
    ['/gekkota', '/lagarto'],

    ['/louva_deus', '/louva'],
    ['/mantis', '/louva'],
    ['/mantodea', '/louva'],

    ['/mollusca', '/marinho'],
    ['/molusco', '/marinho'],
    ['/concha', '/marinho'],
    ['/caracol', '/marinho'],
    ['/caramujo', '/marinho'],
    ['/caranguejo', '/marinho'],
    ['/gastropoda', '/marinho'],

    ['/diptera', '/mosca'],

    ['/opilioes', '/opiliao'],

    ['/gerromorpha', '/percevejo_aq'],

    ['/plecoptera', '/plec'],

    ['/pseudoescorpiao', '/pseudo'],
    ['/pseudoescorpioes', '/pseudo'],

    ['/monocotiledonea', '/monocot'],

    ['/dicotiledonea', '/dicot'],

    ['/anura', '/sapo'],

    ['/scolytinae', '/scoly'],
    ['/brocas', '/scoly'],

    ['/staphylinidae', '/staph'],

    ['/strepsiptera', '/strep'],

    ['/tipulomorpha', '/tipula'],

    ['/zygentoma', '/traca'],

    ['/thysanoptera', '/tripe'],

    ['/vespidae', '/vespa'],
    ['/maribondo', '/vespa'],
    ['/marimbondo', '/vespa']
]);


module.exports = { Nomes_alternativos };