"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "../../lib/fetcher";
import AdminGuard from "../../_components/AdminGuard";

export default function CreateEvent() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [file, setFile] = useState(null);

  const [f, set] = useState({
    title_en: "",
    title_ar: "",
    desc_en: "",
    desc_ar: "",
    venue_en: "",
    venue_ar: "",
    price: "",
    totalTickets: "",
    date: "",
  });

  const handle = (e) => set({ ...f, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title[en]", f.title_en);
      fd.append("title[ar]", f.title_ar);
      fd.append("description[en]", f.desc_en);
      fd.append("description[ar]", f.desc_ar);
      fd.append("venue[en]", f.venue_en);
      fd.append("venue[ar]", f.venue_ar);
      fd.append("price", f.price);
      fd.append("totalTickets", f.totalTickets);
      fd.append("eventDate", f.date);
      if (file) fd.append("file", file);

      await fetcher("/events", { method: "POST", body: fd, headers: {} });
      router.replace("/admin");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <AdminGuard>
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Create Event</h1>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="title_en"
              placeholder="Title (en)"
              className="border p-2 rounded"
              value={f.title_en}
              onChange={handle}
              required
            />
            <input
              name="title_ar"
              placeholder="Title (ar)"
              className="border p-2 rounded"
              value={f.title_ar}
              onChange={handle}
              required
            />
            <textarea
              name="desc_en"
              placeholder="Description (en)"
              className="border p-2 rounded col-span-2"
              value={f.desc_en}
              onChange={handle}
              required
            />
            <textarea
              name="desc_ar"
              placeholder="Description (ar)"
              className="border p-2 rounded col-span-2"
              value={f.desc_ar}
              onChange={handle}
              required
            />
            <input
              name="venue_en"
              placeholder="Venue (en)"
              className="border p-2 rounded"
              value={f.venue_en}
              onChange={handle}
              required
            />
            <input
              name="venue_ar"
              placeholder="Venue (ar)"
              className="border p-2 rounded"
              value={f.venue_ar}
              onChange={handle}
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              className="border p-2 rounded"
              value={f.price}
              onChange={handle}
              required
            />
            <input
              name="totalTickets"
              type="number"
              placeholder="Total tickets"
              className="border p-2 rounded"
              value={f.totalTickets}
              onChange={handle}
              required
            />
            <input
              name="date"
              type="date"
              className="border p-2 rounded col-span-2"
              value={f.date}
              onChange={handle}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0])}
              className="col-span-2"
            />
          </div>

          {err && <p className="text-red-600 text-sm">{err}</p>}

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </form>
      </main>
    </AdminGuard>
  );
}
