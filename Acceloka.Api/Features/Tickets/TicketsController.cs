using MediatR;
using Microsoft.AspNetCore.Mvc;
using Acceloka.Api.Features.Tickets.GetAvailableTickets;

namespace Acceloka.Api.Features.Tickets;

[ApiController]
[Route("api/v1")]
public class TicketsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TicketsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("get-available-ticket")]
    public async Task<IActionResult> GetAvailableTickets([FromQuery] GetAvailableTicketsQuery query)
    {
        var result = await _mediator.Send(query); 
        return Ok(result);
    }

    [HttpPost("book-ticket")]
    public async Task<IActionResult> BookTicket([FromBody] Acceloka.Api.Features.Bookings.BookTicket.BookTicketCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("get-booked-ticket/{bookedTickedId}")]
    public async Task<IActionResult> GetBookedTicket([FromRoute] string bookedTickedId)
    {
        var query = new Acceloka.Api.Features.Bookings.GetBookedTicket.GetBookedTicketQuery
        {
            BookedTicketId = bookedTickedId
        };
        try
        {
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            // Return 404 if ID is invalid 
            return NotFound(new { title = "Not Found", detail = ex.Message });
        }
    }

    [HttpDelete("revoke-ticket/{bookedTicketId}/{ticketCode}/{qty}")]
    public async Task<IActionResult> RevokeTicket([FromRoute] string bookedTicketId, [FromRoute] string ticketCode, [FromRoute] int qty)
    {
        var command = new Acceloka.Api.Features.Bookings.RevokeTicket.RevokeTicketCommand
        {
            BookedTicketId = bookedTicketId,
            TicketCode = ticketCode,
            Quantity = qty
        };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("edit-booked-ticket/{bookedTicketId}")]
    public async Task<IActionResult> EditBookedTicket(string bookedTicketId, [FromBody] Acceloka.Api.Features.Bookings.EditBookedTicket.EditBookedTicketCommand command)
    {
        command.BookedTicketId = bookedTicketId;

        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
