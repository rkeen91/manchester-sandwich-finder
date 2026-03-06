"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function PlacesSearch({ places }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return places;

    return places.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const addr = (p.address || "").toLowerCase();
      return name.includes(s) || addr.includes(s);
    });
  }, [q, places]);

  return (
    <div style={{ marginTop: 16 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name or postcode/area…"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.06)",
          color: "white",
          outline: "none",
          marginBottom: 12,
        }}
      />

      <div style={{ opacity: 0.8, marginBottom: 10 }}>
        Showing {filtered.length} of {places.length}
      </div>

      <ul style={{ paddingLeft: 18 }}>
        {filtered.map((p) => (
          <li key={p.id} style={{ marginBottom: 10 }}>
            <Link href={`/place/${p.slug}`}>{p.name}</Link>
            {p.address ? <div style={{ opacity: 0.8 }}>{p.address}</div> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}