"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import fetcher from "../lib/fetcher";
import AdminGuard from "../_components/AdminGuard";

const LIMIT = 10;

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, pagination } = await fetcher(
        `/events?limit=${LIMIT}&page=${page}`
      );
      setEvents(data);
      setPages(pagination.totalPages);
      setLoading(false);
    };
    load();
  }, [page]);

  const del = async (id) => {
    if (!confirm("Delete this event?")) return;
    await fetcher(`/events/${id}`, { method: "DELETE" });
    setEvents((ev) => ev.filter((e) => e._id !== id));
  };

  return (
    <AdminGuard>
      <main className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Admin – Events</h1>
          <Link
            href="/admin/create"
            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
          >
            + New Event
          </Link>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2">Date</th>
                <th className="p-2">Tickets</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e._id} className="border-t">
                  <td className="p-2">{e.title}</td>
                  <td className="p-2 whitespace-nowrap">
                    {new Date(e.eventDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {e.ticketsSold}/{e.totalTickets}
                  </td>
                  <td className="p-2 space-x-2">
                    <Link
                      href={`/admin/events/${e._id}/bookings`}
                      className="underline text-xs"
                    >
                      Bookings
                    </Link>
                    <button
                      onClick={() => del(e._id)}
                      className="text-red-600 text-xs underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex gap-4 justify-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm self-center">
            {page} / {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </main>
    </AdminGuard>
  );
}
