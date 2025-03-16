const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../src/environments/environment.ts');

const environmentContent = `
export const environment = {
    name: 'prod',
    production: true,
    firebaseConfig: {
        apiKey: '${process.env.DEV_FIREBASE_KEY}',
        authDomain: '${process.env.DEV_FIREBASE_AUTH_DOMAIN}',
        projectId: '${process.env.DEV_FIREBASE_PROJECT_ID}',
        storageBucket: '${process.env.DEV_FIREBASE_STORAGE_BUCKET}',
        messagingSenderId: '${process.env.DEV_FIREBASE_MESSAGING_SENDER_ID}',
        appId: '${process.env.DEV_FIREBASE_APP_ID}',
        measurementId: '${process.env.DEV_FIREBASE_MEASUREMENT_ID}',
    },
    rapidApiURL: '${process.env.DEV_RAPID_API_URL}',
    xRapidApiHostField: '${process.env.DEV_RAPID_API_HOST_FIELD}',
    xRapidApiHost: '${process.env.DEV_RAPID_API_HOST}',
    xRapidApiKeyField: '${process.env.DEV_RAPID_API_KEY_FIELD}',
    xRapidApiKey: '${process.env.DEV_RAPID_API_KEY}',
    logosUrl: '${process.env.DEV_LOGOS_URL}'
};
`;

fs.writeFileSync(envFilePath, environmentContent, 'utf-8');
console.log('Environment variables injected successfully.');
