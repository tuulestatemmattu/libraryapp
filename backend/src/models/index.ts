import Book from './book';
import User from './user';
import Tag from './tag';
import ConnectionBookTag from './connection_book_tag';
import TestAgent from 'supertest/lib/agent';

User.hasMany(Book);
Book.belongsTo(User);

Book.belongsToMany(Tag, { through: ConnectionBookTag });
Tag.belongsToMany(Book, { through: ConnectionBookTag });

const syncModels = async () => {
  await User.sync({ alter: true });
  await Book.sync({ alter: true });
  await Tag.sync({ alter: true });
  await ConnectionBookTag.sync({ alter: true });
};

const resetTables = async () => {
  await Book.destroy({ where: {} });
  await User.destroy({ where: {} });
  await Tag.destroy({ where: {} });
  await ConnectionBookTag.destroy({ where: {} });
};

export { syncModels, resetTables, Book, User, TestAgent, ConnectionBookTag };
