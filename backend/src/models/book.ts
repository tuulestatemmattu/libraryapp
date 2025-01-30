import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db';

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
    },
    authors: {
      type: DataTypes.STRING,
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [10, 13],
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    publishedDate: {
      type: DataTypes.STRING // TODO: check this, string is not ideal
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
