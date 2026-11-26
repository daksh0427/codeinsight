import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CodeSnippet = sequelize.define('CodeSnippet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  },
  language: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['javascript', 'python', 'cpp', 'java', 'go', 'rust', 'typescript', 'php', 'ruby', 'swift', 'c', 'csharp', 'kotlin', 'other']],
    },
  },
  raw_code: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [1, 10000],
    },
  },
  thumbnail_language: {
    type: DataTypes.VIRTUAL,
    get() {
      const langMap = {
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
      return langMap[this.language] || this.language;
    },
  },
}, {
  tableName: 'code_snippets',
});

export default CodeSnippet;
