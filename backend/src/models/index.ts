import Book from './book';
import User from './user';

User.hasMany(Book);
Book.belongsTo(User);

Book.sync({ alter: true });
User.sync({ alter: true });

export { Book, User };
