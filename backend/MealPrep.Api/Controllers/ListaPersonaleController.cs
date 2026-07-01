using MealPrep.Api.Data;
using MealPrep.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace MealPrep.Api.Controllers;

/// <summary>
/// Caso d'uso "Gestione lista personale": aggiunta di una ricetta trovata alla
/// lista personale e rimozione di una ricetta dalla lista personale.
/// </summary>
[ApiController]
[Route("api/lista-personale")]
public class ListaPersonaleController : ControllerBase
{
    private readonly MealPrepStore _store;

    public ListaPersonaleController(MealPrepStore store) => _store = store;

    [HttpGet]
    public ActionResult<IEnumerable<Ricetta>> Lista() => Ok(_store.ListaPersonale());

    /// <summary>Aggiunge alla lista personale una ricetta del ricettario comune.</summary>
    [HttpPost("{ricettaId:int}")]
    public ActionResult<Ricetta> Aggiungi(int ricettaId)
    {
        var ricetta = _store.AggiungiAListaPersonale(ricettaId);
        return ricetta is null ? NotFound() : Ok(ricetta);
    }

    /// <summary>Rimuove una ricetta dalla lista personale.</summary>
    [HttpDelete("{ricettaId:int}")]
    public IActionResult Rimuovi(int ricettaId)
        => _store.RimuoviDaListaPersonale(ricettaId) ? NoContent() : NotFound();
}
