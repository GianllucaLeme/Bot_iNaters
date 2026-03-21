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
    '/help', '/admin', '/bicho', '/milicia', '/sobre', '/tirar_nome', 
    
    '/rbn', '/aranhas', '/abelhas', '/aves', '/besouros', '/baratas', 
    '/borboletas', '/cigarras', '/cobras', '/serpentes', '/diplopoda', 
    '/escorpioes', '/escorpiões', '/formigas', '/formiga', '/formiga_leao', 
    '/formiga_leão', '/fungos','/cogumelos', '/fungi', '/neuroptera', '/geoplanaria', 
    '/geoplanária', '/grilos', '/gafanhotos', '/esperanças', '/orthoptera', '/louva', 
    '/louva_deus', '/mantis', '/mantodea','/mariposas', '/mollusca', '/concha', 
    '/caranguejo', '/moscas', '/mosquitos', '/opilioes', '/opiliões', '/percevejos', 
    '/phasma', '/bicho_pau', '/plantas', '/monocot', '/monocotiledôneas', '/dicot', 
    '/dicotiledôneas', '/sapo', '/anura', '/soldadinho', '/cigarrinhas', '/membracidae', 
    '/staph', '/staphylinidae', '/strep', '/strepsiptera', '/traça', '/zygentoma', 
    '/tripe', '/thysanoptera', '/vespa', '/vespidae', '/maribondo', '/marimbondo',
    
    '/stop', '/all'];

let lista_easter = ['/bloisinho', '/cladoFSM', '/cladofsm', 
    '/cladoPCM', '/cladopcm', '/mateiro', '/meriva', '/vermoidea'];

// Carrega o arquivo JSON
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('contacts.json', 'utf-8'));

let lista_admins = [c.louva.cesar, c.phasma.edgar, c.mariposas.fischer, c.enrico, c.besouros.lorenne, c.aranhas.jean, c.carlos, c.aranhas.gianlluca];

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

