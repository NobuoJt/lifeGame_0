const fs = require('fs');
const path = require('path');
const licenseChecker = require('license-checker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const licensesDir = path.join(__dirname);
if (!fs.existsSync(licensesDir)) fs.mkdirSync(licensesDir);

// ステップ 1: license-checker で取得
licenseChecker.init({ start: '.', json: true }, async (err, json) => {
    if (err) {
        console.error('Error fetching licenses:', err);
        process.exit(1);
    }

    const jsonPath = path.join(licensesDir, 'license_list.json');
    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
    console.log(`Saved: ${jsonPath}`);

  // ステップ 2: CSV に変換
    const csvPath = path.join(licensesDir, 'license_list.csv');
    const csvWriter = createCsvWriter({
        path: csvPath,
        header: [
            { id: 'name', title: 'Package' },
            { id: 'licenses', title: 'License' },
            { id: 'repository', title: 'Repository' },
            { id: 'licenseFile', title: 'LicenseFile' },
        ],
    });

    const records = Object.entries(json).map(([pkgName, info]) => ({
        name: pkgName,
        licenses: info.licenses,
        repository: info.repository || '',
        licenseFile: info.licenseFile || '',
    }));

    await csvWriter.writeRecords(records);
    console.log(`Saved: ${csvPath}`);

  // ステップ 3: ライセンス本文を保存
    for (const [pkgName, info] of Object.entries(json)) {
        const licenseTextPath = info.licenseFile;
        if (licenseTextPath && fs.existsSync(licenseTextPath)) {
            const content = fs.readFileSync(licenseTextPath, 'utf-8');
            const safeName = pkgName.replace(/[\/@]/g, '_');
            const destPath = path.join(licensesDir, `${safeName}_LICENSE.txt`);
            fs.writeFileSync(destPath, content);
        }
    }

    fs.rmSync(jsonPath, { force: true });

    console.log('Individual license files saved.');
});