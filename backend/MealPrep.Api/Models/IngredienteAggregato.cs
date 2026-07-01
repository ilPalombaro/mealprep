namespace MealPrep.Api.Models;

/// <summary>
/// Voce della "lista interattiva" di ingredienti, ottenuta dalla traduzione
/// della lista della spesa: gli ingredienti omonimi delle varie ricette
/// vengono uniti sommando le grammature e unendo gli allergeni.
/// </summary>
public class IngredienteAggregato
{
    public string Id { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public float Grammi { get; set; }
    public List<string> Allergeni { get; set; } = new();

    /// <summary>Nomi delle ricette da cui proviene l'ingrediente.</summary>
    public List<string> Provenienza { get; set; } = new();
}
