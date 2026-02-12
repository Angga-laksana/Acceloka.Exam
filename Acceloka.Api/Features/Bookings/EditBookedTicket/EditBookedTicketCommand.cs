using MediatR;

namespace Acceloka.Api.Features.Bookings.EditBookedTicket;

public class EditBookedTicketCommand : IRequest<List<EditBookedTicketResponse>>
{
    // ID from url
    public string BookedTicketId { get; set; } = string.Empty;

    public List<EditTicketItem> Tickets { get; set; } = new();
}

public class EditTicketItem
{
    public string TicketCode { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class EditBookedTicketResponse
{
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int UpdatedQuantity { get; set; }
}
