import Book from './book';
import Borrow from './borrow';
import User from './user';

User.hasMany(Book);
Book.belongsTo(User);

Book.hasMany(Borrow);
Borrow.belongsTo(Book);

User.hasMany(Borrow);
Borrow.belongsTo(User);

const syncModels = async () => {
  await User.sync({ alter: true });
  await Book.sync({ alter: true });
  await Borrow.sync({ alter: true });
};

const resetTables = async () => {
  await Book.destroy({ where: {} });
  await User.destroy({ where: {} });
  await Borrow.destroy({ where: {} });
};

export { syncModels, resetTables, Book, User, Borrow };
