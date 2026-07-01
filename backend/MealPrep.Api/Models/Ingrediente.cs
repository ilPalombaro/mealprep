namespace MealPrep.Api.Models;

/// <summary>
/// Ingrediente di una ricetta, con grammatura, allergeni e valori nutrizionali.
/// Le validazioni su Nome e Grammi rispecchiano il collaudo di progettazione.
/// </summary>
public class Ingrediente
{
    private string _nome = string.Empty;
    private float _grammi;

    public string Nome
    {
        get => _nome;
        set
        {
            if (string.IsNullOrEmpty(value) || value.Length > 100)
                throw new ArgumentException("Il nome dell'ingrediente deve avere da 1 a 100 caratteri.");
            _nome = value;
        }
    }

    public float Grammi
    {
        get => _grammi;
        set
        {
            if (value < 0)
                throw new ArgumentException("La grammatura non puo' essere negativa.");
            _grammi = value;
        }
    }

    /// <summary>Allergeni contenuti nell'ingrediente (es. "Glutine", "Latte").</summary>
    public List<string> Allergeni { get; set; } = new();

    /// <summary>Valori nutrizionali riferiti alla grammatura indicata.</summary>
    public ValoriNutrizionali ValoriNutrizionali { get; set; } = new();
}
