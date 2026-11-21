/**
 * PLCTagMapping.jsx — PLC Tag Mapping & Configuration Screen
 */
import React, { useState, useEffect } from 'react';
import { plcAPI } from '../../services/plcService';

export default function PLCTagMapping() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', address: 0, type: 'M', direction: 'Read', description: '' });
  const [newTagForm, setNewTagForm] = useState({ name: '', address: 0, type: 'M', direction: 'Read', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const r = await plcAPI.getTags();
      if (r.success) {
        setTags(r.tags || []);
      } else {
        showMsg(false, r.message || 'Failed to load tags');
      }
    } catch (e) {
      showMsg(false, 'Network error loading tags');
    }
    setLoading(false);
  };

  const showMsg = (ok, text) => {
    setMsg({ ok, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleSaveAll = async (updatedTags) => {
    try {
      const r = await plcAPI.saveTags(updatedTags);
      if (r.success) {
        setTags(r.tags);
        showMsg(true, 'Tag mappings saved successfully.');
      } else {
        showMsg(false, r.message || 'Failed to save tags');
      }
    } catch (e) {
      showMsg(false, 'Network error saving tags');
    }
  };

  // Add Tag
  const handleAddTag = () => {
    if (!newTagForm.name.trim()) return showMsg(false, 'Tag name is required');
    if (tags.some(t => t.name.toLowerCase() === newTagForm.name.trim().toLowerCase())) {
      return showMsg(false, `Tag "${newTagForm.name}" already exists`);
    }

    const nextId = tags.reduce((max, t) => t.id > max ? t.id : max, 0) + 1;
    const newTag = {
      id: nextId,
      name: newTagForm.name.trim(),
      address: parseInt(newTagForm.address) || 0,
      type: newTagForm.type,
      direction: newTagForm.direction,
      description: newTagForm.description.trim()
    };

    const updated = [...tags, newTag];
    setTags(updated);
    handleSaveAll(updated);
    setNewTagForm({ name: '', address: 0, type: 'M', direction: 'Read', description: '' });
    setShowAddForm(false);
  };

  // Delete Tag
  const handleDeleteTag = (id) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) return;
    const updated = tags.filter(t => t.id !== id);
    setTags(updated);
    handleSaveAll(updated);
  };

  // Start Inline Edit
  const handleStartEdit = (tag) => {
    setEditingId(tag.id);
    setEditForm({ ...tag });
  };

  // Save Inline Edit
  const handleSaveEdit = () => {
    if (!editForm.name.trim()) return showMsg(false, 'Tag name is required');
    if (tags.some(t => t.id !== editForm.id && t.name.toLowerCase() === editForm.name.trim().toLowerCase())) {
      return showMsg(false, `Tag "${editForm.name}" already exists`);
    }

    const updated = tags.map(t => t.id === editForm.id ? {
      ...editForm,
      name: editForm.name.trim(),
      address: parseInt(editForm.address) || 0,
      description: editForm.description.trim()
    } : t);

    setTags(updated);
    handleSaveAll(updated);
    setEditingId(null);
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Import JSON file
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!Array.isArray(parsed)) throw new Error('Data must be an array of tags');

        // Basic validation and mapping ids
        const validated = parsed.map((t, idx) => {
          if (!t.name || t.address === undefined || !t.type || !t.direction) {
            throw new Error(`Tag index ${idx} is missing required fields`);
          }
          return {
            id: idx + 1,
            name: String(t.name),
            address: parseInt(t.address) || 0,
            type: String(t.type),
            direction: String(t.direction),
            description: String(t.description || '')
          };
        });

        setTags(validated);
        handleSaveAll(validated);
      } catch (err) {
        showMsg(false, `Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Export JSON file
  const handleExportJSON = () => {
    const cleanTags = tags.map(({ name, address, type, direction, description }) => ({
      name, address, type, direction, description
    }));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cleanTags, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "plc-tags.json");
    dlAnchorElem.click();
  };

  // Import CSV file
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length < 2) {
          showMsg(false, 'CSV file is empty or has no data rows');
          return;
        }

        // Parse header row (case-insensitive, trim whitespace)
        const header = lines[0].split(',').map(h => h.trim().toLowerCase());
        const colIdx = {
          tagName: header.indexOf('tagname'),
          address: header.indexOf('address'),
          type: header.indexOf('type'),
          direction: header.indexOf('direction'),
          description: header.indexOf('description'),
        };

        // Validate required columns are present
        const requiredCols = ['tagname', 'address', 'type', 'direction'];
        const missingCols = requiredCols.filter(c => header.indexOf(c) === -1);
        if (missingCols.length > 0) {
          showMsg(false, `CSV missing required columns: ${missingCols.join(', ')}`);
          return;
        }

        const VALID_TYPES = new Set(['M', 'X', 'Y', 'D', 'T', 'C']);
        const VALID_DIRECTIONS = new Set(['Read', 'Write', 'Read+Write']);

        const imported = [];
        let skipped = 0;

        for (let i = 1; i < lines.length; i++) {
          // Split CSV row, respecting quoted fields
          const cols = parseCSVRow(lines[i]);

          const rawTagName = (cols[colIdx.tagName] || '').trim();
          const rawAddress = (cols[colIdx.address] || '').trim();
          const rawType = (cols[colIdx.type] || '').trim();
          const rawDirection = (cols[colIdx.direction] || '').trim();
          const rawDesc = colIdx.description >= 0 ? (cols[colIdx.description] || '').trim() : '';

          // Validate required fields
          const addrNum = parseInt(rawAddress, 10);
          if (
            !rawTagName ||
            rawAddress === '' ||
            isNaN(addrNum) ||
            !VALID_TYPES.has(rawType) ||
            !VALID_DIRECTIONS.has(rawDirection)
          ) {
            skipped++;
            continue;
          }

          imported.push({
            id: 0, // will be reassigned below
            name: rawTagName,
            address: addrNum,
            type: rawType,
            direction: rawDirection,
            description: rawDesc,
          });
        }

        // Reassign IDs sequentially
        const withIds = imported.map((t, idx) => ({ ...t, id: idx + 1 }));

        setTags(withIds);
        showMsg(true, `Imported ${withIds.length} tag${withIds.length !== 1 ? 's' : ''}, skipped ${skipped} row${skipped !== 1 ? 's' : ''}. Review below then click Save.`);
      } catch (err) {
        showMsg(false, `CSV import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input so same file can be re-imported
  };

  /**
   * Minimal CSV row parser — handles quoted fields containing commas.
   */
  const parseCSVRow = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped double-quote inside quoted field
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  };

  // Export CSV file — columns: id, name, address, type, direction, description
  const handleExportCSV = () => {
    const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const filename = `plc-tags-${dateStr}.csv`;

    const escapeCSV = (val) => {
      const str = String(val == null ? '' : val);
      // Wrap in quotes if the value contains a comma, quote, or newline
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headerRow = ['id', 'name', 'address', 'type', 'direction', 'description'].join(',');
    const dataRows = tags.map(t =>
      [t.id, t.name, t.address, t.type, t.direction, t.description || '']
        .map(escapeCSV)
        .join(',')
    );

    const csvContent = [headerRow, ...dataRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="plc-loading">Loading tag configuration…</div>;

  return (
    <div className="plc-page">
      <div className="plc-page-header">
        <div>
          <h2 className="plc-page-title">Tag Mapping Configuration</h2>
          <p className="plc-page-sub">Map logical tags to Modbus addresses for M, X, Y, D registers</p>
        </div>
        <div className="plc-tag-actions">
          <button className="plc-btn plc-btn-secondary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '❌ Cancel' : '➕ Add Tag'}
          </button>
          <label className="plc-btn plc-btn-secondary cursor-pointer">
            📥 Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
          <button className="plc-btn plc-btn-secondary" onClick={handleExportJSON}>
            📤 Export JSON
          </button>
          <label className="plc-btn plc-btn-secondary cursor-pointer">
            📥 Import CSV
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>
          <button className="plc-btn plc-btn-secondary" onClick={handleExportCSV}>
            📤 Export CSV
          </button>
        </div>
      </div>

      {msg && (
        <div className={`plc-banner ${msg.ok ? 'plc-banner-ok' : 'plc-banner-err'}`}>
          {msg.text}
        </div>
      )}

      {/* Add New Tag Card */}
      {showAddForm && (
        <div className="plc-card mb-6 plc-add-card">
          <div className="plc-section-title">Add New PLC Tag</div>
          <div className="plc-grid-row">
            <label className="plc-label flex-1">
              Tag Name
              <input
                className="plc-input"
                value={newTagForm.name}
                onChange={e => setNewTagForm({ ...newTagForm, name: e.target.value })}
                placeholder="e.g. Belt_Speed"
              />
            </label>
            <label className="plc-label w-32">
              Type
              <select
                className="plc-select"
                value={newTagForm.type}
                onChange={e => setNewTagForm({ ...newTagForm, type: e.target.value })}
              >
                <option value="M">M (Internal Coil)</option>
                <option value="X">X (Input Coil)</option>
                <option value="Y">Y (Output Coil)</option>
                <option value="D">D (Data Register)</option>
                <option value="T">T (Timer)</option>
                <option value="C">C (Counter)</option>
              </select>
            </label>
            <label className="plc-label w-32">
              Address
              <input
                className="plc-input"
                type="number"
                value={newTagForm.address}
                onChange={e => setNewTagForm({ ...newTagForm, address: e.target.value })}
              />
            </label>
            <label className="plc-label w-40">
              Direction
              <select
                className="plc-select"
                value={newTagForm.direction}
                onChange={e => setNewTagForm({ ...newTagForm, direction: e.target.value })}
              >
                <option value="Read">Read (Input)</option>
                <option value="Write">Write (Output)</option>
                <option value="Read+Write">Read+Write</option>
              </select>
            </label>
          </div>
          <div className="plc-grid-row mt-3">
            <label className="plc-label flex-1">
              Description
              <input
                className="plc-input"
                value={newTagForm.description}
                onChange={e => setNewTagForm({ ...newTagForm, description: e.target.value })}
                placeholder="Brief explanation of this tag's purpose"
              />
            </label>
            <div className="flex items-end pb-1">
              <button className="plc-btn plc-btn-primary" onClick={handleAddTag}>💾 Save Tag</button>
            </div>
          </div>
        </div>
      )}

      {/* Tags Table */}
      <div className="plc-card plc-table-card">
        <table className="plc-table">
          <thead>
            <tr>
              <th>Tag Name</th>
              <th>Type</th>
              <th>Address</th>
              <th>Direction</th>
              <th>Description</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => {
              const isEditing = editingId === tag.id;
              if (isEditing) {
                return (
                  <tr key={tag.id} className="plc-row-editing">
                    <td>
                      <input
                        className="plc-input"
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="plc-select"
                        value={editForm.type}
                        onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                      >
                        <option value="M">M</option>
                        <option value="X">X</option>
                        <option value="Y">Y</option>
                        <option value="D">D</option>
                        <option value="T">T</option>
                        <option value="C">C</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="plc-input w-24"
                        type="number"
                        value={editForm.address}
                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="plc-select"
                        value={editForm.direction}
                        onChange={e => setEditForm({ ...editForm, direction: e.target.value })}
                      >
                        <option value="Read">Read</option>
                        <option value="Write">Write</option>
                        <option value="Read+Write">Read+Write</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="plc-input"
                        value={editForm.description}
                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <button className="plc-btn-icon text-green-400 mr-2" onClick={handleSaveEdit} title="Save">✔️</button>
                      <button className="plc-btn-icon text-red-400" onClick={handleCancelEdit} title="Cancel">❌</button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={tag.id}>
                  <td className="font-semibold text-blue-300">{tag.name}</td>
                  <td><span className={`plc-tag-type badge-${tag.type}`}>{tag.type}</span></td>
                  <td>{tag.address}</td>
                  <td>
                    <span className={`plc-tag-dir dir-${tag.direction.replace('+', '_')}`}>
                      {tag.direction}
                    </span>
                  </td>
                  <td className="text-slate-400 text-sm max-w-xs truncate" title={tag.description}>
                    {tag.description || '—'}
                  </td>
                  <td className="text-right whitespace-nowrap">
                    <button className="plc-btn-icon text-blue-400 mr-3" onClick={() => handleStartEdit(tag)} title="Edit">✏️</button>
                    <button className="plc-btn-icon text-red-400" onClick={() => handleDeleteTag(tag.id)} title="Delete">🗑️</button>
                  </td>
                </tr>
              );
            })}
            {tags.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-slate-500 py-6">
                  No tags mapped yet. Click "Add Tag" or import a config.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
