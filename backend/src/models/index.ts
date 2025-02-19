import Book from './book';
import User from './user';

User.hasMany(Book);
Book.belongsTo(User);

const syncModels = async () => {
  await User.sync({ alter: true });
  await Book.sync({ alter: true });
};

const resetTables = async () => {
  await Book.destroy({ where: {} });
  await User.destroy({ where: {} });
}

export { syncModels, resetTables, Book, User };
