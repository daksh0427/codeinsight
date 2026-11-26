import User from './User.js';
import CodeSnippet from './CodeSnippet.js';
import Analysis from './Analysis.js';
import Bookmark from './Bookmark.js';

// User has many CodeSnippets
User.hasMany(CodeSnippet, {
  foreignKey: 'user_id',
  as: 'snippets',
  onDelete: 'CASCADE',
});
CodeSnippet.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// CodeSnippet has one Analysis
CodeSnippet.hasOne(Analysis, {
  foreignKey: 'snippet_id',
  as: 'analysis',
  onDelete: 'CASCADE',
});
Analysis.belongsTo(CodeSnippet, {
  foreignKey: 'snippet_id',
  as: 'snippet',
});

// Bookmarks (User <-> CodeSnippet through Bookmark)
User.hasMany(Bookmark, {
  foreignKey: 'user_id',
  as: 'bookmarks',
  onDelete: 'CASCADE',
});
Bookmark.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

CodeSnippet.hasMany(Bookmark, {
  foreignKey: 'snippet_id',
  as: 'bookmarks',
  onDelete: 'CASCADE',
});
Bookmark.belongsTo(CodeSnippet, {
  foreignKey: 'snippet_id',
  as: 'snippet',
});

export { User, CodeSnippet, Analysis, Bookmark };
