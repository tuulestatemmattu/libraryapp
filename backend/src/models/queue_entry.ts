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

class QueueEntry extends Model<InferAttributes<QueueEntry>, InferCreationAttributes<QueueEntry>> {
  declare id: CreationOptional<number>;
  declare bookId: ForeignKey<Book['id']>;
  declare userGoogleId: ForeignKey<User['google_id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

QueueEntry.init(
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
    userGoogleId: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'google_id',
      },
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'queue_entry',
  },
);

export default QueueEntry;
