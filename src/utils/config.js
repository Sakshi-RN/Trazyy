// import API_ENDPOINTS from './endpoints';

// const ENV = {
//   dev: {
//     baseURL: 'https://apidev.investek.in/CCE/api/v1/',
//     endpoints: API_ENDPOINTS,
//   },
//   prod: {
//     baseURL: 'https://apiprod.investek.in/CCE/api/v1/',
//     endpoints: API_ENDPOINTS,
//   },
// };

// /**
//  * Returns environment variables based on build type
//  * __DEV__ === true  -> Development (expo start)
//  * __DEV__ === false -> Production (EAS / Play Store / TestFlight)
//  */
// const getEnvVars = () => {
//   return __DEV__ ? ENV.dev : ENV.prod;
// };

// export default getEnvVars;
import API_ENDPOINTS from './endpoints';

const ENV = {
  dev: {
    baseURL: 'https://apidev.investek.in/CCE/api/v1/',
    endpoints: API_ENDPOINTS,
  },
  prod: {
    baseURL: 'https://apiprod.investek.in/CCE/api/v1/',
    endpoints: API_ENDPOINTS,
  },
};

/**
 * FORCE production environment
 * This will use PROD URL even in development mode
 */
const getEnvVars = () => {
  // console.log('⚠️ Using PRODUCTION API in DEVELOPMENT mode');
  return ENV.prod;
};

export default getEnvVars;
