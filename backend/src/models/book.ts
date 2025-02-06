import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db';
import isIsbn from 'validator/lib/isISBN';

class Book extends Model {}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authors: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isValidIsbn(value: string) {
          if (!isIsbn(value)) {
            throw new Error('Model error: Invalid ISBN');
          }
        },
      },
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    publishedDate: {
      type: DataTypes.STRING,
      validate: {
        isValidYear(value: string) {
          if (!/^(19|20)\d{2}$/.test(value)) {
            throw new Error('Model error: Invalid year');
          }
        },
      },
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'book',
  },
);

Book.sync();

export default Book;
