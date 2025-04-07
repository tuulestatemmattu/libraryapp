import Book from './book';
import BookRequest from './book_request';
import Borrow from './borrow';
import ConnectionBookTag from './connection_book_tag';
import QueueEntry from './queue_entry';
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

User.hasMany(QueueEntry);
QueueEntry.belongsTo(User);
Book.hasMany(QueueEntry);
QueueEntry.belongsTo(Book);

User.hasMany(BookRequest);
BookRequest.belongsTo(User);

const syncModels = async () => {
  await User.sync({ alter: true });
  await Book.sync({ alter: true });
  await Borrow.sync({ alter: true });
  await Tag.sync({ alter: true });
  await ConnectionBookTag.sync({ alter: true });
  await QueueEntry.sync({ alter: true });
  await BookRequest.sync({ alter: true });
};

const resetTables = async () => {
  await Book.destroy({ where: {} });
  await User.destroy({ where: {} });
  await Borrow.destroy({ where: {} });
  await Tag.destroy({ where: {} });
  await ConnectionBookTag.destroy({ where: {} });
  await QueueEntry.destroy({ where: {} });
  await BookRequest.destroy({ where: {} });
};

export { syncModels, resetTables, Book, User, Borrow, Tag, ConnectionBookTag, QueueEntry };
