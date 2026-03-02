export interface Ticket {
    ticketCode: string;
    ticketName: string;
    categoryName: string;
    eventDate: string; //ISO string format
    price: number;
    quota: number;
}

export interface TicketResponse {
    tickets: Ticket[];
    total: number;
}

export interface TicketFilter {
    search?: string;
    categoryName?: string;
    MinEventDate?: string;
    MaxEventDate?: string;
    MaxPrice?: number;
    OrderBy?: string;
    SortDirection?: "asc" | "desc";
    Page?: number;
    PageSize?: number;
}