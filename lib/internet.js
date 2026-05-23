// Verifica se há conexão com a internet [para conexões instáveis e host local]
const https = require('https');

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

module.exports = { temInternet };