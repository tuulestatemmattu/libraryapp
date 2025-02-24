import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import Book from './book';
import Tag from './tag';
import { sequelize } from '../util/db';

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
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'connection_book_tag',
  },
);

export default ConnectionBookTag;
