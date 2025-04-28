import { getAuth } from 'firebase/auth';

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const currentUser = getAuth().currentUser;
  if (!currentUser) throw new Error('User not authenticated');

  const token = await currentUser.getIdToken();

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, { ...options, headers });
}