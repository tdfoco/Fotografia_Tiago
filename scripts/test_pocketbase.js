import PocketBase from 'pocketbase';

const POCKETBASE_URL = 'https://db.tdfoco.cloud';
const pb = new PocketBase(POCKETBASE_URL);

console.log('🔍 PocketBase Diagnostic Test');
console.log('================================\n');

// Test 1: Health Check
async function testHealth() {
    try {
        console.log('1️⃣ Testing PocketBase health...');
        const health = await pb.health.check();
        console.log('✅ PocketBase is healthy:', health);
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

// Test 2: List Collections
async function testCollections() {
    try {
        console.log('\n2️⃣ Listing collections...');
        const collections = await pb.collections.getFullList();
        console.log(`✅ Found ${collections.length} collections:`);
        collections.forEach(c => console.log(`   - ${c.name} (${c.type})`));
        return collections;
    } catch (error) {
        console.error('❌ Failed to list collections:', error.message);
        return [];
    }
}

// Test 3: Test Admin Auth (will fail without credentials, but shows if endpoint works)
async function testAdminEndpoint() {
    try {
        console.log('\n3️⃣ Testing admin auth endpoint...');
        // This will fail but we can see the error type
        await pb.admins.authWithPassword('test@test.com', 'wrongpassword');
    } catch (error) {
        if (error.status === 400) {
            console.log('✅ Admin endpoint is working (returned 400 for invalid credentials)');
            return true;
        } else {
            console.error('❌ Admin endpoint error:', error.message, error.status);
            return false;
        }
    }
}

// Test 4: Test Collection Access (photography)
async function testCollectionAccess() {
    try {
        console.log('\n4️⃣ Testing photography collection access...');
        const records = await pb.collection('photography').getList(1, 1);
        console.log(`✅ Photography collection accessible, ${records.totalItems} total items`);
        return true;
    } catch (error) {
        console.error('❌ Photography collection error:', error.message, error.status);
        return false;
    }
}

// Run all tests
async function runDiagnostics() {
    console.log(`🌐 Target URL: ${POCKETBASE_URL}\n`);

    const healthOk = await testHealth();
    if (!healthOk) {
        console.log('\n❌ CRITICAL: PocketBase server is not responding!');
        console.log('Please check:');
        console.log('  - Is the server running?');
        console.log('  - Is the URL correct?');
        console.log('  - Are there network/firewall issues?');
        return;
    }

    const collections = await testCollections();
    const expectedCollections = [
        'photography',
        'design_projects',
        'hero_images',
        'comments',
        'messages',
        'site_content'
    ];

    console.log('\n📋 Checking required collections:');
    expectedCollections.forEach(name => {
        const exists = collections.find(c => c.name === name);
        if (exists) {
            console.log(`✅ ${name}`);
        } else {
            console.log(`❌ ${name} - MISSING!`);
        }
    });

    await testAdminEndpoint();
    await testCollectionAccess();

    console.log('\n================================');
    console.log('Diagnostic complete!');
}

runDiagnostics().catch(console.error);
