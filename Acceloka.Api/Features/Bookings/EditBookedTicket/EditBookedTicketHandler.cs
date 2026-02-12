using MediatR;
using Microsoft.EntityFrameworkCore;
using Acceloka.Api.Infrastructure.Data;
using Acceloka.Api.Features.Entities;

namespace Acceloka.Api.Features.Bookings.EditBookedTicket;

public class EditBookedTicketHandler : IRequestHandler<EditBookedTicketCommand, List<EditBookedTicketResponse>>
{
    private readonly AppDbContext _dbContext;
    
    public EditBookedTicketHandler(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<EditBookedTicketResponse>> Handle(EditBookedTicketCommand request, CancellationToken cancellationToken)
    {
        var responseList = new List<EditBookedTicketResponse>();

        foreach (var item in request.Tickets)
        {
            var bookedItem = await _dbContext.BookedTickets
                .FirstAsync(b => b.BookingCode == request.BookedTicketId &&
                                 b.TicketCode == item.TicketCode, cancellationToken);

            var ticket = await _dbContext.Tickets
                .FirstAsync(t => t.TicketCode == item.TicketCode, cancellationToken);

            int delta = item.Quantity - bookedItem.Quantity;

            ticket.Quota -= delta;

            bookedItem.Quantity = item.Quantity;

            responseList.Add(new EditBookedTicketResponse
            {
                TicketCode = ticket.TicketCode,
                TicketName = ticket.TicketName,
                CategoryName = ticket.CategoryName,
                UpdatedQuantity = item.Quantity
            });
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        return responseList;
    }
}
