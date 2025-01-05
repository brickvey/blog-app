const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetcher = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${API_URL}${endpoint}`, options);
  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

