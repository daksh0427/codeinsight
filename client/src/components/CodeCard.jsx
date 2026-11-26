import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bookmark, BookmarkCheck, ArrowRight, Clock } from 'lucide-react';
import { LanguageBadge, ComplexityBadge, PatternBadge } from './Badge.jsx';
import { formatDate } from '../utils/formatDate.js';
import { languageMap } from '../utils/languageMap.js';

const CodeCard = memo(({ snippet, onToggleBookmark, index = 0 }) => {
  const navigate = useNavigate();
  const analysis = snippet.analysis;

  const codePreview = snippet.raw_code?.split('\n').slice(0, 5).join('\n') || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card glass-card-hover p-5 flex flex-col cursor-pointer group"
      onClick={() => navigate(`/analysis/${snippet.id}`)}
      id={`code-card-${snippet.id}`}
    >
      {/* Header badges */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <LanguageBadge language={snippet.language} />
        {analysis?.dsa_pattern && <PatternBadge pattern={analysis.dsa_pattern} />}
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-base mb-1 truncate group-hover:text-accent-purple transition-colors">
        {snippet.title}
      </h3>

      {/* Algorithm and complexity */}
      {analysis && (
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {analysis.algorithm_name && (
            <span className="text-xs text-dark-200 font-medium">{analysis.algorithm_name}</span>
          )}
        </div>
      )}

      {/* Complexity badges */}
      {analysis && (
        <div className="flex items-center gap-2 mb-3">
          <ComplexityBadge complexity={analysis.time_complexity} label="T" />
          <ComplexityBadge complexity={analysis.space_complexity} label="S" />
        </div>
      )}

      {/* Brief summary */}
      {analysis?.brief_summary && (
        <p className="text-dark-300 text-xs leading-relaxed mb-3 line-clamp-2">
          {analysis.brief_summary}
        </p>
      )}

      {/* Code preview */}
      <div className="code-preview rounded-lg overflow-hidden mb-4 flex-1">
        <SyntaxHighlighter
          language={languageMap[snippet.language] || 'javascript'}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '12px',
            fontSize: '0.7rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '8px',
            maxHeight: '120px',
            overflow: 'hidden',
          }}
          showLineNumbers={false}
          wrapLines={false}
        >
          {codePreview}
        </SyntaxHighlighter>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-1 text-dark-300 text-xs">
          <Clock size={12} />
          {formatDate(snippet.created_at)}
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleBookmark?.(snippet.id)}
            className={`p-1.5 rounded-lg transition-all ${
              snippet.is_bookmarked
                ? 'text-yellow-400 hover:bg-yellow-500/10'
                : 'text-dark-300 hover:text-white hover:bg-white/5'
            }`}
            id={`bookmark-btn-${snippet.id}`}
          >
            {snippet.is_bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>

          <button
            onClick={() => navigate(`/analysis/${snippet.id}`)}
            className="flex items-center gap-1 text-xs font-medium text-accent-purple hover:text-accent-cyan transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            View Analysis
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

CodeCard.displayName = 'CodeCard';
export default CodeCard;
