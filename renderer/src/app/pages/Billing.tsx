import { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import { MetricCard } from "../components/MetricCard";
import { useWarehouse } from "../context/WarehouseContext";
import { type Invoice } from "../data/mockData";
import { Receipt, DollarSign, Clock, CheckCircle, FileText, Download, X, Plus, Upload, Edit, RefreshCw, AlertCircle, Printer } from "lucide-react";
import { blockNonNumeric } from "../utils/inputHelpers";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";
import { api } from "../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function Billing() {
  const { dispatch, addLog } = useWarehouse();

  const [invoices, setInvoices] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalInvoices: 0, paidInvoices: 0, pendingInvoices: 0 });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);

  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending">("all");
  const [generateStep, setGenerateStep] = useState<"none" | "selection" | "manual" | "csv">("none");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<{ valid: any[], invalid: any[], total: number } | null>(null);
  const [isCsvUploading, setIsCsvUploading] = useState(false);
  const [isCsvSaving, setIsCsvSaving] = useState(false);
  const [manualForm, setManualForm] = useState({
    orderId: "",
    sku: "",
    product: "",
    rackHistory: "",
    duration: "",
    weightCharges: "",
    rackCharges: "",
    date: "",
    status: "pending" as "pending" | "paid",
    customerId: "",
    gstPercent: "18"
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [customers, setCustomers] = useState<any[]>([]);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    gstNumber: "",
    address: "",
    email: "",
    phone: ""
  });
  const [customerFormErrors, setCustomerFormErrors] = useState<Record<string, string>>({});
  const [savingCustomer, setSavingCustomer] = useState(false);

  const loadCustomers = async () => {
    try {
      const res = await api.getCustomers();
      if (res?.success) {
        setCustomers(res.customers || []);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  };

  const handleSaveCustomer = async () => {
    const errors: Record<string, string> = {};
    if (!customerForm.name) errors.name = "Required";
    if (!customerForm.address) errors.address = "Required";
    setCustomerFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingCustomer(true);
    try {
      const res = await api.createCustomer(customerForm);
      if (res?.success) {
        toast.success(`Customer "${customerForm.name}" created successfully`);
        setCustomerForm({ name: "", gstNumber: "", address: "", email: "", phone: "" });
        setShowAddCustomerModal(false);
        await loadCustomers();
        addLog("Admin", "Added Customer", customerForm.name, "New customer profile created", "success");
      } else {
        toast.error(res?.message || "Failed to create customer");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSavingCustomer(false);
    }
  };

  function handlePrintInvoice(invoice: any) {
    const subtotal = (Number(invoice.weightCharges) || 0) + (Number(invoice.rackCharges) || 0);
    const gstPercent = Number(invoice.gstPercent) || 0;
    const gstAmount = subtotal * (gstPercent / 100);
    const grandTotal = subtotal + gstAmount;

    // Date Formatting (DD/MM/YYYY with zero-padding)
    let formattedDate = invoice.date;
    if (typeof formattedDate === 'string') {
      const d = new Date(formattedDate);
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        formattedDate = `${day}/${month}/${year}`;
      }
    }

    const companyDetailsHtml = invoice.companyName
      ? `
        <div>
          <strong>Company Details:</strong><br />
          ${invoice.companyName}<br />
          GSTIN: ${invoice.companyGst}<br />
          Address: ${invoice.companyAddr}<br />
          ${invoice.companyEmail ? `Email: ${invoice.companyEmail}<br />` : ''}
          ${invoice.companyPhone ? `Phone: ${invoice.companyPhone}` : ''}
        </div>
      `
      : `
        <div>
          <strong>Company Details:</strong><br />
          Acme Corp (Not Configured)<br />
        </div>
      `;

    const customerDetailsHtml = invoice.customerName
      ? `
        <div>
          <strong>Customer Details:</strong><br />
          ${invoice.customerName}<br />
          GST Number: ${invoice.customerGst || 'N/A'}<br />
          Address: ${invoice.customerAddr}<br />
          ${invoice.customerEmail ? `Email: ${invoice.customerEmail}<br />` : ''}
          ${invoice.customerPhone ? `Phone: ${invoice.customerPhone}` : ''}
        </div>
      `
      : `
        <div>
          <strong>Customer Details:</strong><br />
          N/A (Walk-in Customer)<br />
        </div>
      `;

    const printHtml = `
      <html>
        <head>
          <title>Invoice - ${invoice.id}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #1e293b;
              margin: 0;
              padding: 40px;
              font-size: 14px;
              line-height: 1.5;
            }
            .header {
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .header h1 {
              margin: 0;
              color: #1d4ed8;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.05em;
            }
            .invoice-meta {
              text-align: right;
            }
            .invoice-meta div {
              margin-bottom: 5px;
            }
            .parties {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            .parties div {
              padding: 20px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
            }
            .parties strong {
              color: #1e3a8a;
              display: block;
              margin-bottom: 8px;
              font-size: 15px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background-color: #3b82f6;
              color: #fff;
              text-align: left;
              padding: 12px;
              font-weight: 600;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e2e8f0;
            }
            .summary-container {
              display: flex;
              justify-content: flex-end;
            }
            .summary-table {
              width: 300px;
              margin-bottom: 0;
            }
            .summary-table td {
              padding: 8px 12px;
              border: none;
            }
            .summary-table tr.total-row td {
              font-weight: bold;
              font-size: 16px;
              border-top: 2px solid #3b82f6;
              color: #1d4ed8;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-paid {
              background-color: #d1fae5;
              color: #065f46;
            }
            .status-pending {
              background-color: #fef3c7;
              color: #92400e;
            }
            @media print {
              body {
                padding: 0;
              }
              .header {
                border-bottom-color: #000;
              }
              th {
                background-color: #f1f5f9 !important;
                color: #000 !important;
                border-bottom: 2px solid #000;
              }
              .parties div {
                background: none !important;
                border-color: #ccc !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>INVOICE</h1>
              <div style="margin-top: 5px; color: #64748b;">WSMS Warehouse Billing System</div>
            </div>
            <div class="invoice-meta">
              <div><strong>Invoice No:</strong> ${invoice.id}</div>
              <div><strong>Order ID:</strong> ${invoice.orderId}</div>
              <div><strong>Date:</strong> ${formattedDate}</div>
              <div>
                <strong>Status:</strong> 
                <span class="status-badge ${invoice.status.toLowerCase() === 'paid' ? 'status-paid' : 'status-pending'}">
                  ${invoice.status}
                </span>
              </div>
            </div>
          </div>

          <div class="parties">
            ${companyDetailsHtml}
            ${customerDetailsHtml}
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>SKU</th>
                <th>Rack History</th>
                <th>Duration</th>
                <th style="text-align: right;">Charges</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Storage Charges</strong><br />
                  <span style="font-size: 12px; color: #64748b;">Product: ${invoice.productName}</span>
                </td>
                <td>${invoice.skuName || '-'}</td>
                <td>${invoice.rackHistory}</td>
                <td>${invoice.storageDuration} days</td>
                <td style="text-align: right;">
                  Weight Charges: $${invoice.weightCharges.toFixed(2)}<br />
                  Rack Charges: $${invoice.rackCharges.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          <div class="summary-container">
            <table class="summary-table">
              <tr>
                <td>Subtotal:</td>
                <td style="text-align: right;">$${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>GST (${gstPercent}%):</td>
                <td style="text-align: right;">$${gstAmount.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td>Total Amount:</td>
                <td style="text-align: right;">$${grandTotal.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 80px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            Thank you for your business! This is a system-generated invoice.
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
    } else {
      toast.error("Popup blocker prevented printing. Please allow popups for this app.");
    }
  }

  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMSG(null);
    try {
      const [invRes, sumRes, revRes, volRes] = await Promise.all([
        api.getInvoices(),
        api.getInvoicesSummary(),
        api.getInvoicesMonthlyRevenue(),
        api.getInvoicesMonthlyVolume(),
        loadCustomers()
      ]);
      console.log("Paid inbvouce", invRes)

      if (invRes.success && sumRes.success && revRes.success && volRes.success) {
        setInvoices(invRes.invoices);
        setSummary(sumRes.summary);
        setRevenueData(revRes.data);
        setVolumeData(volRes.data);
      } else {
        setErrorMSG(invRes.message || sumRes.message || revRes.message || volRes.message || "Failed to load dashboard data");
      }
    } catch (err: any) {
      setErrorMSG(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const filtered = statusFilter === "all" ? invoices : invoices.filter(i => i.status.toLowerCase() === statusFilter);
  const pendingAmount = invoices.filter(i => i.status.toLowerCase() === "pending").reduce((a, i) => a + Number(i.totalAmount || 0), 0);

  async function markPaid(id: string) {
    const res = await api.updateInvoiceStatus({ id, status: 'paid' });
    if (res.success) {
      setSelectedInvoice(null);
      toast.success("Invoice marked as paid");
      addLog("Admin", "Marked Invoice Paid", id, "Payment confirmed", "success");
      loadDashboardData();
    } else {
      toast.error(res.message || "Failed to mark paid");
    }
  }

  function handleExport(invoice: any, format: "PDF" | "CSV" | "Excel" = "PDF") {
    try {
      // Prepare Row Data with required columns
      const rowData = {
        "SR No.": 1,
        "SKU No": invoice.skuName || invoice.sku || "-",
        "Product Name": invoice.productName || "-",
        "Rack": invoice.rackHistory || "-",
        "Quantity": 1,
        "Duration": `${invoice.storageDuration || 0} days`,
        "Amount": `$${Number(invoice.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      };
      const data = [rowData];

      const fileName = `invoice_${invoice.id}`;

      if (format === "CSV") {
        const headers = Object.keys(data[0]);
        const csvRows = [
          headers.join(","),
          ...data.map((row: any) =>
            headers.map((field) => `"${row[field] ?? ""}"`).join(",")
          )
        ];
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, `${fileName}.csv`);
      } else if (format === "Excel") {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `${fileName}.xlsx`);
      } else {
        // PDF Export
        const doc = new jsPDF();
        const PW = 210;

        // Date Formatting (DD/MM/YYYY with zero-padding)
        let formattedDate = invoice.date;
        if (typeof formattedDate === 'string') {
          const d = new Date(formattedDate);
          if (!isNaN(d.getTime())) {
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            formattedDate = `${day}/${month}/${year}`;
          }
        }

        // Title & Header Background
        doc.setFillColor(15, 23, 42); // #0f172a
        doc.rect(0, 0, PW, 25, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("INVOICE", 15, 16);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("WSMS - Warehouse Management", PW - 15, 16, { align: "right" });

        doc.setTextColor(0, 0, 0);

        // Invoice Info
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`Invoice Number: ${invoice.id}`, 15, 40);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Order ID: ${invoice.orderId}`, 15, 48);
        doc.text(`Date: ${formattedDate}`, 15, 54);
        doc.text(`Status: ${invoice.status.toUpperCase()}`, 15, 60);

        // Customer / Details
        doc.setFont("helvetica", "bold");
        doc.text("Billed To:", PW - 70, 40);
        doc.setFont("helvetica", "normal");
        doc.text("WSMS Client", PW - 70, 48);

        // Table Data
        const tableColumn = Object.keys(data[0]);
        const tableRows = data.map((row: any) => tableColumn.map((col) => String(row[col])));

        autoTable(doc, {
          startY: 75,
          head: [tableColumn],
          body: tableRows,
          theme: "striped",
          headStyles: { fillColor: [37, 99, 235] },
          styles: { fontSize: 9, cellPadding: 3, halign: 'center' },
        });

        // Total
        const finalY = (doc as any).lastAutoTable.finalY || 100;
        doc.setFont("helvetica", "bold");
        doc.text(`Total Amount: $${Number(invoice.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, PW - 15, finalY + 10, { align: "right" });

        doc.save(`${fileName}.pdf`);
      }

      toast.success(`Invoice ${invoice.id} exported successfully`);
      addLog("Admin", "Exported Invoice", invoice.id, `Downloaded as ${format}`, "success");
    } catch (err) {
      console.error("Export error:", err);
      toast.error(`Failed to export invoice ${invoice.id}`);
    }
  }

  function validateManualForm() {
    const errors: Record<string, string> = {};
    if (!manualForm.orderId) errors.orderId = "Required";
    if (!manualForm.sku) errors.sku = "Required";
    if (!manualForm.product) errors.product = "Required";
    if (!manualForm.rackHistory) errors.rackHistory = "Required";
    if (!manualForm.customerId) errors.customerId = "Required";
    if (manualForm.gstPercent === "" || isNaN(Number(manualForm.gstPercent))) errors.gstPercent = "Must be numeric";
    if (!manualForm.duration || Number(manualForm.duration) <= 0) errors.duration = "Must be > 0";
    if (manualForm.weightCharges === "" || isNaN(Number(manualForm.weightCharges))) errors.weightCharges = "Must be numeric";
    if (manualForm.rackCharges === "" || isNaN(Number(manualForm.rackCharges))) errors.rackCharges = "Must be numeric";
    if (!manualForm.date) errors.date = "Required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSaveManualInvoice() {
    if (!validateManualForm()) {
      toast.error("Please fix form errors");
      return;
    }
    const wCharge = Number(manualForm.weightCharges) || 0;
    const rCharge = Number(manualForm.rackCharges) || 0;
    const gstPercent = Number(manualForm.gstPercent) || 0;
    const subtotal = wCharge + rCharge;
    const totalAmount = subtotal * (1 + gstPercent / 100);

    const res = await api.createBilling({
      orderId: manualForm.orderId,
      sku: manualForm.sku,
      productName: manualForm.product,
      rackHistory: manualForm.rackHistory,
      duration: Number(manualForm.duration),
      weightCharges: wCharge,
      rackCharges: rCharge,
      amount: totalAmount,
      status: manualForm.status,
      date: manualForm.date,
      gstPercent,
      customerId: manualForm.customerId
    });

    if (res.success) {
      const newInvoice: Invoice = {
        id: res.billing.invoiceId,
        orderId: manualForm.orderId,
        sku: manualForm.sku,
        productName: manualForm.product,
        storageDuration: Number(manualForm.duration),
        weightCharges: wCharge,
        rackCharges: rCharge,
        totalAmount,
        status: manualForm.status,
        date: manualForm.date,
        rackHistory: manualForm.rackHistory,
        gstPercent,
        customerName: customers.find(c => c.id === manualForm.customerId)?.name || ""
      };

      setGenerateStep("none");
      toast.success(`Invoice ${newInvoice.id} generated manually and saved to DB`);
      addLog("Admin", "Added Invoice", newInvoice.id, `Manual entry`, "success");
      loadDashboardData();
    } else {
      toast.error(res.message || "Failed to save invoice to DB.");
    }
  }

  const API_SERVER = "http://localhost:3001"

  const processCsvFile = async (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please upload a valid CSV file");
      return;
    }
    setCsvFile(file);
    setIsCsvUploading(true);
    setCsvPreview(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_SERVER}/api/billing/upload-csv`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setCsvPreview({ valid: data.validRecords || [], invalid: data.invalidRecords || [], total: data.totalParsed || 0 });
        if (data.invalidRecords?.length > 0) {
          toast.warning(`Total parsed: ${data.totalParsed}. Found ${data.invalidRecords.length} invalid rows.`);
        } else {
          toast.success(`Parsed ${data.totalParsed} records successfully.`);
        }
      } else {
        toast.error(data.message || "Failed to parse CSV");
      }
    } catch (err) {
      toast.error("Error parsing CSV. Ensure backend is running.");
    } finally {
      setIsCsvUploading(false);
    }
  };

  const handleSaveCsv = async () => {
    if (!csvPreview || csvPreview.valid.length === 0) return;
    setIsCsvSaving(true);
    try {
      const res = await fetch(`${API_SERVER}/api/billing/bulk-insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: csvPreview.valid })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        // addLog("Admin", "Imported CSV Invoices", `Saved ${data.savedCount}`, "success");
        setGenerateStep("none");
        setCsvFile(null);
        setCsvPreview(null);
        loadDashboardData();
      } else {
        toast.error(data.message || "Failed to save records");
      }
    } catch (err) {
      toast.error("Error saving bulk records");
    } finally {
      setIsCsvSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-muted-foreground gap-3">
        <RefreshCw className="animate-spin" size={24} />
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  if (errorMSG) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-red-400 gap-3">
        <AlertCircle size={32} />
        <p>Error: {errorMSG}</p>
        <button onClick={loadDashboardData} className="px-4 py-2 mt-2 bg-white/[0.04] rounded hover:bg-white/[0.08] text-foreground text-[0.8125rem] transition-colors">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground flex gap-3 items-center">
            Billing
            <button onClick={loadDashboardData} className="p-1.5 rounded hover:bg-white/[0.06] text-muted-foreground hover:text-foreground" title="Refresh Dashboard">
              <RefreshCw size={14} />
            </button>
          </h1>
          <p className="text-[0.8125rem] text-muted-foreground">Invoice management and billing analytics</p>
        </div>
        <div className="flex w-fit gap-3">
          <button
            onClick={() => {
              setCustomerForm({ name: "", gstNumber: "", address: "", email: "", phone: "" });
              setCustomerFormErrors({});
              setShowAddCustomerModal(true);
            }}
            className="w-full flex items-center gap-4 p-3 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] text-left transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-yellow/15 text-yellow">
              <Plus size={18} />
            </div>
            <h4 className="text-[0.875rem] text-foreground font-medium whitespace-nowrap">Add Customer</h4>
          </button>

          <button
            onClick={() => setGenerateStep("manual")}
            className="w-full flex items-center gap-4 p-3 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] text-left transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-blue/15 text-blue">
              <Edit size={18} />
            </div>
            <h4 className="text-[0.875rem] text-foreground font-medium whitespace-nowrap">Add Manually</h4>
          </button>

          <button
            onClick={() => setGenerateStep("csv")}
            className="w-full flex items-center gap-4 p-3 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] text-left transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-green/15 text-green">
              <Upload size={18} />
            </div>
            <h4 className="text-[0.875rem] text-foreground font-medium whitespace-nowrap">Import CSV</h4>
          </button>
        </div>

      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value={`₹${summary.totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-green" />
        <MetricCard title="Total Invoices" value={summary.totalInvoices} icon={FileText} color="text-blue" />
        <MetricCard title="Paid" value={summary.paidInvoices} icon={CheckCircle} color="text-green" />
        <MetricCard title="Pending" value={`${summary.pendingInvoices} (₹${pendingAmount.toLocaleString()})`} icon={Clock} color="text-yellow" />
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <h3 className="text-foreground mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 12 }} />
              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[3, 3, 0, 0]}
                name="Revenue ($)"
                activeBar={{ style: { fill: "#10b981", stroke: "#ffffff", strokeWidth: 0 } }}
              />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="text-foreground mb-4">Invoice Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0", fontSize: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Invoices" />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "paid", "pending"] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-[0.8125rem] capitalize transition-colors ${statusFilter === s ? "bg-blue/15 text-blue border border-blue/30" : "bg-white/[0.03] text-muted-foreground border border-white/[0.06] hover:text-foreground"}`}
          >
            {s} {s !== "all" && `(${s === "paid" ? summary.paidInvoices : summary.pendingInvoices})`}
          </button>
        ))}
      </div>

      {/* Invoice Table */}
      <GlassCard className="overflow-x-auto">
        <table className="w-full text-[0.8125rem]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Invoice #", "Order ID", "Product", "Duration", "Weight", "Rack", "Total", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-blue">{inv.id}</td>
                <td className="px-4 py-3 text-foreground">{inv.orderId}</td>
                <td className="px-4 py-3 text-foreground">{inv.productName}</td>
                <td className="px-4 py-3 text-muted-foreground">{inv.storageDuration}d</td>
                <td className="px-4 py-3 text-muted-foreground">${inv.weightCharges}</td>
                <td className="px-4 py-3 text-muted-foreground">${inv.rackCharges}</td>
                <td className="px-4 py-3 text-foreground">${inv.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">``
                  <span className={`px-2 py-0.5 rounded-full text-[0.6875rem] capitalize ${inv.status.toLowerCase() === "paid" ? "bg-green/15 text-green" : "bg-yellow/15 text-yellow"}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setSelectedInvoice(inv)} className="p-1.5 rounded hover:bg-white/[0.06] text-muted-foreground hover:text-foreground" title="View"><FileText size={14} /></button>
                    <button onClick={() => handlePrintInvoice(inv)} className="p-1.5 rounded hover:bg-white/[0.06] text-muted-foreground hover:text-foreground" title="Print Invoice"><Printer size={14} /></button>
                    <button onClick={() => handleExport(inv)} className="p-1.5 rounded hover:bg-white/[0.06] text-muted-foreground hover:text-foreground" title="Export"><Download size={14} /></button>
                    {inv.status.toLowerCase() === "pending" && (
                      <button onClick={() => markPaid(inv.id)} className="p-1.5 rounded hover:bg-green/10 text-muted-foreground hover:text-green" title="Mark Paid"><CheckCircle size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-[0.8125rem]">No invoices found</div>
        )}
      </GlassCard>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-card rounded-xl border border-white/[0.06] p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-foreground">Invoice {selectedInvoice.id}</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-2.5 text-[0.8125rem] max-h-[60vh] overflow-y-auto pr-1">
              {[
                { k: "Order ID", v: selectedInvoice.orderId },
                { k: "SKU ID", v: selectedInvoice.sku },
                { k: "SKU Name", v: selectedInvoice.skuName || "-" },
                { k: "Product", v: selectedInvoice.productName },
                { k: "Company", v: selectedInvoice.companyName || "Acme Corp (Default)" },
                { k: "Customer", v: selectedInvoice.customerName || "N/A (CSV Import)" },
                { k: "Rack History", v: selectedInvoice.rackHistory },
                { k: "Storage Duration", v: `${selectedInvoice.storageDuration} days` },
                { k: "Weight Charges", v: `₹${selectedInvoice.weightCharges}` },
                { k: "Rack Charges", v: `₹${selectedInvoice.rackCharges}` },
                { k: "GST %", v: `${selectedInvoice.gstPercent || 0}%` },
                { k: "Total Amount", v: `₹${selectedInvoice.totalAmount.toLocaleString()}` },
                { k: "Date", v: selectedInvoice.date },
                { k: "Status", v: selectedInvoice.status },
              ].map(r => (
                <div key={r.k} className="flex justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-muted-foreground">{r.k}</span>
                  <span className={`text-foreground capitalize ${r.k === "Status" ? (selectedInvoice.status.toLowerCase() === "paid" ? "text-green" : "text-yellow") : ""}`}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              <button onClick={() => handlePrintInvoice(selectedInvoice)} className="flex-1 min-w-[80px] py-2.5 bg-blue text-white rounded-lg text-[0.8125rem] hover:bg-blue/80 flex items-center justify-center gap-2">
                <Printer size={14} /> Print
              </button>
              <button onClick={() => handleExport(selectedInvoice, 'PDF')} className="flex-1 min-w-[80px] py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[0.8125rem] text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                <Download size={14} /> PDF
              </button>
              <button onClick={() => handleExport(selectedInvoice, 'CSV')} className="flex-1 min-w-[80px] py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[0.8125rem] text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                <Download size={14} /> CSV
              </button>
              <button onClick={() => handleExport(selectedInvoice, 'Excel')} className="flex-1 min-w-[80px] py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[0.8125rem] text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                <Download size={14} /> Excel
              </button>
              {selectedInvoice.status.toLowerCase() === "pending" && (
                <button onClick={() => markPaid(selectedInvoice.id)} className="flex-1 py-2.5 bg-green text-white rounded-lg text-[0.8125rem] hover:bg-green/80 flex items-center justify-center gap-2">
                  <CheckCircle size={14} /> Mark Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Sequence */}
      {generateStep === "selection" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setGenerateStep("none")}>
          <div className="bg-card rounded-xl border border-white/[0.06] p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-foreground">Add Invoice</h3>
              <button onClick={() => setGenerateStep("none")} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <p className="text-[0.8125rem] text-muted-foreground mb-4">Choose how you'd like to create the invoice.</p>

            <div className="space-y-3">
              <button onClick={() => setGenerateStep("manual")} className="w-full flex items-center gap-4 p-4 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] text-left transition-colors">
                <div className="p-2.5 rounded-lg bg-blue/15 text-blue">
                  <Edit size={18} />
                </div>
                <div>
                  <h4 className="text-[0.875rem] text-foreground font-medium">Add Manually</h4>
                  <p className="text-[0.75rem] text-muted-foreground mt-0.5">Fill an invoice form with custom data</p>
                </div>
              </button>

              <button onClick={() => setGenerateStep("csv")} className="w-full flex items-center gap-4 p-4 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] text-left transition-colors">
                <div className="p-2.5 rounded-lg bg-green/15 text-green">
                  <Upload size={18} />
                </div>
                <div>
                  <h4 className="text-[0.875rem] text-foreground font-medium">Import CSV</h4>
                  <p className="text-[0.75rem] text-muted-foreground mt-0.5">Bulk upload invoice records</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {generateStep === "manual" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" onClick={() => setGenerateStep("none")}>
          <div className="bg-card rounded-xl border border-white/[0.06] p-6 w-full max-w-2xl my-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-foreground">Add Invoice Manually</h3>
              <button onClick={() => setGenerateStep("none")} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[0.8125rem]">
              <div className="space-y-1.5">
                <label className="text-muted-foreground">Invoice ID</label>
                <input
                  type="text"
                  value="Auto-generated"
                  readOnly
                  className="w-full bg-white/[0.02] border border-white/[0.04] text-muted-foreground cursor-not-allowed rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Order ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={manualForm.orderId}
                  placeholder="e.g. ORD-5001"
                  onChange={e => setManualForm({ ...manualForm, orderId: e.target.value })}
                  className={`w-full bg-white/[0.03] border ${formErrors.orderId ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                />
                {formErrors.orderId && <p className="text-red-400 text-xs mt-1">{formErrors.orderId}</p>}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-muted-foreground">Customer <span className="text-red-500">*</span></label>
                <div className="flex gap-2 items-center">
                  <select
                    value={manualForm.customerId}
                    onChange={e => setManualForm({ ...manualForm, customerId: e.target.value })}
                    className={`flex-1 bg-white/[0.03] border ${formErrors.customerId ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="" className="bg-slate-900">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomerModal(true)}
                    className="px-3.5 py-2.5 bg-blue text-white rounded-lg hover:bg-blue/80 flex items-center gap-1.5 shrink-0 transition-colors text-[0.8125rem]"
                  >
                    <Plus size={14} /> Add Customer
                  </button>
                </div>
                {formErrors.customerId && <p className="text-red-400 text-xs mt-1">{formErrors.customerId}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">SKU <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={manualForm.sku}
                  placeholder="e.g. SKU-1001"
                  onChange={e => setManualForm({ ...manualForm, sku: e.target.value })}
                  className={`w-full bg-white/[0.03] border ${formErrors.sku ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                />
                {formErrors.sku && <p className="text-red-400 text-xs mt-1">{formErrors.sku}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Product <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={manualForm.product}
                  placeholder="e.g. Industrial Bearings"
                  onChange={e => setManualForm({ ...manualForm, product: e.target.value })}
                  className={`w-full bg-white/[0.03] border ${formErrors.product ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                />
                {formErrors.product && <p className="text-red-400 text-xs mt-1">{formErrors.product}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Rack History <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={manualForm.rackHistory}
                  placeholder="e.g. R30-L2"
                  onChange={e => setManualForm({ ...manualForm, rackHistory: e.target.value })}
                  className={`w-full bg-white/[0.03] border ${formErrors.rackHistory ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                />
                {formErrors.rackHistory && <p className="text-red-400 text-xs mt-1">{formErrors.rackHistory}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Duration <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={1}
                  value={manualForm.duration}
                  placeholder="e.g. 4"
                  onChange={e => setManualForm({ ...manualForm, duration: e.target.value })}
                  onKeyDown={blockNonNumeric}
                  className={`w-full bg-white/[0.03] border ${formErrors.duration ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                />
                {formErrors.duration && <p className="text-red-400 text-xs mt-1">{formErrors.duration}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Storage Duration</label>
                <input
                  type="text"
                  value={`${Number(manualForm.duration) || 0} days`}
                  readOnly
                  className="w-full bg-white/[0.02] border border-white/[0.04] text-muted-foreground cursor-not-allowed rounded-lg px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={manualForm.date}
                  onChange={e => setManualForm({ ...manualForm, date: e.target.value })}
                  className={`w-full bg-white/[0.03] border ${formErrors.date ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                  style={{ colorScheme: "dark" }}
                />
                {formErrors.date && <p className="text-red-400 text-xs mt-1">{formErrors.date}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Weight Charges (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={manualForm.weightCharges}
                  placeholder="e.g. 125"
                  onChange={e => setManualForm({ ...manualForm, weightCharges: e.target.value })}
                  onKeyDown={blockNonNumeric}
                  className={`w-full bg-white/[0.03] border ${formErrors.weightCharges ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                />
                {formErrors.weightCharges && <p className="text-red-400 text-xs mt-1">{formErrors.weightCharges}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Rack Charges ($) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={manualForm.rackCharges}
                  placeholder="e.g. 60"
                  onChange={e => setManualForm({ ...manualForm, rackCharges: e.target.value })}
                  onKeyDown={blockNonNumeric}
                  className={`w-full bg-white/[0.03] border ${formErrors.rackCharges ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                />
                {formErrors.rackCharges && <p className="text-red-400 text-xs mt-1">{formErrors.rackCharges}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">GST % <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={0}
                  value={manualForm.gstPercent}
                  placeholder="e.g. 18"
                  onChange={e => setManualForm({ ...manualForm, gstPercent: e.target.value })}
                  onKeyDown={blockNonNumeric}
                  className={`w-full bg-white/[0.03] border ${formErrors.gstPercent ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                />
                {formErrors.gstPercent && <p className="text-red-400 text-xs mt-1">{formErrors.gstPercent}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Status</label>
                <select
                  value={manualForm.status}
                  onChange={e => setManualForm({ ...manualForm, status: e.target.value as "pending" | "paid" })}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="pending" className="bg-slate-900">Pending</option>
                  <option value="paid" className="bg-slate-900">Paid</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-muted-foreground">Total Amount (incl. GST) ($)</label>
                <input
                  type="text"
                  value={(((Number(manualForm.weightCharges) || 0) + (Number(manualForm.rackCharges) || 0)) * (1 + (Number(manualForm.gstPercent) || 0) / 100)).toFixed(2)}
                  readOnly
                  className="w-full bg-white/[0.02] border border-white/[0.04] text-muted-foreground cursor-not-allowed rounded-lg px-3 py-2 focus:outline-none text-green"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/[0.04]">
              <button onClick={() => setGenerateStep("none")} className="px-5 py-2.5 border border-white/[0.06] bg-white/[0.02] rounded-lg text-[0.8125rem] text-muted-foreground hover:text-foreground transition-colors hover:bg-white/[0.04]">
                Cancel
              </button>
              <button onClick={handleSaveManualInvoice} className="px-5 py-2.5 bg-blue text-white rounded-lg text-[0.8125rem] hover:bg-blue/80 transition-colors flex items-center gap-2">
                <FileText size={16} /> Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {generateStep === "csv" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" onClick={() => setGenerateStep("none")}>
          <div className="bg-card flex flex-col rounded-xl border border-white/[0.06] p-6 w-full max-w-4xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex shrink-0 items-center justify-between mb-5">
              <h3 className="text-foreground">Import CSV</h3>
              <button onClick={() => setGenerateStep("none")} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="mb-6 flex gap-4">
                <a
                  href="data:text/csv;charset=utf-8,Order%20ID,SKU,Product,Rack%20History,Duration,Date,Weight%20Charges%20($),Rack%20Charges%20($),Status%0AORD-9001,SKU-1001,Bearings,R01-A,30,16-04-2026,10.00,5.00,Paid"
                  download="sample_invoices.csv"
                  className="px-4 py-2 border border-white/[0.06] rounded bg-white/[0.02] text-sm hover:bg-white/[0.06]"
                >
                  <Download size={14} className="inline mr-2" /> Download Sample CSV
                </a>
              </div>

              {!csvPreview ? (
                <div
                  className={`border-2 border-dashed border-white/[0.1] rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] transition-colors ${isCsvUploading ? 'opacity-50 pointer-events-none' : ''}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processCsvFile(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <div className="bg-blue/15 p-4 rounded-full text-blue mb-4">
                    {isCsvUploading ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
                  </div>
                  <h4 className="text-foreground font-medium mb-2">
                    {isCsvUploading ? 'Uploading & Parsing...' : 'Drag and drop your CSV file here'}
                  </h4>
                  <p className="text-[0.8125rem] text-muted-foreground mb-6">
                    Or click below to browse your files
                  </p>
                  <label className="cursor-pointer px-5 py-2.5 bg-blue text-white rounded-lg text-[0.8125rem] hover:bg-blue/80 transition-colors inline-block">
                    Browse File
                    <input type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && processCsvFile(e.target.files[0])} />
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary row */}
                  <div className="flex gap-4">
                    <div className="bg-white/[0.03] p-4 rounded-lg flex-1 border border-white/[0.05]">
                      <div className="text-[0.75rem] text-muted-foreground mb-1">Total Parsed</div>
                      <div className="text-lg text-foreground font-semibold">{csvPreview.total}</div>
                    </div>
                    <div className="bg-green/10 p-4 rounded-lg flex-1 border border-green/20">
                      <div className="text-[0.75rem] text-green/80 mb-1">Valid Records</div>
                      <div className="text-lg text-green font-semibold">{csvPreview.valid.length}</div>
                    </div>
                    <div className="bg-red-500/10 p-4 rounded-lg flex-1 border border-red-500/20">
                      <div className="text-[0.75rem] text-red-400 mb-1">Invalid Records</div>
                      <div className="text-lg text-red-500 font-semibold">{csvPreview.invalid.length}</div>
                    </div>
                  </div>

                  {/* Tables */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[0.875rem] text-foreground font-medium">Valid Records</h4>
                    </div>
                    {csvPreview.valid.length > 0 ? (
                      <div className="border border-white/[0.06] rounded bg-white/[0.02] overflow-x-auto">
                        <table className="w-full text-left text-[0.8125rem]">
                          <thead className="bg-white/[0.02] border-b border-white/[0.06]">
                            <tr>
                              <th className="px-4 py-2 font-medium text-muted-foreground">Order ID</th>
                              <th className="px-4 py-2 font-medium text-muted-foreground">SKU</th>
                              <th className="px-4 py-2 font-medium text-muted-foreground">Total ($)</th>
                              <th className="px-4 py-2 font-medium text-muted-foreground">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {csvPreview.valid.slice(0, 10).map((r, i) => (
                              <tr key={i} className="border-b border-white/[0.04]">
                                <td className="px-4 py-2 text-foreground">{r.orderId}</td>
                                <td className="px-4 py-2 text-foreground">{r.skuCode}</td>
                                <td className="px-4 py-2 text-foreground">{r.amount}</td>
                                <td className="px-4 py-2 text-foreground capitalize">{r.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {csvPreview.valid.length > 10 && (
                          <div className="px-4 py-2 text-muted-foreground text-xs text-center border-t border-white/[0.04] bg-white/[0.01]">
                            Showing 10 of {csvPreview.valid.length}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No valid records to display.</p>
                    )}
                  </div>

                  {csvPreview.invalid.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[0.875rem] text-red-400 font-medium">Invalid Records ({csvPreview.invalid.length})</h4>
                      <div className="border border-red-500/20 rounded bg-red-500/5 overflow-x-auto">
                        <table className="w-full text-left text-[0.8125rem]">
                          <thead className="bg-red-500/10 border-b border-red-500/20">
                            <tr>
                              <th className="px-4 py-2 font-medium text-red-300">Row</th>
                              <th className="px-4 py-2 font-medium text-red-300">Order ID</th>
                              <th className="px-4 py-2 font-medium text-red-300">Errors</th>
                            </tr>
                          </thead>
                          <tbody>
                            {csvPreview.invalid.slice(0, 10).map((r, i) => (
                              <tr key={i} className="border-b border-red-500/10">
                                <td className="px-4 py-2 text-red-100">{r._rowIdx}</td>
                                <td className="px-4 py-2 text-red-100">{r.orderId || 'N/A'}</td>
                                <td className="px-4 py-2 text-red-200 text-xs">{r.errors?.join(', ')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {csvPreview.invalid.length > 10 && (
                          <div className="px-4 py-2 text-red-300 text-xs text-center border-t border-red-500/20 bg-red-500/10">
                            Showing 10 of {csvPreview.invalid.length}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex shrink-0 justify-between items-center mt-6 pt-5 border-t border-white/[0.04]">
              <div>
                {csvPreview && (
                  <button onClick={() => setCsvPreview(null)} className="text-sm text-muted-foreground hover:text-foreground">Back to Upload</button>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setGenerateStep("none")} className="px-5 py-2.5 border border-white/[0.06] bg-white/[0.02] rounded-lg text-[0.8125rem] text-muted-foreground hover:text-foreground transition-colors hover:bg-white/[0.04]">
                  Cancel
                </button>
                <button
                  disabled={!csvPreview || csvPreview.valid.length === 0 || isCsvSaving}
                  onClick={handleSaveCsv}
                  className="px-5 py-2.5 bg-blue text-white rounded-lg text-[0.8125rem] hover:bg-blue/80 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCsvSaving ? <RefreshCw className="animate-spin" size={16} /> : <FileText size={16} />}
                  Save {csvPreview?.valid?.length || 0} Records
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {showAddCustomerModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 overflow-y-auto" onClick={() => setShowAddCustomerModal(false)}>
          <div className="bg-card rounded-xl border border-white/[0.06] p-6 w-full max-w-md my-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-foreground">Add New Customer</h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            <div className="space-y-4 text-[0.8125rem]">
              <div>
                <label className="text-[0.75rem] text-muted-foreground block mb-1">Customer Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={customerForm.name}
                  onChange={e => setCustomerForm({ ...customerForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className={`w-full bg-white/[0.03] border ${customerFormErrors.name ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50`}
                />
                {customerFormErrors.name && <p className="text-red-400 text-xs mt-1">{customerFormErrors.name}</p>}
              </div>

              <div>
                <label className="text-[0.75rem] text-muted-foreground block mb-1">GST Number (Optional)</label>
                <input
                  type="text"
                  value={customerForm.gstNumber}
                  onChange={e => setCustomerForm({ ...customerForm, gstNumber: e.target.value })}
                  placeholder="e.g. 27AADCA3847F1ZS"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50"
                />
              </div>

              <div>
                <label className="text-[0.75rem] text-muted-foreground block mb-1">Address <span className="text-red-500">*</span></label>
                <textarea
                  value={customerForm.address}
                  onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })}
                  placeholder="e.g. 456 Elm Street"
                  rows={3}
                  className={`w-full bg-white/[0.03] border ${customerFormErrors.address ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-lg px-3 py-2 text-foreground resize-none focus:outline-none focus:border-blue/50`}
                />
                {customerFormErrors.address && <p className="text-red-400 text-xs mt-1">{customerFormErrors.address}</p>}
              </div>

              <div>
                <label className="text-[0.75rem] text-muted-foreground block mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })}
                  placeholder="e.g. john@customer.com"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50"
                />
              </div>

              <div>
                <label className="text-[0.75rem] text-muted-foreground block mb-1">Phone (Optional)</label>
                <input
                  type="text"
                  value={customerForm.phone}
                  onChange={e => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  placeholder="e.g. +1 555-0144"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/[0.04]">
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="px-5 py-2.5 border border-white/[0.06] bg-white/[0.02] rounded-lg text-[0.8125rem] text-muted-foreground hover:text-foreground transition-colors hover:bg-white/[0.04]"
              >
                Cancel
              </button>
              <button
                disabled={savingCustomer}
                onClick={handleSaveCustomer}
                className="px-5 py-2.5 bg-blue text-white rounded-lg text-[0.8125rem] hover:bg-blue/80 transition-colors flex items-center gap-2"
              >
                {savingCustomer ? "Saving..." : "Save Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
