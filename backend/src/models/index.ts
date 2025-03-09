import Book from './book';
import Borrow from './borrow';
import ConnectionBookTag from './connection_book_tag';
import Tag from './tag';
import User from './user';

User.hasMany(Book);
Book.belongsTo(User);

Book.hasMany(Borrow);
Borrow.belongsTo(Book);

User.hasMany(Borrow);
Borrow.belongsTo(User);

Book.belongsToMany(Tag, { through: ConnectionBookTag });
Tag.belongsToMany(Book, { through: ConnectionBookTag });

const syncModels = async () => {
  await User.sync({ alter: true });
  await Book.sync({ alter: true });
  await Borrow.sync({ alter: true });
  await Tag.sync({ alter: true });
  await ConnectionBookTag.sync({ alter: true });
};

const resetTables = async () => {
  await Book.destroy({ where: {} });
  await User.destroy({ where: {} });
  await Borrow.destroy({ where: {} });
  await Tag.destroy({ where: {} });
  await ConnectionBookTag.destroy({ where: {} });
};

export { syncModels, resetTables, Book, User, Borrow, Tag, ConnectionBookTag };
