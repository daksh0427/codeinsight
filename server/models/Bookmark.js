import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Bookmark = sequelize.define('Bookmark', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  snippet_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'bookmarks',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'snippet_id'],
    },
  ],
});

export default Bookmark;
