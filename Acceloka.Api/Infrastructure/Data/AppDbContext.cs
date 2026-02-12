using Microsoft.EntityFrameworkCore;
using Acceloka.Api.Features.Entities;

namespace Acceloka.Api.Infrastructure.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<BookedTicket> BookedTickets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure TicketCode as Primary Key for Ticket entity
        modelBuilder.Entity<Ticket>().HasKey(t => t.TicketCode);
        // Configure Id as Primary Key for BookedTicket entity
        modelBuilder.Entity<BookedTicket>().HasKey(b => b.Id);
        // Configure Price property to have precision and scale
        modelBuilder.Entity<Ticket>()
            .Property(t => t.Price)
            .HasColumnType("decimal(18,2)");
    }
}
