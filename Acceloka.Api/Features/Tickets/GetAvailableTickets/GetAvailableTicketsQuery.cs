using MediatR;

namespace Acceloka.Api.Features.Tickets.GetAvailableTickets;
public class GetAvailableTicketsQuery : IRequest<List<GetAvailableTicketsResponse>>
{
    public string? CategoryName { get; set; }
    public string? TicketCode { get; set; }
    public string? TicketName { get; set; }
    public decimal? MaxPrice { get; set; }
    public DateTime? MinEventDate { get; set; }
    public DateTime? MaxEventDate { get; set; }

    public string? OrderBy { get; set; }
    public string? SortDirection { get; set; }
}

public class GetAvailableTicketsResponse
{
    public DateTime EventDate { get; set; }
    public int Quota { get; set; }
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
