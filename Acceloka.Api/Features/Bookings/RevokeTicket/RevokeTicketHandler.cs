using Acceloka.Api.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Acceloka.Api.Features.Bookings.RevokeTicket;

public class RevokeTicketHandler : IRequestHandler<RevokeTicketCommand, RevokeTicketResponse>
{
    private readonly AppDbContext _dbContext;

    public RevokeTicketHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<RevokeTicketResponse> Handle(RevokeTicketCommand request, CancellationToken cancellationToken)
    {
        // Retrieve the Booking row
        var bookedItem = await _dbContext.BookedTickets
            .FirstAsync(b => b.BookingCode == request.BookedTicketId &&
                             b.TicketCode == request.TicketCode,
                             cancellationToken);

        // Retrieve Ticket info
        var ticketInfo = await _dbContext.Tickets
            .FirstAsync(t => t.TicketCode == request.TicketCode,
                             cancellationToken);

        // Update or Delete Logic
        bookedItem.Quantity -= request.Quantity;

        if(bookedItem.Quantity <= 0)
        {
            _dbContext.BookedTickets.Remove(bookedItem);
        }

        // Update Quota? 
        // The exam doesn't explicitly say "Return quota to available tickets", 
        // but typically "Revoke" implies refunding/restocking. 
        // HOWEVER, Step 70 only says "Update data Bookedtiket". 
        // Let's stick to the explicit instructions to be safe.
        //ticketInfo.Quota += request.Quantity;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new RevokeTicketResponse
        {
            TicketCode = ticketInfo.TicketCode,
            TicketName = ticketInfo.TicketName,
            CategoryName = ticketInfo.CategoryName,
            RemainingQuantity = bookedItem.Quantity < 0 ? 0 : bookedItem.Quantity
        };
    }
}
