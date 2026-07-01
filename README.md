# MealPrep — Prototipo

Prototipo della web app **MealPrep** per la pianificazione e la gestione alimentare,
basato sul documento di progetto *"collaboriamo!"* e sulle interfacce HTML fornite.

Architettura **Client/Server a tre livelli** con **API REST**:

- **Backend** — C# / ASP.NET Core (pattern MVC), development server locale.
- **Frontend** — React (Vite), tema e componenti derivati dai mock forniti.
- **Persistenza** — archivio in memoria con dati seminati (nel prototipo sostituisce il DBMS).

## Funzionalità implementate (lato utente)

Sono realizzate solo le parti previste per il primo prototipo:

- **Ricerca ricetta** — ricerca per nome nel ricettario comune e nella lista personale.
- **Visualizza ricetta** — scheda con descrizione, valori nutrizionali e allergeni.
- **Aggiunta ricetta alla lista personale** — dai risultati di ricerca.
- **Aggiunta alla lista della spesa** — dalle ricette della lista personale.
- **Traduci lista della spesa** — aggrega le ricette della spesa in una lista di
  ingredienti (somma le grammature omonime, unisce gli allergeni, traccia le ricette
  di provenienza).
- **Gestione lista ingredienti** — lista interattiva: depenna/ripristina gli ingredienti
  (quelli acquistati vengono decolorati e spostati in fondo).

### Non implementate (come da "Caratteristiche primo prototipo")

Registrazione, autenticazione, gestione log, termini/GDPR, creazione e modifica di
ricette, ricettario comune esteso, creazione/gestione di amministratori e utenti.
La pagina *Gestisci utente* è un segnaposto.

## Struttura

```
mealprep/
├── backend/MealPrep.Api/    # API REST in C# (ASP.NET Core)
│   ├── Models/              # Ricetta, Ingrediente, ValoriNutrizionali, ...
│   ├── Data/                # MealPrepStore (archivio in memoria, seed)
│   └── Controllers/         # Ricette, ListaPersonale, ListaSpesa
└── frontend/                # App React (Vite)
    └── src/{pages,components}
```

## Come eseguire

Servono **.NET SDK 8** e **Node.js 18+**. Aprire due terminali.

### 1. Backend (porta 5000)

```bash
cd backend/MealPrep.Api
dotnet run
```

API su `http://localhost:5000`.

### 2. Frontend (porta 5173)

```bash
cd frontend
npm install
npm run dev
```

App su `http://localhost:5173` (il dev server chiama le API su `:5000`; CORS già configurato).

## Endpoint REST principali

| Metodo | Endpoint                          | Descrizione                                  |
|--------|-----------------------------------|----------------------------------------------|
| GET    | `/api/ricette?q=`                 | Ricerca ricette per nome                     |
| GET    | `/api/ricette/{id}`               | Dettaglio di una ricetta                     |
| GET    | `/api/lista-personale`            | Lista personale                              |
| POST   | `/api/lista-personale/{id}`       | Aggiunge una ricetta alla lista personale    |
| DELETE | `/api/lista-personale/{id}`       | Rimuove una ricetta dalla lista personale    |
| GET    | `/api/lista-spesa`                | Lista della spesa                            |
| POST   | `/api/lista-spesa/{id}`           | Aggiunge una ricetta alla lista della spesa  |
| DELETE | `/api/lista-spesa/{id}`           | Rimuove una ricetta dalla lista della spesa  |
| GET    | `/api/lista-spesa/ingredienti`    | Traduce la spesa nella lista di ingredienti  |

> Nota: essendo un prototipo, i dati sono in memoria e si azzerano a ogni riavvio del backend.
