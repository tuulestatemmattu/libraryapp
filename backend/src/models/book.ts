import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import User from './user';
import { sequelize } from '../util/db';
import isIsbn from 'validator/lib/isISBN';

class Book extends Model<InferAttributes<Book>, InferCreationAttributes<Book>> {
  declare id: CreationOptional<number>;
  declare title: string | null;
  declare authors: string | null;
  declare isbn: string | null;
  declare description: string | null;
  declare publishedDate: string | null;
  declare location: string | null;
  declare lastBorrowedDate: Date | null;
  declare available: boolean;
  declare imageLink: string | null;
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
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastBorrowedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    available: {
      type: DataTypes.BOOLEAN,
    },
    imageLink: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'book',
    indexes: [
      {
        unique: true,
        fields: ['isbn', 'location'],
      },
    ],
  },
);

export default Book;
