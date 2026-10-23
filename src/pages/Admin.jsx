import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  FlaskConical,
  BookOpen,
  Code,
  Database,
  Cpu,
  Brain,
  Server,
  Beaker,
  Atom,
  GraduationCap,
  Layers,
  Boxes,
  FileCode,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import {
  subscribeLabs,
  subscribeExperiments,
  addLab,
  updateLab,
  deleteLab,
  addExperiment,
  updateExperiment,
  deleteExperiment,
  seedDatabase,
} from '../data/firebaseService';
import { experiments as staticExperiments } from '../data/experiments';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

// Icon map for selection
const ICON_OPTIONS = [
  { name: 'Brain', icon: Brain },
  { name: 'Code', icon: Code },
  { name: 'Database', icon: Database },
  { name: 'Cpu', icon: Cpu },
  { name: 'Server', icon: Server },
  { name: 'FlaskConical', icon: FlaskConical },
  { name: 'Beaker', icon: Beaker },
  { name: 'Atom', icon: Atom },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Layers', icon: Layers },
  { name: 'Boxes', icon: Boxes },
  { name: 'FileCode', icon: FileCode },
  { name: 'BookOpen', icon: BookOpen },
];

const COLOR_OPTIONS = [
  { name: 'Indigo → Blue', value: 'from-blue-500 to-indigo-600' },
  { name: 'Yellow → Orange', value: 'from-yellow-400 to-orange-500' },
  { name: 'Green → Emerald', value: 'from-green-400 to-emerald-600' },
  { name: 'Purple → Pink', value: 'from-purple-500 to-pink-600' },
  { name: 'Teal → Cyan', value: 'from-teal-400 to-cyan-600' },
  { name: 'Rose → Red', value: 'from-rose-400 to-red-600' },
  { name: 'Amber → Yellow', value: 'from-amber-400 to-yellow-500' },
  { name: 'Sky → Blue', value: 'from-sky-400 to-blue-600' },
];

// ─── Toast Notification ─────────────────────────────────────────

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.9 }}
    className={cn(
      "fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border",
      type === 'success' 
        ? "bg-green-500/10 border-green-500/30 text-green-400"
        : type === 'error'
        ? "bg-red-500/10 border-red-500/30 text-red-400"
        : "bg-brand-primary/10 border-brand-primary/30 text-brand-primary"
    )}
  >
    {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 p-1 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
  </motion.div>
);

// ─── Add/Edit Lab Modal ─────────────────────────────────────────

