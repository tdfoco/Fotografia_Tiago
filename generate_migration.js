import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ptJsonPath = path.join(__dirname, 'src', 'contexts', 'translations', 'pt.json');
const outputPath = path.join(__dirname, 'cms-setup.sql');

const ptTranslations = JSON.parse(fs.readFileSync(ptJsonPath, 'utf8'));

function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}

const flattened = flattenObject(ptTranslations);

let sql = '\n\n-- Initial Data Migration\n';
sql += 'INSERT INTO site_content (key, lang, value) VALUES\n';

const entries = Object.entries(flattened);
const values = entries.map(([key, value]) => {
    // Escape single quotes in value
    const escapedValue = String(value).replace(/'/g, "''");
    return `('${key}', 'pt', '${escapedValue}')`;
}).join(',\n');

sql += values + '\nON CONFLICT (key, lang) DO UPDATE SET value = EXCLUDED.value;\n';

fs.appendFileSync(outputPath, sql);

console.log('Migration script appended to cms-setup.sql');
