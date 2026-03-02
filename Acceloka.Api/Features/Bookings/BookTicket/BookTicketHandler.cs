using MediatR;
using Microsoft.EntityFrameworkCore;
using Acceloka.Api.Infrastructure.Data;
using Acceloka.Api.Features.Entities;

namespace Acceloka.Api.Features.Bookings.BookTicket;

public class BookTicketHandler : IRequestHandler<BookTicketCommand, BookTicketResponse>
{
    private readonly AppDbContext _dbContext;

    public BookTicketHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BookTicketResponse> Handle(BookTicketCommand request, CancellationToken cancellationToken)
    {
        var bookingId = Guid.NewGuid().ToString();
        var bookedDetails = new List<Ticket>();

        foreach (var item in request.Tickets)
        {
            var ticket = await _dbContext.Tickets.FirstAsync(t => t.TicketCode == item.TicketCode, cancellationToken);

            // Update quota
            ticket.Quota -= item.Quantity;

            // Prepare booked ticket details
            var booking = new BookedTicket
            {
                BookingCode = bookingId,
                TicketCode = ticket.TicketCode,
                Quantity = item.Quantity,
                BookingDate = DateTime.Now
            };

            _dbContext.BookedTickets.Add(booking);
            bookedDetails.Add(ticket);
        }
        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new BookTicketResponse
        {
            BookingId = bookingId,
            PriceSummary = request.Tickets.Sum(i =>
            {
                var t = bookedDetails.First(d => d.TicketCode == i.TicketCode);
                return t.Price * i.Quantity;
            }),
            TicketPerCategories = bookedDetails
                .GroupBy(t => t.CategoryName)
                .Select(g => new CategorySummary
                {
                    CategoryName = g.Key,
                    PriceSummary = g.Sum(t => t.Price * request.Tickets.First(r => r.TicketCode == t.TicketCode).Quantity),
                    Tickets = g.Select(t => new BookedTicketDetail
                    {
                        TicketCode = t.TicketCode,
                        TicketName = t.TicketName,
                        Price = t.Price
                    }).ToList()
                }).ToList()
        };
        return response;
    }
}
