import React, { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import { Edit2, Check, X, Power, PowerOff } from 'lucide-react';

export function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  // Form State
  const [catName, setCatName] = useState('');
  const [subCatName, setSubCatName] = useState('');
  const [subCatParentId, setSubCatParentId] = useState('');


  // Editing State
  const [editCatId, setEditCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editSubId, setEditSubId] = useState(null);
  const [editSubName, setEditSubName] = useState('');

  // UI State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    if (!(window as any).electronAPI) return;
    const res = await (window as any).electronAPI.getCategories();
    if (res.success) setCategories(res.categories);
  };

  const fetchSubCategories = async () => {
    if (!(window as any).electronAPI) return;
    const res = await (window as any).electronAPI.getSubCategories();
    if (res.success) setSubCategories(res.subcategories);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!(window as any).electronAPI) return;

    const res = await (window as any).electronAPI.createCategory({ name: catName });
    if (res.success) {
      setSuccess(`Category "${res.category.name}" created!`);
      setCatName('');
      fetchCategories();
    } else {
      setError(res.message || 'Failed to create category');
    }
  };

  const handleCreateSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!(window as any).electronAPI) return;

    const res = await (window as any).electronAPI.createSubCategory({ name: subCatName, categoryId: subCatParentId });
    if (res.success) {
      setSuccess(`SubCategory "${res.subCategory.name}" created!`);
      setSubCatName('');
      setSubCatParentId('');
      fetchSubCategories();
    } else {
      setError(res.message || 'Failed to create subcategory');
    }
  };

  // Updation Handlers
  const handleUpdateCategory = async (id, name, isActive) => {
    setError(''); setSuccess('');
    const res = await window.electronAPI.updateCategory({ id, name, isActive });
    if (res.success) {
      setSuccess(`Category updated successfully!`);
      setEditCatId(null);
      fetchCategories();
      fetchSubCategories(); // Refresh subcats as their status might also change
    } else {
      setError(res.message || 'Failed to update category');
    }
  };

  const handleUpdateSubCategory = async (id, name, isActive) => {
    setError(''); setSuccess('');
    const res = await (window as any).electronAPI.updateSubCategory({ id, name, isActive });
    if (res.success) {
      setSuccess(`SubCategory updated successfully!`);
      setEditSubId(null);
      fetchSubCategories();
    } else {
      setError(res.message || 'Failed to update subcategory');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-blue/20 text-blue">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Manage Categories</h1>
          <p className="text-[0.8125rem] text-muted-foreground">Add new categories and sub-categories to the database.</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-xl bg-red/10 border border-red/20 text-red text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-green/10 border border-green/20 text-green text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Panel */}
        <div className="bg-card border border-white/[0.06] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue"></div>
          <h2 className="text-[0.9375rem] font-medium text-foreground mb-4">Create Category</h2>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-[0.8125rem] text-muted-foreground mb-1">Category Name</label>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-white/[0.06] rounded-lg focus:outline-none focus:border-blue placeholder:text-muted-foreground/50 text-[0.8125rem]"
                placeholder="e.g. Mechanical"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue hover:bg-blue/90 text-white font-medium rounded-lg transition-colors text-[0.8125rem]"
            >
              Add Category
            </button>
          </form>

          <div className="mt-8 border-t border-white/6 pt-6">
            <h3 className="text-[0.6875rem] font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Existing Categories</h3>
            <div className="max-h-48 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
              {categories.map(c => (
                <div key={c.id} className="p-3 bg-white/5 border border-white/5 rounded-lg flex flex-col gap-2 shadow-sm">
                  {editCatId === c.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editCatName}
                        onChange={(e) => setEditCatName(e.target.value)}
                        className="flex-1 px-2 py-1 bg-black/30 border border-blue-500/50 rounded-lg text-white"
                        autoFocus
                      />
                      <button onClick={() => handleUpdateCategory(c.id, editCatName, undefined)} className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded"><Check size={18} /></button>
                      <button onClick={() => setEditCatId(null)} className="p-1 hover:bg-red-500/20 text-red-400 rounded"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${c.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`}></span>
                        <span className={`text-slate-200 font-medium ${!c.isActive && 'line-through text-slate-500'}`}>{c.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditCatId(c.id); setEditCatName(c.name); }} className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-blue-400 rounded transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleUpdateCategory(c.id, undefined, !c.isActive)} className={`p-1.5 hover:bg-white/10 rounded transition-colors ${c.isActive ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}`} title={c.isActive ? 'Mark Inactive' : 'Mark Active'}>
                          {c.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {categories.length === 0 && <p className="text-muted-foreground text-[0.8125rem]">No categories found.</p>}
            </div>
          </div>
        </div>

        {/* SubCategory Panel */}
        <div className="bg-card border h-130  border-white/6 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
          <h2 className="text-[0.9375rem] font-medium text-foreground mb-4">Create Sub-Category</h2>
          <form onSubmit={handleCreateSubCategory} className="space-y-4">
            <div>
              <label className="block text-[0.8125rem] text-muted-foreground mb-1">Parent Category</label>
              <select
                value={subCatParentId}
                onChange={(e) => setSubCatParentId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-white/6 rounded-lg focus:outline-none focus:border-purple-500 text-[0.8125rem] text-foreground"
                required
              >
                <option value="" disabled className="text-muted-foreground">Select a Category...</option>
                {categories.filter(c => c.isActive).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[0.8125rem] text-muted-foreground mb-1">Sub-Category Name</label>
              <input
                type="text"
                value={subCatName}
                onChange={(e) => setSubCatName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-white/6 rounded-lg focus:outline-none focus:border-purple-500 placeholder:text-muted-foreground/50 text-[0.8125rem]"
                placeholder="e.g. Engines"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#8b5cf6] hover:bg-purple-500 text-white font-medium rounded-lg transition-colors text-[0.8125rem]"
            >
              Add Sub-Category
            </button>
          </form>

          <div className="mt-8 border-t border-white/6 pt-6 ">
            <h3 className="text-[0.6875rem] font-semibold text-muted-foreground pb-3 uppercase tracking-wider">Existing Sub-Categories</h3>
            <div className="max-h-38 overflow-y-auto pr-2  space-y-1.5 custom-scrollbar">
              {subCategories.map(sc => (
                <div key={sc.id} className="p-3 bg-white/5 border border-white/5 rounded-lg flex flex-col gap-2 shadow-sm">
                  {editSubId === sc.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editSubName}
                        onChange={(e) => setEditSubName(e.target.value)}
                        className="flex-1 px-2 py-1 bg-black/30 border border-purple-500/50 rounded-lg text-white"
                        autoFocus
                      />
                      <button onClick={() => handleUpdateSubCategory(sc.id, editSubName, undefined)} className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded"><Check size={18} /></button>
                      <button onClick={() => setEditSubId(null)} className="p-1 hover:bg-red-500/20 text-red-400 rounded"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${sc.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`}></span>
                        <div className="flex flex-col">
                          <span className={`text-slate-200 font-medium ${!sc.isActive && 'line-through text-slate-500'}`}>{sc.name}</span>
                          <span className="text-[0.6875rem] text-muted-foreground">{sc.category?.name || 'Unknown'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditSubId(sc.id); setEditSubName(sc.name); }} className="p-1.5 hover:bg-white/10 text-slate-400 hover:text-purple-400 rounded transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleUpdateSubCategory(sc.id, undefined, !sc.isActive)} className={`p-1.5 hover:bg-white/10 rounded transition-colors ${sc.isActive ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}`} title={sc.isActive ? 'Mark Inactive' : 'Mark Active'}>
                          {sc.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {subCategories.length === 0 && <p className="text-muted-foreground text-[0.8125rem]">No sub-categories found.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
