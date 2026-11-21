import { useState, useEffect, useCallback, useRef } from "react";
import { GlassCard } from "./GlassCard";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Filter, Calendar, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown,
  Clock, Package, MapPin, User, Activity, Loader2, X, History,
  Printer, Eye, Download, Barcode
} from "lucide-react";
import { useWarehouse } from "../context/WarehouseContext";
import JsBarcode from "jsbarcode";

const API_SERVER = 'http://localhost:3001';

interface TransactionRecord {
  id: string;
  dateTime: string;
  skuCode: string;
  productName: string;
  category: string;
  quantity: number;
  rackLocation: string;
  operator: string;
  status: string;
  actionType: 'INWARD' | 'OUTWARD';
  barcodeValue: string | null;
  barcodeNumber: string | null;
  skuBarcode: string | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface InventoryHistoryTableProps {
  /** Filter to show only INWARD, OUTWARD, or both (null) */
  transactionType: 'INWARD' | 'OUTBOUND' | null;
  /** Accent color class name for the header */
  accentColor?: string;
  /** Change this value to trigger a data re-fetch from the parent */
  refreshKey?: number;
  /** Optional external rack filter (e.g., from Outbound form) */
  externalRackFilter?: string;
}

export function InventoryHistoryTable({ transactionType, accentColor = "text-blue", refreshKey = 0, externalRackFilter = "" }: InventoryHistoryTableProps) {
  const { user } = useWarehouse();

  // Data state
  const [records, setRecords] = useState<TransactionRecord[]>([]);

  // Barcode modal state
  const [barcodeModalRecord, setBarcodeModalRecord] = useState<TransactionRecord | null>(null);
  const barcodeModalCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render barcode in modal when record changes
  useEffect(() => {
    if (!barcodeModalRecord || !barcodeModalCanvasRef.current) return;
    const code = barcodeModalRecord.barcodeNumber || barcodeModalRecord.barcodeValue || barcodeModalRecord.skuBarcode;
    if (!code) return;
    try {
      JsBarcode(barcodeModalCanvasRef.current, code, {
        format: "CODE128", width: 2, height: 80, displayValue: true, fontSize: 14, margin: 10
      });
    } catch (e) { console.error('Barcode render error:', e); }
  }, [barcodeModalRecord]);

  // Print a single barcode label
  const handlePrintBarcode = (record: TransactionRecord) => {
    const code = record.barcodeNumber || record.barcodeValue || record.skuBarcode;
    if (!code) { return; }
    const canvas = document.createElement('canvas');
    try { JsBarcode(canvas, code, { format: "CODE128", width: 1.5, height: 60, displayValue: true, fontSize: 10, margin: 5 }); } catch (e) { return; }
    const imgSrc = canvas.toDataURL('image/png');
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:-10000px;bottom:-10000px';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><title>Print Label</title><style>
      @page{size:auto;margin:5mm}body{font-family:Arial,sans-serif;margin:0;background:#fff;color:#000;text-align:center;padding:15px}
      .sku{font-size:20px;font-weight:bold;margin-bottom:3px}.name{font-size:13px;color:#444;margin-bottom:5px}
      .rack{font-size:15px;font-weight:bold;color:#1a73e8;margin-bottom:10px}
      img{max-width:100%;height:auto}.bid{font-size:9px;color:#888;margin-top:5px}
    </style></head><body>
      <div class="sku">${record.skuCode}</div>
      <div class="name">${record.productName}</div>
      <div class="rack">${record.rackLocation}</div>
      <img src="${imgSrc}" />
      <div class="bid">${code}</div>
      <script>window.onload=()=>setTimeout(()=>window.print(),200);<\/script>
    </body></html>`);
    doc.close();
    setTimeout(() => { if (document.body.contains(iframe)) document.body.removeChild(iframe); }, 15000);
  };

  // Download barcode as PNG
  const handleDownloadBarcode = (record: TransactionRecord) => {
    const code = record.barcodeNumber || record.barcodeValue || record.skuBarcode;
    if (!code) return;
    const canvas = document.createElement('canvas');
    try { JsBarcode(canvas, code, { format: "CODE128", width: 2, height: 80, displayValue: true, fontSize: 12, margin: 10 }); } catch (e) { return; }
    const link = document.createElement('a');
    link.download = `barcode-${record.skuCode}-${code}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1, totalPages: 1, totalCount: 0, limit: 10, hasNext: false, hasPrev: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [rackFilter, setRackFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    if (externalRackFilter !== undefined) {
      setRackFilter(externalRackFilter);
      setCurrentPage(1);
    }
  }, [externalRackFilter]);

  // Sort state
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch data
  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(entriesPerPage));
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      if (transactionType) {
        // Map OUTBOUND -> OUTWARD for the backend enum
        const apiType = transactionType === 'OUTBOUND' ? 'OUTWARD' : transactionType;
        params.set("type", apiType);
      }
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (rackFilter) params.set("rack", rackFilter);
      if (fromDate) params.set("fromDate", fromDate);
      if (toDate) params.set("toDate", toDate);

      const res = await fetch(`${API_SERVER}/api/transactions/history?${params.toString()}`, {
        headers: {
          'x-user-role': user?.role || 'ADMIN'
        }
      });
      const json = await res.json();

      if (json.success) {
        setRecords(json.data.transactions);
        setPagination(json.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, entriesPerPage, sortBy, sortOrder, transactionType, debouncedSearch, rackFilter, fromDate, toDate, user?.role, refreshKey]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, rackFilter, fromDate, toDate, entriesPerPage]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setRackFilter("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const hasActiveFilters = search || rackFilter || fromDate || toDate;

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true
    });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      success: { bg: "bg-green/15", text: "text-green", label: "Success" },
      failed: { bg: "bg-red/15", text: "text-red", label: "Failed" },
      pending: { bg: "bg-yellow/15", text: "text-yellow", label: "Pending" }
    };
    const s = map[status] || map.success;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[0.7rem] font-medium ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const isInward = type === "INWARD";
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[0.7rem] font-medium ${isInward ? "bg-blue/15 text-blue" : "bg-yellow/15 text-yellow"}`}>
        {isInward ? "Inbound" : "Outbound"}
      </span>
    );
  };

  // Page numbers to show
  const getPageNumbers = () => {
    const pages: number[] = [];
    const total = pagination.totalPages;
    const current = pagination.currentPage;

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (current >= total - 2) {
        pages.push(total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(current - 2, current - 1, current, current + 1, current + 2);
      }
    }
    return pages;
  };

  const tableTitle = transactionType === 'INWARD'
    ? 'Inbound History'
    : transactionType === 'OUTBOUND'
      ? 'Outbound History'
      : 'Transaction History';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <GlassCard className="p-0">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <History size={20} className={accentColor} />
              <h3 className="text-foreground">{tableTitle}</h3>
              {pagination.totalCount > 0 && (
                <span className="text-[0.7rem] text-muted-foreground bg-white/[0.04] px-2 py-0.5 rounded-full">
                  {pagination.totalCount} records
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="text"
                  placeholder="Search SKU / Product..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-secondary border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground/40 focus:border-blue/40 focus:ring-1 focus:ring-blue/20 transition-all outline-none w-[200px]"
                />
              </div>
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[0.75rem] border transition-colors cursor-pointer
                  ${showFilters || hasActiveFilters
                    ? "bg-blue/10 border-blue/30 text-blue"
                    : "bg-white/[0.03] border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-white/10"
                  }`}
              >
                <Filter size={14} />
                Filters
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 bg-blue rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 mt-4 border-t border-white/[0.04]">
                  {/* From Date */}
                  <div>
                    <label className="text-[0.7rem] text-muted-foreground block mb-1.5">From Date</label>
                    <div className="relative">
                      <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                      <input
                        type="date"
                        value={fromDate}
                        onChange={e => setFromDate(e.target.value)}
                        className="w-full bg-secondary border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-[0.75rem] text-foreground focus:border-blue/40 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* To Date */}
                  <div>
                    <label className="text-[0.7rem] text-muted-foreground block mb-1.5">To Date</label>
                    <div className="relative">
                      <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                      <input
                        type="date"
                        value={toDate}
                        onChange={e => setToDate(e.target.value)}
                        className="w-full bg-secondary border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-[0.75rem] text-foreground focus:border-blue/40 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Rack Filter */}
                  <div>
                    <label className="text-[0.7rem] text-muted-foreground block mb-1.5">Rack Location</label>
                    <div className="relative">
                      <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                      <input
                        type="text"
                        placeholder="e.g., RACK-A1, B2..."
                        value={rackFilter}
                        onChange={e => setRackFilter(e.target.value)}
                        className="w-full bg-secondary border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground/40 focus:border-blue/40 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      disabled={!hasActiveFilters}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[0.75rem] border border-white/[0.06] bg-white/[0.03] text-muted-foreground hover:text-foreground hover:border-white/10 transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <X size={13} />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative" style={{ maxHeight: "480px", overflowY: "auto" }}>
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10">
              <tr className="bg-secondary/80 backdrop-blur-sm border-b border-white/[0.06]">
                {[
                  { key: "timestamp", label: "Date & Time", icon: <Clock size={12} /> },
                  { key: "skuCode", label: "SKU", icon: <Package size={12} /> },
                  { key: "productName", label: "Product Name", icon: null },
                  { key: "quantity", label: "Qty", icon: null },
                  { key: "rackLocation", label: "Rack History", icon: <MapPin size={12} /> },
                  // { key: "barcodeNumber", label: "Barcode", icon: <Barcode size={12} /> },
                  { key: "operator", label: "Operator", icon: <User size={12} /> },
                  { key: "status", label: "Status", icon: null },
                  { key: "actionType", label: "Type", icon: <Activity size={12} /> },
                  { key: "actions", label: "Actions", icon: null },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => (col.key === "timestamp" || col.key === "quantity") ? handleSort(col.key) : null}
                    className={`px-4 py-3 text-[0.7rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap
                      ${(col.key === "timestamp" || col.key === "quantity") ? "cursor-pointer hover:text-foreground transition-colors select-none" : ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.icon}
                      <span>{col.label}</span>
                      {(col.key === "timestamp" || col.key === "quantity") && (
                        sortBy === col.key
                          ? sortOrder === "desc" ? <ArrowDown size={11} className="text-blue" /> : <ArrowUp size={11} className="text-blue" />
                          : <ArrowUpDown size={11} className="opacity-30" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={24} className="text-blue animate-spin" />
                      <p className="text-[0.8125rem] text-muted-foreground">Loading records...</p>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <History size={32} className="text-muted-foreground/30" />
                      <p className="text-[0.8125rem] text-muted-foreground">No transaction records found</p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-[0.75rem] text-blue hover:underline cursor-pointer"
                        >
                          Clear filters to see all records
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                records.map((record, idx) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-[0.75rem] text-foreground whitespace-nowrap">
                      {formatDateTime(record.dateTime)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[0.75rem] font-mono text-cyan bg-cyan/10 px-2 py-0.5 rounded">
                        {record.skuCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[0.75rem] text-foreground max-w-[180px] truncate" title={record.productName}>
                      {record.productName}
                    </td>
                    <td className="px-4 py-3 text-[0.75rem] text-foreground font-medium">
                      {record.quantity}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[0.75rem] font-mono text-purple bg-purple/10 px-2 py-0.5 rounded">
                        {record.rackLocation}
                      </span>
                    </td>
                    {/* <td className="px-4 py-3">
                      {record.barcodeNumber ? (
                        <span className="text-[0.7rem] font-mono text-orange bg-orange/10 px-2 py-0.5 rounded" title={record.barcodeValue || ''}>
                          {record.barcodeNumber}
                        </span>
                      ) : (
                        <span className="text-[0.7rem] text-muted-foreground/40">—</span>
                      )}
                    </td> */}
                    <td className="px-4 py-3 text-[0.75rem] text-muted-foreground">
                      {record.operator}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-4 py-3">
                      {getTypeBadge(record.actionType)}
                    </td>
                    <td className="px-4 py-3">
                      {record.barcodeNumber ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setBarcodeModalRecord(record)}
                            title="View Barcode"
                            className="p-1.5 rounded-md bg-blue/10 border border-blue/20 text-blue hover:bg-blue/20 transition-colors cursor-pointer"
                          >
                            <Eye size={12} />
                          </button>
                          <button
                            onClick={() => handlePrintBarcode(record)}
                            title="Print Barcode"
                            className="p-1.5 rounded-md bg-green/10 border border-green/20 text-green hover:bg-green/20 transition-colors cursor-pointer"
                          >
                            <Printer size={12} />
                          </button>
                          <button
                            onClick={() => handleDownloadBarcode(record)}
                            title="Download Barcode"
                            className="p-1.5 rounded-md bg-purple/10 border border-purple/20 text-purple hover:bg-purple/20 transition-colors cursor-pointer"
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[0.7rem] text-muted-foreground/40">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
          {/* Entries per page */}
          <div className="flex items-center gap-2">
            <span className="text-[0.7rem] text-muted-foreground">Show</span>
            <select
              value={entriesPerPage}
              onChange={e => setEntriesPerPage(Number(e.target.value))}
              className="bg-secondary border border-white/[0.06] rounded-lg px-2 py-1.5 text-[0.75rem] text-foreground focus:border-blue/40 outline-none cursor-pointer"
            >
              {[10, 25, 50].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-[0.7rem] text-muted-foreground">entries</span>
          </div>

          {/* Page info */}
          <div className="text-[0.7rem] text-muted-foreground">
            Showing {records.length > 0 ? ((pagination.currentPage - 1) * pagination.limit) + 1 : 0}
            –{Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount}
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={!pagination.hasPrev}
              className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrev}
              className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`min-w-[32px] h-[32px] rounded-lg text-[0.75rem] font-medium transition-colors cursor-pointer
                  ${pageNum === pagination.currentPage
                    ? "bg-blue text-white border border-blue/50"
                    : "border border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                  }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={!pagination.hasNext}
              className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(pagination.totalPages)}
              disabled={!pagination.hasNext}
              className="p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </GlassCard>
      {/* Barcode Preview Modal */}
      <AnimatePresence>
        {barcodeModalRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            onClick={() => setBarcodeModalRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Barcode size={18} className="text-orange" />
                  <h3 className="text-foreground font-semibold text-[0.9rem]">Barcode Details</h3>
                </div>
                <button
                  onClick={() => setBarcodeModalRecord(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Barcode Image */}
                <div className="flex justify-center rounded-xl p-4">
                  <canvas ref={barcodeModalCanvasRef} />
                </div>

                {/* Details Grid */}
                <div className="space-y-2.5">
                  {[
                    { label: "Barcode Number", value: barcodeModalRecord.barcodeNumber },
                    { label: "SKU Code", value: barcodeModalRecord.skuCode },
                    { label: "Product Name", value: barcodeModalRecord.productName },
                    { label: "Rack Location", value: barcodeModalRecord.rackLocation },
                    { label: "Transaction ID", value: barcodeModalRecord.id?.slice(0, 8) + '...' },
                    { label: "Date", value: new Date(barcodeModalRecord.dateTime).toLocaleString() },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-1.5 border-b border-white/[0.04]">
                      <span className="text-[0.75rem] text-muted-foreground">{item.label}</span>
                      <span className="text-[0.75rem] text-foreground font-medium">{item.value || '—'}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => { handlePrintBarcode(barcodeModalRecord); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green/15 border border-green/30 rounded-lg text-[0.8rem] text-green hover:bg-green/25 transition-colors font-medium cursor-pointer"
                  >
                    <Printer size={14} /> Print Label
                  </button>
                  <button
                    onClick={() => { handleDownloadBarcode(barcodeModalRecord); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple/15 border border-purple/30 rounded-lg text-[0.8rem] text-purple hover:bg-purple/25 transition-colors font-medium cursor-pointer"
                  >
                    <Download size={14} /> Download PNG
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
