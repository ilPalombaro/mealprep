import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { formatGrammi, coloreIcona } from '../helpers.js';

// Caso d'uso "Visualizza ricetta": scheda con dettagli, valori nutrizionali,
// allergeni ed elenco ingredienti.
export default function RecipeModal({ ricettaId, onClose }) {
  const [ricetta, setRicetta] = useState(null);
  const [errore, setErrore] = useState(false);

  useEffect(() => {
    let attivo = true;
    api.dettaglioRicetta(ricettaId)
      .then((r) => attivo && setRicetta(r))
      .catch(() => attivo && setErrore(true));
    return () => { attivo = false; };
  }, [ricettaId]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const vn = ricetta?.valoriNutrizionali;
  const allergeni = ricetta?.allergeni ?? [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {!ricetta && !errore && <div className="loading-row">Caricamento…</div>}
        {errore && <div className="loading-row">Impossibile caricare la ricetta.</div>}

        {ricetta && (
          <>
            <div className="modal-header">
              <div className={`recipe-icon ${coloreIcona(ricetta.coloreIcona)}`} aria-hidden="true">
                <i className={`ti ${ricetta.icona || 'ti-bowl'}`}></i>
              </div>
              <div className="modal-title">
                <h2>{ricetta.nome}</h2>
                <p>{ricetta.ingredienti.length} ingredienti</p>
              </div>
              <button className="modal-close" onClick={onClose} aria-label="Chiudi">
                <i className="ti ti-x"></i>
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-desc">{ricetta.descrizione}</p>

              {allergeni.length > 0 && (
                <div className="allergen-banner">
                  <i className="ti ti-alert-triangle"></i>
                  <div className="allergen-banner-text">
                    <div className="allergen-banner-title">Allergeni presenti</div>
                    <div className="allergen-banner-sub">{allergeni.join(', ')}</div>
                  </div>
                </div>
              )}

              {vn && (
                <>
                  <p className="section-label">Valori nutrizionali</p>
                  <div className="nutri-grid">
                    <div className="nutri-cell"><div className="val">{vn.apportoCalorico}</div><div className="lbl">kcal</div></div>
                    <div className="nutri-cell"><div className="val">{vn.carboidrati.toFixed(0)}g</div><div className="lbl">Carbo</div></div>
                    <div className="nutri-cell"><div className="val">{vn.proteine.toFixed(0)}g</div><div className="lbl">Proteine</div></div>
                    <div className="nutri-cell"><div className="val">{vn.grassi.toFixed(0)}g</div><div className="lbl">Grassi</div></div>
                    <div className="nutri-cell"><div className="val">{vn.fibre.toFixed(0)}g</div><div className="lbl">Fibre</div></div>
                    <div className="nutri-cell"><div className="val">{vn.sale.toFixed(1)}g</div><div className="lbl">Sale</div></div>
                  </div>
                </>
              )}

              <p className="section-label">Ingredienti</p>
              <div>
                {ricetta.ingredienti.map((ing) => (
                  <div className="ing-row" key={ing.nome}>
                    <span className="ing-row-name">
                      {ing.nome}
                      {ing.allergeni.map((a) => (
                        <span className="allergen-badge" key={a}>
                          <i className="ti ti-alert-triangle"></i>{a}
                        </span>
                      ))}
                    </span>
                    <span className="qty-badge">{formatGrammi(ing.grammi)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
