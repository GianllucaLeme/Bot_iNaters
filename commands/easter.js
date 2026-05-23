const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const c = require('../config/contacts_load');

const lista_easter = new Set([
    '/aga', '/alex', '/nos', '/noz', '/naturalista', '/bloisinho', '/blois', '/bloisin', 
    '/crispinin', '/bot', '/caf', '/cladofsm', '/curse', '/trader', '/golpe', '/davi', 
    '/douglas', '/gareli', '/garelli', '/garelao', '/kratos', '/kratosrbn', '/kratos_rbn', 
    '/lycan', '/lycantropia', '/mateiro', '/melga', '/melguinha', '/melgaco', '/adolfo', 
    '/meriva', '/sorteio', '/metaflora', '/metazooa', '/metazoa', '/plankoidea', 
    '/planklep', '/prancheta', '/prancha', '/26', '/reh_csif', '/rehcsif', '/dobra', 
    '/tarrafer', '/fischer', '/vem', '/vermoidea']);

// Função para os comandos Easter Eggs
async function ComandosEasterEgg(client, message, mensagem_normalizada, contato_comando){

    if (['/aga', '/h'].includes(mensagem_normalizada)) {
        const aga = [c.formigas.davi, c.aranhas.gianlluca, c.mariposas.luis_eduardo, 
                     c.formigas.maycon, c.formigas.felipe_santos, c.formigas.gabriel_rogerio, 
                     c.formigas.gomide, c.staph.pedro_staph, c.aranhas.ryan, c.vankan, c.bot];

        let lista = aga.map(user => `${user}@c.us`);
        let pessoas = `@${aga.join(', @')}`;

        await client.sendMessage(message.from, pessoas, {mentions: lista});

        return;
    }

    if (['/alex', '/nos', '/noz', '/naturalista'].includes(mensagem_normalizada)){
        let random_alex = Math.floor(Math.random()*7);
        
        if(random_alex < 6){
            const media = MessageMedia.fromFilePath(`./pictures/alexes/alex${random_alex}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        } else {
            let texto_alex = `> é noz! 😉😉😉`;
            await client.sendMessage(message.from, texto_alex);
        }
        
        return;
    }

    if (['/bloisinho', '/blois', '/bloisin', '/crispinin'].includes(mensagem_normalizada)){
        let random_blois = Math.floor(Math.random()*10);
        const media = MessageMedia.fromFilePath(`./pictures/bloisinhos/blois${random_blois}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        return;
    }
    
    if (mensagem_normalizada === '/bot'){
        let random_patada = Math.floor(Math.random()*3);
        const media = MessageMedia.fromFilePath(`./pictures/bot_patadas/patada${random_patada}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        return;
    }

    if (mensagem_normalizada === '/caf'){
        let random_certidao = Math.floor(Math.random()*1);
        const media = MessageMedia.fromFilePath(`./pictures/certidao_caf/caf${random_certidao}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/cladofsm') {
        const clado_fsm = [c.mariposas.fischer, c.sapo.shiva, c.formigas.maycon];
        let lista = clado_fsm.map(user => `${user}@c.us`);
        let pessoas = `@${clado_fsm.join(', @')}`;
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }

    if (['/curse', '/trader', '/golpe'].includes(mensagem_normalizada)){
        let random_curse = Math.floor(Math.random()*2);
        const media = MessageMedia.fromFilePath(`./pictures/curses/curse${random_curse}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/davi'){
        const media = MessageMedia.fromFilePath(`./pictures/aga/clbc_davi.mp3`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (['/dicka', '/dickao'].includes(mensagem_normalizada)) {
        let random_dicka = Math.floor(Math.random()*7);
        const media = MessageMedia.fromFilePath(`./pictures/aga/dickas/dicka${random_dicka}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/douglas'){
        let random_douglas = Math.floor(Math.random()*7);
        const media = MessageMedia.fromFilePath(`./pictures/douglas/douglas${random_douglas}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (['/kratos', '/kratosrbn', '/kratos_rbn'].includes(mensagem_normalizada)){
        let random_kratos = Math.floor(Math.random()*2);

        if(random_kratos == 1){
            let texto_kratos = `> Sereessss! 💪\n`;
            texto_kratos += `> Doem para a vila 🏘️ e o templo 🏛️ da RBN ⚔️, fomentem 💵 tudo e todos 🙌, vamos saudar 🙇 nossa senhora RBN 🩸🛡️, vamos seres ⚔️, ajudem com tudo 👊👊!!`

            await client.sendMessage(message.from, texto_kratos);
        } else {
            const media = MessageMedia.fromFilePath(`./pictures/kratos_rbn/kratos${random_kratos}.mp3`);
            await client.sendMessage(message.from, media);
        }
        return;
    }

    if (['/lycantropia', '/lycan'].includes(mensagem_normalizada)){
        let random_lycan = Math.floor(Math.random()*5);

        if (random_lycan !== 0) {
            const media = MessageMedia.fromFilePath(`./pictures/lycans/lycan${random_lycan}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        } else {
            await client.sendMessage(message.from, media);
        }
        
        return;
    }

    if (mensagem_normalizada === '/mateiro'){
        const hoje = new Date();

        const natal = (
            hoje.getMonth() === 11 &&
            hoje.getDate() >= 24 &&
            hoje.getDate() <= 25
        );

        if(natal){
            const media = MessageMedia.fromFilePath(`./pictures/mateiros/mateiro${7}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        } else {
            let random_malta = Math.floor(Math.random()*20);
            const media = MessageMedia.fromFilePath(`./pictures/mateiros/mateiro${random_malta}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        }
        return;
    }

    if (['/melga', '/melguinha', '/melgaco', '/adolfo'].includes(mensagem_normalizada)){
        let random_melga = Math.floor(Math.random()*14);
        const media = MessageMedia.fromFilePath(`./pictures/melgas/melga${random_melga}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true , 
                                                        stickerAuthor: "AracnoGian", 
                                                        stickerName: "🤗 Irrita_Melgaço.exe 🤗" });
        return;
    }

    if (['/meriva', '/sorteio'].includes(mensagem_normalizada)){
        let random_meriva = Math.floor(Math.random()*15);
        const media = MessageMedia.fromFilePath(`./pictures/merivas/meriva${random_meriva}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/metaflora') {
        let mensagem_flora = 'Qual a planta do dia? 👀\n\n';

        mensagem_flora += 'https://flora.metazooa.com';

        await client.sendMessage(message.from, mensagem_flora);
        return;
    }

    if (['/metazooa', '/metazoa'].includes(mensagem_normalizada)) {
        let mensagem_zooa = 'Qual o bicho do dia? 👀\n\n';

        mensagem_zooa += 'https://metazooa.com';

        await client.sendMessage(message.from, mensagem_zooa);
        return;
    }

    if (['/plankoidea', '/planklep'].includes(mensagem_normalizada)){
        let random_plank = Math.floor(Math.random()*1);
        const media = MessageMedia.fromFilePath(`./pictures/plankoidea/plank${random_plank}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (['/prancheta', '/prancha', '/26'].includes(mensagem_normalizada)){
        let random_prancha = Math.floor(Math.random()*2);
        const media = MessageMedia.fromFilePath(`./pictures/pranchetas/prancha${random_prancha}.png`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (['/reh_csif', '/rehcsif', '/dobra'].includes(mensagem_normalizada)){
        let random_reh = Math.floor(Math.random()*1);

        const caminho = `./pictures/reh_csif/conhecimento${random_reh}.txt`;
        let texto_conhecimento = await fs.promises.readFile(caminho, 'utf-8');
        
        await client.sendMessage(message.from, texto_conhecimento);
        return;
    }

    if (['/tarrafer', '/fischer'].includes(mensagem_normalizada)){
        let random_tarrafer = Math.floor(Math.random()*17);

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
        } else if([13, 14, 15, 16].includes(random_tarrafer)){
            const contatinho = [`${c.mariposas.fischer}@c.us`];

            let texto_sabio2 = `Áudio supremo do nosso amigo @${c.mariposas.fischer}:`;

            await client.sendMessage(message.from, texto_sabio2, {mentions: contatinho});
            
            const media = MessageMedia.fromFilePath(`./pictures/tarraferes/tarrafer${random_tarrafer}.mp3`);
            await client.sendMessage(message.from, media);
        }
        return;
    }

    if (mensagem_normalizada === '/vem'){
        const media = MessageMedia.fromFilePath(`./pictures/aga/clbc_vem.mp3`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/vermoidea'){
        const vermoidea = [c.mariposas.fischer, c.sapo.shiva, c.formigas.davi, 
                           c.aranhas.adolfo, c.sobral, c.inacio];
        let lista = vermoidea.map(user => `${user}@c.us`);
        let pessoas = `@${vermoidea.join(', @')}`;
        await client.sendMessage(message.from, pessoas, {mentions: lista});
        return;
    }
}

module.exports = { ComandosEasterEgg, lista_easter };