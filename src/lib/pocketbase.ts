import PocketBase from 'pocketbase';

// URL do PocketBase
export const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://db.tdfoco.cloud';

export const pb = new PocketBase(POCKETBASE_URL);

// Desabilitar auto-cancelamento de requisições pendentes
pb.autoCancellation(false);
