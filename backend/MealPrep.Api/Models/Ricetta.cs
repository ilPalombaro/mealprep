namespace MealPrep.Api.Models;

/// <summary>
/// Ricetta del ricettario comune o della lista personale di un utente.
/// Le validazioni su Nome e Descrizione rispecchiano il collaudo di progettazione.
/// </summary>
public class Ricetta
{
    private string _nome = string.Empty;
    private string _descrizione = string.Empty;

    public int Id { get; set; }

    public string Nome
    {
        get => _nome;
        set
        {
            if (string.IsNullOrEmpty(value) || value.Length > 100)
                throw new ArgumentException("Il nome della ricetta deve avere da 1 a 100 caratteri.");
            _nome = value;
        }
    }

    public string Descrizione
    {
        get => _descrizione;
        set
        {
            if (string.IsNullOrEmpty(value) || value.Length > 1000)
                throw new ArgumentException("La descrizione deve avere da 1 a 1000 caratteri.");
            _descrizione = value;
        }
    }

    /// <summary>Path della foto rappresentativa della ricetta (vedi progettazione di dettaglio).</summary>
    public string? PathFoto { get; set; }

    /// <summary>Icona Tabler usata dall'interfaccia (coerenza con il mock fornito).</summary>
    public string Icona { get; set; } = "ti-bowl";

    /// <summary>Colore dell'icona usato dall'interfaccia (green/amber/red/purple/blue).</summary>
    public string ColoreIcona { get; set; } = "green";

    public List<Ingrediente> Ingredienti { get; set; } = new();

    /// <summary>Valori nutrizionali complessivi, calcolati dagli ingredienti.</summary>
    public ValoriNutrizionali ValoriNutrizionali =>
        Ingredienti.Aggregate(new ValoriNutrizionali(), (acc, ing) => acc.Somma(ing.ValoriNutrizionali));

    /// <summary>Elenco degli allergeni presenti negli ingredienti, senza duplicati.</summary>
    public IReadOnlyList<string> Allergeni =>
        Ingredienti.SelectMany(i => i.Allergeni).Distinct().OrderBy(a => a).ToList();
}
