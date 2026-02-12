namespace Acceloka.Api.Features.Entities;

public class BookedTicket
{
    public int Id { get; set; }
    public string BookingCode { get; set; } = string.Empty;
    public string TicketCode { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime BookingDate { get; set; } = DateTime.Now;
}
