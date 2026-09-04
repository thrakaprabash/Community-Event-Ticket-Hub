const PROD_API_URL = 'https://community-event-ticket-hub-server.vercel.app/api';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? PROD_API_URL : '/api');
