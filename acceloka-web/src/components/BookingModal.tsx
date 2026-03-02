"use client";

import { useState } from "react";
import { Ticket } from "../types/ticket";
import { useRouter } from "next/navigation";

interface BookingModalProps {
    ticket: Ticket;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BookingModal({ ticket, onClose, onSuccess }: BookingModalProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const [isBooking, setIsBooking] = useState<boolean>(false);
    const router = useRouter();

    const handleBooking = async () => {
        setIsBooking(true);
        try {
            const payload = {
                tickets: [
                    {
                        ticketCode: ticket.ticketCode,
                        quantity: quantity,
                    }
                ]
            };
            const res = await fetch("http://localhost:5144/api/v1/book-ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const errorData = await res.json();
                alert(`Failed: ${errorData.message || "Failed to book ticket"}`);
                router.push("/");
                return;
            }
            alert("Ticket booked successfully!");
            const data = await res.json();
            if (data.bookingId) {
                onSuccess();
                onClose();
                router.push(`/booking/${data.bookingId}`);
            } else {
                alert("Booking successful but failed to retrieve booking ID.");
                onClose();
            }
        } catch {
            alert("Failed to book ticket");
        } finally {
            setIsBooking(false);
        }
    }

    return (
        <div className="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-heading font-bold text-gray-800">Book Ticket</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600">Ticket:</p>
                    <p className="font-semibold">{ticket.ticketName}</p>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600 mb-2">Quantity:</p>
                    <input
                        placeholder="quantity"
                        type="number" 
                        min="1" 
                        max={ticket.quota} // Limit to available quota
                        className="w-full border p-2 rounded"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Total: Rp {(ticket.price * quantity).toLocaleString()}
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleBooking}
                        disabled={isBooking || quantity < 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                        {isBooking ? "Booking..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}