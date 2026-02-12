using MediatR;

namespace Acceloka.Api.Features.Bookings.RevokeTicket;

public class RevokeTicketCommand : IRequest<RevokeTicketResponse>
{
    public string BookedTicketId { get; set; } = string.Empty;
    public string TicketCode { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class RevokeTicketResponse
{
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int RemainingQuantity { get; set; }
}
