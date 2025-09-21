const API = (process.env.REACT_APP_API_URL as string) || 'http://localhost:8080';

export function setToken(t: string){ localStorage.setItem('token', t); }
export function getToken(){ return localStorage.getItem('token'); }
export function clearToken(){ localStorage.removeItem('token'); }

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string,string> = options.headers ? { ...(options.headers as any) } : {};
  const t = getToken();
  if (t) headers['Authorization'] = `Bearer ${t}`;
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  return res.json();
}
