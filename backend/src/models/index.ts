import Book from './book';
import User from './user';

User.hasMany(Book);
Book.belongsTo(User);

const syncModels = async () => {
  await User.sync({ alter: true });
  await Book.sync({ alter: true });
};

export { syncModels, Book, User };
