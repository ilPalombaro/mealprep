import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { coloreIcona } from '../helpers.js';

// Caso d'uso "Gestione lista della spesa": elenco delle ricette scelte, rimozione
// e comando "Traduci lista della spesa" verso la lista interattiva di ingredienti.
export default function Shopping({ toast, onView, navigate }) {
  const [ricette, setRicette] = useState([]);
  const [ingredienti, setIngredienti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);

  async function ricarica() {
    setCaricamento(true);
    try {
      const [spesa, ing] = await Promise.all([
        api.listaSpesa(),
        api.traduciSpesa(),
      ]);
      setRicette(spesa);
      setIngredienti(ing);
    } catch {
      toast('Errore di connessione al server', 'error');
    } finally {
      setCaricamento(false);
    }
  }

  useEffect(() => { ricarica(); }, []);

  async function rimuovi(r) {
    try {
      await api.rimuoviDaSpesa(r.id);
      toast(`"${r.nome}" rimossa dalla lista della spesa`);
      ricarica();
    } catch {
      toast('Impossibile rimuovere la ricetta', 'error');
    }
  }

  const allergeni = [...new Set(ingredienti.flatMap((i) => i.allergeni))];
  const vuota = ricette.length === 0;

  return (
    <>
      <div className="page-header">
        <h1>Lista della spesa</h1>
        <p>Seleziona le ricette da preparare</p>
      </div>

      <div className="section">
        <p className="section-label">Ricette selezionate</p>

        {caricamento && <div className="loading-row">Caricamento…</div>}

        {!caricamento && vuota && (
          <div className="shopping-empty">
            <i className="ti ti-shopping-cart"></i>
            <p>Nessuna ricetta nella lista — aggiungine dalla lista personale</p>
          </div>
        )}

        {!caricamento && ricette.map((r) => (
          <div className="recipe-card clickable" key={r.id} onClick={() => onView(r.id)}>
            <div className={`recipe-icon ${coloreIcona(r.coloreIcona)}`} aria-hidden="true">
              <i className={`ti ${r.icona || 'ti-bowl'}`}></i>
            </div>
            <div className="recipe-info">
              <div className="recipe-name">{r.nome}</div>
              <div className="recipe-meta">{r.ingredienti.length} ingredienti</div>
            </div>
            <div className="recipe-actions" onClick={(e) => e.stopPropagation()}>
              <button className="recipe-remove" onClick={() => rimuovi(r)} aria-label={`Rimuovi ${r.nome}`}>
                <i className="ti ti-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {!caricamento && !vuota && (
        <div className="shopping-footer">
          <div className="shopping-stats">
            <div className="stat-pill"><i className="ti ti-book-2"></i>{ricette.length} ricette</div>
            <div className="stat-pill"><i className="ti ti-list"></i>{ingredienti.length} ingredienti</div>
            {allergeni.length > 0 && (
              <div className="stat-pill warn"><i className="ti ti-alert-triangle"></i>{allergeni.length} allergeni</div>
            )}
          </div>
          <button className="btn-primary" onClick={() => navigate('ingredients')}>
            <i className="ti ti-list-check"></i>
            Traduci lista della spesa
          </button>
        </div>
      )}
    </>
  );
}
