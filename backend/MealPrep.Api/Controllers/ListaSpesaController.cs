using MealPrep.Api.Data;
using MealPrep.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace MealPrep.Api.Controllers;

/// <summary>
/// Casi d'uso "Gestione lista della spesa" e "Traduci lista della spesa".
/// L'utente aggiunge/rimuove ricette della lista personale e ne ordina la
/// traduzione nella lista interattiva di ingredienti.
/// </summary>
[ApiController]
[Route("api/lista-spesa")]
public class ListaSpesaController : ControllerBase
{
    private readonly MealPrepStore _store;

    public ListaSpesaController(MealPrepStore store) => _store = store;

    [HttpGet]
    public ActionResult<IEnumerable<Ricetta>> Lista() => Ok(_store.ListaSpesa());

    /// <summary>Aggiunge alla lista della spesa una ricetta della lista personale.</summary>
    [HttpPost("{ricettaId:int}")]
    public ActionResult<Ricetta> Aggiungi(int ricettaId)
    {
        var ricetta = _store.AggiungiAListaSpesa(ricettaId);
        return ricetta is null ? NotFound() : Ok(ricetta);
    }

    /// <summary>Rimuove una ricetta dalla lista della spesa.</summary>
    [HttpDelete("{ricettaId:int}")]
    public IActionResult Rimuovi(int ricettaId)
        => _store.RimuoviDaListaSpesa(ricettaId) ? NoContent() : NotFound();

    /// <summary>Traduce la lista della spesa nella lista interattiva di ingredienti.</summary>
    [HttpGet("ingredienti")]
    public ActionResult<IEnumerable<IngredienteAggregato>> Ingredienti()
        => Ok(_store.TraduciListaSpesa());
}
