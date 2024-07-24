"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function combineCsv(dir) {
    const result = [];
    const files = fs.readdirSync(dir).filter(f => path.extname(f) === '.csv');
    const data = fs.readFileSync(path.join(dir, files[0]), 'utf-8');
    const lines = data.split('\n');
    result.push(lines[0]);
    files.forEach(file => {
        const data = fs.readFileSync(path.join(dir, file), 'utf-8');
        const lines = data.split('\n').slice(1);
        lines.forEach(line => {
            result.push(line);
        });
    });
    fs.writeFileSync(path.join(dir, 'combined.csv'), result.join('\n'));
}
if (process.argv.length < 3) {
    console.error('Usage: ts-node merge_csv.ts <directory path>');
}
else {
    combineCsv(process.argv[2]);
}
//# sourceMappingURL=merge_csv.js.map