import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { formatGrammi } from '../helpers.js';

// Casi d'uso "Traduci lista della spesa" e "Gestione lista degli ingredienti":
// la lista aggregata (dal backend) e' resa interattiva lato client. Gli
// ingredienti depennati vengono decolorati e spostati in fondo; l'operazione
// e' annullabile ri-selezionandoli.
export default function Ingredients({ toast, navigate }) {
  const [ingredienti, setIngredienti] = useState([]);
  const [depennati, setDepennati] = useState(new Set());
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    let attivo = true;
    api.traduciSpesa()
      .then((ing) => attivo && setIngredienti(ing))
      .catch(() => attivo && toast('Errore nel caricamento degli ingredienti', 'error'))
      .finally(() => attivo && setCaricamento(false));
    return () => { attivo = false; };
  }, []);

  function toggle(id) {
    setDepennati((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const attivi = ingredienti.filter((i) => !depennati.has(i.id));
  const acquistati = ingredienti.filter((i) => depennati.has(i.id));
  const allergeni = [...new Set(ingredienti.flatMap((i) => i.allergeni))];
  const tuttoFatto = ingredienti.length > 0 && attivi.length === 0;

  const item = (ing, isChecked) => (
    <div
      className={`ingredient-item ${isChecked ? 'checked' : ''}`}
      key={ing.id}
      role="checkbox"
      aria-checked={isChecked}
      tabIndex={0}
      onClick={() => toggle(ing.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(ing.id); } }}
    >
      <div className="check-circle" aria-hidden="true"><i className="ti ti-check"></i></div>
      <div className="ingredient-body">
        <div className="ingredient-name">{ing.nome}</div>
        <div className="ingredient-detail">
          <span className="qty-badge">{formatGrammi(ing.grammi)}</span>
          {ing.allergeni.map((a) => (
            <span className="allergen-badge" key={a}><i className="ti ti-alert-triangle"></i>{a}</span>
          ))}
          {ing.provenienza.length > 1 && (
            <span style={{ color: 'var(--text3)' }}>· {ing.provenienza.length} ricette</span>
          )}
        </div>
      </div>
    </div>
  );

  if (caricamento) {
    return (
      <>
        <div className="page-header"><h1>Lista ingredienti</h1></div>
        <div className="loading-row">Caricamento…</div>
      </>
    );
  }

  if (ingredienti.length === 0) {
    return (
      <>
        <div className="page-header">
          <h1>Lista ingredienti</h1>
          <p>Nessun ingrediente da mostrare</p>
        </div>
        <div className="shopping-empty">
          <i className="ti ti-list"></i>
          <p>Aggiungi almeno una ricetta alla lista della spesa</p>
        </div>
        <button className="btn-outline" onClick={() => navigate('shopping')}>
          <i className="ti ti-arrow-left"></i>Torna alla lista della spesa
        </button>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Lista ingredienti</h1>
        <p>{tuttoFatto ? 'Hai acquistato tutto! 🎉' : 'Tocca un ingrediente per depennarlo'}</p>
      </div>

      <div className="ingredients-summary">
        <div className="summary-chip"><i className="ti ti-list"></i>{ingredienti.length} ingredienti</div>
        <div className="summary-chip"><i className="ti ti-circle-check"></i>{acquistati.length} acquistati</div>
      </div>

      {allergeni.length > 0 && (
        <div className="allergen-banner">
          <i className="ti ti-alert-triangle"></i>
          <div className="allergen-banner-text">
            <div className="allergen-banner-title">Allergeni presenti</div>
            <div className="allergen-banner-sub">Presenti in questa lista: {allergeni.join(', ')}</div>
          </div>
        </div>
      )}

      <p className="section-label">Da acquistare</p>
      <div className="ingredient-list" aria-label="Ingredienti da acquistare">
        {attivi.map((ing) => item(ing, false))}
      </div>

      {acquistati.length > 0 && (
        <div>
          <div className="ingredients-section-label">
            Già acquistati <span className="checked-count">{acquistati.length}</span>
          </div>
          <div className="ingredient-list" aria-label="Ingredienti già acquistati">
            {acquistati.map((ing) => item(ing, true))}
          </div>
        </div>
      )}

      {tuttoFatto && (
        <div className="completed-banner">
          <i className="ti ti-circle-check"></i>
          <p>Ottimo lavoro! 🎉</p>
          <span>Hai acquistato tutti gli ingredienti</span>
        </div>
      )}

      <button className="btn-outline" onClick={() => navigate('shopping')}>
        <i className="ti ti-arrow-left"></i>Torna alla lista della spesa
      </button>
    </>
  );
}
