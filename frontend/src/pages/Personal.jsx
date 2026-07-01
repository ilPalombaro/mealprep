import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { coloreIcona } from '../helpers.js';

// Lista personale: le ricette salvate dall'utente. Da qui si aggiungono ricette
// alla lista della spesa (caso d'uso "Gestione lista della spesa") o si rimuovono
// dalla lista personale.
export default function Personal({ toast, onView, navigate }) {
  const [ricette, setRicette] = useState([]);
  const [spesaIds, setSpesaIds] = useState(new Set());
  const [caricamento, setCaricamento] = useState(true);

  async function ricarica() {
    setCaricamento(true);
    try {
      const [personale, spesa] = await Promise.all([
        api.listaPersonale(),
        api.listaSpesa(),
      ]);
      setRicette(personale);
      setSpesaIds(new Set(spesa.map((r) => r.id)));
    } catch {
      toast('Errore di connessione al server', 'error');
    } finally {
      setCaricamento(false);
    }
  }

  useEffect(() => { ricarica(); }, []);

  async function aggiungiASpesa(r) {
    try {
      await api.aggiungiASpesa(r.id);
      setSpesaIds((prev) => new Set(prev).add(r.id));
      toast(`"${r.nome}" aggiunta alla lista della spesa`);
    } catch {
      toast('Impossibile aggiungere alla spesa', 'error');
    }
  }

  async function rimuovi(r) {
    try {
      await api.rimuoviDaPersonale(r.id);
      setRicette((prev) => prev.filter((x) => x.id !== r.id));
      toast(`"${r.nome}" rimossa dalla lista personale`);
    } catch {
      toast('Impossibile rimuovere la ricetta', 'error');
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Lista personale</h1>
        <p>Le tue ricette salvate</p>
      </div>

      {caricamento && <div className="loading-row">Caricamento…</div>}

      {!caricamento && ricette.length === 0 && (
        <div className="placeholder-wrap">
          <i className="ti ti-bookmark"></i>
          <p>Nessuna ricetta salvata — cercane una da aggiungere</p>
          <button className="btn-outline" style={{ width: 'auto', marginTop: 8 }} onClick={() => navigate('search')}>
            <i className="ti ti-search"></i>Vai alla ricerca
          </button>
        </div>
      )}

      {!caricamento && ricette.map((r) => {
        const inSpesa = spesaIds.has(r.id);
        return (
          <div className="recipe-card clickable" key={r.id} onClick={() => onView(r.id)}>
            <div className={`recipe-icon ${coloreIcona(r.coloreIcona)}`} aria-hidden="true">
              <i className={`ti ${r.icona || 'ti-bowl'}`}></i>
            </div>
            <div className="recipe-info">
              <div className="recipe-name">{r.nome}</div>
              <div className="recipe-meta">
                {r.ingredienti.length} ingredienti
                {inSpesa && <span style={{ color: 'var(--amber)' }}>· nella spesa</span>}
              </div>
            </div>
            <div className="recipe-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="recipe-add"
                onClick={() => aggiungiASpesa(r)}
                disabled={inSpesa}
                title={inSpesa ? 'Già nella lista della spesa' : 'Aggiungi alla lista della spesa'}
                aria-label={`Aggiungi ${r.nome} alla lista della spesa`}
              >
                <i className={`ti ${inSpesa ? 'ti-check' : 'ti-shopping-cart-plus'}`}></i>
              </button>
              <button className="recipe-remove" onClick={() => rimuovi(r)} aria-label={`Rimuovi ${r.nome}`}>
                <i className="ti ti-trash"></i>
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
