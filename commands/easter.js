const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const c = require('../config/contacts_load');

const { easterCommands, lista_easter_set } = require('./helpers/easterCommands');
const { easterAliases } = require('./maps/easterAliases');

const { enviarStickerAleatorio, enviarTexto, enviarMedia, enviarMentions } = require('./handlers/easterSender');

const lista_easter = new Set([
    '/aga', '/alex', '/nos', '/noz', '/naturalista', '/bloisinho', '/blois', '/bloisin', 
    '/crispinin', '/bot', '/caf', '/cladofsm', '/curse', '/trader', '/golpe', '/davi', 
    '/douglas', '/kratos', '/kratosrbn', '/kratos_rbn', '/lycan', '/lycantropia', '/mateiro', 
    '/melga', '/melguinha', '/melgaco', '/adolfo', '/meriva', '/sorteio', '/metaflora', 
    '/metazooa', '/metazoa', '/plankoidea', '/planklep', '/prancheta', '/prancha', '/26', 
    '/reh_csif', '/rehcsif', '/dobra', '/tarrafer', '/fischer', '/vem', '/vermoidea'
]);


// Função para os comandos Easter Eggs
async function ComandosEasterEgg(client, message, mensagem_normalizada){
    let comando = mensagem_normalizada;

    if (easterAliases.has(mensagem_normalizada)) {
        comando = easterAliases.get(mensagem_normalizada);
    }

    const config = easterCommands.get(comando);

    if (config) {
        switch (config.tipo) {
            case 'mention':
                await enviarMentions(client, message, config.usuarios);
                break;
    
            case 'random_sticker':
                await enviarStickerAleatorio(client, message, config);
                break;
    
            case 'text':
                await enviarTexto(client, message, config);
                break;
            
            case 'media':
                await enviarMedia(client, message, config);
                break;
        }
    }

    if (mensagem_normalizada === '/alex'){
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

    if (mensagem_normalizada === '/davi'){
        const media = MessageMedia.fromFilePath(`./pictures/aga/clbc_davi.mp3`);
        await client.sendMessage(message.from, media);
        return;
    }

    if (mensagem_normalizada === '/kratos'){
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

    if (mensagem_normalizada === '/lycan'){
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

    if (mensagem_normalizada === '/melga'){
        let random_melga = Math.floor(Math.random()*14);
        const media = MessageMedia.fromFilePath(`./pictures/melgas/melga${random_melga}.png`);
        await client.sendMessage(message.from, media, { sendMediaAsSticker: true , 
                                                        stickerAuthor: "AracnoGian", 
                                                        stickerName: "🤗 Irrita_Melgaço.exe 🤗" });
        return;
    }

    if (mensagem_normalizada === '/reh_csif'){
        let random_reh = Math.floor(Math.random()*1);

        const caminho = `./pictures/reh_csif/conhecimento${random_reh}.txt`;
        let texto_conhecimento = await fs.promises.readFile(caminho, 'utf-8');
        
        await client.sendMessage(message.from, texto_conhecimento);
        return;
    }

    if (mensagem_normalizada === '/tarrafer'){
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
}


module.exports = { ComandosEasterEgg, lista_easter };