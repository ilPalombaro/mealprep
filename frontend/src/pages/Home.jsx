const AZIONI = [
  { page: 'search', icon: 'ti-search', color: 'green', titolo: 'Ricerca ricette',
    testo: 'Cerca nel database comune e salva le ricette che preferisci' },
  { page: 'personal', icon: 'ti-bookmark', color: 'red', titolo: 'Lista personale',
    testo: 'Le tue ricette salvate, pronte per la spesa' },
  { page: 'shopping', icon: 'ti-shopping-cart', color: 'amber', titolo: 'Lista della spesa',
    testo: 'Aggiungi ricette e genera la lista ingredienti interattiva' },
  { page: 'account', icon: 'ti-user-circle', color: 'purple', titolo: 'Gestisci utente',
    testo: 'Modifica nome utente, password e dati del profilo' },
];

export default function Home({ navigate }) {
  return (
    <>
      <div className="page-header">
        <h1>Bentornato, Marco 👋</h1>
        <p>Cosa vuoi cucinare oggi?</p>
      </div>
      <div className="section">
        <p className="section-label">Azioni rapide</p>
        <div className="cards-grid">
          {AZIONI.map((a) => (
            <button className="action-card" key={a.page} onClick={() => navigate(a.page)}>
              <div className={`icon-wrap ${a.color}`}><i className={`ti ${a.icon}`}></i></div>
              <h3>{a.titolo}</h3>
              <p>{a.testo}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
