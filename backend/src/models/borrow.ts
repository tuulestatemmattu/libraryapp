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
  declare borrowedDate: Date | null;
  declare userGoogleId: ForeignKey<User['google_id']>;
<<<<<<< HEAD
  declare active: boolean
=======
  declare active: boolean;
>>>>>>> staging
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
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
<<<<<<< HEAD
      allowNull: true
    }
=======
      allowNull: true,
    },
>>>>>>> staging
  },
  {
    sequelize,
    underscored: true,
    modelName: 'borrow',
  },
);

export default Borrow;
