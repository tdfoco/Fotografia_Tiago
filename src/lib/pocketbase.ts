import PocketBase from 'pocketbase';

// URL do PocketBase (será atualizada após a instalação na VPS)
export const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://148.230.76.195:8090';

export const pb = new PocketBase(POCKETBASE_URL);

// Desabilitar auto-cancelamento de requisições pendentes
pb.autoCancellation(false);
