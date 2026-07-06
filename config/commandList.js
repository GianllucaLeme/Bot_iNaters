const c = require('./contacts_load');

const lista_comandos = new Set([
    '/help', '/help2', '/admin', '/bicho', '/milicia', '/sac', '/sobre', '/tirar_nome', 
    
    '/rbn', '/aranha', '/abelha', '/ave', '/barata', '/barbeiro', '/besouro', '/coleoptera', '/bichopau', 
    '/bicho_pau', '/phasma', '/borboleta', '/cigarra', '/cigarrinha','/cobra', '/serpente', '/cupim', 
    '/cupins', '/isoptera', '/diplopoda', '/escorpiao', '/escorpioes', '/formiga', '/formiga_leao', 
    '/fungo', '/cogumelo', '/fungi', '/neuroptera', '/geoplanaria', '/grilo', '/gafanhoto', '/esperanca', 
    '/orthoptera', '/hemi', '/hemiptera', '/lagarta', '/lepi', '/lepidoptera', '/lagarto', '/calango', 
    '/gekkota', '/louva', '/louva_deus', '/mantis', '/mantodea', '/marinho', '/mollusca', '/molusco', '/concha', 
    '/caracol', '/caramujo', '/caranguejo', '/gastropoda', '/siri', '/mariposa', '/morcego', '/mosca', '/diptera', '/mosquito', 
    '/opiliao', '/opilioes', '/percevejo', '/percevejo_aq', '/gerromorpha', '/planta', '/plec', '/plecoptera', 
    '/monocot', '/monocotiledonea', '/dicot', '/dicotiledonea', '/pseudo', '/pseudoescorpiao', '/pseudoescorpioes', 
    '/sapo', '/anura', '/scoly', '/scolytinae', '/brocas', '/soldadinho', '/membracidae', '/staph', '/staphylinidae', 
    '/strep', '/strepsiptera', '/tipula', '/tipulomorpha', '/traca', '/zygentoma', '/tripe', '/thysanoptera', 
    '/vespa', '/vespidae', '/maribondo', '/marimbondo',
    
    '/stop', '/all'
]);

const lista_easter = new Set([
    '/alex', '/nos', '/noz', '/naturalista', '/bloisinho', '/blois', '/bloisin', 
    '/crispinin', '/bot', '/caf', '/cladofsm', '/curse', '/trader', '/golpe', 
    '/douglas', '/kratos', '/kratosrbn', '/kratos_rbn', '/lycan', '/lycantropia', '/mateiro', 
    '/melga', '/melguinha', '/melgaco', '/adolfo', '/meriva', '/sorteio', '/metaflora', 
    '/metazooa', '/metazoa', '/plankoidea', '/planklep', '/prancheta', '/prancha', '/26', 
    '/reh_csif', '/rehcsif', '/dobra', '/tarrafer', '/fischer', '/vermoidea', 
    
    '/aga', '/h', '/dicka', '/dickao', '/vem', '/davi'
]);

// Objetos auxiliares para os comandos do grupo "aga"
const clbc_aga = new Set([
    'dido', 'felipe', 'gabriel', 'gomide', 'henrique', 'kleber', 'laz', 'luis', 
    'maycon', 'mayconu7', 'meta', 'pedro', 'pinguim', 'ryan', 'calabot', 'bot2', 
    'sophia', 'sofia', 'carrasco', 'maria', 'cristina', 'vini', 'gian', 'gia', 
    'barata2', 'safira',
    
    c.aga.kleber_audio, c.aga.kleber_audio2, c.aga.dido_audio, c.aga.dido_audio2, 
    c.aga.laz_audio, c.aga.henrique_audio
]);

const lista_easter_aga = new Set([
    '/true_aga', '/true_h', '/cala', '/clbc', '/random_clbc', '/pertubacao', '/ping', 
    '/alou', '/certo', '/grupo_certo'
]);

for (const comando of clbc_aga) {
    lista_easter_aga.add(`/${comando}`);
}


module.exports = { lista_comandos, lista_easter, clbc_aga, lista_easter_aga };