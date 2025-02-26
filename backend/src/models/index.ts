import Book from './book';
import BorrowedBooks from './borrowed_books';
import User from './user';

User.hasMany(Book);
BorrowedBooks.belongsTo(User);

const syncModels = async () => {
  await User.sync({ alter: true });
  await BorrowedBooks.sync({ alter: true });
};

const resetTables = async () => {
  await Book.destroy({ where: {} });
  await User.destroy({ where: {} });
  await BorrowedBooks.destroy({ where: {} });
};

export { syncModels, resetTables, Book, User, BorrowedBooks };
