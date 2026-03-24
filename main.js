/*--- Sincronização do bot com o WhatsApp ---*/

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');

// Create a new client instance
const client = new Client({
    authStrategy: new LocalAuth()
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});


/*--- Funcionalidades do bot ---*/


let lista_comandos = [
    '/help', '/help2', '/admin', '/bicho', '/milicia', '/sobre', '/tirar_nome', 
    
    '/rbn', '/aranha', '/abelha', '/ave', '/barata', '/barbeiro?', '/barbeiro', 
    '/besouro', '/borboleta', '/cigarra', '/cigarrinha','/cobra', '/serpente', '/cupim', '/isoptera', 
    '/diplopoda', '/escorpioes', '/escorpiões', '/formiga', '/formiga_leao', 
    '/formiga_leão', '/fungo','/cogumelo', '/fungi', '/neuroptera', '/geoplanaria', 
    '/geoplanária', '/grilo', '/gafanhoto', '/esperança', '/orthoptera', '/lagarto', 
    '/calango', '/gekkota', '/louva', '/louva_deus', '/mantis', '/mantodea','/mariposa', 
    '/mollusca', '/concha', '/caranguejo', '/morcego', '/mosca', '/mosquito', '/opilioes', 
    '/opiliões', '/percevejo', '/percevejo_aq', '/gerromorpha', '/phasma', '/bicho_pau', 
    '/planta', '/pseudo', '/pseudoescorpioes', '/pseudoescorpiões', '/monocot', 
    '/monocotiledôneas', '/dicot', '/dicotiledôneas', '/sapo', '/anura', '/soldadinho', 
    '/membracidae', '/staph', '/staphylinidae', '/strep', '/strepsiptera', '/tipula', 
    '/tipulomorpha', '/traça', '/zygentoma', '/tripe', '/thysanoptera', '/vespa', '/vespidae', 
    '/maribondo', '/marimbondo',
    
    '/stop', '/all'];

let lista_easter = [
    '/bloisinho', '/bot', '/cladofsm', '/mateiro', '/meriva', '/plankoidea', 
    '/planklep', '/reh_csif', '/rehcsif', '/dobra', '/tarrafer', '/fischer', 
    '/vermoidea'];

// Carrega o arquivo JSON
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('contacts.json', 'utf-8'));

let lista_admins = [c.louva.cesar, c.phasma.edgar, c.mariposas.fischer, 
                    c.enrico, c.besouros.lorenne, c.aranhas.jean, 
                    c.carlos_adm, c.aranhas.gianlluca];

// Função que determina a chance do usuário ser marcado
async function chanceUsuario(usuario, chance) {
    if (Math.random() < chance) {
        return usuario;
    } else {
        return null;
    }
}

// Função que adiciona o usuário para ser propriamente mencionado na mensagem
async function mencionarUsuario(lista, pessoas, usuario, chance) {
    const marcacao = await chanceUsuario(usuario, chance);
    if(marcacao){
        lista.push(marcacao + '@c.us');
        return pessoas + `, @${marcacao}`;
    }else{
        return pessoas;
    }
}

// Função para embaralhar a lista de contatos
async function embaralharContatos(contatos) {
    for (let i = contatos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [contatos[i], contatos[j]] = [contatos[j], contatos[i]];  // Troca os elementos
    }
    return contatos;
}

// Função para tratar variações de comandos do usuário, como pluralização, espaços etc.
function normalizarComando(message) {
    let comando = message.toLowerCase().trim();

    // remove plural simples
    if (comando.endsWith('s')) {
        comando = comando.slice(0, -1);
    }

    return comando;
}

