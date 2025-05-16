"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetcher from "../../../../lib/fetcher";
import AdminGuard from "../../../../_components/AdminGuard";

export default function EventBookings() {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: ev }, { data: bks }] = await Promise.all([
          fetcher("/events/" + id),
          fetcher(`/events/${id}/bookings?limit=1000`),
        ]);
        setEvent(ev);
        setBookings(bks);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const cancel = async (bid) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await fetcher(`/bookings/${bid}`, { method: "DELETE" });
      setBookings((prev) =>
        prev.map((b) => (b._id === bid ? { ...b, status: "cancelled" } : b))
      );
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <AdminGuard>
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">
          Bookings – {event ? event.title : "…"}
        </h1>

        {loading ? (
          <p>Loading…</p>
        ) : !bookings.length ? (
          <p>No bookings.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">User</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-2">
                    {b.user?.username} <br />
                    <span className="text-gray-500">{b.user?.email}</span>
                  </td>
                  <td className="p-2 text-center">{b.qty}</td>
                  <td className="p-2 text-center">
                    {b.status === "cancelled" ? (
                      <span className="text-red-600">cancelled</span>
                    ) : (
                      <span className="text-green-600">confirmed</span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => cancel(b._id)}
                        className="text-xs text-red-600 underline"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </AdminGuard>
  );
}
