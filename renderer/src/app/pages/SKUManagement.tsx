import { useState, useMemo, useEffect, useRef } from "react";
import { GlassCard } from "../components/GlassCard";
import { useWarehouse } from "../context/WarehouseContext";
import { Plus, Pencil, Trash2, Barcode, X, Search, Download, Copy } from "lucide-react";
import { toast } from "sonner";
import { api } from "../utils/api";
import { blockNonNumeric } from "../utils/inputHelpers";
import JsBarcode from "jsbarcode";

export function SKUManagement() {
  const { addLog, checkPermission, user } = useWarehouse();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const [skus, setSkus] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [editingSku, setEditingSku] = useState<any | null>(null);
  const [showBarcode, setShowBarcode] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const barcodeRef = useRef<HTMLCanvasElement>(null);

  // RBAC checks
  const canView = checkPermission("Inventory", "canView");
  const canCreate = checkPermission("Inventory", "canCreate");
  const canEdit = checkPermission("Inventory", "canEdit");
  const canDelete = checkPermission("Inventory", "canDelete");

  useEffect(() => {
    if (canView) {
      fetchData();
    }
  }, [canView]);

  async function fetchData() {
    setLoading(true);
    try {
      const [skusRes, categoriesRes] = await Promise.all([
        api.getSkus(),
        api.getCategories()
      ]);
      if (skusRes.success) setSkus(skusRes.skus || []);
      if (categoriesRes.success) setCategories(categoriesRes.categories || []);
    } catch (err) {
      toast.error("Failed to fetch SKU data");
    } finally {
      setLoading(false);
    }
  }

  // Render barcode when modal opens
  useEffect(() => {
    if (showBarcode && barcodeRef.current && showBarcode.barcode) {
      try {
        console.log('Rendering barcode:', showBarcode.barcode);
        JsBarcode(barcodeRef.current, showBarcode.barcode, {
          format: "CODE128",
          width: 2,
          height: 100,
          displayValue: true,
          fontSize: 14,
          margin: 10
        });
        console.log('Barcode rendered successfully');
      } catch (e: any) {
        console.error('Barcode render error:', e);
        toast.error('Failed to render barcode: ' + e.message);
      }
    } else {
      console.log('Barcode ref not ready:', { showBarcode: !!showBarcode, hasRef: !!barcodeRef.current, barcodeValue: showBarcode?.barcode });
    }
  }, [showBarcode]);

  const filtered = skus.filter(s => {
    if (categoryFilter !== "all" && s.categoryId !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.skuCode.toLowerCase().includes(q) || s.productName.toLowerCase().includes(q);
    }
    return true;
  });

  async function handleDelete(id: string) {
    if (!canDelete) return toast.error("Permission denied");

    try {
      const result = await api.deleteSku({ id });
      if (result.success) {
        setSkus(prev => prev.filter(s => s.id !== id));
        toast.success("SKU deleted successfully");
        addLog(user?.name, "Deleted SKU", id, "SKU removed from system", "warning");
      } else {
        toast.error(result.message || "Failed to delete SKU");
      }
    } catch (err) {
      toast.error("Error deleting SKU");
    } finally {
      setDeleteConfirm(null);
    }
  }

  function handlePrintBarcode() {
    if (!showBarcode || !barcodeRef.current) {
      toast.error("Barcode not available for printing");
      return;
    }

    try {
      const dataUrl = barcodeRef.current.toDataURL("image/png");

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "-10000px";
      iframe.style.bottom = "-10000px";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        toast.error("Failed to initialize print window");
        return;
      }

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Barcode - ${showBarcode.skuCode}</title>
            <style>
              @page { size: auto; margin: 0mm; }
              body { 
                font-family: Arial, sans-serif; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: white;
                color: black;
              }
              .label-container {
                text-align: center;
                padding: 20px;
                border: 2px dashed #ccc;
                border-radius: 8px;
                max-width: 400px;
              }
              .sku { font-size: 28px; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px; }
              .name { font-size: 16px; margin-bottom: 20px; color: #444; }
              img { max-width: 100%; height: auto; }
              @media print {
                .label-container { border: none; padding: 0; }
                body { height: auto; display: block; text-align: center; padding-top: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="label-container">
              <div class="sku">${showBarcode.skuCode}</div>
              <div class="name">${showBarcode.productName}</div>
              <img src="${dataUrl}" />
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                }, 150);
              };
            </script>
          </body>
        </html>
      `);
      doc.close();

      // Clean up iframe after printing dialogue is likely closed or resolved
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 10000);

      toast.success("Barcode label sent to printer");
      if (showBarcode) addLog(user?.name || "System", "Printed Barcode", showBarcode.skuCode, "Barcode label printed", "info");
    } catch (err) {
      console.error("Print error:", err);
      toast.error("Failed to print barcode");
    }
  }

  function handleCopyBarcode() {
    if (showBarcode?.barcode) {
      navigator.clipboard.writeText(showBarcode.barcode);
      toast.success("Barcode copied to clipboard");
    }
  }

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <h2 className="text-xl text-foreground font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view the Inventory module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground">SKU Management</h1>
          <p className="text-[0.8125rem] text-muted-foreground">{skus.length} products registered</p>
        </div>
        {canCreate && (
          <button onClick={() => { setEditingSku(null); setShowForm(true); }} className="px-4 py-2.5 bg-blue text-white rounded-lg hover:bg-blue/80 text-[0.8125rem] flex items-center gap-2 w-fit">
            <Plus size={16} /> Add SKU
          </button>
        )}
      </div>

      <GlassCard className="p-3 flex flex-wrap items-center gap-3">
        <Search size={16} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by SKU code or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-[0.8125rem] text-foreground placeholder:text-muted-foreground/50 flex-1 min-w-[200px]"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground transition-colors" title="Clear search">
            <X size={14} />
          </button>
        )}
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-secondary text-foreground text-[0.8125rem] rounded-lg px-3 py-1.5 border border-white/6 outline-none cursor-pointer">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {(search || categoryFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setCategoryFilter("all"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-white/6 text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={12} /> Clear
          </button>
        )}
        <span className="text-[0.75rem] text-muted-foreground">{filtered.length} results</span>
      </GlassCard>

      <GlassCard className="overflow-x-auto">
        <table className="w-full text-left text-[0.8125rem]">
          <thead>
            <tr className="border-b border-white/6">
              {["SKU Code", "Product Name", "Category", "SubCategory", "Weight", "Stock", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">Loading inventory...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No SKUs match your search</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-blue">{s.skuCode}</td>
                <td className="px-4 py-3 text-foreground">{s.productName}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] text-muted-foreground text-[0.75rem]">{s.categoryName || '-'}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.subCategoryName || '-'}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.weight} kg</td>
                {/* <td className="px-4 py-3 text-muted-foreground">{s.rackLocation || "—"}</td> */}
                <td className="px-4 py-3">
                  <span className={s.stock <= 0 ? "text-red" : "text-emerald-400"}>{s.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {canEdit && <button onClick={() => { setEditingSku(s); setShowForm(true); }} className="p-1.5 rounded hover:bg-white/[0.06] text-muted-foreground hover:text-foreground" title="Edit"><Pencil size={14} /></button>}
                    {canDelete && <button onClick={() => setDeleteConfirm(s.id)} className="p-1.5 rounded hover:bg-red/10 text-muted-foreground hover:text-red" title="Delete"><Trash2 size={14} /></button>}
                    <button onClick={() => setShowBarcode(s)} className="p-1.5 rounded hover:bg-white/[0.06] text-muted-foreground hover:text-foreground" title="View Barcode"><Barcode size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-card rounded-xl border border-white/6 p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-foreground mb-3">Delete SKU?</h3>
            <p className="text-[0.8125rem] text-muted-foreground mb-5">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red text-white rounded-lg hover:bg-red/80 text-[0.8125rem]">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/4 border border-white/6 rounded-lg text-muted-foreground hover:text-foreground text-[0.8125rem]">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <SKUForm
          sku={editingSku}
          categories={categories}
          onSave={(updatedSku?: any) => {
            if (updatedSku) {
              // Immediately update the edited row in state (no re-fetch needed)
              setSkus(prev => prev.map(s => s.id === updatedSku.id ? updatedSku : s));
            } else {
              // New SKU — re-fetch to get server-assigned skuCode
              fetchData();
            }
          }}
          onClose={() => { setShowForm(false); setEditingSku(null); }}
        />
      )}

      {showBarcode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowBarcode(null)}>
          <div className="bg-card rounded-xl border border-white/6 p-6 w-full max-w-md text-center" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-foreground">Barcode Details</h3>
              <button onClick={() => setShowBarcode(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>

            {/* SKU Information */}
            <div className="mb-4 text-left bg-white/[0.04] rounded-lg p-3">
              <div className="grid grid-cols-2 gap-2 text-[0.8125rem]">
                <div>
                  <p className="text-muted-foreground">SKU Code</p>
                  <p className="text-blue font-medium">{showBarcode.skuCode}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Product</p>
                  <p className="text-foreground font-medium">{showBarcode.productName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Weight</p>
                  <p className="text-foreground">{showBarcode.weight} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Format</p>
                  <p className="text-foreground">{showBarcode.barcodeFormat || 'CODE128'}</p>
                </div>
              </div>
            </div>

            {/* Barcode Display */}
            <div className="bg-white rounded-lg p-4 mb-4 flex justify-center min-h-[150px] items-center">
              {showBarcode?.barcode ? (
                <canvas
                  ref={barcodeRef}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              ) : (
                <p className="text-muted-foreground text-[0.8125rem]">No barcode available</p>
              )}
            </div>

            {/* Barcode Value */}
            <div className="bg-white/4 rounded-lg p-3 mb-4">
              <p className="text-[0.75rem] text-muted-foreground mb-1">Barcode Value</p>
              <p className="text-[0.9rem] font-mono text-blue break-all">
                {showBarcode?.barcode || <span className="text-red text-[0.8rem]">⚠ No barcode assigned</span>}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handlePrintBarcode}
                className="flex-1 py-2.5 bg-blue text-white rounded-lg text-[0.8125rem] hover:bg-blue/80 flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Print Label
              </button>
              <button
                onClick={handleCopyBarcode}
                className="flex-1 py-2.5 bg-white/4 border border-white/6 rounded-lg text-muted-foreground hover:text-foreground text-[0.8125rem] flex items-center justify-center gap-1.5"
              >
                <Copy size={14} /> Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SKUForm({ sku, categories, onSave, onClose }: { sku: any | null; categories: any[]; onSave: (updatedSku?: any) => void; onClose: () => void }) {
  const { addLog, user } = useWarehouse();
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubCategories] = useState<any[]>([]);
  const [subLoading, setSubLoading] = useState(false);

  const [form, setForm] = useState({
    productName: sku?.productName || "",
    categoryId: sku?.categoryId || (categories.filter((c: any) => c.isActive !== false).length > 0 ? categories.filter((c: any) => c.isActive !== false)[0].id : ""),
    subCategoryId: sku?.subCategoryId || "",
    weight: sku?.weight ?? null,
    dimensions: sku?.dimensions || "",
    stock: sku?.stock ?? null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Clear a field error as soon as the user starts correcting it
  function setField(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  }

  useEffect(() => {
    if (!form.categoryId) { setSubCategories([]); return; }
    setSubLoading(true);
    api.getSubCategories(form.categoryId).then(res => {
      if (res.success) {
        const subs = res.subcategories || [];
        setSubCategories(subs);
        const activeSubs = subs.filter((s: any) => s.isActive !== false);
        const validIds = activeSubs.map((s: any) => s.id);
        if (!validIds.includes(form.subCategoryId)) {
          setForm(prev => ({ ...prev, subCategoryId: validIds.length > 0 ? validIds[0] : "" }));
        }
      }
    }).finally(() => setSubLoading(false));
  }, [form.categoryId]);

  // Normalize dimensions: accept x/X/× as separator, convert to L*W*H
  function normalizeDimensions(raw: string): string {
    return raw.replace(/[xX×]/g, "*").replace(/\s/g, "");
  }

  function parsedDims(raw: string) {
    const normalized = normalizeDimensions(raw);
    const parts = normalized.split("*").map(Number);
    if (parts.length === 3 && parts.every(n => !isNaN(n) && n > 0)) return parts;
    return null;
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.productName.trim()) errs.productName = "Product name is required";
    if (!form.categoryId) errs.categoryId = "Category is required";
    if (!form.subCategoryId) errs.subCategoryId = "Subcategory is required";
    if (!form.weight || form.weight <= 0) errs.weight = "Weight must be greater than 0";
    if (!form.dimensions.trim()) {
      errs.dimensions = "Dimensions are required";
    } else if (!parsedDims(form.dimensions)) {
      errs.dimensions = "Use format L*W*H with positive numbers (e.g. 150*100*10)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);

    // Normalize dimensions before sending (so backend always gets L*W*H format)
    const payload = { ...form, dimensions: normalizeDimensions(form.dimensions) };

    try {
      let result;
      if (sku) {
        result = await api.updateSku({ id: sku.id, ...payload });
        if (result.success) {
          toast.success("SKU updated successfully");
          addLog(user?.name, "Updated SKU", result.sku.skuCode, `Updated ${form.productName}`, "info");
        }
      } else {
        result = await api.createSku(payload);
        if (result.success) {
          toast.success("SKU created successfully");
          addLog(user?.name, "Added New SKU", result.sku.skuCode, `Added ${form.productName}`, "success");
        }
      }

      if (result.success) {
        if (sku) {
          // Build display-ready object so the table row updates immediately without refetch
          const selectedCat = categories.find((c: any) => c.id === form.categoryId);
          const selectedSub = subcategories.find((s: any) => s.id === form.subCategoryId);
          onSave({
            ...sku,
            ...payload,
            categoryName: selectedCat?.name ?? sku.categoryName,
            subCategoryName: selectedSub?.name ?? sku.subCategoryName,
          });
        } else {
          onSave(); // Re-fetch for new SKU to get server-assigned skuCode
        }
        onClose();
      } else {
        toast.error(result.message || "Operation failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const dimsPreview = parsedDims(form.dimensions);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-card rounded-xl border border-white/6 w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/6 shrink-0">
          <div>
            <h3 className="text-foreground text-[0.9375rem] font-medium">
              {sku ? `Edit ${sku.skuCode}` : "Add New SKU"}
            </h3>
            <p className="text-[0.75rem] text-muted-foreground mt-0.5">
              {sku ? "Update product details below" : "Fill in the product details below"}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/4">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="grid grid-cols-2 gap-4 text-[0.8125rem]">

            {/* Product Name */}
            <div className="col-span-2">
              <label className="text-[0.75rem] text-muted-foreground mb-1.5 block font-medium">
                Product Name <span className="text-red/70">*</span>
              </label>
              <input
                type="text"
                value={form.productName}
                onChange={e => setField("productName", e.target.value)}
                className={`w-full bg-secondary border rounded-lg px-3 py-2.5 text-foreground outline-none transition-colors focus:border-blue/50 ${errors.productName ? "border-red/50" : "border-white/6"}`}
                placeholder="e.g. Servo Motor AX-5"
              />
              {errors.productName && <p className="text-[0.6875rem] text-red mt-1">{errors.productName}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="text-[0.75rem] text-muted-foreground mb-1.5 block font-medium">
                Category <span className="text-red/70">*</span>
              </label>
              <select
                value={form.categoryId}
                onChange={e => setField("categoryId", e.target.value)}
                className={`w-full bg-secondary border rounded-lg px-3 py-2.5 text-foreground cursor-pointer outline-none transition-colors focus:border-blue/50 ${errors.categoryId ? "border-red/50" : "border-white/6"}`}
              >
                <option value="" disabled>Select Category</option>
                {categories.filter((c: any) => c.isActive !== false).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-[0.6875rem] text-red mt-1">{errors.categoryId}</p>}
            </div>

            {/* SubCategory */}
            <div>
              <label className="text-[0.75rem] text-muted-foreground mb-1.5 block font-medium">
                SubCategory <span className="text-red/70">*</span>
              </label>
              <select
                disabled={!form.categoryId || subLoading}
                value={form.subCategoryId}
                onChange={e => setField("subCategoryId", e.target.value)}
                className={`w-full bg-secondary border rounded-lg px-3 py-2.5 text-foreground cursor-pointer outline-none transition-colors focus:border-blue/50 disabled:opacity-50 disabled:cursor-not-allowed ${errors.subCategoryId ? "border-red/50" : "border-white/6"}`}
              >
                {subLoading
                  ? <option value="" disabled>Loading...</option>
                  : subcategories.length === 0
                    ? <option value="" disabled>No subcategories</option>
                    : <option value="" disabled>Select Subcategory</option>
                }
                {subcategories.filter((s: any) => s.isActive !== false).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {errors.subCategoryId && <p className="text-[0.6875rem] text-red mt-1">{errors.subCategoryId}</p>}
            </div>

            {/* Weight */}
            <div>
              <label className="text-[0.75rem] text-muted-foreground mb-1.5 block font-medium">
                Weight (kg) <span className="text-red/70">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={form.weight}
                onChange={e => setField("weight", Number(e.target.value))}
                onKeyDown={blockNonNumeric}
                className={`w-full bg-secondary border rounded-lg px-3 py-2.5 text-foreground outline-none transition-colors focus:border-blue/50 ${errors.weight ? "border-red/50" : "border-white/6"}`}
                placeholder="e.g. 1.5"
              />
              {errors.weight && <p className="text-[0.6875rem] text-red mt-1">{errors.weight}</p>}
            </div>

            {/* Dimensions */}
            <div>
              <label className="text-[0.75rem] text-muted-foreground mb-1.5 block font-medium">
                Dimensions (mm) <span className="text-red/70">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 150*100*10"
                value={form.dimensions}
                onChange={e => setField("dimensions", e.target.value)}
                className={`w-full bg-secondary border rounded-lg px-3 py-2.5 text-foreground outline-none transition-colors focus:border-blue/50 ${errors.dimensions ? "border-red/50" : "border-white/6"}`}
              />
              {errors.dimensions
                ? <p className="text-[0.6875rem] text-red mt-1">{errors.dimensions}</p>
                : dimsPreview
                  ? <p className="text-[0.6875rem] text-green mt-1">{dimsPreview[0]}L × {dimsPreview[1]}W × {dimsPreview[2]}H mm</p>
                  : <p className="text-[0.6875rem] text-muted-foreground/60 mt-1">Format: Length * Width * Height</p>
              }
            </div>



            {/* Stock */}
            <div>
              <label className="text-[0.75rem] text-muted-foreground mb-1.5 block font-medium">
                {sku ? "Stock" : "Initial Stock"}
              </label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={e => setField("stock", Number(e.target.value))}
                onKeyDown={blockNonNumeric}
                className="w-full bg-secondary border border-white/6 rounded-lg px-3 py-2.5 text-foreground outline-none transition-colors focus:border-blue/50"
                placeholder="0"
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-white/6 shrink-0">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-blue text-white rounded-lg hover:bg-blue/80 disabled:opacity-50 transition-all font-medium text-[0.8125rem]"
          >
            {loading ? "Saving..." : (sku ? "Save Changes" : "Create SKU")}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 bg-white/4 border border-white/6 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50 font-medium text-[0.8125rem] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
