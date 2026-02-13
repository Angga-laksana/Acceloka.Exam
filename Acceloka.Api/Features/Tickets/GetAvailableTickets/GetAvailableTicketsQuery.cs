using MediatR;

namespace Acceloka.Api.Features.Tickets.GetAvailableTickets;
public class GetAvailableTicketsQuery : IRequest<GetAvailableTicketsListResponse>
{
    public string? CategoryName { get; set; }
    public string? TicketCode { get; set; }
    public string? TicketName { get; set; }
    public decimal? MaxPrice { get; set; }
    public DateTime? MinEventDate { get; set; }
    public DateTime? MaxEventDate { get; set; }

    public string? OrderBy { get; set; }
    public string? SortDirection { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetAvailableTicketsListResponse
{
    public List<GetAvailableTicketsResponse> Tickets { get; set; } = new();
    public int TotalTickets { get; set; }
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
