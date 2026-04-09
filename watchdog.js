const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

let botProcess = null;
let contadorReinicio = 0; // Mandar mensagem de aviso de reinicialização do bot
let botCaiu = false; // flag para escutar o encerramento do processo

// Limpa arquivos de controle antigos
const killrestartNotice = path.join(process.cwd(), 'RESTART_NOTICE');
const killStop = path.join(process.cwd(), 'STOP');

if (fs.existsSync(killStop)) {
    fs.unlinkSync(killStop);
}
if (fs.existsSync(killrestartNotice)) {
    fs.unlinkSync(killrestartNotice);
}

// Verifica se há conexão com a internet [para conexões instáveis e host local]
function temInternet() {
    return new Promise((resolve) => {
        const req = https.get('https://www.google.com', (res) => {
            resolve(res.statusCode >= 200 && res.statusCode < 400);
        });

        req.on('error', () => resolve(false));

        req.setTimeout(5000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

// Funções para iniciar, parar e deletar cache do bot
function iniciarBot() {
    console.log('[BOT] Iniciando main.js...');

    const mainPath = path.join(process.cwd(), 'main.js');

    botProcess = spawn('node.exe', [mainPath], {
        stdio: 'inherit'
    });

    botProcess.on('close', (code) => {
        console.log(`[BOT] main.js encerrado com código ${code}`);

        // Zera o contador caso o bot em si (main.js) dê erro inesperado
        if (code !== 0) {
            botCaiu = true;
        }

        botProcess = null;
    });
}

async function pararBot() {
    if (!botProcess) return;

    console.log('[BOT] Encerrando main.js...');

    const processo = botProcess;

    try {
        process.kill(processo.pid, 'SIGKILL');
    } catch {}

    await new Promise(resolve => {
        processo.once('close', resolve);
        setTimeout(resolve, 5000);
    });

    botProcess = null;
}

function deletarCache() {
    const cachePath = path.join(process.cwd(), '.wwebjs_cache');

    if (fs.existsSync(cachePath)) {
        console.log('[BOT] Deletando o cache...');
        fs.rmSync(cachePath, { recursive: true, force: true });
    }
}

// Rotina principal
async function rotina() {

    while (true) {
        // Arquivo de parada caso tenha mais de um processo do watchdog rodando em segundo plano
        if (fs.existsSync(path.join(process.cwd(), 'KILL'))) {
            console.log('[WATCHDOG] Encerrando watchdog...');
            process.exit(0);
        } 
        
        const internet = await temInternet();

        if (internet) {
            
            console.log('[NET] Internet detectada.');
            
            deletarCache();

            // Condição para evitar que duas instâncias do bot sejam iniciadas
            if (!botProcess) {
                iniciarBot();
            }

            // Condição para mandar mensagem de reinício do bot no grupo
            const stopPath = path.join(process.cwd(), 'STOP'); // Impede a mensagem caso esteja pausado

            if (fs.existsSync(stopPath)) {
                contadorReinicio = 0;

                const restartPath = path.join(process.cwd(), 'RESTART_NOTICE');

                if (fs.existsSync(restartPath)) {
                    fs.unlinkSync(restartPath);
                }
            } else {
                // Aviso a cada 6 reinícios
                contadorReinicio++;
                console.log(contadorReinicio);

                if (contadorReinicio >= 6) {
                    fs.writeFileSync(path.join(process.cwd(), 'RESTART_NOTICE'), '1');
                    contadorReinicio = 0;
                }
            }

            // Espera um tempo para o bot reiniciar (ajustar conforme necessário)
            let horas_extras = 1;
            let horas = 1; // converter em minutos
            let minutos = 60 * 30; // converter em segundos
            
            botCaiu = false;
            const tempoTotal = horas_extras * horas * minutos * 1000;
            const intervalo = 5000;

            for (let tempo = 0; tempo < tempoTotal; tempo += intervalo) {
                if (botCaiu) {
                    console.log('[WATCHDOG] Bot caiu inesperadamente, reiniciando ciclo...');
                    break;
                }

                await new Promise(resolve => setTimeout(resolve, intervalo));
            }

            pararBot();
            
            // Tempo de aviso para o início do próximo ciclo
            let tempo_reinicio = 10;
            console.log(`[BOT] Reiniciando em ${tempo_reinicio} segundos...`);
            await new Promise(resolve => setTimeout(resolve, tempo_reinicio * 1000));

        } else {
            contadorReinicio = 0;
            let tempo_sem_internet = 10;
            console.log(`[NET] Sem internet. Tentando novamente em ${tempo_sem_internet} segundos...`);
            await new Promise(resolve => setTimeout(resolve, tempo_sem_internet * 1000));
        }
    }
}

rotina();