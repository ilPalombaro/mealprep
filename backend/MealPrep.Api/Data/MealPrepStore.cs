using MealPrep.Api.Models;

namespace MealPrep.Api.Data;

/// <summary>
/// Archivio dati in memoria del prototipo. Sostituisce il livello di persistenza
/// (DBMS) previsto dalla progettazione: per il primo prototipo i dati sono seminati
/// in memoria. Registrato come singleton, coerentemente con il RicettarioComune.
/// </summary>
public class MealPrepStore
{
    private readonly object _lock = new();

    /// <summary>Ricettario comune: ricette standard definite dagli amministratori.</summary>
    private readonly List<Ricetta> _ricettarioComune = new();

    /// <summary>Lista personale dell'utente (prototipo mono-utente).</summary>
    private readonly List<Ricetta> _listaPersonale = new();

    /// <summary>Lista della spesa: ricette scelte per essere tradotte in ingredienti.</summary>
    private readonly List<Ricetta> _listaSpesa = new();

    public MealPrepStore()
    {
        Seed();
    }

    // ── Ricerca / visualizzazione ────────────────────────────────────────────

    /// <summary>Ricerca per nome nel ricettario comune e nella lista personale.</summary>
    public IReadOnlyList<Ricetta> Cerca(string? query)
    {
        lock (_lock)
        {
            IEnumerable<Ricetta> tutte = _ricettarioComune
                .Concat(_listaPersonale)
                .GroupBy(r => r.Id)
                .Select(g => g.First());

            if (!string.IsNullOrWhiteSpace(query))
            {
                tutte = tutte.Where(r =>
                    r.Nome.Contains(query.Trim(), StringComparison.OrdinalIgnoreCase));
            }

            return tutte.OrderBy(r => r.Nome).ToList();
        }
    }

    public Ricetta? Trova(int id)
    {
        lock (_lock)
        {
            return _ricettarioComune.Concat(_listaPersonale).FirstOrDefault(r => r.Id == id);
        }
    }

    // ── Lista personale ───────────────────────────────────────────────────────

    public IReadOnlyList<Ricetta> ListaPersonale()
    {
        lock (_lock) { return _listaPersonale.OrderBy(r => r.Nome).ToList(); }
    }

    /// <summary>Aggiunge alla lista personale una ricetta del ricettario comune.</summary>
    public Ricetta? AggiungiAListaPersonale(int ricettaId)
    {
        lock (_lock)
        {
            var ricetta = _ricettarioComune.FirstOrDefault(r => r.Id == ricettaId);
            if (ricetta == null) return null;
            if (_listaPersonale.All(r => r.Id != ricettaId))
                _listaPersonale.Add(ricetta);
            return ricetta;
        }
    }

    public bool RimuoviDaListaPersonale(int ricettaId)
    {
        lock (_lock)
        {
            _listaSpesa.RemoveAll(r => r.Id == ricettaId);
            return _listaPersonale.RemoveAll(r => r.Id == ricettaId) > 0;
        }
    }

    // ── Lista della spesa ───────────────────────────────────────────────────

    public IReadOnlyList<Ricetta> ListaSpesa()
    {
        lock (_lock) { return _listaSpesa.ToList(); }
    }

    /// <summary>Aggiunge alla lista della spesa una ricetta della lista personale.</summary>
    public Ricetta? AggiungiAListaSpesa(int ricettaId)
    {
        lock (_lock)
        {
            var ricetta = _listaPersonale.FirstOrDefault(r => r.Id == ricettaId);
            if (ricetta == null) return null;
            if (_listaSpesa.All(r => r.Id != ricettaId))
                _listaSpesa.Add(ricetta);
            return ricetta;
        }
    }

    public bool RimuoviDaListaSpesa(int ricettaId)
    {
        lock (_lock) { return _listaSpesa.RemoveAll(r => r.Id == ricettaId) > 0; }
    }

