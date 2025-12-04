const https = require('https');

const data = JSON.stringify({
    email: 'tdfoco@gmail.com',
    password: 'luaTD0101*',
    passwordConfirm: 'luaTD0101*'
});

const options = {
    hostname: 'db.tdfoco.cloud',
    port: 443,
    path: '/api/admins',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Tentando criar admin...');

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', responseBody);

        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ SUCESSO!');
        } else {
            console.log('❌ FALHA.');
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Erro de conexão:', error);
});

req.write(data);
req.end();
