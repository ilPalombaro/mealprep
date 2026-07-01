using MealPrep.Api.Data;
using MealPrep.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace MealPrep.Api.Controllers;

/// <summary>
/// Caso d'uso "Ricerca ricetta" e "Visualizza ricetta".
/// </summary>
[ApiController]
[Route("api/ricette")]
public class RicetteController : ControllerBase
{
    private readonly MealPrepStore _store;

    public RicetteController(MealPrepStore store) => _store = store;

    /// <summary>Ricerca ricette per nome nel ricettario comune e nella lista personale.</summary>
    [HttpGet]
    public ActionResult<IEnumerable<Ricetta>> Cerca([FromQuery] string? q)
        => Ok(_store.Cerca(q));

    /// <summary>Visualizza i dettagli di una ricetta.</summary>
    [HttpGet("{id:int}")]
    public ActionResult<Ricetta> Dettaglio(int id)
    {
        var ricetta = _store.Trova(id);
        return ricetta is null ? NotFound() : Ok(ricetta);
    }
}
