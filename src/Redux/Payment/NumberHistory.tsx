// src/components/Payment/NumberHistory.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/store";
import {
  fetchNumberHistory,
  clearNumberHistory,
  selectNumberHistoryData,
  selectNumberHistoryError,
  selectNumberHistoryLoading,
  setLastFilters,
  NumberHistoryFilters,
  PayMethod,
  NumberHistoryRow,
} from "../../Redux/Payment/paymentNumberHistorySlice";

import jsPDF from "jspdf";
// IMPORTANT: this import extends jsPDF with autoTable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "jspdf-autotable";

type FilterMode = "MONTH_YEAR" | "DATE_RANGE";

const NumberHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectNumberHistoryData);
  const loading = useAppSelector(selectNumberHistoryLoading);
  const error = useAppSelector(selectNumberHistoryError);

  // ---- Form state ----
  const [number, setNumber] = useState<string>("");
  const [methods, setMethods] = useState<PayMethod[]>(["ZAAD", "E-DAHAB"]);
  const [filterMode, setFilterMode] = useState<FilterMode>("MONTH_YEAR");
  const [month, setMonth] = useState<number | "">("");
  const [year, setYear] = useState<number | "">("");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  const printableRef = useRef<HTMLDivElement>(null);

  // ---- Helpers ----
  const toggleMethod = useCallback(
    (m: PayMethod) => {
      setMethods((prev) =>
        prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
      );
    },
    []
  );

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(2000, i, 1).toLocaleString(undefined, {
          month: "long",
        }),
      })),
    []
  );

  const currentFilters: NumberHistoryFilters = useMemo((): NumberHistoryFilters => {
    const base: NumberHistoryFilters = {
      number: number.trim(),
      methods,
    };
    if (filterMode === "DATE_RANGE" && dateStart && dateEnd) {
      return { ...base, dateStart, dateEnd };
    }
    if (filterMode === "MONTH_YEAR") {
      if (month) base.month = Number(month);
      if (year) base.year = Number(year);
    }
    return base;
  }, [number, methods, filterMode, month, year, dateStart, dateEnd]);

  // ---- Actions ----
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!currentFilters.number) return;
      dispatch(setLastFilters(currentFilters));
      dispatch(fetchNumberHistory(currentFilters));
    },
    [dispatch, currentFilters]
  );

  const onClear = useCallback(() => {
    dispatch(clearNumberHistory());
    setNumber("");
    setMethods(["ZAAD", "E-DAHAB"]);
    setFilterMode("MONTH_YEAR");
    setMonth("");
    setYear("");
    setDateStart("");
    setDateEnd("");
  }, [dispatch]);

  // ---- Derived UI ----
  const totalAmountDisplay = useMemo(() => {
    const t = data?.totalAmountThisMonth ?? 0;
    return `$${t.toFixed(2)}`;
  }, [data]);

  const effectiveFrom = useMemo(
    () => (data?.dateStart ? new Date(data.dateStart).toLocaleDateString() : "-"),
    [data?.dateStart]
  );
  const effectiveTo = useMemo(
    () => (data?.dateEnd ? new Date(data.dateEnd).toLocaleDateString() : "-"),
    [data?.dateEnd]
  );

  // ---- Print ----
  const handlePrint = useCallback(() => {
    if (!printableRef.current) return;
    const content = printableRef.current.innerHTML;
    const w = window.open("", "_blank", "width=1200,height=800");
    if (!w) return;
    w.document.open();
    w.document.write(`
      <html>
        <head>
          <title>Number History</title>
          <style>
            @page { size: A4; margin: 14mm; }
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #111827; }
            .title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
            .subtitle { font-size: 12px; color: #4B5563; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #E5E7EB; padding: 6px 8px; text-align: left; }
            th { background: #F9FAFB; }
            .meta { margin-bottom: 10px; font-size: 12px; }
            .meta div { margin-bottom: 2px; }
          </style>
        </head>
        <body>
          ${content}
          <script>window.onload = () => { window.print(); window.close(); };</script>
        </body>
      </html>
    `);
    w.document.close();
  }, []);

  // ---- PDF ----
  const handleDownloadPDF = useCallback(() => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const now = new Date();

    const title = "Payment Number History";
    const subtitle = `Number: ${number || "-"} | Methods: ${
      methods.join(", ") || "-"
    }`;
    const range = `Range: ${effectiveFrom} — ${effectiveTo}`;
    const totals = `Used: ${data?.usedCount ?? 0} | Allocations: ${
      data?.totalAllocations ?? 0
    } | Total: $${(data?.totalAmountThisMonth ?? 0).toFixed(2)}`;
    const generated = `Generated: ${now.toLocaleString()}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, 40, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(subtitle, 40, 60);
    doc.text(range, 40, 75);
    doc.text(totals, 40, 90);
    doc.text(generated, 40, 105);

    // Table head
    const head: string[][] = [
      [
        "#",
        "Student",
        "Class",
        "Amount",
        "Month",
        "Year",
        "Date",
        "User",
        "Method",
        "Number",
        "Payment ID",
      ],
    ];

    // Table body — fully typed, no implicit any
    const body: (string | number)[][] =
      (data?.rows || []).map((r: NumberHistoryRow, idx: number) => [
        idx + 1,
        r.student,
        r.class,
        `$${r.amount.toFixed(2)}`,
        r.month ?? "-",
        r.year ?? "-",
        new Date(r.date).toLocaleString(),
        r.user,
        r.method,
        r.number,
        r.paymentId,
      ]);

    // @ts-ignore - autoTable is added by side-effect import
    doc.autoTable({
      head,
      body,
      startY: 125,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [249, 250, 251], textColor: [17, 24, 39] },
      alternateRowStyles: { fillColor: [252, 252, 253] },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 120 },
        2: { cellWidth: 50 },
        3: { cellWidth: 60 },
        4: { cellWidth: 40 },
        5: { cellWidth: 42 },
        6: { cellWidth: 120 },
        7: { cellWidth: 90 },
        8: { cellWidth: 60 },
        9: { cellWidth: 86 },
        10: { cellWidth: 70 },
      },
      // remove unused param warning by omitting the param
      didDrawPage: () => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = (pageSize as any).height || pageSize.getHeight?.();
        const pageWidth = (pageSize as any).width || pageSize.getWidth?.();

        // Prefer typed method if available; fallback to internal
        const pageCount =
          typeof (doc as any).getNumberOfPages === "function"
            ? (doc as any).getNumberOfPages()
            : (doc as any).internal?.getNumberOfPages?.() ?? 1;

        doc.setFontSize(9);
        doc.text(
          `Total: $${(data?.totalAmountThisMonth ?? 0).toFixed(2)}`,
          40,
          (pageHeight || 820) - 24
        );
        doc.text(
          `Page ${pageCount}`,
          (pageWidth || 595) - 80,
          (pageHeight || 820) - 24
        );
      },
      margin: { left: 40, right: 40 },
    });

    const fileName = `number-history-${number || "unknown"}-${now
      .toISOString()
      .slice(0, 10)}.pdf`;
    doc.save(fileName);
  }, [data, effectiveFrom, effectiveTo, methods, number]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Check Payment Number History
        </h1>
        <p className="text-sm text-gray-500">
          Verify how many times a ZAAD / E-DAHAB number was used, see student allocations,
          totals, and the effective date range. Includes Print & PDF export.
        </p>
      </div>

      {/* Card: Form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 md:p-6 mb-6 border border-gray-100 dark:border-gray-800">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Number */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium mb-1">Number</label>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g. 634481677"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Methods */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium mb-1">Methods</label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={methods.includes("ZAAD")}
                  onChange={() => toggleMethod("ZAAD")}
                />
                <span>ZAAD</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={methods.includes("E-DAHAB")}
                  onChange={() => toggleMethod("E-DAHAB")}
                />
                <span>E-DAHAB</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave both checked to search across ZAAD and E-DAHAB.
            </p>
          </div>

          {/* Filter Mode */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium mb-1">Filter Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFilterMode("MONTH_YEAR")}
                className={`rounded-xl px-3 py-2 border ${
                  filterMode === "MONTH_YEAR"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                Month & Year
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("DATE_RANGE")}
                className={`rounded-xl px-3 py-2 border ${
                  filterMode === "DATE_RANGE"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                Date Range
              </button>
            </div>
          </div>

          {/* Month/Year */}
          {filterMode === "MONTH_YEAR" && (
            <>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-1">Month</label>
                <select
                  value={month}
                  onChange={(e) =>
                    setMonth(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All</option>
                  {monthOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 2025"
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          {/* Date Range */}
          {filterMode === "DATE_RANGE" && (
            <>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="md:col-span-12 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !number.trim()}
              className="rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Search"}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Clear
            </button>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                disabled={!data?.rows?.length}
                className="rounded-xl px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                title="Print this report"
              >
                Print
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={!data?.rows?.length}
                className="rounded-xl px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                title="Download PDF"
              >
                Download PDF
              </button>
            </div>
            {error && (
              <span className="text-sm text-red-600">{error}</span>
            )}
          </div>
        </form>
      </div>

      {/* Printable region */}
      <div ref={printableRef}>
        {/* Card: Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 md:p-6 mb-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold mb-3">Summary</h2>
            <div className="text-xs text-gray-500">
              Number History | {new Date().toLocaleString()}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
              <div className="text-gray-500">Used Count</div>
              <div className="text-xl font-semibold">{data?.usedCount ?? 0}</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
              <div className="text-gray-500">Total Allocations</div>
              <div className="text-xl font-semibold">{data?.totalAllocations ?? 0}</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
              <div className="text-gray-500">Total Amount</div>
              <div className="text-xl font-semibold">{totalAmountDisplay}</div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3">
              <div className="text-gray-500">Date Range</div>
              <div className="text-sm">
                <div>From: {effectiveFrom}</div>
                <div>To: {effectiveTo}</div>
              </div>
            </div>
          </div>
          {data?.message && (
            <p className="text-xs text-gray-500 mt-2">{data.message}</p>
          )}
        </div>

        {/* Card: Rows Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 md:p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Allocations</h2>
            <div className="text-sm text-gray-500">
              {data?.rows?.length ?? 0} record(s)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-800">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">Student</th>
                  <th className="py-2 pr-4">Class</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Month</th>
                  <th className="py-2 pr-4">Year</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Method</th>
                  <th className="py-2 pr-4">Number</th>
                  <th className="py-2 pr-4">Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {data?.rows?.length ? (
                  data.rows.map((r: NumberHistoryRow, idx: number) => (
                    <tr key={`${r.paymentId}-${idx}`} className="border-b border-gray-50 dark:border-gray-800">
                      <td className="py-2 pr-4">{idx + 1}</td>
                      <td className="py-2 pr-4">{r.student}</td>
                      <td className="py-2 pr-4">{r.class}</td>
                      <td className="py-2 pr-4">${r.amount.toFixed(2)}</td>
                      <td className="py-2 pr-4">{r.month ?? "-"}</td>
                      <td className="py-2 pr-4">{r.year ?? "-"}</td>
                      <td className="py-2 pr-4">{new Date(r.date).toLocaleString()}</td>
                      <td className="py-2 pr-4">{r.user}</td>
                      <td className="py-2 pr-4">{r.method}</td>
                      <td className="py-2 pr-4">{r.number}</td>
                      <td className="py-2 pr-4">{r.paymentId}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-6 pr-4 text-center text-gray-500" colSpan={11}>
                      {loading ? "Loading..." : "No records to display."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NumberHistory;
