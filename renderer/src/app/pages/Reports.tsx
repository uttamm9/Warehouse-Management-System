import { useState, useMemo, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useWarehouse } from "../context/WarehouseContext";
import { FileText, Download, Calendar, Check, Search, Filter } from "lucide-react";
import { toast } from "sonner";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import saveAs from "file-saver";
import autoTable from "jspdf-autotable";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const reportTypes = [
  { id: "inbound", label: "Inbound Report" },
  { id: "outbound", label: "Outbound Report" },
  { id: "stock", label: "Stock Status" },
  { id: "utilization", label: "Rack Utilization" },
];

export function Reports() {
  const { state, addLog, user } = useWarehouse();
  const [activeReport, setActiveReport] = useState("inbound");
  const [dateRange, setDateRange] = useState("week");
  const [skuFilter, setSkuFilter] = useState("all");
  const [rackFilter, setRackFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [exporting, setExporting] = useState<string | null>(null);

  const [tableData, setTableData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [graphsData, setGraphsData] = useState<any>({
    zoneUtilization: [],
    skuDistribution: [],
    inventoryTrends: []
  });
  const [loading, setLoading] = useState(false);

  const isFiltered = skuFilter !== "all" || rackFilter !== "all" || dateRange !== "week" || searchQuery !== "";

  const handleClearFilters = () => {
    setSkuFilter("all");
    setRackFilter("all");
    setDateRange("week");
    setSearchQuery("");
  };
  const API_SERVER = 'http://localhost:3001';
  const API_BASE = `${API_SERVER}/api/reports`;

  const fetchReportData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      let endpoint = activeReport;
      if (activeReport === "utilization") endpoint = "rack-utilization";

      const queryParams = new URLSearchParams();
      if (dateRange !== "all") queryParams.append("dateRange", dateRange);
      if (skuFilter !== "all") queryParams.append("skuFilter", skuFilter);
      if (rackFilter !== "all") queryParams.append("rackFilter", rackFilter);

      const res = await fetch(`${API_BASE}/${endpoint}?${queryParams.toString()}`, {
        headers: {
          'x-user-role': user?.role || 'UNKNOWN'
        }
      });
      const json = await res.json();
      if (json.success) {
        setTableData(json.data);
      }

      const resGraphs = await fetch(`${API_BASE}/graphs`, {
        headers: {
          'x-user-role': user?.role || 'UNKNOWN'
        }
      });
      const jsonGraphs = await resGraphs.json();
      if (jsonGraphs.success) {
        setGraphsData(jsonGraphs.data);
      }

      const resSummary = await fetch(`${API_BASE}/summary`, {
        headers: {
          'x-user-role': user?.role || 'UNKNOWN'
        }
      });
      const jsonSummary = await resSummary.json();
      if (jsonSummary.success) {
        setSummaryData(jsonSummary.data);
      }
    } catch (error) {
      console.error("Failed to fetch report data:", error);
      if (!isBackground) toast.error("Failed to load reports");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
    const interval = setInterval(() => fetchReportData(true), 30000);
    return () => clearInterval(interval);
  }, [activeReport, dateRange, skuFilter, rackFilter]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return tableData;
    const lowerQuery = searchQuery.toLowerCase();
    return tableData.filter(row =>
      Object.values(row).some(val => String(val).toLowerCase().includes(lowerQuery))
    );
  }, [tableData, searchQuery]);

  // ─── Types ────────────────────────────────────────────────────────────────────

  type RGB = [number, number, number];

  const COLOR = {
    headerBg: [15, 23, 42] as RGB, // #0f172a
    accent: [37, 99, 235] as RGB, // #2563eb
    accentDark: [29, 78, 216] as RGB, // #1d4ed8
    accentMid: [59, 130, 246] as RGB, // #3b82f6
    text: [30, 41, 59] as RGB, // #1e293b
    muted: [100, 116, 139] as RGB, // #64748b
    border: [226, 232, 240] as RGB, // #e2e8f0
    kpiBg: [241, 245, 249] as RGB, // #f1f5f9
    rowAlt: [248, 250, 252] as RGB, // #f8fafc
    white: [255, 255, 255] as RGB,
    green: [22, 101, 52] as RGB, // text
    greenBg: [220, 252, 231] as RGB,
    amber: [133, 77, 14] as RGB,
    amberBg: [254, 249, 195] as RGB,
    red: [153, 27, 27] as RGB,
    redBg: [254, 226, 226] as RGB,
    blue: [30, 64, 175] as RGB,
    blueBg: [219, 234, 254] as RGB,
    slate: [71, 85, 105] as RGB, // #475569
    slate2: [51, 65, 85] as RGB, // #334155
  };

  // ─── Helper: draw a filled rounded rectangle ─────────────────────────────────

  function roundedRect(
    doc: jsPDF,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    fill?: RGB,
    stroke?: RGB,
    strokeWidth = 0.3,
  ) {
    if (fill) {
      doc.setFillColor(...fill);
    }
    if (stroke) {
      doc.setDrawColor(...stroke);
      doc.setLineWidth(strokeWidth);
    }

    const mode = fill && stroke ? "FD" : fill ? "F" : "D";
    doc.roundedRect(x, y, w, h, r, r, mode);
  }

  // ─── Helper: small status badge ──────────────────────────────────────────────

  function drawBadge(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    bg: RGB,
    fg: RGB,
  ) {
    const padding = 1.8;
    doc.setFontSize(6);
    const tw = doc.getTextWidth(text);
    const bw = tw + padding * 2 + 2;
    const bh = 4.5;

    roundedRect(doc, x, y - bh + 1, bw, bh, 1, bg);
    doc.setTextColor(...fg);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(text, x + padding + 1, y - 0.4);
  }

  // ─── Helper: mini quantity bar ────────────────────────────────────────────────

  function drawQtyBar(
    doc: jsPDF,
    qty: number,
    max: number,
    x: number,
    y: number,
    barW = 20,
    barH = 2.5,
  ) {
    const ratio = Math.min(qty / max, 1);
    const fillColor: RGB =
      ratio === 0 ? COLOR.red : ratio < 0.15 ? COLOR.amber : COLOR.accent;

    // background track
    roundedRect(doc, x, y - barH + 0.5, barW, barH, 1, COLOR.border);
    // fill
    if (ratio > 0) {
      roundedRect(doc, x, y - barH + 0.5, barW * ratio, barH, 1, fillColor);
    }
  }

  // ─── Warehouse SVG Logo (drawn with jsPDF primitives) ────────────────────────

  function drawWarehouseLogo(doc: jsPDF, ox: number, oy: number) {
    const s = 0.72; // scale factor to fit ~18×18 pt

    // Ground platform
    doc.setFillColor(...COLOR.slate2);
    doc.roundedRect(
      ox + 0 * s,
      oy + 19.5 * s,
      30 * s,
      2.5 * s,
      0.8 * s,
      0.8 * s,
      "F",
    );

    // Building body
    doc.setFillColor(...COLOR.accentDark);
    doc.rect(ox + 2.5 * s, oy + 9.5 * s, 25 * s, 10 * s, "F");

    // Roof polygon
    doc.setFillColor(...COLOR.accent);
    doc.triangle(
      ox + 0 * s,
      oy + 9.8 * s,
      ox + 15 * s,
      oy + 1.5 * s,
      ox + 30 * s,
      oy + 9.8 * s,
      "F",
    );

    // Roof edge highlight
    doc.setDrawColor(...COLOR.accentMid);
    doc.setLineWidth(0.5);
    doc.lines(
      [
        [15 * s, -8.3 * s],
        [15 * s, 8.3 * s],
      ],
      ox + 0 * s,
      oy + 9.8 * s,
      [1, 1],
      undefined,
      false,
    );

    // Building top ridge
    doc.setFillColor(...COLOR.accentDark);
    doc.rect(ox + 2.5 * s, oy + 9.5 * s, 25 * s, 1 * s, "F");

    // Left loading bay door
    doc.setFillColor(...COLOR.headerBg);
    doc.roundedRect(
      ox + 3.5 * s,
      oy + 13 * s,
      7.5 * s,
      7 * s,
      0.4 * s,
      0.4 * s,
      "F",
    );
    doc.setFillColor(...COLOR.accentDark);
    doc.rect(ox + 3.5 * s, oy + 13 * s, 7.5 * s, 1 * s, "F");

    // Right loading bay door
    doc.setFillColor(...COLOR.headerBg);
    doc.roundedRect(
      ox + 19 * s,
      oy + 13 * s,
      7.5 * s,
      7 * s,
      0.4 * s,
      0.4 * s,
      "F",
    );
    doc.setFillColor(...COLOR.accentDark);
    doc.rect(ox + 19 * s, oy + 13 * s, 7.5 * s, 1 * s, "F");

    // Central window
    doc.setFillColor(...COLOR.headerBg);
    doc.roundedRect(
      ox + 12.5 * s,
      oy + 13 * s,
      5 * s,
      4 * s,
      0.4 * s,
      0.4 * s,
      "F",
    );
    // Window panes
    doc.setFillColor(30, 58, 138);
    doc.rect(ox + 13 * s, oy + 13.5 * s, 1.6 * s, 3 * s, "F");
    doc.rect(ox + 15.2 * s, oy + 13.5 * s, 1.6 * s, 3 * s, "F");

    // Rooftop vent / chimney
    doc.setFillColor(...COLOR.accentDark);
    doc.roundedRect(
      ox + 22 * s,
      oy + 4 * s,
      2.5 * s,
      5 * s,
      0.4 * s,
      0.4 * s,
      "F",
    );

    // Diamond accent on roof
    doc.setFillColor(...COLOR.accentMid);
    doc.triangle(
      ox + 15 * s,
      oy + 5 * s,
      ox + 16.5 * s,
      oy + 7 * s,
      ox + 15 * s,
      oy + 9 * s,
      "F",
    );
    doc.triangle(
      ox + 15 * s,
      oy + 5 * s,
      ox + 13.5 * s,
      oy + 7 * s,
      ox + 15 * s,
      oy + 9 * s,
      "F",
    );
  }

  // ─── Main PDF Generator ───────────────────────────────────────────────────────

  function generateWSMSReport(
    data: Record<string, unknown>[],
    activeReport: string,
  ) {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const PW = 210; // page width
    const PH = 297; // page height
    const ML = 10; // margin left
    const MR = 10; // margin right
    const CW = PW - ML - MR; // content width

    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    // ── Detect status column for badge coloring ────────────────────────────────
    const statusKey = headers.find((h) => /status|state|condition/i.test(h));

    function getStatusColors(val: string): { bg: RGB; fg: RGB } | null {
      if (!statusKey) return null;
      const v = String(val).toLowerCase();
      if (/in.?stock|active|complete|available/i.test(v))
        return { bg: COLOR.greenBg, fg: COLOR.green };
      if (/low|warn|pending|partial/i.test(v))
        return { bg: COLOR.amberBg, fg: COLOR.amber };
      if (/out|inactive|error|unavail/i.test(v))
        return { bg: COLOR.redBg, fg: COLOR.red };
      return null;
    }

    // ── HEADER BAR ──────────────────────────────────────────────────────────────
    doc.setFillColor(...COLOR.headerBg);
    doc.rect(0, 0, PW, 22, "F");

    // Logo
    drawWarehouseLogo(doc, ML, 1.5);

    // Vertical divider
    doc.setDrawColor(...COLOR.slate2);
    doc.setLineWidth(0.3);
    doc.line(ML + 26, 4, ML + 26, 18);

    // Brand name
    doc.setTextColor(...COLOR.white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("WSMS", ML + 29, 10.5);

    // Brand subtitle
    doc.setTextColor(148, 163, 184); // #94a3b8
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text("WAREHOUSE MANAGEMENT SYSTEM", ML + 29, 15.5);

    // Report type (right-aligned)
    const reportLabel = `${activeReport.toUpperCase()} REPORT`;
    doc.setTextColor(226, 232, 240);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(reportLabel, PW - MR, 9, { align: "right" });

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text("REPORT TYPE", PW - MR, 14.5, { align: "right" });

    // ── ACCENT STRIPE ──────────────────────────────────────────────────────────
    doc.setFillColor(...COLOR.accent);
    doc.rect(0, 22, PW, 1.2, "F");

    // slight lighter right portion
    doc.setFillColor(...COLOR.accentMid);
    doc.rect(PW * 0.6, 22, PW * 0.4, 1.2, "F");

    // ── META ROW ───────────────────────────────────────────────────────────────
    const metaY = 28;
    doc.setTextColor(...COLOR.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      `Generated: ${new Date().toLocaleString()}  |  Generated by: Admin`,
      ML,
      metaY,
    );

    // Confidential badge (right)
    const badgeW = 22;
    const badgeH = 4.5;
    const badgeX = PW - MR - badgeW;
    const badgeY = metaY - badgeH + 0.5;
    roundedRect(doc, badgeX, badgeY, badgeW, badgeH, 1.5, [239, 246, 255]);
    doc.setFillColor(...COLOR.accent);
    doc.circle(badgeX + 3.5, badgeY + badgeH / 2, 1, "F");
    doc.setTextColor(...COLOR.accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text("Confidential", badgeX + 6, badgeY + badgeH - 1.2);

    // Meta divider line
    doc.setDrawColor(...COLOR.border);
    doc.setLineWidth(0.3);
    doc.line(ML, metaY + 2, PW - MR, metaY + 2);

    // ── KPI CARDS ──────────────────────────────────────────────────────────────
    const kpiY = metaY + 5;
    const kpiH = 16;
    const kpiW = (CW - 8) / 3;
    const kpiGap = 4;

    const kpis = [
      { label: "TOTAL RECORDS", value: String(data.length), unit: "items" },
      { label: "REPORT TYPE", value: activeReport, unit: "" },
      { label: "GENERATED BY", value: "Admin", unit: "" },
    ];

    kpis.forEach((kpi, i) => {
      const kx = ML + i * (kpiW + kpiGap);

      // Card background
      roundedRect(doc, kx, kpiY, kpiW, kpiH, 2, COLOR.kpiBg, COLOR.border, 0.3);

      // Top accent bar
      doc.setFillColor(...COLOR.accent);
      doc.roundedRect(kx, kpiY, kpiW, 1.5, 1.5, 1.5, "F");
      doc.rect(kx, kpiY + 0.5, kpiW, 1, "F"); // square bottom of accent

      // Label
      doc.setTextColor(...COLOR.muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.text(kpi.label, kx + 4, kpiY + 6);

      // Value
      doc.setTextColor(...COLOR.text);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(kpi.value.length > 8 ? 9 : 12);
      doc.text(kpi.value, kx + 4, kpiY + 13);

      // Unit suffix
      if (kpi.unit) {
        const valW = doc.getTextWidth(kpi.value);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...COLOR.muted);
        doc.text(kpi.unit, kx + 4 + valW + 1.5, kpiY + 13);
      }
    });

    // ── SECTION HEADER ─────────────────────────────────────────────────────────
    const secY = kpiY + kpiH + 6;
    doc.setTextColor(...COLOR.text);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(`${activeReport.toUpperCase()} RECORDS`, ML, secY);

    const secLabelW =
      doc.getTextWidth(`${activeReport.toUpperCase()} RECORDS`) + 3;
    doc.setDrawColor(...COLOR.border);
    doc.setLineWidth(0.3);
    doc.line(ML + secLabelW, secY - 0.5, PW - MR, secY - 0.5);

    // ── DATA TABLE ─────────────────────────────────────────────────────────────
    const tableStartY = secY + 3;

    // Build column styles — mark the status column
    const columnStyles: Record<number, object> = {};
    headers.forEach((h, i) => {
      if (h === statusKey) columnStyles[i] = { cellWidth: 24 };
    });

    // Quantity column detection
    const qtyKey = headers.find((h) => /qty|quantity|stock|count/i.test(h));
    let qtyMaxVal = 1;
    if (qtyKey) {
      data.forEach((row) => {
        const v = Number(row[qtyKey]);
        if (!isNaN(v) && v > qtyMaxVal) qtyMaxVal = v;
      });
    }

    autoTable(doc, {
      startY: tableStartY,
      head: [headers],
      body: data.map((row) => headers.map((h) => String(row[h] ?? ""))),

      margin: { left: ML, right: MR },

      styles: {
        fontSize: 7.5,
        cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
        textColor: COLOR.text,
        font: "helvetica",
        lineColor: COLOR.border,
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: COLOR.accent,
        textColor: COLOR.white,
        fontStyle: "bold",
        fontSize: 7,
        cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
      },

      alternateRowStyles: {
        fillColor: COLOR.rowAlt,
      },

      columnStyles,

      // Per-cell custom rendering
      didParseCell(data) {
        // Make header text uppercase
        if (data.section === "head") {
          data.cell.text = [String(data.cell.text[0]).toUpperCase()];
        }
      },

      didDrawCell(data) {
        if (data.section !== "body") return;

        const colKey = headers[data.column.index];
        const cellVal = String((data.row.raw as any[])[data.column.index]);

        // Status badge coloring
        if (colKey === statusKey) {
          const colors = getStatusColors(cellVal);
          if (colors) {
            // Clear the default text (we re-draw it as a badge)
            doc.setFillColor(
              data.row.index % 2 === 0 ? COLOR.white[0] : COLOR.rowAlt[0],
              data.row.index % 2 === 0 ? COLOR.white[1] : COLOR.rowAlt[1],
              data.row.index % 2 === 0 ? COLOR.white[2] : COLOR.rowAlt[2],
            );
            doc.rect(
              data.cell.x + 0.5,
              data.cell.y + 0.5,
              data.cell.width - 1,
              data.cell.height - 1,
              "F",
            );

            drawBadge(
              doc,
              cellVal,
              data.cell.x + 2,
              data.cell.y + data.cell.height - 2.2,
              colors.bg,
              colors.fg,
            );
          }
        }

        // Quantity mini-bar
        if (colKey === qtyKey) {
          const qty = parseFloat(cellVal);
          if (!isNaN(qty)) {
            drawQtyBar(
              doc,
              qty,
              qtyMaxVal,
              data.cell.x + 2,
              data.cell.y + data.cell.height - 1.5,
              Math.min(data.cell.width - 6, 22),
              2,
            );
          }
        }
      },
    });

    // ── FOOTER (all pages) ─────────────────────────────────────────────────────
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      const footerY = PH - 8;

      // Footer background
      doc.setFillColor(...COLOR.headerBg);
      doc.rect(0, PH - 11, PW, 11, "F");

      // Left: confidentiality
      doc.setTextColor(...COLOR.slate);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text("WSMS CONFIDENTIAL", ML, footerY);

      // Center: domain
      doc.setTextColor(...COLOR.slate2);
      doc.setFontSize(6);
      doc.text("◇  wsms.internal  ◇", PW / 2, footerY, { align: "center" });

      // Right: page number
      doc.setTextColor(...COLOR.slate);
      doc.setFontSize(6.5);
      doc.text(`Page ${i} of ${pageCount}`, PW - MR, footerY, {
        align: "right",
      });

      // Footer top separator line (accent)
      doc.setDrawColor(...COLOR.accent);
      doc.setLineWidth(0.4);
      doc.line(0, PH - 11, PW, PH - 11);
    }

    // ── SAVE ───────────────────────────────────────────────────────────────────
    doc.save(`${activeReport.toLowerCase()}-report.pdf`);
  }

  function handleExport(format: string) {
    setExporting(format);

    try {
      let rawData: any[] = [];

      if (activeReport === "inbound" || activeReport === "outbound" || activeReport === "stock" || activeReport === "utilization") {
        rawData = filteredData;
      }

      if (!rawData || rawData.length === 0) {
        toast.error("No data to export");
        return;
      }

      // Transform data: Add SR No. and format dates
      const data = rawData.map((row, index) => {
        const newRow: any = { "SR No.": index + 1 };
        for (const [key, value] of Object.entries(row)) {
          let val = value;
          // Check if value is a date string
          if (typeof val === 'string' && (key.toLowerCase().includes('date') || key.toLowerCase().includes('time') || key.toLowerCase() === 'timestamp' || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val))) {
            const d = new Date(val);
            if (!isNaN(d.getTime())) {
              const day = String(d.getDate()).padStart(2, '0');
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const year = d.getFullYear();
              val = `${day}/${month}/${year}`;
            }
          }
          newRow[key] = val;
        }
        return newRow;
      });

      // ================= CSV =================
      if (format === "CSV") {
        const headers = Object.keys(data[0]);
        const csvRows = [
          headers.join(","),
          ...data.map((row) =>
            headers.map((field) => `"${row[field] ?? ""}"`).join(","),
          ),
        ];

        const blob = new Blob([csvRows.join("\n")], {
          type: "text/csv;charset=utf-8;",
        });
        saveAs(blob, `${activeReport}-report.csv`);
      }

      // ================= EXCEL =================
      else if (format === "Excel") {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, `${activeReport}-report.xlsx`);
      }

      // ================= PDF =================
      //     else if (format === "PDF") {
      //   const doc = new jsPDF();

      //   const headers = Object.keys(data[0]);

      // // ===== HEADER BACKGROUND =====
      // doc.setFillColor(15, 23, 42);
      // doc.rect(0, 0, 210, 25, "F");

      // // ===== DRAW WAREHOUSE ICON (SVG STYLE) =====
      // doc.setDrawColor(255, 255, 255);
      // doc.setFillColor(255, 255, 255);

      // // Roof
      // doc.triangle(10, 14, 16, 8, 22, 14, "F");

      // // Building base
      // doc.rect(11, 14, 10, 7, "F");

      // // Door
      // doc.setFillColor(15, 23, 42);
      // doc.rect(14, 16, 4, 5, "F");

      // // Reset text color
      // doc.setTextColor(255, 255, 255);

      // // ===== BRAND NAME =====
      // doc.setFontSize(16);
      // doc.text("WSMS", 26, 12);

      // doc.setFontSize(10);
      // doc.text("Warehouse Management System", 26, 18);

      //   // ===== REPORT TITLE =====
      //   doc.setFontSize(12);
      //   doc.text(`${activeReport.toUpperCase()} REPORT`, 140, 15);

      //   // ===== DATE =====
      //   doc.setTextColor(120);
      //   doc.setFontSize(9);
      //   doc.text(`Generated: ${new Date().toLocaleString()}`, 10, 32);

      //   // ===== SUMMARY BOX (KPI STYLE) =====
      //   let yStart = 40;

      //   const summary = [
      //     ["Total Records", data.length],
      //     ["Report Type", activeReport],
      //     ["Generated By", "Admin"],
      //   ];

      //   summary.forEach((item, i) => {
      //     doc.setFillColor(241, 245, 249);
      //     doc.roundedRect(10 + i * 65, yStart, 60, 18, 3, 3, "F");

      //     doc.setTextColor(100);
      //     doc.setFontSize(8);
      //     doc.text(item[0], 12 + i * 65, yStart + 6);

      //     doc.setTextColor(0);
      //     doc.setFontSize(11);
      //     doc.text(String(item[1]), 12 + i * 65, yStart + 13);
      //   });

      //   // ===== TABLE =====
      //   autoTable(doc, {
      //     startY: yStart + 25,
      //     head: [headers],
      //     body: data.map(row => headers.map(h => String(row[h] ?? ""))),

      //     styles: {
      //       fontSize: 8,
      //       cellPadding: 3,
      //     },

      //     headStyles: {
      //       fillColor: [37, 99, 235],
      //       textColor: 255,
      //       fontStyle: "bold",
      //     },

      //     alternateRowStyles: {
      //       fillColor: [248, 250, 252],
      //     },

      //     margin: { left: 10, right: 10 },
      //   });

      //   // ===== FOOTER =====
      //   const pageCount = doc.getNumberOfPages();

      //   for (let i = 1; i <= pageCount; i++) {
      //     doc.setPage(i);

      //     doc.setFontSize(8);
      //     doc.setTextColor(150);

      //     doc.text(
      //       `WSMS Confidential`,
      //       10,
      //       290
      //     );

      //     doc.text(
      //       `Page ${i} of ${pageCount}`,
      //       170,
      //       290
      //     );
      //   }

      //   doc.save(`${activeReport}-report.pdf`);
      // }
      // Replace your old `else if (format === "PDF")` block with:
      else if (format === "PDF") {
        generateWSMSReport(data, activeReport);
      }
      toast.success(`${format} downloaded successfully`);
      addLog(
        "Admin",
        "Exported Report",
        `${activeReport}-report`,
        `Downloaded as ${format}`,
        "success",
      );
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    } finally {
      setExporting(null);
    }
  }
  // (Summary tables are now fully dynamic based on active report)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground">Reports</h1>
          <p className="text-[0.8125rem] text-muted-foreground">
            Warehouse analytics and reporting
          </p>
        </div>
        <div className="flex  gap-2">
          {["CSV", "Excel"].map((f) => (
            <button
              key={f}
              onClick={() => handleExport(f)}
              disabled={exporting === f}
              className="px-3 py-2 rounded-lg cursor-pointer bg-white/4 border border-white/6 text-[0.75rem] text-muted-foreground hover:text-foreground flex items-center gap-1.5 disabled:opacity-50"
            >
              {exporting === f ? (
                <Check size={12} className="text-green" />
              ) : (
                <Download size={12} />
              )}{" "}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Report Type Tabs & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {reportTypes.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveReport(r.id)}
            className={`px-4 py-2 cursor-pointer rounded-lg text-[0.8125rem] transition-colors ${activeReport === r.id ? "bg-blue/15 text-blue border border-blue/30" : "bg-white/3 text-muted-foreground border border-white/6 hover:text-foreground"}`}
          >
            {r.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <select
            value={skuFilter}
            onChange={(e) => setSkuFilter(e.target.value)}
            className="bg-secondary border cursor-pointer border-white/6 rounded-lg px-3 py-1.5 text-[0.8125rem] text-foreground"
          >
            <option value="all">All SKUs</option>
            {state.skus.slice(0, 10).map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
          <select
            value={rackFilter}
            onChange={(e) => setRackFilter(e.target.value)}
            className="bg-secondary border cursor-pointer border-white/6 rounded-lg px-3 py-1.5 text-[0.8125rem] text-foreground"
          >
            <option value="all">All Racks</option>
            {state.racks.slice(0, 10).map((r) => (
              <option key={r.id} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-secondary border cursor-pointer border-white/6 rounded-lg px-3 py-1.5 text-[0.8125rem] text-foreground"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          {isFiltered && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-1.5 rounded-lg bg-secondary border border-white/[0.06] text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <h3 className="text-foreground mb-4">Zone Utilization</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={graphsData.zoneUtilization}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="utilized"
                fill="#3b82f6"
                radius={[3, 3, 0, 0]}
                name="Utilized %"
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-foreground mb-4">SKU Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={graphsData.skuDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {graphsData.skuDistribution.map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5 xl:col-span-2">
          <h3 className="text-foreground mb-4">Inventory Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={graphsData.inventoryTrends}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="totalUnits"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Total Units"
              />
              <Line
                type="monotone"
                dataKey="inbound"
                stroke="#10b981"
                strokeWidth={2}
                name="Inbound"
              />
              <Line
                type="monotone"
                dataKey="outbound"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Outbound"
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Report Summary KPI Table */}
      <GlassCard className="overflow-x-auto">
        <div className="p-4 border-b border-white/6 flex items-center gap-2">
          <FileText size={16} className="text-blue" />
          <h3 className="text-foreground">Report Summary</h3>
        </div>
        {summaryData ? (
          <table className="w-full text-[0.8125rem]">
            <thead>
              <tr className="border-b border-white/6 bg-white/[0.02]">
                {["Metric", "Current", "Previous", "Change"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-muted-foreground font-medium uppercase text-xs tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'totalRacks', label: 'Total Racks', type: 'count' },
                { key: 'occupiedLevels', label: 'Occupied Levels', type: 'count' },
                { key: 'totalSKUs', label: 'Total SKUs', type: 'count' },
                { key: 'avgUtilization', label: 'Avg Utilization', type: 'percent' },
                { key: 'activeInvoices', label: 'Active Invoices', type: 'count' },
              ].map((metric) => {
                const data = summaryData[metric.key];
                if (!data) return null;

                const current = data.current;
                const prev = data.previous;
                let diff = current - prev;

                let changeStr = '';
                let isUp = diff >= 0;

                if (metric.type === 'percent') {
                  changeStr = `${diff > 0 ? '+' : ''}${diff}%`;
                } else {
                  let percentChange = prev > 0 ? Math.round((diff / prev) * 100) : (diff > 0 ? 100 : 0);
                  changeStr = `${diff >= 0 ? '+' : ''}${percentChange}%`;
                }

                return (
                  <tr key={metric.key} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{metric.label}</td>
                    <td className="px-4 py-3 text-foreground">
                      {current}{metric.type === 'percent' ? '%' : ''}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {prev}{metric.type === 'percent' ? '%' : ''}
                    </td>
                    <td className={`px-4 py-3 ${diff > 0 ? "text-green" : diff < 0 ? "text-red" : "text-green"}`}>
                      {changeStr}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-muted-foreground text-sm flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin mr-3"></div>
            Loading summary...
          </div>
        )}
      </GlassCard>

      {/* Detailed Report Table (Dynamic per Tab) */}
      {/* <GlassCard className="overflow-x-auto">
        <div className="p-4 border-b border-white/6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue" />
            <h3 className="text-foreground">Detailed Records - {reportTypes.find(r => r.id === activeReport)?.label}</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              type="text"
              placeholder="Search data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-secondary border border-white/6 rounded-lg text-[0.8125rem] text-foreground focus:border-accent outline-none"
            />
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground text-sm flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mr-3"></div>
            Loading data...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[0.8125rem]">
              <thead>
                <tr className="border-b border-white/6 bg-white/[0.02]">
                  {Object.keys(filteredData[0]).map((key) => (
                    <th key={key} className="px-4 py-3 text-left text-muted-foreground font-medium uppercase text-xs tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                    {Object.values(row).map((val: any, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 text-foreground whitespace-nowrap">
                        {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard> */}
    </div>
  );
}
