import { Model, DataTypes, InferAttributes, ForeignKey } from 'sequelize';
import User from './user';
import { sequelize } from '../util/db';
import isIsbn from 'validator/lib/isISBN';

class Book extends Model<InferAttributes<Book>> {
  declare id: number;
  declare title: string | null;
  declare authors: string | null;
  declare isbn: string | null;
  declare description: string | null;
  declare publishedDate: string | null;
  declare lastBorrowedDate: Date | null;
  declare available: boolean;
  declare userGoogleId: ForeignKey<User['google_id']>;
}

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
    lastBorrowedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    available: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'book',
  },
);

export default Book;