// Função principal que rege todos os comandos
async function Comandos(message) {
    /*--- Comandos Ajuda ---*/
    
    if (message.body === '/help') {
        const usuario_duvida = message.author || message.from;
        
        const comandosAjuda = [
            { comando: '/help', descricao: 'Mostra os comandos atuais do bot;' },
            { comando: '/admin', descricao: 'Marca dois admins aleatórios;' },
            { comando: '/bicho', descricao: 'Usar quando não souber quem marcar;' },
            { comando: '/milicia', descricao: 'Usar quando precisar de ajuda para virar IDs no iNat;' },
            { comando: '/sobre', descricao: 'Mostra informações sobre o bot;'},
            { comando: '/tirar_nome', descricao: 'Abre um requerimento para retirar seu nome das marcações.'}
        ];

        let comandos_removidos = ['/help', '/admin', '/bicho', '/milicia', '/sobre', '/tirar_nome', '/stop', '/all', 
                                  '/serpentes', '/escorpiões', '/geoplanária', '/gafanhotos', '/esperanças', 
                                  '/orthoptera', '/opiliões', '/bicho_pau' , '/louva_deus', '/mantis', '/mantodea', 
                                  '/concha', '/caranguejo', '/formiga', '/formiga_leão', '/neuroptera', '/cogumelos', 
                                  '/fungi', '/cigarrinhas', '/membracidae', '/staphylinidae', '/strepsiptera', 
                                  '/monocotiledôneas', '/dicotiledôneas', '/anura', '/thysanoptera', '/vespidae', 
                                  '/maribondo', '/marimbondo', '/zygentoma'];
        
        let comandosPrincipais = lista_comandos.filter(comando => !comandos_removidos.includes(comando));

        let mensagem = `Olá! Esses são os comandos disponíveis até o momento:\n\n`;
        
        mensagem += `> Comandos de Ajuda\n`;
        mensagem += comandosAjuda.map(cmd_help => `* \`${cmd_help.comando}\` - ${cmd_help.descricao}`).join('\n') + '\n\n';

        mensagem += `> Comandos Principais - marcam os membros que trabalham em seus respectivos grupos *[ordem alfabética]*\n`;
        mensagem += comandosPrincipais.map(cmd_main => {
            if (cmd_main === '/rbn') {
                return `* \`${cmd_main}\` - Rede Brasileira de Naturalistas`;
            } else if (cmd_main === '/cobras') {
                return `* \`${cmd_main}\` ou \`/serpentes\``;
            } else if (cmd_main === '/diplopoda') {
                return `* \`${cmd_main}\` - piolho-de-cobra`;
            } else if (cmd_main === '/escorpioes') {
                return `* \`${cmd_main}\` ou \`/escorpiões\``;
            } else if (cmd_main === '/formigas') {
                return `* \`${cmd_main}\` ou \`/formiga\``;
            } else if (cmd_main === '/formiga_leao') {
                return `* \`${cmd_main}\`, \`/formiga_leão\` ou \`/neuroptera\``;
            } else if (cmd_main === '/fungos') {
                return `* \`${cmd_main}\`, \`/cogumelos\` ou \`/fungi\``;
            } else if (cmd_main === '/geoplanaria') {
                return `* \`${cmd_main}\` ou \`/geoplanária\` - planária terrestre`;          
            } else if (cmd_main === '/grilos') {
                return `* \`${cmd_main}\`, \`/gafanhotos\`, \`/esperanças\` ou \`/orthoptera\``;          
            } else if (cmd_main === '/louva') {
                return `* \`${cmd_main}\`, \`/louva_deus\`, \`/mantis\` ou \`/mantodea\``;
            } else if (cmd_main === '/mollusca') {
                return `* \`${cmd_main}\`, \`/concha\` ou \`/caranguejo\``;
            } else if (cmd_main === '/opilioes'){
                return `* \`${cmd_main}\` ou \`/opiliões\``;
            } else if (cmd_main === '/phasma'){
                return `* \`${cmd_main}\` ou \`/bicho_pau\``;
            } else if (cmd_main === '/monocot'){
                return `* \`${cmd_main}\` ou \`/monocotiledôneas\``;
            } else if (cmd_main === '/dicot'){
                return `* \`${cmd_main}\` ou \`/dicotiledôneas\``;
            } else if (cmd_main === '/sapo'){
                return `* \`${cmd_main}\` ou \`/anura\` - sapos e pererecas`;
            } else if (cmd_main === '/soldadinho') {
                return `* \`${cmd_main}\`, \`/cigarrinhas\` ou \`/membracidae\``;
            } else if (cmd_main === '/staph') {
                return `* \`${cmd_main}\` ou \`/staphylinidae\``;
            } else if (cmd_main === '/strep') {
                return `* \`${cmd_main}\` ou \`/strepsiptera\``;
            } else if (cmd_main === '/traça') {
                return `* \`${cmd_main}\` ou \`/zygentoma\``;
            } else if (cmd_main === '/tripe') {
                return `* \`${cmd_main}\` ou \`/thysanoptera\``;
            } else if (cmd_main === '/vespa') {
                return `* \`${cmd_main}\`, \`/vespidae\`, \`/maribondo\` ou \`/marimbondo\``;
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

    if (message.body === '/abelhas') {
        const abelhas = [c.abelhas.bruno_aranda, c.abelhas.beatriz, 
                         c.staph.pedro_staph, c.abelhas.abelhero_misterioso];
        
        let lista = abelhas.map(user => `${user}@c.us`);
        let pessoas = `@${abelhas.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.3);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/aranhas'){
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

    if (message.body === '/aves') {
        let aves = [c.plantas.edvandro, c.aves.jose_valerio, c.aves.matheus_santos, 
                    c.aves.miguel_malta, c.aves.henrique_stranz, c.aves.ruan];
       
        aves = (await embaralharContatos(aves)).slice(0, 3);
        
        let lista = aves.map(user => `${user}@c.us`);
        let pessoas = `@${aves.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.95);
        pessoas = await mencionarUsuario(lista, pessoas, c.aves.victor_aves, 0.3)
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/besouros') {
        const besouros = [c.besouros.lorenne, c.besouros.vincenzo, c.besouros.bruno_begha];
        
        let lista = besouros.map(user => `${user}@c.us`);
        let pessoas = `@${besouros.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.336);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/baratas') {
        const baratas = [c.mariposas.fischer, c.phasma.pedro_alvaro];
        
        let lista = baratas.map(user => `${user}@c.us`);
        let pessoas = `@${baratas.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.3);
        pessoas = await mencionarUsuario(lista, pessoas, c.louva.lorena, 0.2);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/borboletas'){
        const borboletas =  [c.borboletas.andre_nog, c.borboletas.pedro_souza, 
                             c.borboletas.rafaela, c.borboletas.tiago];

        let lista = borboletas.map(user => `${user}@c.us`);
        let pessoas = `@${borboletas.join(', @')}`;
        
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);
        pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.fischer, 0.15);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/cigarras') {
        const cigarras = [c.cigarras.bruno];
        
        let lista = cigarras.map(user => `${user}@c.us`);
        let pessoas = `@${cigarras.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);
        pessoas = await mencionarUsuario(lista, pessoas, c.mariposas.fischer, 0.15);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/cobras', '/serpentes'].includes(message.body)) {
        const cobras = [c.enrico, c.aves.jose_valerio, 
                        c.cobras.leonardo_conversano];
        
        let lista = cobras.map(user => `${user}@c.us`);
        let pessoas = `@${cobras.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }    

    if (message.body === '/diplopoda') {
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

    if (['/formigas', '/formiga'].includes(message.body)){
        let formigas = [c.formigas.davi, c.formigas.felipe_santos, c.formigas.gabriel_rogerio, 
                          c.formigas.maycon];

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

    if (['/fungos','/cogumelos', '/fungi'].includes(message.body)) {
        const fungos = [c.fungos.mateus_ribeiro];
        
        let lista = fungos.map(user => `${user}@c.us`);
        let pessoas = `@${fungos.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/geoplanaria', '/geoplanária'].includes(message.body)) {
        const geoplanaria = [c.geoplanaria.piter];
        
        let lista = geoplanaria.map(user => `${user}@c.us`);
        let pessoas = `@${geoplanaria.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.2);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/grilos', '/gafanhotos', '/esperanças', '/orthoptera'].includes(message.body)) {
        const grilos = [c.phasma.phil];
        
        let lista = grilos.map(user => `${user}@c.us`);
        let pessoas = `@${grilos.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/louva', '/louva_deus', '/mantis', '/mantodea'].includes(message.body)) {
        const louva = [c.louva.cesar, c.louva.gabriel_gomes, 
                       c.louva.leo, c.louva.lorena, c.louva.savio];

        let lista = louva.map(user => `${user}@c.us`);
        let pessoas = `@${louva.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.02);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/mariposas'){
        let mariposas = [c.mariposas.miguel, c.phasma.pedro_alvaro, 
                         c.mariposas.pedro_lafin];
        
        let prioridade = [c.mariposas.fischer, c.mariposas.laila, c.mariposas.luis_eduardo, 
                          c.mariposas.nicolas];
        
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

    if (['/mollusca', '/concha', '/caranguejo'].includes(message.body)) {
        const mollusca = [c.mollusca.carlos_sigma, c.aranhas.celio, c.mosquitos.walther];
        
        let lista = mollusca.map(user => `${user}@c.us`);
        let pessoas = `@${mollusca.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.4);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/moscas') {
        const moscas = [c.moscas.matheus, c.moscas.rodrigo, c.moscas.lais, c.moscas.luan];

        let lista = moscas.map(user => `${user}@c.us`);
        let pessoas = `@${moscas.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.1);
        
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/mosquitos') {
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

    if (message.body === '/percevejos') {
        const percevejos = [c.percevejos.guilherme_lopez];
        
        let lista = percevejos.map(user => `${user}@c.us`);
        let pessoas = `@${percevejos.join(', @')}`;
    
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

    if (message.body === '/plantas') {
        const plantas = [c.plantas.edvandro, c.mariposas.fischer, c.plantas.thomaz_ricardo];
        
        let lista = plantas.map(user => `${user}@c.us`);
        let pessoas = `@${plantas.join(', @')}`;
        
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

    if (['/sapo', '/anura'].includes(message.body)) {
        const sapo = [c.sapo.allanis, c.sapo.catarina, c.sapo.shiva];
        
        let lista = sapo.map(user => `${user}@c.us`);
        let pessoas = `@${sapo.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.5);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/soldadinho', '/cigarrinhas', '/membracidae'].includes(message.body)) {
        const soldadinho = [c.soldadinho.aline, c.soldadinho.andre_soldadinho, c.soldadinho.eduardo_henrique];
        
        let lista = soldadinho.map(user => `${user}@c.us`);
        let pessoas = `@${soldadinho.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.4);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/staph', '/staphylinidae'].includes(message.body)) {
        const staph = [c.staph.pedro_staph];
        
        let lista = staph.map(user => `${user}@c.us`);
        let pessoas = `@${staph.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.7);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/strep', '/strepsiptera'].includes(message.body)) {
        const strep = [c.formigas.gabriel_rogerio];
        
        let lista = strep.map(user => `${user}@c.us`);
        let pessoas = `@${strep.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/traça', '/zygentoma'].includes(message.body)) {
        const traca = [c.sapo.shiva];
        
        let lista = traca.map(user => `${user}@c.us`);
        let pessoas = `@${traca.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.1);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/tripe', '/thysanoptera'].includes(message.body)) {
        const tripe = [c.tripe.marina];
        
        let lista = tripe.map(user => `${user}@c.us`);
        let pessoas = `@${tripe.join(', @')}`;
    
        pessoas = await mencionarUsuario(lista, pessoas, c.enrico, 0.1);

        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (['/vespa', '/vespidae', '/maribondo', '/marimbondo'].includes(message.body)) {
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

    if (message.body === '/bloisinho'){
        let random_blois = Math.floor(Math.random()*4);
        const media = MessageMedia.fromFilePath(`./pictures/bloisinhos/blois${random_blois}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }

    if (['/cladoFSM', '/cladofsm'].includes(message.body)) {
        const clado_fsm = [c.mariposas.fischer, c.sapo.shiva, c.formigas.maycon];
        let lista = clado_fsm.map(user => `${user}@c.us`);
        let pessoas = `@${clado_fsm.join(', @')}`;
        await client.sendMessage(message.from, pessoas, {mentions: lista});
    }

    if (message.body === '/mateiro'){
        let random_malta = Math.floor(Math.random()*9);
        const media = MessageMedia.fromFilePath(`./pictures/mateiros/mateiro${random_malta}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
    }

    if (message.body === '/meriva'){
        let random_meriva = Math.floor(Math.random()*11);
        const media = MessageMedia.fromFilePath(`./pictures/merivas/meriva${random_meriva}.png`);
        await client.sendMessage(message.from, media);
    }

    if (message.body === '/vermoidea'){
        const vermoidea = [c.mariposas.fischer, c.sapo.shiva, c.formigas.maycon, c.aranhas.gabriel_costa, c.aranhas.adolfo];
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
    
    // Spam handling antes de detectar os comandos
    if ([...lista_comandos, ...lista_easter].includes(message.body)) {
        let msg1 = message.timestamp;
        lista_spam[flag_spam] = msg1;

        flag_spam++;

        if(flag_spam == 2){
            flag_spam = 0;
        }

        if(!(Math.abs(lista_spam[1] - lista_spam[0]) < 3)){
            await Comandos(message);
        }
    }
});

// Ligar o bot
client.initialize();