using MediatR;

namespace Acceloka.Api.Features.Bookings.GetBookedTicket;
public class GetBookedTicketQuery : IRequest<List<GetBookedTicketResponse>>
{
    public string BookedTicketId { get; set; }
}

public class GetBookedTicketResponse
{
    public string CategoryName { get; set; } = string.Empty;
    public int QtyPerCategory { get; set; }
    public List<BookedTicketItemDetail> Ticket { get; set; } = new();
}

public class BookedTicketItemDetail
{
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
}

