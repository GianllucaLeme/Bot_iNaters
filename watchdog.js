const { exec, execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const stopFile = path.join(__dirname, 'STOP');

let botProcess = null;

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
    });
}

function pararBot() {
    if (botProcess) {
        console.log('[BOT] Encerrando main.js...');

        try {
            process.kill(botProcess.pid, 'SIGKILL');
        } catch {}

        botProcess = null;
    }
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
        if (fs.existsSync(path.join(__dirname, 'KILL_WATCHDOG'))) {
            console.log('[WATCHDOG] Encerrando watchdog...');
            process.exit(0);
        } 
        
        const internet = await temInternet();

        if (internet) {
            
            // Pausar o bot através do arquivo STOP
            if (fs.existsSync(stopFile)) {
                console.log('[BOT] Arquivo STOP detectado. Watchdog pausado.');
                await new Promise(resolve => setTimeout(resolve, 60 * 1000));
                continue;
            }
            
            console.log('[NET] Internet detectada.');
            
            deletarCache();
            iniciarBot();

            // Espera um tempo para o bot reiniciar (ajustar conforme necessário)
            let horas_extras = 1;
            let horas = 1; // converter em minutos
            let minutos = 30; // converter em segundos

            await new Promise(resolve => setTimeout(resolve, horas_extras * horas * minutos * 1000));

            pararBot();

            // Mata o processo do Chrome para que outra sessão seja iniciada corretamente
            const chromePid = fs.readFileSync('chrome_pid.txt', 'utf8').trim();

            try {
                execSync(`taskkill /PID ${chromePid} /F /T`);
            } catch (err) {
                console.log(err);
            }
            
            // Tempo de aviso para o início do próximo ciclo
            let tempo_reinicio = 20;
            console.log(`[BOT] Reiniciando em ${tempo_reinicio} segundos...`);
            await new Promise(resolve => setTimeout(resolve, tempo_reinicio * 1000));

        } else {
            let tempo_sem_internet = 20;
            console.log(`[NET] Sem internet. Tentando novamente em ${tempo_sem_internet} segundos...`);
            await new Promise(resolve => setTimeout(resolve, tempo_sem_internet * 1000));
        }
    }
}

rotina();