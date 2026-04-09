const { exec, execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

let botProcess = null;
let contadorReinicio = 0; // Mandar mensagem de aviso de reinicialização do bot

// Limpa arquivos de controle antigos
const killrestartNotice = path.join(__dirname, 'RESTART_NOTICE');
const killStop = path.join(__dirname, 'STOP');

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

    botProcess = spawn('node', ['main.js'], {
        stdio: 'inherit',
        shell: true
    });

    botProcess.on('close', (code) => {
        console.log(`[BOT] main.js encerrado com código ${code}`);

        // Zera o contador caso o bot em si (main.js) dê erro inesperado
        if (code !== 0) {
            contadorReinicio = 0;
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
    const cachePath = path.join(__dirname, '.wwebjs_cache');

    if (fs.existsSync(cachePath)) {
        console.log('[BOT] Deletando o cache...');
        fs.rmSync(cachePath, { recursive: true, force: true });
    }
}

// Rotina principal
async function rotina() {

    while (true) {
        // Arquivo de parada caso tenha mais de um processo do watchdog rodando em segundo plano
        if (fs.existsSync(path.join(__dirname, 'KILL'))) {
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

            // Aviso a cada 6 reinícios
            contadorReinicio++;
            if (contadorReinicio == 6) {
                fs.writeFileSync(path.join(__dirname, 'RESTART_NOTICE'), '1');
                contadorReinicio = 0; // Reinicia o contador
            }

            // Espera um tempo para o bot reiniciar (ajustar conforme necessário)
            let horas_extras = 1;
            let horas = 1; // converter em minutos
            let minutos = 60 * 30; // converter em segundos

            await new Promise(resolve => setTimeout(resolve, horas_extras * horas * minutos * 1000));

            pararBot();

            // Mata o processo do Chrome para que outra sessão seja iniciada corretamente
            const chromePidPath = path.join(__dirname, 'chrome_pid.txt');

            if (fs.existsSync(chromePidPath)) {
                const chromePid = fs.readFileSync(chromePidPath, 'utf8').trim();

                try {
                    execSync(`taskkill /PID ${chromePid} /F /T`);
                } catch (err) {
                    console.log('[BOT] Não foi possível encerrar o Chrome:', err.message);
                }

                fs.unlinkSync(chromePidPath);
            }
            
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