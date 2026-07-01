namespace MealPrep.Api.Models;

/// <summary>
/// Valori nutrizionali di un ingrediente o di una ricetta.
/// Le validazioni rispecchiano il collaudo definito in fase di progettazione:
/// l'apporto calorico e i macronutrienti non possono essere negativi.
/// </summary>
public class ValoriNutrizionali
{
    private int _apportoCalorico;
    private float _carboidrati;
    private float _proteine;
    private float _grassi;
    private float _fibre;
    private float _sale;

    public int ApportoCalorico
    {
        get => _apportoCalorico;
        set
        {
            if (value < 0)
                throw new ArgumentException("L'apporto calorico non puo' essere negativo.");
            _apportoCalorico = value;
        }
    }

    public float Carboidrati
    {
        get => _carboidrati;
        set => _carboidrati = ValidaNonNegativo(value, nameof(Carboidrati));
    }

    public float Proteine
    {
        get => _proteine;
        set => _proteine = ValidaNonNegativo(value, nameof(Proteine));
    }

    public float Grassi
    {
        get => _grassi;
        set => _grassi = ValidaNonNegativo(value, nameof(Grassi));
    }

    public float Fibre
    {
        get => _fibre;
        set => _fibre = ValidaNonNegativo(value, nameof(Fibre));
    }

    public float Sale
    {
        get => _sale;
        set => _sale = ValidaNonNegativo(value, nameof(Sale));
    }

    private static float ValidaNonNegativo(float value, string nome)
    {
        if (value < 0)
            throw new ArgumentException($"Il valore '{nome}' non puo' essere negativo.");
        return value;
    }

    /// <summary>Somma questi valori con quelli di un altro (usato per aggregare ingredienti).</summary>
    public ValoriNutrizionali Somma(ValoriNutrizionali altro) => new()
    {
        ApportoCalorico = ApportoCalorico + altro.ApportoCalorico,
        Carboidrati = Carboidrati + altro.Carboidrati,
        Proteine = Proteine + altro.Proteine,
        Grassi = Grassi + altro.Grassi,
        Fibre = Fibre + altro.Fibre,
        Sale = Sale + altro.Sale,
    };
}