// Função principal que rege todos os comandos
async function Comandos(message, mensagem_normalizada) {
    /*--- Comandos Ajuda ---*/
    
    if (message.body === '/help') {
        const usuario_duvida = message.author || message.from;
        
        const comandosAjuda = [
            { comando: '/help', descricao: 'Mostra os comandos atuais do bot;' },
            { comando: '/help2', descricao: 'Mostra comandos mais avançados;' },
            { comando: '/admin', descricao: 'Marca dois admins aleatórios;' },
            { comando: '/bicho', descricao: 'Usar quando não souber quem marcar;' },
            { comando: '/milicia', descricao: 'Usar quando precisar de ajuda para virar IDs no iNat;' },
            { comando: '/sobre', descricao: 'Mostra informações sobre o bot;'},
            { comando: '/tirar_nome', descricao: 'Abre um requerimento para retirar seu nome das marcações.'}
        ];

        let comandos_removidos = ['/help', '/help2', '/admin', '/bicho', '/milicia', '/sobre', '/tirar_nome', '/stop', 
                                  '/all', '/barbeiro', '/serpentes', '/isoptera', '/escorpiões', '/geoplanária', '/gafanhotos', 
                                  '/esperanças', '/orthoptera', '/opiliões', '/gerromorpha', '/bicho_pau', '/pseudoescorpioes', 
                                  '/pseudoescorpiões', '/calangos', '/gekkota', '/louva_deus', '/mantis', '/mantodea', '/concha', 
                                  '/caranguejo', '/formiga', '/formiga_leão', '/neuroptera', '/cogumelos', '/fungi', '/soldadinho', 
                                  '/membracidae', '/staphylinidae', '/strepsiptera', '/tipulomorpha', '/monocotiledôneas', 
                                  '/dicotiledôneas', '/anura', '/thysanoptera', '/vespidae', '/maribondo', '/marimbondo', 
                                  '/zygentoma'];
        
        let comandosPrincipais = lista_comandos.filter(comando => !comandos_removidos.includes(comando));

        let mensagem = `Olá! Esses são os comandos disponíveis até o momento:\n\n`;
        
        mensagem += `> Comandos de Ajuda\n`;
        mensagem += comandosAjuda.map(cmd_help => `* \`${cmd_help.comando}\` - ${cmd_help.descricao}`).join('\n') + '\n\n';

        mensagem += `> Comandos Principais - marcam os membros que trabalham em seus respectivos grupos *[ordem alfabética]*\n`;
        mensagem += comandosPrincipais.map(cmd_main => {
            if (cmd_main === '/rbn') {
                return `* \`${cmd_main}\` - Rede Brasileira de Naturalistas`;
            } else if (cmd_main === '/barbeiro?') {
                return `* \`${cmd_main}\` - *percevejo de importância médica*`;
            } else if (cmd_main === '/cigarrinha') {
                return `* \`${cmd_main}\` - soldadinhos e membracídeos`;
            } else if (cmd_main === '/cobras') {
                return `* \`${cmd_main}\` ou \`/serpentes\``;
            } else if (cmd_main === '/diplopoda') {
                return `* \`${cmd_main}\` - piolho-de-cobra`;
            } else if (cmd_main === '/formiga_leao') {
                return `* \`${cmd_main}\` - ou coisas parecidas`;
            } else if (cmd_main === '/fungos') {
                return `* \`${cmd_main}\` - cogumelos e afins`;
            } else if (cmd_main === '/geoplanaria') {
                return `* \`${cmd_main}\` - planária terrestre`;          
            } else if (cmd_main === '/grilos') {
                return `* \`${cmd_main}\` - inclui gafanhotos e esperanças tbm`;          
            } else if (cmd_main === '/lagartos') {
                return `* \`${cmd_main}\` - calangos e afins`;
            } else if (cmd_main === '/louva') {
                return `* \`${cmd_main}\` ou  \`/mantis\``;
            } else if (cmd_main === '/mollusca') {
                return `* \`${cmd_main}\` - inclui conchas e caranguejos tbm`;
            } else if (cmd_main === '/percevejo_aq') {
                return `* \`${cmd_main}\` - percevejos aquáticos`;
            } else if (cmd_main === '/phasma'){
                return `* \`${cmd_main}\` ou \`/bicho_pau\``;
            } else if (cmd_main === '/pseudo') {
                return `* \`${cmd_main}\` - pseudoescorpiões`;
            } else if (cmd_main === '/monocot'){
                return `* \`${cmd_main}\` - monocotiledôneas`;
            } else if (cmd_main === '/dicot'){
                return `* \`${cmd_main}\` - dicotiledôneas`;
            } else if (cmd_main === '/sapo'){
                return `* \`${cmd_main}\` - sapos, rãs ou pererecas`;
            }  else if (cmd_main === '/staph') {
                return `* \`${cmd_main}\` - staphylinidae`;
            } else if (cmd_main === '/strep') {
                return `* \`${cmd_main}\` - strepsiptera`;
            } else if (cmd_main === '/tipula') {
                return `* \`${cmd_main}\` - tipulomorpha`;
            } else if (cmd_main === '/traça') {
                return `* \`${cmd_main}\` - zygentoma`;
            } else if (cmd_main === '/tripe') {
                return `* \`${cmd_main}\` - thysanoptera`;
            } else if (cmd_main === '/vespa') {
                return `* \`${cmd_main}\` ou \`/maribondo\``;
            } else {
                return `* \`${cmd_main}\``;
            }
        }).join('\n');       

        await client.sendMessage(usuario_duvida, mensagem);
    }
    
    if (message.body === '/help2') {
        const usuario_duvida = message.author || message.from;

        let comandos_avancados = ['/anura', '/barbeiro', '/calangos', '/caranguejo', '/cogumelos', 
                                  '/dicotiledôneas', '/escorpiões', '/esperanças', '/formiga', 
                                  '/formiga_leão', '/geoplanária', '/gerromorpha', '/isoptera', 
                                  '/marimbondo', '/opiliões', '/pseudoescorpioes', '/staphylinidae', 
                                  '/strepsiptera', '/thysanoptera', '/tipulomorpha', '/zygentoma'];

        let mensagem = `> Comandos Avançados - variações dos comandos básicos *[ordem alfabética]*\n`;
        mensagem += comandos_avancados.map(cmd_main => {
            if (cmd_main === '/anura') {
                return `* \`${cmd_main}\` - sapos e pererecas`;
            } else if (cmd_main === '/calangos') {
                return `* \`${cmd_main}\` ou \`/gekkota\``;
            } else if (cmd_main === '/caranguejo') {
                return `* \`${cmd_main}\` ou \`/concha\``;
            } else if (cmd_main === '/cogumelos') {
                return `* \`${cmd_main}\` ou \`/fungi\``;
            } else if (cmd_main === '/dicotiledôneas') {
                return `* \`${cmd_main}\` ou \`/monocotiledôneas\``;
            } else if (cmd_main === '/esperanças') {
                return `* \`${cmd_main}\`, \`/gafanhotos\` ou \`/orthoptera\``;
            } else if (cmd_main === '/formiga_leão') {
                return `* \`${cmd_main}\` ou \`/neuroptera\``;
            } else if (cmd_main === '/gerromorpha') {
                return `* \`${cmd_main}\` - percevejos aquáticos`;
            } else if (cmd_main === '/isoptera') {
                return `* \`${cmd_main}\` - cupins`;
            } else if (cmd_main === '/marimbondo') {
                return `* \`${cmd_main}\` ou \`/vespidae\``;
            } else if (cmd_main === '/pseudoescorpioes') {
                return `* \`${cmd_main}\` ou \`/pseudoescorpiões\``;
            } else if (cmd_main === '/thysanoptera') {
                return `* \`${cmd_main}\` - tripes`;
            } else if (cmd_main === '/tipulomorpha') {
                return `* \`${cmd_main}\` - típulas e afins`;
            } else if (cmd_main === '/zygentoma') {
                return `* \`${cmd_main}\` - traças`;
            } else {
                return `* \`${cmd_main}\``;
            }
        }).join('\n');       

        await client.sendMessage(usuario_duvida, mensagem);
    }

    if (message.body === '/admin'){
        lista_admins_filtered = lista_admins.filter(admin => admin !== c.aranhas.gianlluca)
        lista_admins_filtered = (await embaralharContatos(lista_admins_filtered)).slice(0, 2)

        let lista = lista_admins_filtered.map(user => `${user}@c.us`);
        let pessoas = `@${lista_admins_filtered.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/bicho'){
        const bicho = [c.enrico, c.aranhas.celio, c.phasma.edgar];
        let lista = bicho.map(user => `${user}@c.us`);
        let pessoas = `@${bicho.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/milicia'){
        let ajudantes = [c.aranhas.celio, c.aranhas.gianlluca, c.mariposas.fischer, 
                         c.mariposas.luis_eduardo, c.formigas.davi, c.formigas.gabriel_rogerio, 
                         c.formigas.maycon, c.phasma.edgar, c.enrico, c.shiva, c.jose_valerio];
        
        ajudantes = (await embaralharContatos(ajudantes)).slice(0, 5)

        let lista = ajudantes.map(user => `${user}@c.us`);
        let pessoas = `@${ajudantes.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/sobre') {
        const usuario_curioso = message.author || message.from;

        let mensagem = 'O \`iMark\` foi criado para facilitar o processo de identificação de animais, plantas, fungos etc., permitindo a marcação automática de membros especializados em seus grupos taxonômicos.\n\n';

        mensagem += 'Com essa funcionalidade, elimina-se a necessidade de saber exatamente quem marcar, sendo especialmente útil para quem é novo no grupo. Além disso, esse bot promove uma interação melhor e mais dinâmica entre os membros mais antigos e novos do grupo.\n\n';
        
        mensagem += 'Sugestões mandar no privado do autor! 👇\n\n'
        
        mensagem += `Desenvolvedor: @${c.aranhas.gianlluca}\n`;
        mensagem += 'Versão atual: \`\`\`1.0.0\`\`\`\n';
        mensagem += 'GitHub: https://github.com/GianllucaLeme/Bot_iNaters';

        await client.sendMessage(usuario_curioso, mensagem, {mentions: c.aranhas.gianlluca + '@c.us'});
    }

    if (message.body === '/tirar_nome') {
        let usuario_tirar = await message.getContact();

        await client.sendMessage(message.from, '> Requerimento enviado.');
        
        setTimeout(async () => {
            await client.sendMessage(c.aranhas.gianlluca + '@c.us', `O @${usuario_tirar.id.user} quer retirar a marcação!`, {mentions: usuario_tirar.id.user + '@c.us'});
        }, 3000);
    }
    
    /*--- Comandos Principais ---*/

    if (mensagem_normalizada === '/abelha') {
        const abelhas = [c.abelhas.bruno_abelha, c.abelhas.bruno_aranda, 
                         c.abelhas.beatriz, c.staph.pedro_staph];
        
        let lista = abelhas.map(user => `${user}@c.us`);
        let pessoas = `@${abelhas.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.3);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/aranha'){
        let aranhas = [c.aranhas.adolfo, c.aranhas.alfredo, c.aranhas.claudia, c.aranhas.dayvson, 
                       c.aranhas.fernando, c.aranhas.gabriel_costa, c.aranhas.isaac, c.aranhas.lucas_gusso, 
                       c.aranhas.michelotto, c.aranhas.pedro_martins, c.aranhas.victor];
        
        let prioridade = [c.aranhas.celio, c.aranhas.gianlluca, c.aranhas.jean, c.aranhas.ryan];

        aranhas = (await embaralharContatos(aranhas)).slice(0, 3);

        let lista = aranhas.map(user => `${user}@c.us`);
        let pessoas = `@${aranhas.join(', @')}`;
        
        for (let i = 0; i < prioridade.length; i++) {
            pessoas = await mencionarUsuario(lista, pessoas, prioridade[i], 0.633975);
        }

        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);

        await client.sendMessage(message.from, pessoas, { mentions: lista});
    }

    if (mensagem_normalizada === '/ave') {
        let aves = [c.plantas.edvandro, c.aves.jose_valerio, c.aves.matheus_santos, 
                    c.aves.miguel_malta, c.aves.henrique_stranz, c.aves.ruan];
       
        aves = (await embaralharContatos(aves)).slice(0, 3);
        
        let lista = aves.map(user => `${user}@c.us`);
        let pessoas = `@${aves.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.95);
        pessoas = await mencionarUsuario(lista, pessoas, c.aves.victor_aves, 0.3)
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/barata') {
        const baratas = [c.mariposas.fischer, c.baratas.matheus_dora,
                         c.phasma.pedro_alvaro];
        
        let lista = baratas.map(user => `${user}@c.us`);
        let pessoas = `@${baratas.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.3);
        pessoas = await mencionarUsuario(lista, pessoas, c.louva.lorena, 0.2);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/barbeiro?', '/barbeiro'].includes(message.body)) {
        const barbeiro = [c.carlos_adm, c.aranhas.celio];
        
        let lista = barbeiro.map(user => `${user}@c.us`);
        let pessoas = `@${barbeiro.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.6);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/besouro') {
        const besouros = [c.besouros.glauco, c.besouros.lorenne, 
                          c.besouros.vincenzo, c.besouros.bruno_begha];
        
        let lista = besouros.map(user => `${user}@c.us`);
        let pessoas = `@${besouros.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.336);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/borboleta'){
        const borboletas =  [c.borboletas.andre_nog, c.mariposas.jhonatan, 
                             c.borboletas.pedro_souza, c.borboletas.rafaela, 
                             c.borboletas.tiago];

        let lista = borboletas.map(user => `${user}@c.us`);
        let pessoas = `@${borboletas.join(', @')}`;
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.fischer, 0.15);
        pessoas = await mencionarUsuario(lista, pessoas, c.borboletas.guilherme_augusto, 0.1);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/cigarra') {
        const cigarras = [c.cigarras.bruno];
        
        let lista = cigarras.map(user => `${user}@c.us`);
        let pessoas = `@${cigarras.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.fischer, 0.15);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/cigarrinha', '/soldadinho', '/membracidae'].includes(mensagem_normalizada)) {
        const cigarrinha = [c.cigarrinha.aline, c.cigarrinha.andre_cigarrinha, 
                            c.cigarrinha.eduardo_henrique];
        
        let lista = cigarrinha.map(user => `${user}@c.us`);
        let pessoas = `@${cigarrinha.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.4);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/cobra', '/serpente'].includes(mensagem_normalizada)) {
        const cobras = [c.enrico, c.aves.jose_valerio, 
                        c.cobras.leonardo_conversano];
        
        let lista = cobras.map(user => `${user}@c.us`);
        let pessoas = `@${cobras.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/cupim', '/isoptera'].includes(mensagem_normalizada)) {
        const cupim = [c.cupim.karina_lima];
        
        let lista = cupim.map(user => `${user}@c.us`);
        let pessoas = `@${cupim.join(', @')}`;

        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/diplopoda') {
        const diplopoda = [c.diplopoda.rodrigo_bouzan];
        
        let lista = diplopoda.map(user => `${user}@c.us`);
        let pessoas = `@${diplopoda.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/escorpioes', '/escorpiões'].includes(message.body)){
        let escorpioes = [c.aranhas.adolfo, c.aranhas.fernando, c.aranhas.gianlluca, 
                          c.aranhas.lucas_gusso, c.aranhas.pedro_martins];
        let prioridade = [c.aranhas.celio, c.aranhas.jean, c.aranhas.michelotto];

        escorpioes = (await embaralharContatos(escorpioes)).slice(0, 3);

        let lista = escorpioes.map(user => `${user}@c.us`);
        let pessoas = `@${escorpioes.join(', @')}`;
        
        for (let i = 0; i < prioridade.length; i++) {
            pessoas = await mencionarUsuario(lista, pessoas, prioridade[i], 0.2);
        }

        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);

        await client.sendMessage(message.from, pessoas, { mentions: lista});
    }

    if (mensagem_normalizada === '/formiga'){
        let formigas = [c.formigas.davi, c.formigas.felipe_santos, 
                        c.formigas.gabriel_rogerio, c.formigas.maycon];

        let lista = formigas.map(user => `${user}@c.us`);
        let pessoas = `@${formigas.join(', @')}`;

        pessoas = await mencionarUsuario(lista, pessoas, c.formigas.joao_paulo, 0.1);
        pessoas = await mencionarUsuario(lista, pessoas, c.formigas.diego, 0.05);
        pessoas = await mencionarUsuario(lista, pessoas, c.formigas.didobola, 1e-8);
        pessoas = await mencionarUsuario(lista, pessoas, c.formigas.vankan, 0.03);
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.25);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/formiga_leao', '/formiga_leão', '/neuroptera'].includes(message.body)) {
        const formiga_leao = [c.formiga_leao.leon, c.formiga_leao.maria_girelli];

        let lista = formiga_leao.map(user => `${user}@c.us`);
        let pessoas = `@${formiga_leao.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.3);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/fungo','/cogumelo', '/fungi'].includes(mensagem_normalizada)) {
        const fungos = [c.fungos.mateus_ribeiro];
        
        let lista = fungos.map(user => `${user}@c.us`);
        let pessoas = `@${fungos.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/geoplanaria', '/geoplanária'].includes(mensagem_normalizada)) {
        const geoplanaria = [c.geoplanaria.piter];
        
        let lista = geoplanaria.map(user => `${user}@c.us`);
        let pessoas = `@${geoplanaria.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/grilo', '/gafanhoto', '/esperança', '/orthoptera'].includes(mensagem_normalizada)) {
        const grilos = [c.phasma.phil];
        
        let lista = grilos.map(user => `${user}@c.us`);
        let pessoas = `@${grilos.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/lagarto', '/calango', '/gekkota'].includes(mensagem_normalizada)) {
        const lagarto = [c.lagartos.dani_alcantara, c.lagartos.joao_alcantara];
        
        let lista = lagarto.map(user => `${user}@c.us`);
        let pessoas = `@${lagarto.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.6);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/louva', '/louva_deus', '/mantis', '/mantodea'].includes(message.body)) {
        let louva = [c.louva.bruno_louva, c.louva.cesar, 
                       c.louva.gabriel_gomes, c.louva.leo, 
                       c.louva.lorena, c.louva.lorram, 
                       c.louva.savio];

        louva = (await embaralharContatos(louva)).slice(0, 4);

        let lista = louva.map(user => `${user}@c.us`);
        let pessoas = `@${louva.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.02);

        if(!pessoas.includes('@' + c.louva.gabriel_gomes)){
            pessoas = await mencionarUsuario(lista, pessoas, c.louva.gabriel_gomes, 1);
        }
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/mariposa'){
        let mariposas = [c.mariposas.jhonatan, c.mariposas.miguel, 
                         c.phasma.pedro_alvaro, c.mariposas.pedro_lafin];
        
        let prioridade = [c.mariposas.fischer, c.mariposas.laila, 
                          c.mariposas.luis_eduardo, c.mariposas.nicolas];
        
        mariposas = (await embaralharContatos(mariposas)).slice(0, 2);
        prioridade = (await embaralharContatos(prioridade)).slice(0, 2);

        let lista = mariposas.map(user => `${user}@c.us`);
        let pessoas = `@${mariposas.join(', @')}`;

        pessoas = await mencionarUsuario(lista, pessoas, prioridade[0], 1);
        pessoas = await mencionarUsuario(lista, pessoas, prioridade[1], 1);

        if(!(pessoas.includes('@' + c.mariposas.fischer))){
            pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.fischer, 1);
        }

        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/mollusca', '/concha', '/caranguejo'].includes(mensagem_normalizada)) {
        const mollusca = [c.mollusca.carlos_sigma, c.aranhas.celio, 
                          c.mollusca.rafael_masson, c.mosquitos.walther];
        
        let lista = mollusca.map(user => `${user}@c.us`);
        let pessoas = `@${mollusca.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.4);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/morcego') {
        const morcegos = [c.aranhas.lucas_gusso];
        
        let lista = morcegos.map(user => `${user}@c.us`);
        let pessoas = `@${morcegos.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/mosca') {
        const moscas = [c.moscas.daniel_schelesky, c.moscas.lais, 
                        c.moscas.leonardo_breder, c.moscas.luan, 
                        c.moscas.matheus, c.moscas.rodrigo];

        let lista = moscas.map(user => `${user}@c.us`);
        let pessoas = `@${moscas.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.1);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/mosquito') {
        const mosquitos = [c.mosquitos.walther];
        
        let lista = mosquitos.map(user => `${user}@c.us`);
        let pessoas = `@${mosquitos.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/opilioes', '/opiliões'].includes(message.body)) {
        const opilioes = [c.opilioes.lohan, c.opilioes.luis_cla, c.opilioes.thales];
        
        let lista = opilioes.map(user => `${user}@c.us`);
        let pessoas = `@${opilioes.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/percevejo') {
        const percevejos = [c.percevejos.guilherme_lopez];
        
        let lista = percevejos.map(user => `${user}@c.us`);
        let pessoas = `@${percevejos.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.8);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/percevejo_aq', '/gerromorpha'].includes(message.body)) {
        const aquatico = [c.percevejos.taoso];
        
        let lista = aquatico.map(user => `${user}@c.us`);
        let pessoas = `@${aquatico.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.8);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/phasma', '/bicho_pau'].includes(message.body)) {
        const phasma = [c.phasma.edgar, c.phasma.pedro_alvaro, 
                        c.phasma.pedro_sisnando, c.phasma.phil];
        
        let lista = phasma.map(user => `${user}@c.us`);
        let pessoas = `@${phasma.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.01);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/planta') {
        const plantas = [c.plantas.edvandro, c.mariposas.fischer, c.plantas.thomaz_ricardo];
        
        let lista = plantas.map(user => `${user}@c.us`);
        let pessoas = `@${plantas.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/pseudo', '/pseudoescorpioes', '/pseudoescorpiões'].includes(message.body)) {
        const pseudo = [c.aranhas.dayvson];
        
        let lista = pseudo.map(user => `${user}@c.us`);
        let pessoas = `@${pseudo.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/monocot', '/monocotiledôneas'].includes(message.body)) {
        const monocot = [c.mariposas.fischer, c.formigas.joao_paulo, c.plantas.marcos];
        
        let lista = monocot.map(user => `${user}@c.us`);
        let pessoas = `@${monocot.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/dicot', '/dicotiledôneas'].includes(message.body)) {
        const dicot = [c.plantas.angelo_correa, c.plantas.bruno_santos, 
                       c.plantas.edvandro, c.opilioes.luis_cla];
        
        let lista = dicot.map(user => `${user}@c.us`);
        let pessoas = `@${dicot.join(', @')}`;
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/rbn') {
        const rbn = [c.borboletas.andre_nog, c.abelhas.bruno_aranda, c.aranhas.celio,
                     c.phasma.edgar, c.enrico, c.aves.jose_valerio, c.rbn.tiago_rbn];
        
        let lista = rbn.map(user => `${user}@c.us`);
        let pessoas = `@${rbn.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/sapo', '/anura'].includes(mensagem_normalizada)) {
        const sapo = [c.sapo.allanis, c.sapo.catarina, c.sapo.shiva];
        
        let lista = sapo.map(user => `${user}@c.us`);
        let pessoas = `@${sapo.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/staph', '/staphylinidae'].includes(mensagem_normalizada)) {
        const staph = [c.staph.pedro_staph];
        
        let lista = staph.map(user => `${user}@c.us`);
        let pessoas = `@${staph.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/strep', '/strepsiptera'].includes(mensagem_normalizada)) {
        const strep = [c.formigas.gabriel_rogerio];
        
        let lista = strep.map(user => `${user}@c.us`);
        let pessoas = `@${strep.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/tipula', '/tipulomorpha'].includes(mensagem_normalizada)) {
        const tipula = [c.mosquitos.walther];
        
        let lista = tipula.map(user => `${user}@c.us`);
        let pessoas = `@${tipula.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/traça', '/zygentoma'].includes(mensagem_normalizada)) {
        const traca = [c.sapo.shiva];
        
        let lista = traca.map(user => `${user}@c.us`);
        let pessoas = `@${traca.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.1);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/tripe', '/thysanoptera'].includes(mensagem_normalizada)) {
        const tripe = [c.tripe.marina];
        
        let lista = tripe.map(user => `${user}@c.us`);
        let pessoas = `@${tripe.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.1);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/vespa', '/vespidae', '/maribondo', '/marimbondo'].includes(mensagem_normalizada)) {
        const vespa = [c.aranhas.celio, c.mariposas.laila];
        
        let lista = vespa.map(user => `${user}@c.us`);
        let pessoas = `@${vespa.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.3);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    /*--- Comandos Admin ---*/

    if (message.body === '/stop') {
        let admin = await message.getContact();

        if (lista_admins.includes(admin.id.user)) {
            await client.sendMessage(message.from, '> Bot desligando...');
            
            // Espera 1 s para que a mensagem seja enviada no WhatsApp
            setTimeout(async () => {
                await client.destroy();
            }, 1000);
        }else{
            await client.sendMessage(message.from, '> Você não tem autorização para utilizar esse comando.');
        }
    }
    
    if (message.body === '/all') {
        let admin = await message.getContact();

        if (lista_admins.includes(admin.id.user)) {
            const chat = await message.getChat();
            let mentions = [];
        
            for (let participantes of chat.participants) {
                mentions.push(`${participantes.id.user}@c.us`);
            }
        
            await chat.sendMessage('> Marcando todo mundo...', {mentions});
        }else{
            await client.sendMessage(message.from, '> Você não tem autorização para utilizar esse comando.');
        }
    }

    /*--- Comandos Easter Eggs ---*/

    if (mensagem_normalizada === '/bloisinho'){
        let random_blois = Math.floor(Math.random()*4);
        const media = MessageMedia.fromFilePath(`./pictures/bloisinhos/blois${random_blois}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }
    
    if (mensagem_normalizada === '/bot'){
        let random_patada = Math.floor(Math.random()*3);
        const media = MessageMedia.fromFilePath(`./pictures/bot_patadas/patada${random_patada}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }

    if (mensagem_normalizada === '/cladofsm') {
        const clado_fsm = [c.mariposas.fischer, c.sapo.shiva, c.formigas.maycon];
        let lista = clado_fsm.map(user => `${user}@c.us`);
        let pessoas = `@${clado_fsm.join(', @')}`;
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (mensagem_normalizada === '/mateiro'){
        let random_malta = Math.floor(Math.random()*10);
        const media = MessageMedia.fromFilePath(`./pictures/mateiros/mateiro${random_malta}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }

    if (mensagem_normalizada === '/meriva'){
        let random_meriva = Math.floor(Math.random()*11);
        const media = MessageMedia.fromFilePath(`./pictures/merivas/meriva${random_meriva}.png`);
        await client.sendMessage(message.from, media);
    }

    if (['/plankoidea', '/planklep'].includes(mensagem_normalizada)){
        let random_plank = Math.floor(Math.random()*1);
        const media = MessageMedia.fromFilePath(`./pictures/plankoidea/plank${random_plank}.png`);
        await client.sendMessage(message.from, media);
    }

    if (['/reh_csif', '/rehcsif', '/dobra'].includes(mensagem_normalizada)){
        let random_reh = Math.floor(Math.random()*1);

        let conhecimento = fs.openSync(`./pictures/reh_csif/conhecimento${random_reh}.txt`, 'r');
        let texto_conhecimento = fs.readFileSync(conhecimento, 'utf-8');
        fs.closeSync(conhecimento);
        
        await client.sendMessage(message.from, texto_conhecimento);
    }

    if (['/tarrafer', '/fischer'].includes(mensagem_normalizada)){
        let random_tarrafer = Math.floor(Math.random()*15);

        if(random_tarrafer < 9){ //aumentar em cascata caso tenha mais .pngs
            const media = MessageMedia.fromFilePath(`./pictures/tarraferes/tarrafer${random_tarrafer}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        } else if([10, 11, 12].includes(random_tarrafer)){
            const contatinho = [`${c.mariposas.fischer}@c.us`];

            let texto_sabio = `Quote do dia do nosso amigo @${c.mariposas.fischer}:\n`;

            const quotes = [
                `> _Ah claro, como poderia me esquecer de Reh Csif, famoso escriba e colecionador privado do Segundo Período Intermédio do Egito_`,
                `> _Jahpawt jau jau spaghetti hte rau_`,
                `> _Zwibbly wobble flibbertigibbet snozzwanger snazzlepop blibber-blubber jibber-jabber!_`,
            ];
            
            texto_sabio += quotes[random_tarrafer - 10];

            await client.sendMessage(message.from, texto_sabio, {mentions: contatinho});
        } else if([13, 14].includes(random_tarrafer)){
            const contatinho = [`${c.mariposas.fischer}@c.us`];

            let texto_sabio2 = `Áudio supremo do nosso amigo @${c.mariposas.fischer}:`;

            await client.sendMessage(message.from, texto_sabio2, {mentions: contatinho});
            
            const media = MessageMedia.fromFilePath(`./pictures/tarraferes/tarrafer${random_tarrafer}.mp3`);
            await client.sendMessage(message.from, media);
        } 
    }

    if (mensagem_normalizada === '/vermoidea'){
        const vermoidea = [c.mariposas.fischer, c.sapo.shiva, c.formigas.maycon, 
                           c.aranhas.gabriel_costa, c.aranhas.adolfo];
        let lista = vermoidea.map(user => `${user}@c.us`);
        let pessoas = `@${vermoidea.join(', @')}`;
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }
}

// Spam handling
let lista_spam = [];
let flag_spam = 0;

// Bot, em loop, lendo as mensagens
client.on('message_create', async message => {
    const mensagem_normalizada = normalizarComando(message.body);

    // Spam handling antes de detectar os comandos
    if ([...lista_comandos, ...lista_easter].includes(mensagem_normalizada)) {
        let msg1 = message.timestamp;
        lista_spam[flag_spam] = msg1;

        flag_spam++;

        if(flag_spam == 2){
            flag_spam = 0;
        }

        if(!(Math.abs(lista_spam[1] - lista_spam[0]) < 3)){
            await Comandos(message, mensagem_normalizada);
        }
    }
});

// Ligar o bot
client.initialize();