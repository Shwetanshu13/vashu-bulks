// Environment configuration
const ENV = {
    development: {
        API_BASE_URL: 'http://localhost:3000/api',
        DEBUG: true,
    },
    production: {
        API_BASE_URL: 'https://your-production-api.com/api',
        DEBUG: false,
    },
};

const getCurrentEnv = () => {
    return __DEV__ ? ENV.development : ENV.production;
};

export default getCurrentEnv();