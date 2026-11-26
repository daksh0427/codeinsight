import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  ArrowLeft, Bookmark, BookmarkCheck, Copy, Check, ChevronDown, ChevronUp,
  AlertTriangle, Clock, Eye, EyeOff
} from 'lucide-react';
import { getSnippet, toggleBookmark as toggleBookmarkApi } from '../api/code.api.js';
import { LanguageBadge, ComplexityBadge, PatternBadge } from '../components/Badge.jsx';
import Loader from '../components/Loader.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatDate } from '../utils/formatDate.js';
import { languageMap } from '../utils/languageMap.js';

const getComplexityRingColor = (complexity) => {
  if (!complexity) return '#f59e0b';
  const c = complexity.toLowerCase();
  if (c.includes('o(1)') || c.includes('o(log')) return '#10b981';
  if (c.includes('o(n)') && !c.includes('o(n²)') && !c.includes('o(n^2)')) return '#f59e0b';
  return '#ef4444';
};

const AnalysisResult = () => {
  const { snippetId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [openQuestions, setOpenQuestions] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSnippet(snippetId);
        if (data.success) {
          setSnippet(data.snippet);
        }
      } catch (err) {
        addToast({ message: 'Failed to load analysis', type: 'error' });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [snippetId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.raw_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast({ message: 'Code copied!', type: 'success' });
    } catch {
      addToast({ message: 'Failed to copy', type: 'error' });
    }
  };

  const handleToggleBookmark = async () => {
    try {
      const data = await toggleBookmarkApi(snippet.id);
      setSnippet({ ...snippet, is_bookmarked: data.bookmarked });
      addToast({
        message: data.bookmarked ? 'Bookmarked!' : 'Bookmark removed',
        type: 'success',
      });
    } catch {
      addToast({ message: 'Failed to toggle bookmark', type: 'error' });
    }
  };

  const toggleQuestion = (index) => {
    setOpenQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (loading) return <Loader fullScreen text="Loading analysis..." />;
  if (!snippet) return null;

  const analysis = snippet.analysis;
  const timeColor = getComplexityRingColor(analysis?.time_complexity);
  const spaceColor = getComplexityRingColor(analysis?.space_complexity);

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Background Orbs */}
      <div className="bg-orbs">
        <div className="orb orb-purple" style={{ opacity: 0.08 }} />
        <div className="orb orb-cyan" style={{ opacity: 0.06 }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* ===== SECTION 1: HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-dark-300 hover:text-white transition-colors mb-6 text-sm"
            id="back-to-dashboard"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-3">{snippet.title}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <LanguageBadge language={snippet.language} />
                {analysis?.dsa_pattern && <PatternBadge pattern={analysis.dsa_pattern} />}
                <span className="flex items-center gap-1 text-dark-400 text-xs">
                  <Clock size={12} />
                  {formatDate(snippet.created_at)}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleBookmark}
              className={`p-2.5 rounded-xl transition-all border ${
                snippet.is_bookmarked
                  ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
                  : 'text-dark-300 bg-white/5 border-white/10 hover:text-white'
              }`}
              id="analysis-bookmark"
            >
              {snippet.is_bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          </div>
        </motion.div>

        {/* AI Validity Banner */}
        {analysis && !analysis.is_valid && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm mb-6"
          >
            <AlertTriangle size={18} />
            <span>AI response could not be fully parsed. Some fields may be incomplete.</span>
          </motion.div>
        )}

        {/* ===== SECTION 2: COMPLEXITY CARDS ===== */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-2 gap-6 mb-8"
          >
            {/* Time Complexity */}
            <div className="glass-card p-6 flex items-center gap-5">
              <div
                className="complexity-ring flex-shrink-0"
                style={{ '--ring-color': `linear-gradient(135deg, ${timeColor}, ${timeColor}88)` }}
              >
                <span className="font-mono font-bold text-lg text-white">T</span>
              </div>
              <div>
                <p className="text-dark-400 text-xs font-medium uppercase tracking-wider mb-1">Time Complexity</p>
                <p className="text-2xl font-mono font-bold text-white">{analysis.time_complexity || 'N/A'}</p>
              </div>
            </div>

            {/* Space Complexity */}
            <div className="glass-card p-6 flex items-center gap-5">
              <div
                className="complexity-ring flex-shrink-0"
                style={{ '--ring-color': `linear-gradient(135deg, ${spaceColor}, ${spaceColor}88)` }}
              >
                <span className="font-mono font-bold text-lg text-white">S</span>
              </div>
              <div>
                <p className="text-dark-400 text-xs font-medium uppercase tracking-wider mb-1">Space Complexity</p>
                <p className="text-2xl font-mono font-bold text-white">{analysis.space_complexity || 'N/A'}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== SECTION 3: ALGORITHM INFO ===== */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 mb-8"
          >
            {analysis.algorithm_name && (
              <h2 className="text-xl font-bold text-white mb-2">{analysis.algorithm_name}</h2>
            )}
            {analysis.dsa_pattern && (
              <PatternBadge pattern={analysis.dsa_pattern} className="mb-4" />
            )}
            {analysis.explanation && (
              <p className="text-dark-200 leading-relaxed text-sm mt-4">{analysis.explanation}</p>
            )}
          </motion.div>
        )}

        {/* ===== SECTION 4: CODE VIEWER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card overflow-hidden mb-8 relative"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <span className="text-sm text-dark-300 font-mono">{snippet.thumbnail_language || snippet.language}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-dark-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              id="copy-code"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <SyntaxHighlighter
            language={languageMap[snippet.language] || 'javascript'}
            style={atomDark}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.3)',
              fontSize: '0.85rem',
              lineHeight: '1.6',
            }}
            lineNumberStyle={{ color: '#474777', paddingRight: '1em' }}
          >
            {snippet.raw_code}
          </SyntaxHighlighter>
        </motion.div>

        {/* ===== SECTION 5: VIVA Q&A ===== */}
        {analysis?.viva_questions && analysis.viva_questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Interview Prep — Viva Q&A</h2>
              <button
                onClick={() => {
                  setPracticeMode(!practiceMode);
                  setOpenQuestions(new Set());
                }}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all ${
                  practiceMode
                    ? 'text-accent-purple bg-accent-purple/10 border-accent-purple/30'
                    : 'text-dark-300 bg-white/5 border-white/10 hover:text-white'
                }`}
                id="practice-mode-toggle"
              >
                {practiceMode ? <EyeOff size={14} /> : <Eye size={14} />}
                Practice Mode {practiceMode ? 'On' : 'Off'}
              </button>
            </div>

            <div className="space-y-3">
              {analysis.viva_questions.map((qa, i) => {
                const isOpen = openQuestions.has(i);
                const showAnswer = practiceMode ? isOpen : true;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="glass-card overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(i)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
                      id={`question-${i}`}
                    >
                      <span className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-white text-sm font-medium">{qa.question}</span>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-dark-400" />
                      ) : (
                        <ChevronDown size={16} className="text-dark-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pl-14">
                            {showAnswer ? (
                              <div className="border-l-2 border-accent-purple/40 pl-4">
                                <p className="text-dark-200 text-sm leading-relaxed">{qa.answer}</p>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  const next = new Set(openQuestions);
                                  next.add(i);
                                  setOpenQuestions(next);
                                }}
                                className="text-accent-purple text-sm hover:text-accent-cyan transition-colors"
                              >
                                Click to reveal answer
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
