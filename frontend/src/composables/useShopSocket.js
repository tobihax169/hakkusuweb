import { io } from 'socket.io-client';

export function getSocketBaseUrl() {
  const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const noApi = raw.replace(/\/?api\/?$/i, '').replace(/\/$/, '');
  const fromEnv = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, '');
  return fromEnv || noApi;
}

/**
 * @returns {import('socket.io-client').Socket | null}
 */
export function createShopSocket() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return io(getSocketBaseUrl(), {
    auth: { token },
    transports: ['websocket', 'polling']
  });
}
