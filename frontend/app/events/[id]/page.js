"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../_context/AuthContext";
import fetcher from "../../lib/fetcher";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function EventDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: ev } = await fetcher("/events/" + id);
        setEvent(ev);

        if (user) {
          const { data: myBookings } = await fetcher("/bookings");
          setBooked(myBookings.some((b) => b.event === id));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleBook = async () => {
    try {
      await fetcher("/bookings", {
        method: "POST",
        body: { eventId: id, qty: 1 },
      });
      router.push("/congrats");
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading…</p>;
  if (!event) return <p className="text-center mt-10">Event not found.</p>;

  return (
    <main className="max-w-3xl mx-auto p-4">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-60 object-cover rounded mb-4"
        />
      )}

      <h1 className="text-2xl font-semibold">{event.title}</h1>
      <p className="text-sm text-gray-500 mt-1">
        {fmtDate(event.eventDate)} • {event.venue}
      </p>

      <p className="mt-4">{event.description}</p>

      <p className="mt-6 font-semibold">Price: ${event.price.toFixed(2)}</p>

      {booked ? (
        <button className="mt-4 py-2 px-6 bg-gray-300 rounded" disabled>
          Booked
        </button>
      ) : (
        <button
          onClick={handleBook}
          className="mt-4 py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
        >
          Book now
        </button>
      )}
    </main>
  );
}
