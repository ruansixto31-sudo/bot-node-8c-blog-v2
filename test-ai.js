// test-ai3.js — Testa RAPIDAMENTE se as URLs de imagem funcionam
const http = require('http');
const https = require('https');
const fs = require('fs');

function httpPost(url, body, headers = {}) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const data = JSON.stringify(body);
        const req = http.request({
            hostname: u.hostname, port: u.port, path: u.pathname,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...headers }
        }, res => {
            let b = '';
            res.on('data', c => b += c);
            res.on('end', () => { try { resolve(JSON.parse(b)); } catch(e) { resolve({ raw: b }); } });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function main() {
    // Login
    const login = await httpPost('http://localhost:3003/api/auth/login', { username: 'adm', password: '123456' });
    if (!login.token) { console.log('LOGIN FALHOU'); return; }
    console.log('OK login');

    // AI chat
    console.log('Enviando para IA...');
    const ai = await httpPost('http://localhost:3003/api/ai/chat', {
        messages: [{ role: 'user', content: 'Crie um blog sobre noticias do Brasil' }],
        currentLayout: []
    }, { 'Authorization': 'Bearer ' + login.token });

    if (ai.error) { console.log('ERRO:', ai.error); return; }

    console.log('MSG:', ai.message);
    console.log('BLOCOS:', ai.layout?.length);

    const imgs = (ai.layout || []).filter(b => b.type === 'hero' || b.type === 'img');
    console.log('IMAGENS:', imgs.length);
    
    for (const img of imgs) {
        console.log('\nTIPO:', img.type);
        console.log('URL:', img.content);
        
        // Test if URL loads
        if (img.content?.startsWith('https://')) {
            try {
                await new Promise((resolve, reject) => {
                    https.get(img.content, { timeout: 10000 }, res => {
                        console.log('  STATUS:', res.statusCode);
                        console.log('  CT:', res.headers['content-type']);
                        if (res.statusCode === 302 || res.statusCode === 301) {
                            console.log('  REDIR:', res.headers.location);
                            console.log('  >> IMAGEM VAI FUNCIONAR NO BROWSER! <<');
                        }
                        if (res.headers['content-type']?.includes('image')) {
                            console.log('  >> IMAGEM DIRETA! <<');
                        }
                        res.resume();
                        resolve();
                    }).on('error', e => { console.log('  ERR:', e.message); resolve(); });
                });
            } catch(e) { console.log('  ERR:', e.message); }
        } else {
            console.log('  NAO E URL HTTPS!');
        }
    }
    console.log('\nFIM');
}

main().catch(e => console.log('FATAL:', e.message));
