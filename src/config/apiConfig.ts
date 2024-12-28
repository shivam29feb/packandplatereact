// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Base URLs for different environments
const DEV_BASE_URL = 'http://localhost/packandplatereact/src/config';
const PROD_BASE_URL = 'http://packandplate29febreact.rf.gd/packandplatereact/src/config';

// Export the appropriate base URL
export const API_BASE_URL = isProduction ? PROD_BASE_URL : DEV_BASE_URL;

// For debugging
console.log('Current Environment:', process.env.NODE_ENV);
console.log('Is Production?', isProduction);
console.log('Selected API URL:', API_BASE_URL);
