import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { coloreIcona } from '../helpers.js';

// Caso d'uso "Ricerca ricetta": ricerca per nome nel ricettario comune e nella
// lista personale, con possibilita' di visualizzare i dettagli o aggiungere una
// ricetta alla lista personale.
export default function Search({ toast, onView }) {
  const [query, setQuery] = useState('');
  const [risultati, setRisultati] = useState([]);
  const [personaleIds, setPersonaleIds] = useState(new Set());
  const [caricamento, setCaricamento] = useState(true);

  async function ricarica(q) {
    setCaricamento(true);
    try {
      const [ricette, personale] = await Promise.all([
        api.cercaRicette(q),
        api.listaPersonale(),
      ]);
      setRisultati(ricette);
      setPersonaleIds(new Set(personale.map((r) => r.id)));
    } catch {
      toast('Errore di connessione al server', 'error');
    } finally {
      setCaricamento(false);
    }
  }

  // Ricerca con debounce sull'input.
  useEffect(() => {
    const t = setTimeout(() => ricarica(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  async function aggiungi(ricetta) {
    try {
      await api.aggiungiAPersonale(ricetta.id);
      setPersonaleIds((prev) => new Set(prev).add(ricetta.id));
      toast(`"${ricetta.nome}" aggiunta alla lista personale`);
    } catch {
      toast('Impossibile aggiungere la ricetta', 'error');
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Ricerca ricette</h1>
        <p>Cerca nel ricettario comune e nella tua lista personale</p>
      </div>

      <div className="search-bar">
        <i className="ti ti-search"></i>
        <input
          type="text"
          placeholder="Cerca una ricetta per nome…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {caricamento && <div className="loading-row">Caricamento…</div>}

      {!caricamento && risultati.length === 0 && (
        <div className="placeholder-wrap">
          <i className="ti ti-search-off"></i>
          <p>Nessuna ricetta trovata</p>
        </div>
      )}

      {!caricamento && risultati.map((r) => {
        const inPersonale = personaleIds.has(r.id);
        return (
          <div className="recipe-card clickable" key={r.id} onClick={() => onView(r.id)}>
            <div className={`recipe-icon ${coloreIcona(r.coloreIcona)}`} aria-hidden="true">
              <i className={`ti ${r.icona || 'ti-bowl'}`}></i>
            </div>
            <div className="recipe-info">
              <div className="recipe-name">{r.nome}</div>
              <div className="recipe-meta">
                {r.ingredienti.length} ingredienti
                {inPersonale && <span style={{ color: 'var(--primary)' }}>· in lista personale</span>}
              </div>
            </div>
            <div className="recipe-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="recipe-add"
                onClick={() => aggiungi(r)}
                disabled={inPersonale}
                aria-label={`Aggiungi ${r.nome} alla lista personale`}
                title={inPersonale ? 'Già nella lista personale' : 'Aggiungi alla lista personale'}
              >
                <i className={`ti ${inPersonale ? 'ti-check' : 'ti-bookmark-plus'}`}></i>
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
