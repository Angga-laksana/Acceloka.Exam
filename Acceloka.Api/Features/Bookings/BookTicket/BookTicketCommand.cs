using MediatR;

namespace Acceloka.Api.Features.Bookings.BookTicket;
public class BookTicketCommand : IRequest<BookTicketResponse>
{
    public List<BookTicketItem> Tickets { get; set; } = new(); 
}

public class BookTicketItem
{
    public string TicketCode { get; set; } = string.Empty;
    public int Quantity { get; set; }
}

public class BookTicketResponse
{
    public string BookingId { get; set; } = string.Empty;
    public decimal PriceSummary { get; set; }
    public List<CategorySummary> TicketPerCategories { get; set; } = new();
}

public class CategorySummary
{
    public string CategoryName { get; set; } = string.Empty;
    public decimal PriceSummary { get; set; }
    public List<BookedTicketDetail> Tickets { get; set; } = new();
}

public class BookedTicketDetail
{
    public string TicketCode { get; set; } = string.Empty;
    public string TicketName { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

