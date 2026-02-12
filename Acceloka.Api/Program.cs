using Serilog;
using FluentValidation;
using System.Reflection;
using Microsoft.AspNetCore.Diagnostics;
using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Acceloka.Api.Infrastructure.Data;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Serilog Logging
// saved to "logs/Log-{current_date}"
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.File("logs/Log-.txt", rollingInterval: RollingInterval.Day)
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();
// --------------------------------

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Register Database
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// MARVEL Pattern (MediatR + FluentValidation)
// Register all MediatR Handlers in this assembly
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
    cfg.AddOpenBehavior(typeof(Acceloka.Api.Infrastructure.Behaviors.ValidationBehavior<,>));    
});
// Register all Validators in this assembly
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
// --------------------------------

var app = builder.Build();

// Global Error Handling (RFC 7807)
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        var problemDetails = new Microsoft.AspNetCore.Mvc.ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "An error occured while processing your request.",
            Detail = exception?.Message,
            Instance = context.Request.Path
        };

        // Log using Serilog
        Log.Error(exception, "Unhandled exception occured.");

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(problemDetails);
    });
});
// --------------------------------

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // For Api UI
}

app.UseAuthorization();
app.MapControllers();

app.Run();