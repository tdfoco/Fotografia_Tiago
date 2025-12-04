
const url = 'https://db.tdfoco.cloud/api/admins';
const data = {
    email: 'tdfoco@gmail.com',
    password: 'luaTD0101*',
    passwordConfirm: 'luaTD0101*'
};

console.log(`Tentando criar admin em: ${url}`);

try {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
        console.log('✅ Admin criado com sucesso!');
    } else {
        console.log('ℹ️ Resultado:', result);
    }
} catch (error) {
    console.error('❌ Erro de conexão:', error);
}
