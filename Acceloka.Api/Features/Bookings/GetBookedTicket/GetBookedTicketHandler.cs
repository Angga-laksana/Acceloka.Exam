using MediatR;
using Microsoft.EntityFrameworkCore;
using Acceloka.Api.Infrastructure.Data;

namespace Acceloka.Api.Features.Bookings.GetBookedTicket;
public class GetBookedTicketHandler : IRequestHandler<GetBookedTicketQuery, List<GetBookedTicketResponse>>
{
    private readonly AppDbContext _dbContext;

    public GetBookedTicketHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<GetBookedTicketResponse>> Handle(GetBookedTicketQuery request, CancellationToken cancellationToken)
    {
        // Get the raw data (Joining BookedTicket -> Ticket)
        var bookedItems = await _dbContext.BookedTickets
            .Where(b => b.BookingCode == request.BookedTicketId)
            .Join(_dbContext.Tickets,
                booking => booking.TicketCode,
                ticket => ticket.TicketCode,
                (booking, ticket) => new
                {
                    ticket.CategoryName,
                    ticket.TicketName,
                    ticket.TicketCode,
                    ticket.EventDate,
                    booking.Quantity
                })
            .ToListAsync(cancellationToken);

        if (!bookedItems.Any())
        {
            throw new KeyNotFoundException($"Booking ID {request.BookedTicketId} not found.");
        }

        // Group by Category and project to Response
        var response = bookedItems
            .GroupBy(x => x.CategoryName)
            .Select(g => new GetBookedTicketResponse
            {
                CategoryName = g.Key,
                QtyPerCategory = g.Sum(x => x.Quantity),
                Ticket = g.Select(x => new BookedTicketItemDetail
                {
                    TicketCode = x.TicketCode,
                    TicketName = x.TicketName,
                    EventDate = x.EventDate
                }).ToList()
            }).ToList();

        return response;
    }
}
