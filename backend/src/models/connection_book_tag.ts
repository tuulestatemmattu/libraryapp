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
import Tag from './tag';

class ConnectionBookTag extends Model<
  InferAttributes<ConnectionBookTag>,
  InferCreationAttributes<ConnectionBookTag>
> {
  declare id: CreationOptional<number>;
  declare bookId: ForeignKey<Book['id']>;
  declare tagId: ForeignKey<Tag['id']>;
}

ConnectionBookTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'book', key: 'id' },
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'tag', key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'connection_book_tag',
  },
);

export default ConnectionBookTag;
