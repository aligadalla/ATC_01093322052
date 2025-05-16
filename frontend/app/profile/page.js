"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../_context/AuthContext";
import fetcher from "../lib/fetcher";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const { data } = await fetcher("/bookings?limit=1000");
        setBookings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const cancelBooking = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await fetcher(`/bookings/${id}`, { method: "DELETE" });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch (e) {
      alert(e.message);
    }
  };

  if (!user) return <p className="text-center mt-10">Please log in.</p>;

  return (
    <main className="max-w-5xl mx-auto p-4">
      <section className="flex items-center gap-4 mb-8">
        {user.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-xl font-semibold">{user.username}</h1>
          <p className="text-sm text-gray-600">{user.email}</p>
          <button
            onClick={logout}
            className="mt-2 text-xs underline text-red-500"
          >
            Logout
          </button>
        </div>
      </section>

      <h2 className="text-lg font-semibold mb-4">My Bookings</h2>

      {loading ? (
        <p>Loading…</p>
      ) : !bookings.length ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const qty = Number(b.qty) || 0;
            const price = Number(b.totalPrice) || Number(b.event?.price) || 0;
            const total = price * qty;

            return (
              <div
                key={b._id}
                className="border rounded p-4 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={b.event?.imageUrl || "/placeholder.jpg"}
                  alt={b.event?.title}
                  className="w-full sm:w-40 h-32 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {b.event?.title ?? "Unnamed event"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {b.event?.eventDate ? fmtDate(b.event.eventDate) : "—"} •{" "}
                    {b.event?.venue ?? "—"}
                  </p>

                  <p className="text-sm mt-1">
                    Qty: {qty} — Total: ${total.toFixed(2)}
                  </p>

                  <p
                    className={
                      b.status === "cancelled"
                        ? "text-red-500 text-sm"
                        : "text-green-600 text-sm"
                    }
                  >
                    {b.status}
                  </p>
                </div>

                {b.status !== "cancelled" && (
                  <button
                    onClick={() => cancelBooking(b._id)}
                    className="self-start sm:self-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
