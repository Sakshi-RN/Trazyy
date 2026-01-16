import Constants from 'expo-constants';

// Default to 'dev' if not specified
const appEnv = Constants.expoConfig?.extra?.APP_ENV || 'dev';

let config;

switch (appEnv) {
    case 'uat':
        config = require('./env.uat').default;
        break;
    case 'prod':
    case 'production':
        config = require('./env.prod').default;
        break;
    case 'dev':
    default:
        config = require('./env.dev').default;
        break;
}

export default config;
