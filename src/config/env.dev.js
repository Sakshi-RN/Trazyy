import API_ENDPOINTS from '../utils/endpoints';

export default {
    ENV: 'DEV',
    // NOTE: Using PROD URL for Dev because apidev is unstable (400 Bad Request)
    baseURL: 'https://apiprod.investek.in/CCE/api/v1/',
    endpoints: API_ENDPOINTS,
    larkApiKey: 'sdk_test_ea05090c5371daa3e4096b2b0014a197',
    larkApiSecret: 'secret_test_c4a467e49376cbee6b17307785d07f3c',
};
