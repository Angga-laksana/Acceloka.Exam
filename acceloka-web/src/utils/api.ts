import { TicketResponse, TicketFilter } from "../types/ticket";

const API_BASE_URL = "http://localhost:5144/api/v1";

export async function fetchTickets(filters: TicketFilter): Promise<TicketResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") queryParams.append(key, value.toString());
    });

    if (!queryParams.has("Page")) queryParams.append("Page", "1");
    if (!queryParams.has("PageSize")) queryParams.append("PageSize", "10");

    const res = await fetch(`${API_BASE_URL}/get-available-ticket?${queryParams.toString()}`, {cache: "no-store"});

    if (!res.ok) {
        throw new Error(`Failed to fetch tickets: ${res.statusText}`);
    }

    return res.json();
}

export async function fetchBooking(id: string) {
    const res = await fetch (`${API_BASE_URL}/get-booked-ticket/${id}`, {cache: "no-store"});

    if (!res.ok) {
        throw new Error(`Failed to fetch booking: ${res.statusText}`);
    }
    
    return res.json();
}

export async function updateBooking(id: string, ticketCode: string, quantity: number) {
    const res = await fetch(`${API_BASE_URL}/edit-booked-ticket/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tickets: [{
                ticketCode: ticketCode,
                quantity: quantity,
            }],
         })
    });

    if (!res.ok) {
        throw new Error(`Failed to update booking: ${res.statusText}`);
    }

    return res.json();
}

export async function revokeBooking(id: string, ticketCode: string, quantity: number) {
    const res = await fetch(`${API_BASE_URL}/revoke-ticket/${id}/${ticketCode}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            quantity: quantity
         })
    });
    
    if (!res.ok) {
        throw new Error(`Failed to revoke booking: ${res.statusText}`);
    }
    
    return res.json();
}