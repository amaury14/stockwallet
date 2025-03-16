const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../src/environments/environment.local.ts');

const environmentContent = `
export const environment = {
    name: 'NGINX',
    production: false,
    testVar: '${process.env.TEST_VAR}'
};
`;

fs.writeFileSync(envFilePath, environmentContent, 'utf-8');
console.log('Environment variables injected successfully.');
