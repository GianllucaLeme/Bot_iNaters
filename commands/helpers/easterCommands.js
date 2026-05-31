const c = require('../../config/contacts_load');
const { MessageMedia } = require('whatsapp-web.js');

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
        ext: 'png',
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
        ext: 'png',
        max: 2
    }],

    ['/davi', {
        tipo: 'media',
        pasta: './pictures/aga',
        prefixo: 'clbc_davi',
        ext: 'mp3'
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
        ext: 'png',
        max: 7
    }],

    ['/melga', {
        tipo: 'random_sticker',
        pasta: './pictures/melgas',
        prefixo: 'melga',
        descricao: { sendMediaAsSticker: true , 
                     stickerAuthor: "AracnoGian", 
                     stickerName: "🤗 Irrita_Melgaço.exe 🤗" },
        max: 14
    }],

    ['/meriva', {
        tipo: 'media',
        pasta: './pictures/merivas',
        prefixo: 'meriva',
        ext: 'png',
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
        ext: 'png',
        max: 1
    }],

    ['/prancheta', {
        tipo: 'media',
        pasta: './pictures/pranchetas',
        prefixo: 'prancha',
        max: 2
    }],

    ['/reh_csif', {
        tipo: 'text',
        conhecimento: './pictures/reh_csif/dobra.txt'
    }],

    ['/vem', {
        tipo: 'media',
        pasta: './pictures/aga',
        prefixo: 'clbc_vem',
        ext: 'mp3'
    }],

    ['/vermoidea', {
        tipo: 'mention',
        
        usuarios: [c.mariposas.fischer, c.sapo.shiva, c.formigas.davi, 
                   c.aranhas.adolfo, c.sobral, c.inacio]
    }],
]);

const easterCommands_custom = new Map([
    ['/alex', async (client, message) => {
        let random_alex = Math.floor(Math.random()*7);
                
        if(random_alex < 6){
            const media = MessageMedia.fromFilePath(`./pictures/alexes/alex${random_alex}.png`);
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });
        
        } else {
            let texto_alex = `> é noz! 😉😉😉`;
            await client.sendMessage(message.from, texto_alex);
        }
    }],

    ['/kratos', async (client, message) => {
        let random_kratos = Math.floor(Math.random()*2);
        
        if(random_kratos == 1){
            let texto_kratos = `> Sereessss! 💪\n`;
            texto_kratos += `> Doem para a vila 🏘️ e o templo 🏛️ da RBN ⚔️, fomentem 💵 tudo e todos 🙌, vamos saudar 🙇 nossa senhora RBN 🩸🛡️, vamos seres ⚔️, ajudem com tudo 👊👊!!`
            await client.sendMessage(message.from, texto_kratos);

        } else {
            const media = MessageMedia.fromFilePath(`./pictures/kratos_rbn/kratos${random_kratos}.mp3`);
            await client.sendMessage(message.from, media);
        }
    }],

    ['/lycan', async (client, message) => {
        let random_lycan = Math.floor(Math.random()*5);
        const media = MessageMedia.fromFilePath(`./pictures/lycans/lycan${random_lycan}.png`);

        if (random_lycan !== 0) {
            await client.sendMessage(message.from, media, { sendMediaAsSticker: true });

        } else {
            await client.sendMessage(message.from, media);
        }
    }],

    ['/mateiro', async (client, message) => {
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
    }],

    ['/tarrafer', async (client, message) => {
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
    }]
]);


module.exports = { easterCommands, easterCommands_custom };