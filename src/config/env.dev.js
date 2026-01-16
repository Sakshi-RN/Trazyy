import API_ENDPOINTS from '../utils/endpoints';

export default {
    ENV: 'DEV',
    // NOTE: Using PROD URL for Dev because apidev is unstable (400 Bad Request)
    baseURL: 'https://apiprod.investek.in/CCE/api/v1/',
    endpoints: API_ENDPOINTS,
};
