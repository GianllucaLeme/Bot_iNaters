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

// Mapa para a descrição dos comandos alternativos
const Descricao_alternativos = new Map([
    ['/anura', 'sapos e pererecas'],

    ['/calango', 'ou `/gekkota`'],
    
    ['/caranguejo', ', `/mollusca`, `/molusco`, `/concha`, `/caracol`, `/caramujo` ou `/gastropoda`'],

    ['/cogumelo', 'ou `/fungi`'],

    ['/cupins', 'ou `/isoptera`'],

    ['/dicotiledonea', 'ou `/monocotiledonea`'],

    ['/esperança', ', `/gafanhoto` ou `/orthoptera`'],

    ['/gerromorpha', 'percevejos aquáticos'],

    ['/lepi', 'ou `/lepidoptera`'],

    ['/marimbondo', 'ou `/vespidae`'],

    ['/pseudoescorpiao', 'ou `/pseudoescorpioes`'],

    ['/scolytinae', 'ou `/brocas`'],

    ['/thysanoptera', 'tripes'],

    ['/tipulomorpha', 'típulas e afins'],

    ['/zygentoma', 'traças']
]);


module.exports = { Nomes_alternativos, Descricao_alternativos };