import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
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
  declare copies: number;
  declare copiesAvailable: number;
  declare imageLink: string | null;
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
    copies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 0,
      },
    },
    copiesAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 0,
      },
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
