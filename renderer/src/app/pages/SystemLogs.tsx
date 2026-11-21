import { useState, useMemo, useEffect, useCallback } from "react";
import { GlassCard } from "../components/GlassCard";
import { useWarehouse } from "../context/WarehouseContext";
import { Filter, Search, Download, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  success: "bg-green/15 text-green",
  warning: "bg-yellow/15 text-yellow",
  error: "bg-red/15 text-red",
  info: "bg-blue/15 text-blue",
};

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  item: string;
  details: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface LogsResponse {
  success: boolean;
  data: {
    logs: LogEntry[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
    summaryCounts: {
      success: number;
      warning: number;
      error: number;
      info: number;
    };
  };
}

export function SystemLogs() {
  const { state, checkPermission, user } = useWarehouse();
  const [userFilter, setUserFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    success: 0,
    warning: 0,
    error: 0,
    info: 0,
  });
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<string[]>([]);

  const perPage = 20;
  const isFiltered = userFilter !== "all" || statusFilter !== "all" || actionFilter !== "all" || search !== "";
  const API_SERVER = 'http://localhost:3001';
  // Fetch available filters on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`${API_SERVER}/logs/metadata`, {
          headers: {
            'x-user-role': user?.role || 'UNKNOWN'
          }
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setAvailableActions(result.data.actions || []);
            setAvailableUsers(result.data.users || []);
          }
        }
      } catch (err) {
        console.error('Failed to fetch metadata:', err);
      }
    };
    fetchMetadata();
  }, [user?.role]);

  // Fetch logs when filters or page changes
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', perPage.toString());

        if (search) params.append('search', search);
        if (userFilter !== 'all') params.append('user', userFilter);
        if (actionFilter !== 'all') params.append('action', actionFilter);
        if (statusFilter !== 'all') params.append('status', statusFilter);

        console.log('[SystemLogs] Fetching from:', `${API_SERVER}/logs?${params.toString()}`);

        const response = await fetch(`${API_SERVER}/logs?${params.toString()}`, {
          headers: {
            'x-user-role': user?.role || 'UNKNOWN'
          }
        });

        console.log('[SystemLogs] Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`);
        }

        const result: any = await response.json();

        console.log('[SystemLogs] API Response:', result);

        if (result.success && result.data) {
          setLogs(result.data.logs);
          setTotalCount(result.data.pagination.totalCount);
          setTotalPages(result.data.pagination.totalPages);
          setStatusCounts(result.data.summaryCounts);
        } else {
          // Better error handling for failed responses
          const errorMsg = result.message || result.data?.message || 'Failed to fetch logs from backend';
          console.error('[SystemLogs] API Error:', errorMsg);
          throw new Error(errorMsg);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch logs';
        setError(errorMessage);
        console.error('Error fetching logs:', err);
        toast.error(errorMessage);

        // Set empty state when error occurs
        setLogs([]);
        setTotalCount(0);
        setTotalPages(0);
        setStatusCounts({ success: 0, warning: 0, error: 0, info: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [page, userFilter, actionFilter, statusFilter, search, user?.role]);

  function handleClearFilters() {
    setUserFilter("all");
    setStatusFilter("all");
    setActionFilter("all");
    setSearch("");
    setPage(1);
  }

  const handleExportLogs = useCallback(() => {
    if (logs.length === 0) {
      toast.info("No logs to export");
      return;
    }

    try {
      const headers = ["SR No.", "Timestamp", "User", "Action", "Item", "Details", "Status"];
      const csvContent = [
        headers.join(","),
        ...logs.map((log, index) => {
          const d = new Date(log.timestamp);
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          const formattedDate = !isNaN(d.getTime()) ? `${day}/${month}/${year}` : log.timestamp;

          return [
            index + 1,
            formattedDate,
            log.user,
            log.action,
            log.item,
            `"${log.details.replace(/"/g, '""')}"`, // Escape quotes in details
            log.status,
          ].join(",");
        }),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `system-logs-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${logs.length} log entries as CSV`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed';
      toast.error(errorMessage);
      console.error('Export error:', err);
    }
  }, [logs]);

  // Loading skeleton
  if (loading && logs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white/[0.04] rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-12 bg-white/[0.04] rounded-lg animate-pulse" />
        <div className="h-64 bg-white/[0.04] rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground">System Logs</h1>
          <p className="text-[0.8125rem] text-muted-foreground">{totalCount} audit entries</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportLogs}
            disabled={!checkPermission("Reports", "canCreate") || logs.length === 0}
            className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.06] text-muted-foreground hover:text-foreground rounded-lg text-[0.8125rem] flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={!checkPermission("Reports", "canCreate") ? "You do not have permission to export logs" : logs.length === 0 ? "No logs to export" : ""}
          >
            <Download size={16} /> Export Logs
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["success", "warning", "error", "info"] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            className={`p-3 rounded-lg border transition-colors text-center ${statusFilter === s ? `${statusColors[s]} border-current` : "border-white/[0.06] bg-white/[0.02]"}`}
          >
            <p className={`text-[1.25rem] ${statusFilter === s ? "" : s === "success" ? "text-green" : s === "warning" ? "text-yellow" : s === "error" ? "text-red" : "text-blue"}`}>
              {statusCounts[s] || 0}
            </p>
            <p className="text-[0.75rem] text-muted-foreground capitalize">{s}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap items-center gap-4">
        <Filter size={16} className="text-muted-foreground" />
        <div className="flex items-center gap-2">
          <Search size={14} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs (SKU, details)..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="bg-transparent border-none outline-none text-[0.8125rem] text-foreground placeholder:text-muted-foreground/50 w-40"
          />
        </div>
        <select
          value={userFilter}
          onChange={e => { setUserFilter(e.target.value); setPage(1); }}
          className="bg-secondary text-foreground text-[0.8125rem] rounded-lg px-3 py-1.5 border border-white/[0.06]"
        >
          <option value="all">All Users</option>
          {availableUsers.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select
          value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(1); }}
          className="bg-secondary text-foreground text-[0.8125rem] rounded-lg px-3 py-1.5 border border-white/[0.06]"
        >
          <option value="all">All Actions</option>
          {availableActions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        {isFiltered && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-white/[0.06] text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}
        <span className="ml-auto text-[0.75rem] text-muted-foreground">{totalCount} entries</span>
      </GlassCard>

      {/* Error State */}
      {error && (
        <GlassCard className="p-4 border border-red/20 bg-red/5">
          <p className="text-red text-[0.8125rem]">Error: {error}</p>
        </GlassCard>
      )}

      {/* Log Table */}
      <GlassCard className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-[0.8125rem]">
            No log entries match your filters
          </div>
        ) : (
          <table className="w-full text-[0.8125rem]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Timestamp", "User", "Action", "Item", "Details", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-[0.75rem]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-foreground">{log.user}</td>
                  <td className="px-4 py-3 text-foreground">{log.action}</td>
                  <td className="px-4 py-3 text-blue cursor-pointer hover:underline">{log.item}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[0.6875rem] ${statusColors[log.status]}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[0.8125rem] text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page + i - 2;
              if (p > totalPages || p < 1) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-[0.8125rem] transition-colors ${p === page ? "bg-blue/15 text-blue border border-blue/30" : "bg-white/[0.04] border border-white/[0.06] text-muted-foreground hover:text-foreground"}`}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[0.8125rem] text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
          >
            Next
          </button>
          <span className="text-[0.75rem] text-muted-foreground ml-2">
            Page {page} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
