import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function check() {
    const doc = await PDFDocument.create();
    console.log('Keys:', Object.keys(doc));
    console.log('Prototype keys:', Object.getOwnPropertyNames(Object.getPrototypeOf(doc)));

    // Try to find version file
    try {
        const pkg = JSON.parse(fs.readFileSync('node_modules/pdf-lib/package.json', 'utf8'));
        console.log('Version:', pkg.version);
    } catch (e) {
        console.log('Could not read version');
    }
}

check().catch(console.error);
