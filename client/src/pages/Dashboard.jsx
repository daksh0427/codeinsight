import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Bookmark, BookmarkCheck, Upload, LogOut, Search,
  ChevronDown, X, Plus, Loader2, FolderCode, Cpu, Globe, Star,
  Menu, ChevronLeft, CheckCircle2, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getAllSnippets, uploadSnippet, toggleBookmark as toggleBookmarkApi, deleteSnippet } from '../api/code.api.js';
import { analyzeSnippet } from '../api/code.api.js';
import CodeCard from '../components/CodeCard.jsx';
import { SkeletonCard } from '../components/Loader.jsx';
import { languageOptions } from '../utils/languageMap.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  // Stats
  const [stats, setStats] = useState({ total: 0, algorithms: 0, languages: 0, bookmarks: 0 });

  // Upload form
  const [uploadForm, setUploadForm] = useState({ title: '', language: 'javascript', raw_code: '' });
  const [uploadStep, setUploadStep] = useState(0); // 0 = idle, 1-4 = progress steps
  const [uploading, setUploading] = useState(false);

  // Debounce search
  const searchTimer = useRef(null);

  const fetchSnippets = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (searchQuery) params.search = searchQuery;
      if (languageFilter) params.language = languageFilter;

      const data = await getAllSnippets(params);
      if (data.success) {
        if (page === 1) {
          setSnippets(data.snippets);
        } else {
          setSnippets((prev) => [...prev, ...data.snippets]);
        }
        setPagination(data.pagination);

        // Calculate stats
        const allSnippets = page === 1 ? data.snippets : [...snippets, ...data.snippets];
        const algos = new Set(allSnippets.map((s) => s.analysis?.algorithm_name).filter(Boolean));
        const langs = new Set(allSnippets.map((s) => s.language));
        const bmarks = allSnippets.filter((s) => s.is_bookmarked).length;

        setStats({
          total: data.pagination.total,
          algorithms: algos.size,
          languages: langs.size,
          bookmarks: bmarks,
        });
      }
    } catch (err) {
      addToast({ message: 'Failed to load snippets', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, languageFilter]);

  useEffect(() => {
    fetchSnippets(1);
  }, [fetchSnippets]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      // fetchSnippets triggers via useEffect
    }, 300);
  };

  const handleToggleBookmark = async (snippetId) => {
    try {
      const data = await toggleBookmarkApi(snippetId);
      setSnippets((prev) =>
        prev.map((s) => (s.id === snippetId ? { ...s, is_bookmarked: data.bookmarked } : s))
      );
      addToast({
        message: data.bookmarked ? 'Bookmarked!' : 'Bookmark removed',
        type: 'success',
      });
    } catch (err) {
      addToast({ message: 'Failed to toggle bookmark', type: 'error' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.raw_code) {
      addToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    setUploading(true);

    try {
      // Step 1: Uploading snippet
      setUploadStep(1);
      const uploadData = await uploadSnippet(uploadForm);
      if (!uploadData.success) throw new Error('Upload failed');

      // Step 2: Sending to AI
      setUploadStep(2);
      const snippetId = uploadData.snippet.id;

      // Step 3: Parsing results
      setUploadStep(3);
      const analysisData = await analyzeSnippet(snippetId);

      // Step 4: Saving analysis
      setUploadStep(4);
      await new Promise((r) => setTimeout(r, 500));

      addToast({ message: 'Snippet analyzed successfully!', type: 'success' });
      setDrawerOpen(false);
      setUploadForm({ title: '', language: 'javascript', raw_code: '' });
      setUploadStep(0);

      // Refresh snippets
      fetchSnippets(1);
    } catch (err) {
      addToast({ message: err.response?.data?.message || 'Upload failed', type: 'error' });
      setUploadStep(0);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Infinite scroll
  const observerRef = useRef(null);
  const lastCardRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.page < pagination.totalPages) {
          fetchSnippets(pagination.page + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, pagination]
  );

  const userInitials = user?.username?.slice(0, 2).toUpperCase() || '??';

  const statCards = [
    { label: 'Total Snippets', value: stats.total, icon: FolderCode, color: 'text-purple-400' },
    { label: 'Algorithms', value: stats.algorithms, icon: Cpu, color: 'text-cyan-400' },
    { label: 'Languages', value: stats.languages, icon: Globe, color: 'text-green-400' },
    { label: 'Bookmarks', value: stats.bookmarks, icon: Star, color: 'text-yellow-400' },
  ];

  const uploadSteps = [
    'Uploading snippet...',
    'Sending to AI...',
    'Parsing results...',
    'Saving analysis...',
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* ======== SIDEBAR ======== */}
      <aside
        className={`fixed top-0 left-0 h-full bg-dark-950/80 backdrop-blur-xl border-r border-white/5 z-40 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full md:w-16 md:translate-x-0'
        }`}
        id="sidebar"
      >
        <div className={`flex-1 flex flex-col overflow-hidden ${!sidebarOpen ? 'items-center' : ''}`}>
          {/* User Section */}
          <div className={`p-4 border-b border-white/5 ${!sidebarOpen ? 'px-2' : ''}`}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: user?.avatar_color || '#7c3aed' }}
              >
                {userInitials}
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-white font-semibold text-sm truncate">{user?.username}</p>
                  <p className="text-dark-400 text-xs truncate">{user?.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-3 space-y-1">
            <button
              onClick={() => { setSearchQuery(''); setLanguageFilter(''); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-white bg-white/5 ${!sidebarOpen ? 'justify-center' : ''}`}
              id="nav-all-snippets"
            >
              <FolderCode size={18} />
              {sidebarOpen && 'All Snippets'}
            </button>
            <button
              onClick={() => navigate('/bookmarks')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-dark-200 hover:text-white hover:bg-white/5 ${!sidebarOpen ? 'justify-center' : ''}`}
              id="nav-bookmarks"
            >
              <BookmarkCheck size={18} />
              {sidebarOpen && 'Bookmarks'}
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-dark-200 hover:text-white hover:bg-white/5 ${!sidebarOpen ? 'justify-center' : ''}`}
              id="nav-upload"
            >
              <Upload size={18} />
              {sidebarOpen && 'Upload New'}
            </button>
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-white/5">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-300 hover:text-red-400 hover:bg-red-500/5 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
              id="nav-logout"
            >
              <LogOut size={18} />
              {sidebarOpen && 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* ======== MAIN CONTENT ======== */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0 md:ml-16'}`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-30 glass border-b border-white/5 px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-dark-300 hover:text-white transition-colors p-1"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-dark pl-10 py-2 text-sm"
                placeholder="Search snippets..."
                id="search-input"
              />
            </div>

            {/* Language Filter */}
            <div className="relative">
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="input-dark py-2 text-sm pr-8 appearance-none cursor-pointer min-w-[140px]"
                id="language-filter"
              >
                <option value="">All Languages</option>
                {languageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
            </div>

            {/* Upload Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="btn-primary py-2 px-4 text-sm hidden sm:flex"
              id="upload-btn"
            >
              <Plus size={16} />
              Upload
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 gradient-border rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-dark-400 text-xs">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Code Cards Grid */}
          {loading && snippets.length === 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : snippets.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <FolderCode size={32} className="text-dark-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">No snippets found</h3>
              <p className="text-dark-300 text-sm mb-6">
                {searchQuery || languageFilter
                  ? 'Try adjusting your search or filters.'
                  : 'Upload your first code snippet to get started!'}
              </p>
              {!searchQuery && !languageFilter && (
                <button onClick={() => setDrawerOpen(true)} className="btn-primary">
                  <Plus size={18} /> Upload Your First Snippet
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {snippets.map((snippet, i) => (
                <div key={snippet.id} ref={i === snippets.length - 1 ? lastCardRef : null}>
                  <CodeCard
                    snippet={snippet}
                    onToggleBookmark={handleToggleBookmark}
                    index={i}
                  />
                </div>
              ))}
            </div>
          )}

          {loading && snippets.length > 0 && (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin text-accent-purple" />
            </div>
          )}
        </div>
      </main>

      {/* ======== UPLOAD DRAWER ======== */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => !uploading && setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-dark-900 border-l border-white/5 z-50 flex flex-col overflow-y-auto"
              id="upload-drawer"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h2 className="text-lg font-bold text-white">Upload & Analyze</h2>
                <button
                  onClick={() => !uploading && setDrawerOpen(false)}
                  className="text-dark-300 hover:text-white transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <form onSubmit={handleUpload} className="flex-1 p-6 flex flex-col gap-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="input-dark"
                    placeholder="e.g., Binary Search Implementation"
                    required
                    id="upload-title"
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">Language</label>
                  <div className="relative">
                    <select
                      value={uploadForm.language}
                      onChange={(e) => setUploadForm({ ...uploadForm, language: e.target.value })}
                      className="input-dark pr-8 appearance-none cursor-pointer"
                      id="upload-language"
                    >
                      {languageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
                  </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">
                    Code <span className="text-dark-400 text-xs ml-1">({uploadForm.raw_code.length}/10,000)</span>
                  </label>
                  <textarea
                    value={uploadForm.raw_code}
                    onChange={(e) => setUploadForm({ ...uploadForm, raw_code: e.target.value.slice(0, 10000) })}
                    className="input-dark font-mono text-sm leading-relaxed min-h-[300px] resize-y"
                    placeholder="Paste your code here..."
                    required
                    id="upload-code"
                  />
                </div>

                {/* Progress Steps */}
                {uploading && (
                  <div className="space-y-2">
                    {uploadSteps.map((step, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 text-sm ${
                          uploadStep > i + 1
                            ? 'text-green-400'
                            : uploadStep === i + 1
                            ? 'text-accent-purple'
                            : 'text-dark-400'
                        }`}
                      >
                        {uploadStep > i + 1 ? (
                          <CheckCircle2 size={16} />
                        ) : uploadStep === i + 1 ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-dark-400" />
                        )}
                        {step}
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary py-3 text-base disabled:opacity-50"
                  id="upload-submit"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analyze with AI
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
