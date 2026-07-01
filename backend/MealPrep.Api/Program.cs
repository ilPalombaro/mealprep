using MealPrep.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Controller REST (pattern MVC).
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Archivio dati in memoria: singleton, coerente con il RicettarioComune.
builder.Services.AddSingleton<MealPrepStore>();

// CORS: consente al frontend React (dev server) di chiamare le API.
const string FrontendCors = "frontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCors, policy =>
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors(FrontendCors);
app.MapControllers();

// Endpoint di cortesia per verificare che il server sia attivo.
app.MapGet("/", () => Results.Ok(new { service = "MealPrep API", status = "ok" }));

app.Run();
