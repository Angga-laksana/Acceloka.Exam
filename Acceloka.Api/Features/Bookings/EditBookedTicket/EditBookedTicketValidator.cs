using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Acceloka.Api.Infrastructure.Data;

namespace Acceloka.Api.Features.Bookings.EditBookedTicket;

public class EditBookedTicketValidator : AbstractValidator<EditBookedTicketCommand>
{
    private readonly AppDbContext _dbContext;

    public EditBookedTicketValidator(AppDbContext dbContext)
    {
        _dbContext = dbContext;

        // Rule: Booking Code & Ticket Codes must exist in BookedTickets table
        RuleFor(x => x.BookedTicketId)
            .MustAsync(async (code, cancellation) =>
                await _dbContext.BookedTickets.AnyAsync(b => b.BookingCode == code, cancellation))
            .WithMessage("Booking Code does not exist.");

        RuleForEach(x => x.Tickets)
            .ChildRules(items =>
            {
                items.RuleFor(i => i.Quantity)
                     .GreaterThanOrEqualTo(1)
                     .WithMessage("Quantity must be at least 1");
            })
            .MustAsync(async (command, item, cancellation) =>
            {
                var bookedItem = await _dbContext.BookedTickets
                    .FirstOrDefaultAsync(b => b.BookingCode == command.BookedTicketId &&
                                              b.TicketCode == item.TicketCode, cancellation);

                if (bookedItem == null) { return false; }

                int delta = item.Quantity - bookedItem.Quantity;

                if (delta > 0)
                {
                    var ticket = await _dbContext.Tickets.FindAsync(new object[] { item.TicketCode }, cancellation);
                    if (ticket == null || ticket.Quota < delta) { return false; }
                }

                return true;
            })
            .WithMessage((command, item) => $"Ticket '{item.TicketCode}' not found in booking or insufficient quota.");
    }
}
