import Book from './book';
import User from './user';

User.hasMany(Book);
Book.belongsTo(User);

User.sync({ alter: true });
Book.sync({ alter: true });

export { Book, User };