    /// <summary>
    /// "Traduci lista della spesa": aggrega gli ingredienti di tutte le ricette
    /// presenti nella lista della spesa unendo gli omonimi (somma grammature,
    /// unione allergeni, tracciamento delle ricette di provenienza).
    /// </summary>
    public IReadOnlyList<IngredienteAggregato> TraduciListaSpesa()
    {
        lock (_lock)
        {
            var mappa = new Dictionary<string, IngredienteAggregato>();

            foreach (var ricetta in _listaSpesa)
            {
                foreach (var ing in ricetta.Ingredienti)
                {
                    var chiave = ing.Nome.ToLowerInvariant();
                    if (mappa.TryGetValue(chiave, out var esistente))
                    {
                        esistente.Grammi += ing.Grammi;
                        esistente.Allergeni = esistente.Allergeni
                            .Concat(ing.Allergeni).Distinct().ToList();
                        if (!esistente.Provenienza.Contains(ricetta.Nome))
                            esistente.Provenienza.Add(ricetta.Nome);
                    }
                    else
                    {
                        mappa[chiave] = new IngredienteAggregato
                        {
                            Id = chiave,
                            Nome = ing.Nome,
                            Grammi = ing.Grammi,
                            Allergeni = new List<string>(ing.Allergeni),
                            Provenienza = new List<string> { ricetta.Nome },
                        };
                    }
                }
            }

            return mappa.Values.OrderBy(i => i.Nome).ToList();
        }
    }

    // ── Seed dati di prototipo ────────────────────────────────────────────────

