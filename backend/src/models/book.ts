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
        len: [10, 13],
      },
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    publishedDate: {
      type: DataTypes.STRING, // TODO: check this, string is not ideal
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
