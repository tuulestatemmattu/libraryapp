import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import { sequelize } from '../util/db';
import User from './user';

class BookRequest extends Model<
  InferAttributes<BookRequest>,
  InferCreationAttributes<BookRequest>
> {
  declare id: CreationOptional<number>;
  declare user_google_id: ForeignKey<User['google_id']>;
  declare title: string;
  declare author: string;
  declare isbn: string;
  declare status: string;
}

BookRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_google_id: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'google_id',
      },
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'book_request',
  },
);

export default BookRequest;