    private void Seed()
    {
        Ingrediente Ing(string nome, float grammi, string[]? allergeni = null,
            int kcal = 0, float carb = 0, float prot = 0, float grassi = 0, float fibre = 0, float sale = 0)
            => new()
            {
                Nome = nome,
                Grammi = grammi,
                Allergeni = allergeni?.ToList() ?? new List<string>(),
                ValoriNutrizionali = new ValoriNutrizionali
                {
                    ApportoCalorico = kcal,
                    Carboidrati = carb,
                    Proteine = prot,
                    Grassi = grassi,
                    Fibre = fibre,
                    Sale = sale,
                },
            };

        _ricettarioComune.AddRange(new[]
        {
            new Ricetta
            {
                Id = 1, Nome = "Pasta al pomodoro", Icona = "ti-bowl", ColoreIcona = "green",
                Descrizione = "Un classico primo piatto italiano con spaghetti, pomodoro e basilico.",
                Ingredienti =
                {
                    Ing("Spaghetti", 200, new[] { "Glutine" }, 316, 62f, 11f, 1.5f, 3f, 0.01f),
                    Ing("Pomodori pelati", 400, null, 84, 14f, 4f, 0.8f, 4f, 0.4f),
                    Ing("Olio d'oliva", 30, null, 265, 0f, 0f, 30f, 0f, 0f),
                    Ing("Aglio", 10, null, 15, 3f, 0.6f, 0.05f, 0.2f, 0f),
                    Ing("Basilico", 5, null, 1, 0.1f, 0.2f, 0f, 0.1f, 0f),
                    Ing("Sale", 5, null, 0, 0f, 0f, 0f, 0f, 5f),
                },
            },
            new Ricetta
            {
                Id = 2, Nome = "Insalata greca", Icona = "ti-salad", ColoreIcona = "amber",
                Descrizione = "Insalata fresca con pomodori, cetrioli, feta e olive nere.",
                Ingredienti =
                {
                    Ing("Pomodori", 200, null, 36, 7f, 1.8f, 0.4f, 2.4f, 0f),
                    Ing("Cetriolo", 150, null, 24, 5f, 1f, 0.2f, 0.8f, 0f),
                    Ing("Peperoni", 100, null, 31, 6f, 1f, 0.3f, 2.1f, 0f),
                    Ing("Feta", 100, new[] { "Latte" }, 264, 4f, 14f, 21f, 0f, 3.2f),
                    Ing("Olive nere", 80, null, 92, 5f, 0.7f, 8f, 2.6f, 2f),
                    Ing("Olio d'oliva", 30, null, 265, 0f, 0f, 30f, 0f, 0f),
                },
            },
            new Ricetta
            {
                Id = 3, Nome = "Pollo arrosto", Icona = "ti-meat", ColoreIcona = "red",
                Descrizione = "Pollo arrosto con aglio e rosmarino, semplice e saporito.",
                Ingredienti =
                {
                    Ing("Pollo", 800, null, 1320, 0f, 248f, 32f, 0f, 0.8f),
                    Ing("Aglio", 15, null, 22, 4.5f, 0.9f, 0.07f, 0.3f, 0f),
                    Ing("Rosmarino", 5, null, 7, 1f, 0.2f, 0.3f, 0.7f, 0f),
                    Ing("Olio d'oliva", 30, null, 265, 0f, 0f, 30f, 0f, 0f),
                    Ing("Sale", 5, null, 0, 0f, 0f, 0f, 0f, 5f),
                    Ing("Pepe", 2, null, 5, 1.3f, 0.2f, 0.06f, 0.5f, 0f),
                },
            },
            new Ricetta
            {
                Id = 4, Nome = "Frittata di verdure", Icona = "ti-egg", ColoreIcona = "amber",
                Descrizione = "Frittata soffice con uova e verdure di stagione.",
                Ingredienti =
                {
                    Ing("Uova", 180, new[] { "Uova" }, 258, 1.8f, 22.5f, 18f, 0f, 0.6f),
                    Ing("Zucchine", 150, null, 25, 4.8f, 1.8f, 0.5f, 1.5f, 0f),
                    Ing("Cipolla", 60, null, 24, 5.6f, 0.7f, 0.06f, 1f, 0f),
                    Ing("Parmigiano", 40, new[] { "Latte" }, 157, 0f, 14f, 11f, 0f, 0.6f),
                    Ing("Olio d'oliva", 20, null, 177, 0f, 0f, 20f, 0f, 0f),
                    Ing("Sale", 4, null, 0, 0f, 0f, 0f, 0f, 4f),
                },
            },
            new Ricetta
            {
                Id = 5, Nome = "Zuppa di lenticchie", Icona = "ti-soup", ColoreIcona = "green",
                Descrizione = "Zuppa calda e nutriente a base di lenticchie e verdure.",
                Ingredienti =
                {
                    Ing("Lenticchie", 250, null, 850, 150f, 62f, 2.5f, 27f, 0.02f),
                    Ing("Carota", 100, null, 41, 10f, 0.9f, 0.2f, 2.8f, 0.07f),
                    Ing("Sedano", 80, new[] { "Sedano" }, 13, 2.4f, 0.6f, 0.1f, 1.3f, 0.1f),
                    Ing("Cipolla", 70, null, 28, 6.5f, 0.8f, 0.07f, 1.2f, 0f),
                    Ing("Olio d'oliva", 20, null, 177, 0f, 0f, 20f, 0f, 0f),
                    Ing("Sale", 5, null, 0, 0f, 0f, 0f, 0f, 5f),
                },
            },
            new Ricetta
            {
                Id = 6, Nome = "Risotto ai funghi", Icona = "ti-bowl", ColoreIcona = "purple",
                Descrizione = "Risotto cremoso con funghi porcini e parmigiano.",
                Ingredienti =
                {
                    Ing("Riso", 300, null, 1110, 240f, 21f, 3f, 3f, 0.03f),
                    Ing("Funghi", 200, null, 44, 6.6f, 6.2f, 0.7f, 2f, 0.01f),
                    Ing("Parmigiano", 50, new[] { "Latte" }, 196, 0f, 17.5f, 14f, 0f, 0.8f),
                    Ing("Burro", 30, new[] { "Latte" }, 215, 0.2f, 0.3f, 24f, 0f, 0.03f),
                    Ing("Cipolla", 50, null, 20, 4.6f, 0.6f, 0.05f, 0.9f, 0f),
                    Ing("Sale", 4, null, 0, 0f, 0f, 0f, 0f, 4f),
                },
            },
        });

        // Lista personale iniziale: alcune ricette gia' salvate dall'utente,
        // cosi' la lista della spesa e' subito utilizzabile nel prototipo.
        foreach (var id in new[] { 1, 2 })
        {
            var r = _ricettarioComune.First(x => x.Id == id);
            _listaPersonale.Add(r);
        }
    }
}
