import React from 'react';

const languageColors = {
  javascript: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  python: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30' },
  cpp: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  java: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  go: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  rust: { bg: 'bg-orange-600/15', text: 'text-orange-300', border: 'border-orange-600/30' },
  typescript: { bg: 'bg-blue-600/15', text: 'text-blue-300', border: 'border-blue-600/30' },
  php: { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30' },
  ruby: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
  swift: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  c: { bg: 'bg-gray-500/15', text: 'text-gray-400', border: 'border-gray-500/30' },
  csharp: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  kotlin: { bg: 'bg-purple-600/15', text: 'text-purple-300', border: 'border-purple-600/30' },
  other: { bg: 'bg-gray-500/15', text: 'text-gray-400', border: 'border-gray-500/30' },
};

const complexityColors = {
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const getComplexityColor = (complexity) => {
  if (!complexity) return complexityColors.yellow;
  const c = complexity.toLowerCase();
  if (c.includes('o(1)') || c.includes('o(log')) return complexityColors.green;
  if (c.includes('o(n)') || c.includes('o(n log')) return complexityColors.yellow;
  return complexityColors.red;
};

const languageLabels = {
  javascript: 'JavaScript',
  python: 'Python',
  cpp: 'C++',
  java: 'Java',
  go: 'Go',
  rust: 'Rust',
  typescript: 'TypeScript',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  c: 'C',
  csharp: 'C#',
  kotlin: 'Kotlin',
  other: 'Other',
};

export const LanguageBadge = ({ language, className = '' }) => {
  const colors = languageColors[language] || languageColors.other;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border} ${className}`}>
      {languageLabels[language] || language}
    </span>
  );
};

export const ComplexityBadge = ({ complexity, label, className = '' }) => {
  const colorClass = getComplexityColor(complexity);
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${colorClass} ${className}`}>
      {label && <span className="font-sans font-medium opacity-70">{label}:</span>}
      {complexity || 'N/A'}
    </span>
  );
};

export const PatternBadge = ({ pattern, className = '' }) => {
  if (!pattern) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-violet-500/10 text-violet-300 border-violet-500/30 ${className}`}>
      {pattern}
    </span>
  );
};

export { languageColors, languageLabels, getComplexityColor };
