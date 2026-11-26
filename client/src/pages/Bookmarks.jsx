import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookmarkX, Bookmark as BookmarkIcon } from 'lucide-react';
import { getBookmarks, toggleBookmark as toggleBookmarkApi } from '../api/code.api.js';
import CodeCard from '../components/CodeCard.jsx';
import Loader, { SkeletonCard } from '../components/Loader.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Bookmarks = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getBookmarks();
        if (data.success) {
          setSnippets(data.snippets);
        }
      } catch (err) {
        addToast({ message: 'Failed to load bookmarks', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleToggleBookmark = async (snippetId) => {
    try {
      const data = await toggleBookmarkApi(snippetId);
      if (!data.bookmarked) {
        // Remove from list
        setSnippets((prev) => prev.filter((s) => s.id !== snippetId));
        addToast({ message: 'Bookmark removed', type: 'success' });
      }
    } catch (err) {
      addToast({ message: 'Failed to remove bookmark', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Background Orbs */}
      <div className="bg-orbs">
        <div className="orb orb-purple" style={{ opacity: 0.06 }} />
        <div className="orb orb-cyan" style={{ opacity: 0.04 }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-dark-300 hover:text-white transition-colors mb-6 text-sm"
          id="back-to-dashboard"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8 gradient-border rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <BookmarkIcon size={22} className="text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Your Bookmarked Snippets</h1>
              <p className="text-dark-300 text-sm">Focused Revision Mode — {snippets.length} snippet{snippets.length !== 1 ? 's' : ''} saved</p>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : snippets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <BookmarkX size={32} className="text-dark-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No bookmarks yet</h3>
            <p className="text-dark-300 text-sm mb-6">
              Star snippets you want to revisit for focused revision.
            </p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Browse Snippets
            </button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet, i) => (
              <CodeCard
                key={snippet.id}
                snippet={snippet}
                onToggleBookmark={handleToggleBookmark}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
