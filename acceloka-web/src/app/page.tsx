"use client";

import { useState, useEffect, useCallback} from "react";
import { useRouter } from "next/navigation";
import { fetchTickets } from "@/src/utils/api";
import { Ticket } from "@/src/types/ticket";
import BookingModal from "@/src/components/BookingModal";

export default function Home() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [minDate, setMinDate] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("ticketCode");
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchFilter, setSearchFilter] = useState({Search: "", Category: "", Date: "", OrderBy: "ticketCode", SortDirection: "asc" as "asc" | "desc" });
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const router = useRouter();
  const [retrievedId, setRetrievedId] = useState<string>("");

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchTickets({
        search: searchFilter.Search,
        categoryName: searchFilter.Category,
        MinEventDate: searchFilter.Date,
        OrderBy: searchFilter.OrderBy,
        SortDirection: searchFilter.SortDirection,
        Page: page,
        PageSize: pageSize,
      });

      setTickets(data.tickets || []);
      setTotalTickets(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occured.");
    } finally {
      setLoading(false);
    }
  }, [searchFilter, page]);

  // Initial load and reload when page changes
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Handlers for search and pagination
  const handleSearch = () => {
    setPage(1);
    const [orderByField, sortDir] = orderBy.split("-");
    setSearchFilter({ 
      Search: search,
      Category: category, 
      Date: minDate, 
      OrderBy: orderByField || "ticketCode",
      SortDirection: (sortDir as "asc" | "desc") || "asc"
    });
  }

  const totalPages = Math.ceil(totalTickets / pageSize);

  const handleRetrieveBooking = () => {
    if (!retrievedId.trim()) {
      alert("Please enter a booking ID");
      return;
    }
    router.push(`/booking/${retrievedId.trim()}`);
  }
  
  return (
    <main className="min-h-screen bg-background">

      {/* Hero Section */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-doodle-pattern opacity-60 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold mb-4 tracking-wide">
            ✨ Family Deals Available!
          </span>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-textMain mb-6 leading-tight">
            Book Your <span className="text-primary relative inline-block">
              Fun Moments
              {/* Underline Doodle */}
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-xl text-textMuted max-w-2xl mx-auto mb-12">
            Cinema, concerts, and events all in one place. Easy booking for the whole family.
          </p>

          {/* --- SEARCH WIDGET --- */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto transform transition-all hover:scale-[1.01]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Search Input */}
              <div className="md:col-span-4 text-left">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Search</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Name or Code..." 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all font-medium text-gray-700"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Input */}
              <div className="md:col-span-4 text-left">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Category</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400">🎪</span>
                  <input 
                    type="text" 
                    placeholder="Cinema, Concert..." 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-2xl outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              {/* 3. Date Input (3 cols) */}
              <div className="md:col-span-4 text-left">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Date</label>
                <div className="relative">
                  <input 
                    placeholder="Date"
                    type="datetime-local" 
                    className="w-full px-4 py-3 bg-gray-50 focus:bg-white border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all font-medium text-gray-700"
                    value={minDate}
                    onChange={(e) => setMinDate(e.target.value)}
                  />
                </div>
              </div>

            </div>
            {/* Search Button */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6 justify-self-stretch">
              <div className="md:col-span-3 flex items-end">
                <button 
                  onClick={handleSearch}
                  className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 text-lg"
                  >
                  Let&apos;s Go!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Toolbar: Title, Sorting, & Retrieve ID */}
        <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center mb-8 gap-4 border-b border-gray-100 pb-4">
          
          <h2 className="font-heading text-3xl font-bold text-textMain">
            Upcoming Events
          </h2>
          
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            
            {/* SORTING DROPDOWN */}
            <div className="relative">
              <select 
                aria-label="Sort by"
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <option value="ticketCode-asc">Sort by Code</option>
                <option value="price-asc">Price: Lowest</option>
                <option value="price-desc">Price: Highest</option>
                <option value="eventDate-asc">Date: Soonest</option>
              <option value="eventDate-desc">Date: Latest</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* RETRIEVE BOOKING */}
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 pl-3">
              <input 
                type="text" 
                placeholder="Booking ID..." 
                className="outline-none text-sm text-gray-600 w-28 bg-transparent"
                value={retrievedId}
                onChange={(e) => setRetrievedId(e.target.value)}
              />
              <button 
                onClick={handleRetrieveBooking}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold transition uppercase"
              >
                Check
              </button>
            </div>
          </div>
        </div>

        {/* --- TICKET GRID --- */}
        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-bounce text-4xl">🎈</div>
           </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tickets.map((t) => (
                <div key={t.ticketCode} className="group bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden">
                  
                  {/* Decorative Blob */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[50px] -z-0 group-hover:bg-blue-100 transition-colors"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                        {t.categoryName}
                      </span>
                      <span className="text-gray-400 font-mono text-xs">#{t.ticketCode}</span>
                    </div>
                    
                    <h3 className="font-heading text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                      {t.ticketName}
                    </h3>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-6">
                      <span className="mr-2">📅</span>
                      {new Date(t.eventDate).toLocaleDateString(undefined, {
                        weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'
                      })}
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
                        <p className="text-lg font-bold text-primary">Rp {t.price?.toLocaleString()}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Seats</p>
                        {t.quota < 5 ? (
                          <span className="text-red-500 font-bold text-sm bg-red-50 px-2 py-1 rounded-lg">Only {t.quota}!</span>
                        ) : (
                          <span className="text-gray-600 font-bold">{t.quota}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="w-full mt-5 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 font-bold py-3 rounded-xl shadow-lg shadow-blue-100 transition-all"
                    >
                      <span>Book Ticket</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- PAGINATION CONTROLS --- */}
            {totalTickets < pageSize && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  &larr; Previous
                </button>
                
                <span className="text-gray-400 font-heading font-medium">
                  Page <span className="text-primary font-bold text-xl">{page}</span> of {totalPages+1}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
      

      {/* Modal Injection */}
      {selectedTicket && (
        <BookingModal 
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onSuccess={() => {
            loadTickets();
            setSelectedTicket(null);
          }}
        />
      )}
    </main>
  );
}