import { useCallback, useState } from 'react';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Personal from './pages/Personal.jsx';
import Shopping from './pages/Shopping.jsx';
import Ingredients from './pages/Ingredients.jsx';
import Account from './pages/Account.jsx';
import RecipeModal from './components/RecipeModal.jsx';

const TITOLI = {
  home: 'Home',
  search: 'Ricerca ricette',
  personal: 'Lista personale',
  shopping: 'Lista della spesa',
  ingredients: 'Lista ingredienti',
  account: 'Gestisci utente',
};

// Voci del menu (la pagina "ingredients" e' una sotto-vista della spesa).
const NAV = [
  { page: 'home', icon: 'ti-home', label: 'Home' },
  { page: 'search', icon: 'ti-search', label: 'Ricerca ricette' },
  { page: 'personal', icon: 'ti-bookmark', label: 'Lista personale' },
  { page: 'shopping', icon: 'ti-shopping-cart', label: 'Lista della spesa' },
];

const MOBILE_NAV = [
  { page: 'home', icon: 'ti-home', label: 'Home' },
  { page: 'search', icon: 'ti-search', label: 'Cerca' },
  { page: 'personal', icon: 'ti-bookmark', label: 'Salvate' },
  { page: 'shopping', icon: 'ti-shopping-cart', label: 'Spesa' },
  { page: 'account', icon: 'ti-user-circle', label: 'Profilo' },
];

export default function App() {
  const [page, setPage] = useState('home');
  const [modalId, setModalId] = useState(null);
  const [toast, setToast] = useState(null);

  const navigate = useCallback((p) => setPage(p), []);
  const onView = useCallback((id) => setModalId(id), []);

  const showToast = useCallback((messaggio, tipo = 'ok') => {
    setToast({ messaggio, tipo });
    setTimeout(() => setToast(null), 2600);
  }, []);

  // La lista ingredienti va ricreata a ogni ingresso: key la forza a rimontare.
  const renderPage = () => {
    switch (page) {
      case 'home': return <Home navigate={navigate} />;
      case 'search': return <Search toast={showToast} onView={onView} />;
      case 'personal': return <Personal toast={showToast} onView={onView} navigate={navigate} />;
      case 'shopping': return <Shopping toast={showToast} onView={onView} navigate={navigate} />;
      case 'ingredients': return <Ingredients key="ing" toast={showToast} navigate={navigate} />;
      case 'account': return <Account />;
      default: return <Home navigate={navigate} />;
    }
  };

  const isIngredients = page === 'ingredients';

  return (
    <div className="layout">
      {/* ── SIDEBAR (desktop) ── */}
      <aside className="sidebar" aria-label="Menu principale">
        <div className="sidebar-logo">
          <div className="logo-text">Meal<span>Prep</span></div>
        </div>
        <nav className="nav-group" aria-label="Navigazione">
          {NAV.map((n) => (
            <button
              key={n.page}
              className={`nav-item ${page === n.page ? 'active' : ''}`}
              onClick={() => navigate(n.page)}
            >
              <i className={`ti ${n.icon}`} aria-hidden="true"></i>
              {n.label}
            </button>
          ))}
          <div className="nav-divider"></div>
          <button
            className={`nav-item ${page === 'account' ? 'active' : ''}`}
            onClick={() => navigate('account')}
          >
            <i className="ti ti-user-circle" aria-hidden="true"></i>
            Gestisci utente
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="user-chip" onClick={() => navigate('account')}>
            <div className="avatar" aria-hidden="true">MR</div>
            <div>
              <div className="user-name">Marco Rossi</div>
              <div className="user-role">Utente</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="main">
        {/* ── TOPBAR (desktop) ── */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isIngredients && (
              <button className="icon-btn" onClick={() => navigate('shopping')} aria-label="Torna alla spesa">
                <i className="ti ti-arrow-left"></i>
              </button>
            )}
            <span className="topbar-title">{TITOLI[page]}</span>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" onClick={() => navigate('search')} aria-label="Cerca ricette">
              <i className="ti ti-search"></i>
            </button>
            <div className="avatar-btn" onClick={() => navigate('account')}>MR</div>
          </div>
        </header>

        {/* ── TOPBAR (mobile) ── */}
        <header className="mobile-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isIngredients && (
              <button className="icon-btn" onClick={() => navigate('shopping')} aria-label="Torna alla spesa">
                <i className="ti ti-arrow-left"></i>
              </button>
            )}
            <div className="logo-text">Meal<span style={{ color: 'var(--primary)' }}>Prep</span></div>
          </div>
          <div className="avatar-btn" onClick={() => navigate('account')}>MR</div>
        </header>

        <main className="page-content">{renderPage()}</main>
      </div>

      {/* ── BOTTOM NAV (mobile) ── */}
      <nav className="mobile-nav" aria-label="Navigazione principale">
        <div className="mobile-nav-row">
          {MOBILE_NAV.map((n) => (
            <button
              key={n.page}
              className={`mobile-nav-item ${page === n.page ? 'active' : ''}`}
              onClick={() => navigate(n.page)}
            >
              <i className={`ti ${n.icon}`} aria-hidden="true"></i>
              <span>{n.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {modalId != null && <RecipeModal ricettaId={modalId} onClose={() => setModalId(null)} />}

      {toast && (
        <div className="toast" role="status">
          <i className={`ti ${toast.tipo === 'error' ? 'ti-alert-circle' : 'ti-circle-check'}`}></i>
          {toast.messaggio}
        </div>
      )}
    </div>
  );
}