const LabModal = ({ lab, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: lab?.name || '',
    code: lab?.code || '',
    description: lab?.description || '',
    icon: lab?.icon || 'Brain',
    color: lab?.color || COLOR_OPTIONS[0].value,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{lab ? 'Edit Lab Section' : 'Add New Lab Section'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-5">
          {/* Subject Name */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Subject Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Machine Learning"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all text-sm"
            />
          </div>

          {/* Subject Code */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Subject Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g. ML, CS301, DEVOP"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all text-sm font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of this lab..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all text-sm resize-none"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Icon</label>
            <div className="grid grid-cols-6 sm:grid-cols-7 gap-2">
              {ICON_OPTIONS.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => setForm({ ...form, icon: name })}
                  className={cn(
                    "p-3 rounded-xl border transition-all flex items-center justify-center",
                    form.icon === name
                      ? "bg-brand-primary/20 border-brand-primary/50 text-white"
                      : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Accent Color</label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setForm({ ...form, color: c.value })}
                  className={cn(
                    "h-10 rounded-xl bg-gradient-to-r border-2 transition-all",
                    c.value,
                    form.color === c.value ? "border-white scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim() || !form.code.trim()}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
              saving || !form.name.trim() || !form.code.trim()
                ? "bg-brand-primary/30 text-white/50 cursor-not-allowed"
                : "bg-brand-primary hover:bg-brand-primary/80 text-white shadow-lg shadow-brand-primary/20"
            )}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {lab ? 'Update' : 'Create'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


// ─── Add/Edit Experiment Modal ──────────────────────────────────

const ExperimentModal = ({ experiment, labId, onClose, onSave }) => {
  const [form, setForm] = useState({
    number: experiment?.number || '',
    title: experiment?.title || '',
    description: experiment?.description || '',
    code: experiment?.code || '',
    downloadLink: experiment?.downloadLink || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.number.trim() || !form.title.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{experiment ? 'Edit Program' : 'Add New Program'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Program Number */}
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Program No.</label>
              <input
                type="text"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                placeholder="e.g. 01"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all text-sm font-mono"
              />
            </div>

            {/* Download Link */}
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Download Link (optional)</label>
              <input
                type="text"
                value={form.downloadLink}
                onChange={(e) => setForm({ ...form, downloadLink: e.target.value })}
                placeholder="e.g. /devop/EXP 1.pdf"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all text-sm"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Data Visualization with Histograms"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe this program..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all text-sm resize-none"
            />
          </div>

          {/* Code */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Program Code</label>
            <textarea
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="Paste or write the program code here..."
              rows={12}
              spellCheck={false}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-primary/50 focus:bg-black/60 transition-all text-sm font-mono resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.number.trim() || !form.title.trim()}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
              saving || !form.number.trim() || !form.title.trim()
                ? "bg-brand-primary/30 text-white/50 cursor-not-allowed"
                : "bg-brand-primary hover:bg-brand-primary/80 text-white shadow-lg shadow-brand-primary/20"
            )}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {experiment ? 'Update' : 'Add Program'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


// ─── Password Gate ──────────────────────────────────────────────

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || '96500';

const PasswordGate = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE) {
      sessionStorage.setItem('elab_admin_auth', 'true');
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={error ? { x: [-10, 10, -10, 10, 0], opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: error ? 0.3 : 0.4 }}
        className="glass rounded-3xl p-8 md:p-10 max-w-md w-full border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-white/10 flex items-center justify-center mx-auto mb-4 text-brand-primary shadow-inner"
          >
            <Lock className="w-8 h-8" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Admin Authentication</h2>
          <p className="text-white/40 text-sm">
            Enter the authorization passcode to manage lab sections and programs.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <div className={cn(
              "flex items-center gap-2 bg-black/40 border rounded-xl px-4 py-3 transition-all",
              error 
                ? "border-red-500/80 bg-red-500/5 shadow-lg shadow-red-500/10" 
                : "border-white/10 focus-within:border-brand-primary/50 focus-within:bg-black/60"
            )}>
              <KeyRound className="w-5 h-5 text-white/40 shrink-0" />
              <input
                type={showPasscode ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                autoFocus
                className="w-full bg-transparent outline-none text-white text-sm tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="text-white/40 hover:text-white transition-colors p-1"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 mt-2 flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" /> Incorrect passcode. Access denied.
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary/80 text-white font-medium text-sm transition-all shadow-lg shadow-brand-primary/25 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Unlock Dashboard
          </motion.button>

          <Link
            to="/"
            className="block text-center text-xs text-white/40 hover:text-white transition-colors pt-2"
          >
            ← Return to Labs Home
          </Link>
        </form>
      </motion.div>
    </div>
  );
};


// ─── Main Admin Page ────────────────────────────────────────────

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('elab_admin_auth') === 'true';
  });
  const [labs, setLabs] = useState([]);
  const [expandedLab, setExpandedLab] = useState(null);
  const [labExperiments, setLabExperiments] = useState({});
  const [showLabModal, setShowLabModal] = useState(false);
  const [editingLab, setEditingLab] = useState(null);
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [activeLabForExp, setActiveLabForExp] = useState(null);
  const [toast, setToast] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Subscribe to labs
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsub = subscribeLabs((labsData) => {
      setLabs(labsData);
      setLoading(false);
    });
    return unsub;
  }, [isAuthenticated]);

  // Subscribe to experiments for expanded lab
  useEffect(() => {
    if (!isAuthenticated || !expandedLab) return;
    const unsub = subscribeExperiments(expandedLab, (exps) => {
      setLabExperiments((prev) => ({ ...prev, [expandedLab]: exps }));
    });
    return unsub;
  }, [isAuthenticated, expandedLab]);

  const handleLogout = () => {
    sessionStorage.removeItem('elab_admin_auth');
    setIsAuthenticated(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const seeded = await seedDatabase(staticExperiments);
      if (seeded) {
        showToast('Database seeded with existing experiments!');
      } else {
        showToast('Database already contains data. Skipped seeding.', 'info');
      }
    } catch (err) {
      showToast('Failed to seed database: ' + err.message, 'error');
    } finally {
      setSeeding(false);
    }
  };

  const handleSaveLab = async (formData) => {
    if (editingLab) {
      await updateLab(editingLab.id, formData);
      showToast(`Updated "${formData.name}" lab section`);
    } else {
      await addLab(formData);
      showToast(`Created "${formData.name}" lab section`);
    }
    setEditingLab(null);
  };

  const handleDeleteLab = async (labId, labName) => {
    await deleteLab(labId);
    setDeleteConfirm(null);
    if (expandedLab === labId) setExpandedLab(null);
    showToast(`Deleted "${labName}" and all its programs`);
  };

  const handleSaveExperiment = async (formData) => {
    if (editingExp) {
      await updateExperiment(activeLabForExp, editingExp.id, formData);
      showToast(`Updated program "${formData.title}"`);
    } else {
      await addExperiment(activeLabForExp, formData);
      showToast(`Added program "${formData.title}"`);
    }
    setEditingExp(null);
  };

  const handleDeleteExperiment = async (labId, expId, title) => {
    await deleteExperiment(labId, expId);
    setDeleteConfirm(null);
    showToast(`Deleted program "${title}"`);
  };

  const getIconComponent = (iconName) => {
    const found = ICON_OPTIONS.find((i) => i.name === iconName);
    return found ? found.icon : Brain;
  };

  if (!isAuthenticated) {
    return <PasswordGate onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group text-sm">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Admin <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-white/40 text-sm">Manage lab sections and programs dynamically.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {labs.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSeedDatabase}
              disabled={seeding}
              className={cn(
                "px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                seeding
                  ? "bg-white/5 text-white/30 cursor-not-allowed"
                  : "bg-white/5 hover:bg-white/10 text-white/70 border border-white/10"
              )}
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              Seed Existing Data
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setEditingLab(null); setShowLabModal(true); }}
            className="px-5 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/80 text-white text-sm font-medium shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Lab Section
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 text-white/60 hover:text-red-400 border border-white/10 transition-all flex items-center gap-2 text-sm"
            title="Lock Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Lock</span>
          </motion.button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          <p className="text-white/40 text-sm">Connecting to database...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && labs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-12 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <FlaskConical className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Lab Sections Yet</h3>
          <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
            Create your first lab section or seed from existing data to get started.
          </p>
        </motion.div>
      )}

      {/* Labs List */}
      <div className="space-y-4">
        {labs.map((lab, index) => {
          const IconComp = getIconComponent(lab.icon);
          const isExpanded = expandedLab === lab.id;
          const experiments = labExperiments[lab.id] || [];

          return (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-3xl overflow-hidden"
            >
              {/* Lab Header */}
              <div
                className="flex items-center gap-4 p-6 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedLab(isExpanded ? null : lab.id)}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${lab.color} flex items-center justify-center shrink-0`}>
                  <IconComp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold truncate">{lab.name}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-white/10 text-white/60 shrink-0">{lab.code}</span>
                  </div>
                  <p className="text-white/40 text-sm truncate">{lab.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-white/40 hidden sm:block">{experiments.length} programs</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingLab(lab); setShowLabModal(true); }}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ type: 'lab', id: lab.id, name: lab.name }); }}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-white/40 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-white/30" /> : <ChevronDown className="w-5 h-5 text-white/30" />}
                </div>
              </div>

              {/* Expanded Experiments */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/5 p-6 bg-black/20">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider">Programs</h4>
                        <button
                          onClick={() => { setActiveLabForExp(lab.id); setEditingExp(null); setShowExpModal(true); }}
                          className="px-4 py-2 rounded-xl bg-brand-secondary/10 hover:bg-brand-secondary/20 text-brand-secondary text-xs font-bold flex items-center gap-2 transition-colors border border-brand-secondary/20"
                        >
                          <Plus className="w-3 h-3" />
                          Add Program
                        </button>
                      </div>

                      {experiments.length === 0 ? (
                        <p className="text-white/30 text-sm py-4 text-center">No programs yet. Add one to get started.</p>
                      ) : (
                        <div className="space-y-2">
                          {experiments.map((exp) => (
                            <div
                              key={exp.id}
                              className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex flex-col items-center justify-center border border-brand-primary/20 shrink-0">
                                <span className="text-[8px] font-bold text-brand-primary/60">EXP</span>
                                <span className="text-sm font-bold">{exp.number}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-sm truncate">{exp.title}</h5>
                                <p className="text-white/30 text-xs truncate">{exp.description}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => { setActiveLabForExp(lab.id); setEditingExp(exp); setShowExpModal(true); }}
                                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ type: 'experiment', labId: lab.id, id: exp.id, name: exp.title })}
                                  className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-white/40 hover:text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showLabModal && (
          <LabModal
            lab={editingLab}
            onClose={() => { setShowLabModal(false); setEditingLab(null); }}
            onSave={handleSaveLab}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExpModal && (
          <ExperimentModal
            experiment={editingExp}
            labId={activeLabForExp}
            onClose={() => { setShowExpModal(false); setEditingExp(null); }}
            onSave={handleSaveExperiment}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-3xl p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Delete {deleteConfirm.type === 'lab' ? 'Lab Section' : 'Program'}?</h3>
                  <p className="text-white/40 text-sm">
                    This will permanently delete <strong className="text-white/70">"{deleteConfirm.name}"</strong>
                    {deleteConfirm.type === 'lab' ? ' and all its programs.' : '.'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === 'lab') {
                      handleDeleteLab(deleteConfirm.id, deleteConfirm.name);
                    } else {
                      handleDeleteExperiment(deleteConfirm.labId, deleteConfirm.id, deleteConfirm.name);
                    }
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
