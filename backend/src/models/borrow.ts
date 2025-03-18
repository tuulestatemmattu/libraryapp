import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import { sequelize } from '../util/db';
import Book from './book';
import User from './user';

class Borrow extends Model<InferAttributes<Borrow>, InferCreationAttributes<Borrow>> {
  declare id: CreationOptional<number>;
  declare bookId: ForeignKey<Book['id']>;
  declare borrowedDate: Date;
  declare userGoogleId: ForeignKey<User['google_id']>;
  declare active: boolean;
}

Borrow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
      references: {
        model: Book,
        key: 'id',
      },
      allowNull: false,
    },
    borrowedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'borrow',
  },
);

export default Borrow;
