// Client per le API REST del backend C# (ASP.NET Core).
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error(`Errore ${res.status} su ${path}`);
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Ricerca ricetta (ricettario comune + lista personale)
  cercaRicette: (q) => request(`/ricette?q=${encodeURIComponent(q ?? '')}`),
  dettaglioRicetta: (id) => request(`/ricette/${id}`),

  // Lista personale
  listaPersonale: () => request('/lista-personale'),
  aggiungiAPersonale: (id) => request(`/lista-personale/${id}`, { method: 'POST' }),
  rimuoviDaPersonale: (id) => request(`/lista-personale/${id}`, { method: 'DELETE' }),

  // Lista della spesa
  listaSpesa: () => request('/lista-spesa'),
  aggiungiASpesa: (id) => request(`/lista-spesa/${id}`, { method: 'POST' }),
  rimuoviDaSpesa: (id) => request(`/lista-spesa/${id}`, { method: 'DELETE' }),

  // Traduci lista della spesa -> lista interattiva di ingredienti
  traduciSpesa: () => request('/lista-spesa/ingredienti'),
};
