"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchBooking, updateBooking, revokeBooking } from "@/src/utils/api";

interface Ticket {
    ticketCode: string;
    ticketName: string;
    eventDate: string;
}

interface BookingCategory {
    categoryName: string;
    qtyPerCategory: number;
    ticket: Ticket[];
}

export default function BookingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<BookingCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadReceipt = useCallback(() => {
        if (!id) {
            return;
        }
        fetchBooking(id as string)
            .then((data) => {
                if (!data || data.length === 0) {
                    alert("No booking found for this ID");
                    router.push("/");
                    return;
                }
                setBooking(data);
            })
            .catch((err) => {
                alert(err.message || "Failed to fetch booking");
                router.push("/");
            })
            .finally(() => setLoading(false));
    }, [id, router]);
    
    useEffect(() => {
        loadReceipt();
    }, [loadReceipt]);

    const handleEdit = async (ticketCode: string, currentQty: number) => {
        const newQtyStr = prompt(`Update quantity for ${ticketCode}?`, String(currentQty));
        if (!newQtyStr) {
            return;
        }

        const newQty = parseInt(newQtyStr);
        if (isNaN(newQty) || newQty < 1) {
            alert("Please enter a valid number greater than 0");
            return;
        }

        try {
            await updateBooking(id as string, ticketCode, newQty);
            alert("Quantity updated!");
            
            setLoading(true); // <--- Add this
            loadReceipt(); 
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to update tickets");
        }
    };

    const handleRevoke = async (ticketCode: string) => {
        const qtyStr = prompt(`How many tickets to revoke (cancel) for ${ticketCode}?`, "1");
        if (!qtyStr) {
            return;
        }

        const qtyToRevoke = parseInt(qtyStr);
        if (isNaN(qtyToRevoke) || qtyToRevoke < 1) {
            alert("Invalid quantity");
            return;
        }

        if (!confirm(`Are you sure you want to cancel ${qtyToRevoke} tickets?`)) {
            return;
        }
        
        try {
            await revokeBooking(id as string, ticketCode, qtyToRevoke);
            alert("Tickets revoked successfully.");
            
            setLoading(true); // <--- Add this
            loadReceipt(); 
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to revoke tickets");
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Loading Receipt...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
            <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg border">

                <div className="text-center mb-8 border-b pb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
                    <p className="text-gray-500 mt-2">ID: {id}</p>
                </div>

                {/* Render Categories */}
                {booking.map((category: BookingCategory, index: number) => (
                    <div key={index} className="mb-6">
                        <h3 className="text-lg font-bold text-blue-700 mb-4 uppercase tracking-wide border-l-4 border-blue-500 pl-3">
                            {/* {category.categoryName} ({category.qtyPerCategory} items) */}
                            {category.categoryName}
                        </h3>

                        <div className="space-y-3">
                            {category.ticket.map((t: Ticket) => (
                                <div key={t.ticketCode} className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-50 rounded-lg border hover:shadow-md transition">
                                    
                                    {/* Ticket Details */}
                                    <div className="mb-4 md:mb-0 flex items-center space-x-4">
                                        <p className="font-bold text-gray-800 text-lg">{t.ticketName}</p>
                                        <p className="font-sm text-gray-500">{new Date(t.eventDate).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Code: <span className="font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded">{t.ticketCode}</span>
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase">Quantity</p>
                                            <p className="text-2xl font-bold text-gray-800">{category.qtyPerCategory}</p>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button 
                                              onClick={() => handleEdit(t.ticketCode, category.qtyPerCategory)}
                                              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                                            >
                                                Edit Qty
                                            </button>
                                            <button 
                                              onClick={() => handleRevoke(t.ticketCode)}
                                              className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition"
                                            >
                                                Revoke
                                            </button>
                                        </div>
                                    </div>

                                    {/* <div>
                                        <p className="font-bold text-gray-800">{t.ticketName}</p>
                                        <p className="text-xs text-gray-500">
                                        {new Date(t.eventDate).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                                        {t.ticketCode}
                                        </span>
                                    </div> */}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="mt-8 pt-6 border-t flex justify-between">
                    <button 
                        onClick={() => router.push("/")}
                        className="text-gray-600 hover:text-gray-900 font-semibold"
                    >
                        &larr; Back to Home
                    </button>
                    <button 
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        onClick={() => window.print()}
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
}