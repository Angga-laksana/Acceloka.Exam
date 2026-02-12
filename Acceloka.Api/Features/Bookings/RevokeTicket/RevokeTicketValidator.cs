using Acceloka.Api.Infrastructure.Data;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Api.Features.Bookings.RevokeTicket;

public class RevokeTicketValidator : AbstractValidator<RevokeTicketCommand>
{
    private readonly AppDbContext _dbContext;

    public RevokeTicketValidator(AppDbContext dbContext)
    {
        _dbContext = dbContext;

        // Rule 1: Booking ID & Ticket Code must exist in BookedTickets table 
        RuleFor(x => x)
            .MustAsync(async (command, cancellation) =>
            {
                return await _dbContext.BookedTickets.AnyAsync(
                    b => b.BookingCode == command.BookedTicketId &&
                         b.TicketCode == command.TicketCode,
                    cancellation);
            })
            .WithMessage("Ticket not found in this booking.");

        // Rule 2: Qty to revoke must be <= Booked Qty 
        RuleFor(x => x)
            .MustAsync(async (command, cancellation) =>
            {
                var bookedItem = await _dbContext.BookedTickets
                    .FirstOrDefaultAsync(b => b.BookingCode == command.BookedTicketId &&
                                              b.TicketCode == command.TicketCode, cancellation);

                if (bookedItem == null) { return true; } // Handled by previous rule

                return command.Quantity <= bookedItem.Quantity;
            })
            .WithMessage("Cannot revoke more tickets than originally booked.");
    }
}
