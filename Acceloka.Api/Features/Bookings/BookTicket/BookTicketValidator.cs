using FluentValidation;
using Acceloka.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Api.Features.Bookings.BookTicket;
public class BookTicketValidator : AbstractValidator<BookTicketCommand>
{
    private readonly AppDbContext _dbContext;

    public BookTicketValidator(AppDbContext dbContext)
    {
        _dbContext = dbContext;

        RuleFor(x => x.Tickets)
            .NotEmpty().WithMessage("Ticket list cannot be empty.");

        RuleForEach(x => x.Tickets).SetValidator(new TicketItemValidator(_dbContext));
    }

    public class TicketItemValidator : AbstractValidator<BookTicketItem>
    {
        public TicketItemValidator(AppDbContext context)
        {
            // Rule 1: Code ticket tidak terdaftar 
            RuleFor(x => x.TicketCode)
                .MustAsync(async (code, cancellation) =>
                {
                    return await context.Tickets.AnyAsync(t => t.TicketCode == code, cancellation);
                })
                .WithMessage(x => $"Ticket code '{x.TicketCode}' is not registered.");

            // Rule 2 & 3: Quota habis or Quantity > Quota 
            RuleFor(x => x)
                .MustAsync(async (item, cancellation) =>
                {
                    var ticket = await context.Tickets.FindAsync(new object[] { item.TicketCode }, cancellation);
                    if (ticket == null) { return true; } // Handled by previous rule

                    return ticket.Quota >= item.Quantity;
                })
                .WithMessage(x => $"Quantity for '{x.TicketCode}' exceeds available quota.");

            // Rule 4: Event Date validation 
            RuleFor(x => x.TicketCode)
                .MustAsync(async (code, cancellation) =>
                {
                    var ticket = await context.Tickets.FindAsync(new object[] { code }, cancellation);
                    if (ticket == null) { return true; }

                    // "Date event tidak boleh <= tanggal booking" (Booking date is Now)
                    return ticket.EventDate > DateTime.Now;
                })
                .WithMessage(x => $"Event date for '{x.TicketCode}' has already passed.");
        }
    }
}
