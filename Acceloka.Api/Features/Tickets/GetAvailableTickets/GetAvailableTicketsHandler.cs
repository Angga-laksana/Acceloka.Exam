using MediatR;
using Microsoft.EntityFrameworkCore;
using Acceloka.Api.Infrastructure.Data;
using Acceloka.Api.Features.Entities;
using Microsoft.IdentityModel.Tokens;

namespace Acceloka.Api.Features.Tickets.GetAvailableTickets;
public class GetAvailableTicketsHandler : IRequestHandler<GetAvailableTicketsQuery, GetAvailableTicketsListResponse>
{
    private readonly AppDbContext _DbContext;

    public GetAvailableTicketsHandler(AppDbContext dbContext)
    {
        _DbContext = dbContext;
    }

    public async Task<GetAvailableTicketsListResponse> Handle(GetAvailableTicketsQuery request, CancellationToken cancellationToken)
    {
        var query = _DbContext.Tickets.AsQueryable();
        
        // Apply filters
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            string searchTerm = request.Search.ToLower().Trim();
            query = query.Where(t => t.TicketName.ToLower().Contains(searchTerm) || t.TicketCode.ToLower().Contains(searchTerm));
        }
        if (!string.IsNullOrEmpty(request.CategoryName))
        {
            string category = request.CategoryName.ToLower().Trim();
            query = query.Where(t => t.CategoryName.ToLower().Contains(category));
        }
        if (!string.IsNullOrEmpty(request.TicketCode))
        {
            query = query.Where(t => t.TicketCode == request.TicketCode);
        }
        if (!string.IsNullOrEmpty(request.TicketName))
        {
            query = query.Where(t => t.TicketName.ToLower().Contains(request.TicketName));
        }
        if (request.MaxPrice.HasValue)
        {
            query = query.Where(t => t.Price <= request.MaxPrice.Value);
        }
        if (request.MinEventDate.HasValue)
        {
            query = query.Where(t => t.EventDate >= request.MinEventDate.Value);
        }
        if (request.MaxEventDate.HasValue)
        {
            query = query.Where(t => t.EventDate <= request.MaxEventDate.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        // Apply sorting
        query = ApplySorting(query, request.OrderBy, request.SortDirection);

        var pagedData = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(t => new GetAvailableTicketsResponse
            {
                // ... map your properties ...
                TicketCode = t.TicketCode,
                TicketName = t.TicketName,
                CategoryName = t.CategoryName,
                EventDate = t.EventDate,
                Price = t.Price,
                Quota = t.Quota
            })
            .ToListAsync(cancellationToken);

        // 3. Return the Wrapper
        return new GetAvailableTicketsListResponse
        {
            Tickets = pagedData,
            TotalTickets = totalCount
        };
    }

    private IQueryable<Ticket> ApplySorting(IQueryable<Ticket> query, string? orderBy, string? sortDirection)
    {
        bool ascending = string.Equals(sortDirection, "asc", StringComparison.OrdinalIgnoreCase);
        return orderBy?.ToLower() switch
        {
            "categoryname" => ascending ? query.OrderBy(t => t.CategoryName) : query.OrderByDescending(t => t.CategoryName),
            "ticketcode" => ascending ? query.OrderBy(t => t.TicketCode) : query.OrderByDescending(t => t.TicketCode),
            "ticketname" => ascending ? query.OrderBy(t => t.TicketName) : query.OrderByDescending(t => t.TicketName),
            "price" => ascending ? query.OrderBy(t => t.Price) : query.OrderByDescending(t => t.Price),
            "eventdate" => ascending ? query.OrderBy(t => t.EventDate) : query.OrderByDescending(t => t.EventDate),
            _ => query.OrderBy(t => t.TicketCode), // Default sorting
        };
    }
}
