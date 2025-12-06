import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ENVIRONMENTS = {
    dev: {
        name: 'Development',
        url: 'https://dev.tdfoco.cloud',
        vpsPath: '/home/tdfoco/development/dist',
    },
    prod: {
        name: 'Production',
        url: 'https://tdfoco.cloud',
        vpsPath: '/home/tdfoco/htdocs/tdfoco.cloud/dist',
    }
};

async function deploy(env = 'dev') {
    const environment = ENVIRONMENTS[env];

    if (!environment) {
        console.error('❌ Invalid environment. Use: dev or prod');
        process.exit(1);
    }

    console.log(`🚀 Deploying to ${environment.name} (${environment.url})...`);
    console.log('');

    try {
        // 1. Build
        console.log('📦 Building project...');
        const { stdout: buildOutput } = await execAsync('npm run build');
        console.log(buildOutput);
        console.log('✅ Build completed');
        console.log('');

        // 2. Upload
        console.log(`📤 Uploading to VPS (${environment.vpsPath})...`);
        const uploadCmd = `scp -r dist/* root@148.230.76.195:${environment.vpsPath}/`;
        await execAsync(uploadCmd);
        console.log('✅ Files uploaded');
        console.log('');

        // 3. Restart services
        console.log('🔄 Restarting services...');
        await execAsync('ssh root@148.230.76.195 "systemctl reload nginx"');
        console.log('✅ Services restarted');
        console.log('');

        console.log('========================================');
        console.log(`✅ Deployment to ${environment.name} complete!`);
        console.log(`🌍 ${environment.url}`);
        console.log('========================================');

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

// Get environment from command line args
const env = process.argv[2] || 'dev';
deploy(env);
