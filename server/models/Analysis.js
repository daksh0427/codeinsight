import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Analysis = sequelize.define('Analysis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  snippet_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  algorithm_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  time_complexity: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  space_complexity: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  brief_summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dsa_pattern: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  viva_questions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  raw_ai_response: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_valid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'analyses',
  updatedAt: false,
});

export default Analysis;
