import { useState, useRef, useEffect } from "react";
import { useWarehouse } from "../context/WarehouseContext";
import { GlassCard } from "../components/GlassCard";
import { Scan as ScanIcon, Package, Layers, Hash, MapPin, Box, Weight } from "lucide-react";
import { toast } from "sonner";

export function Scan() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useWarehouse();

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!barcode.trim()) return;

    setLoading(true);
    setError(null);
    setProductData(null);
    const API_SERVER = 'http://localhost:3001';
    try {
      const response = await fetch(`${API_SERVER}/api/scan/${encodeURIComponent(barcode.trim())}`, {
        method: "GET",
        headers: {
          "x-user-role": user?.role || "",
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();

      if (data.success) {
        console.log("scanned data", data);
        setProductData(data.data);
      } else {
        setError(data.message || "Barcode not found");
        toast.error(data.message || "Barcode not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch details");
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
      setBarcode(""); // Clear input for next scan
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Scan Product</h1>
          <p className="text-sm text-muted-foreground mt-1">Scan or manually enter a barcode to view product details.</p>
        </div>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleScan} className="flex gap-4 md:flex-row flex-col">
          <div className="relative flex-1">
            <ScanIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Scan or type barcode / SKU code..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-blue/50 transition-colors text-white"
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !barcode.trim()}
            className="px-6 py-3 bg-blue/20 hover:bg-blue/30 text-blue font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-blue/30 border-t-blue rounded-full animate-spin" />
            ) : (
              "Submit"
            )}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red/10 border border-red/20 rounded-lg text-red text-sm flex items-center justify-center">
            {error}
          </div>
        )}
      </GlassCard>

      {productData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-6 flex items-start gap-4 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue/10 flex items-center justify-center text-blue shrink-0">
              <Hash size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SKU Number</p>
              <p className="text-lg font-semibold text-foreground">{productData.skuCode}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-start gap-4 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center text-purple shrink-0">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Product Name</p>
              <p className="text-lg font-semibold text-foreground">{productData.productName}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-start gap-4 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="text-lg font-semibold text-foreground">
                {productData.category}
                {productData.subCategory !== 'N/A' && <span className="text-muted-foreground text-sm"> &bull; {productData.subCategory}</span>}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-start gap-4 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center text-green shrink-0">
              <Weight size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="text-lg font-semibold text-foreground">{productData.weight} kg</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-start gap-4 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan shrink-0">
              <Box size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Stock / Quantity</p>
              <p className="text-2xl font-bold text-foreground">{productData.quantity}</p>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
