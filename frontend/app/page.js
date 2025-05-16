"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "./_context/AuthContext";
import fetcher from "./lib/fetcher";

const LIMIT = 5;

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function EventsPage() {
  const { user } = useAuth();
  const router = useRouter();

  /* ---------------- state ---------------- */
  const [events, setEvents] = useState([]);
  const [booked, setBooked] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  /* ---------------- fetch events + bookings ---------------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        /* query-string for events request */
        const qsObj = { ...filters, limit: LIMIT, page };
        const qs = new URLSearchParams(
          Object.entries(qsObj).filter(([, v]) => v !== "")
        ).toString();

        /* parallel requests: events + my bookings (large limit) */
        const [{ data: evs, pagination }, bookingsRes] = await Promise.all([
          fetcher("/events?" + qs),
          user
            ? fetcher("/bookings?limit=1000").catch(() => ({ data: [] }))
            : { data: [] },
        ]);

        /* normalise booking → eventId as string */
        const toId = (b) =>
          typeof b.event === "string" ? b.event : b.event?._id;

        const active = bookingsRes.data.filter((b) => b.status !== "cancelled");

        setEvents(evs);
        setTotalPages(pagination.totalPages || 1);
        setBooked(new Set(active.map(toId)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters, page, user]);

  /* reset page to 1 whenever filters change */
  useEffect(() => {
    setPage(1);
  }, [filters.category, filters.minPrice, filters.maxPrice]);

  /* ---------------- helpers ---------------- */
  const categories = useMemo(
    () => Array.from(new Set(events.map((e) => e.category))).sort(),
    [events]
  );

  const handleBook = async (eventId) => {
    try {
      await fetcher("/bookings", {
        method: "POST",
        body: { eventId, qty: 1 },
      });

      /* immediately mark it as booked */
      setBooked((prev) => {
        const next = new Set(prev);
        next.add(String(eventId));
        return next;
      });

      router.push("/congrats");
    } catch (e) {
      alert(e.message);
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) return <p className="text-center mt-10">Loading…</p>;
  if (!events.length)
    return <p className="text-center mt-10">No events found.</p>;

  return (
    <main className="p-4 max-w-6xl mx-auto">
      {/* Filters */}
      <section className="flex flex-wrap gap-4 mb-6">
        {/* category */}
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((f) => ({ ...f, category: e.target.value }))
          }
          className="border px-3 py-2 rounded"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* price */}
        <input
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters((f) => ({ ...f, minPrice: e.target.value }))
          }
          className="border px-3 py-2 w-28 rounded"
        />
        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxPrice: e.target.value }))
          }
          className="border px-3 py-2 w-28 rounded"
        />

        <button
          onClick={() =>
            setFilters({ category: "", minPrice: "", maxPrice: "" })
          }
          className="text-sm underline"
        >
          Clear
        </button>
      </section>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => (
          <article
            key={ev._id}
            className="bg-white border rounded shadow-sm flex flex-col"
          >
            <Link href={`/events/${ev._id}`}>
              <img
                src={ev.imageUrl || "/placeholder.jpg"}
                alt={ev.title}
                className="w-full h-40 object-cover rounded-t"
              />
            </Link>

            <div className="p-4 flex flex-col flex-1">
              <h2 className="font-semibold text-lg">{ev.title}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {fmtDate(ev.eventDate)} • {ev.venue}
              </p>

              <p className="mt-auto font-semibold">${ev.price.toFixed(2)}</p>

              {booked.has(String(ev._id)) ? (
                <button
                  className="mt-2 py-2 bg-gray-300 rounded text-sm"
                  disabled
                >
                  Booked
                </button>
              ) : (
                <button
                  onClick={() => handleBook(ev._id)}
                  className="mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
                >
                  Book now
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="self-center text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </main>
  );
}
