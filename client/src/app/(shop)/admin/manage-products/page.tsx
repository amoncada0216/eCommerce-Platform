"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

type ProductInput = {
  name: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

type PreviewResponse = {
  new: ProductInput[];
  conflicts: {
    incoming: ProductInput;
    existing: { id: string; name: string; slug: string };
  }[];
};

export default function AdminProductsPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conflictActions, setConflictActions] = useState<
    Record<string, "update" | "skip">
    >({});
  
  const router = useRouter();

  async function handlePreview() {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const parsed = JSON.parse(jsonInput);

      const res = await api.post("/api/v1/admin/bulk-preview", parsed);

      setPreview(res.data);
    } catch {
      setError("Invalid JSON or preview failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCommit() {
    if (!preview) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const operations = [
        ...preview.new.map((p) => ({
          action: "create",
          product: p,
        })),
        ...preview.conflicts.map((c) => ({
          action: "update", // default behavior
          id: c.existing.id,
          product: c.incoming,
        })),
      ];

      const res = await api.post("/api/v1/admin/bulk-commit", operations);

      setMessage(
        `Created: ${res.data.created}, Updated: ${res.data.updated}, Skipped: ${res.data.skipped}`,
      );

      setPreview(null);
      setJsonInput("");
    } catch {
      setError("Commit failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <button
        onClick={() => router.push("/admin")}
        className="cursor-pointer"
        style={{ marginBottom: 20 }}
      >
        ← Back to Admin Panel
      </button>
      <h1>Admin Product Manager</h1>
      <br />
      <textarea
        rows={15}
        style={{ width: "100%", border: "1px solid #ccc" }}
        placeholder="Paste JSON array here..."
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handlePreview} disabled={loading} className="cursor-pointer">
        {loading ? "Processing..." : "Preview"}
      </button>
      <br />
      <br />
      {preview && (
        <div className="border">
          <p>New products: {preview.new.length}</p>
          <p>Conflicts: {preview.conflicts.length}</p>

          {preview.conflicts.map((conflict) => {
            const key = conflict.existing.id;

            return (
              <div
                key={key}
                style={{
                  border: "1px solid #ccc",
                  padding: 15,
                  marginBottom: 15,
                }}
              >
                <h3>Conflict: {conflict.existing.slug}</h3>
                <br />
                <div style={{ display: "flex", gap: 40 }}>
                  <div>
                    <strong>Existing (DB)</strong>
                    {Object.entries(conflict.incoming).map(([key, incomingValue]) => {
                      const existingValue =
                        conflict.existing[key as keyof typeof conflict.existing];

                      const isDifferent = String(existingValue) !== String(incomingValue);

                      return (
                        <div
                          key={key}
                          style={{
                            backgroundColor: isDifferent ? "gray" : "transparent",
                            padding: "2px 4px",
                          }}
                        >
                          <strong>{key}:</strong> {String(existingValue ?? "")}
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <strong>Incoming</strong>
                    {Object.entries(conflict.incoming).map(([key, incomingValue]) => {
                      const existingValue =
                        conflict.existing[key as keyof typeof conflict.existing];

                      const isDifferent = String(existingValue) !== String(incomingValue);

                      return (
                        <div
                          key={key}
                          style={{
                            backgroundColor: isDifferent ? "gray" : "transparent",
                            padding: "2px 4px",
                          }}
                        >
                          <strong>{key}:</strong> {String(incomingValue ?? "")}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <label>
                    <input
                      type="radio"
                      name={key}
                      checked={conflictActions[key] === "update"}
                      onChange={() =>
                        setConflictActions((prev) => ({
                          ...prev,
                          [key]: "update",
                        }))
                      }
                    />
                    Update
                  </label>
                  <label style={{ marginLeft: 10 }}>
                    <input
                      type="radio"
                      name={key}
                      checked={conflictActions[key] === "skip"}
                      onChange={() =>
                        setConflictActions((prev) => ({
                          ...prev,
                          [key]: "skip",
                        }))
                      }
                    />
                    Skip
                  </label>
                </div>
              </div>
            );
          })}

          <button onClick={handleCommit} disabled={loading} className="cursor-pointer">
            Confirm & Commit
          </button>
        </div>
      )}

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
