import Book from './book';
import User from './user';
import Tag from './tag';
import ConnectionBookTag from './connection_book_tag';

User.hasMany(Book);
Book.belongsTo(User);

Book.belongsToMany(Tag, { through: ConnectionBookTag })
Tag.belongsToMany(Book, { through: ConnectionBookTag })

User.sync({ alter: true });
Book.sync({ alter: true });
Tag.sync({ alter: true });
ConnectionBookTag.sync({ alter: true });

export { Book, User, Tag, ConnectionBookTag };
