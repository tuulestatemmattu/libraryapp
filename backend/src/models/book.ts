const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class Book extends Model {}

Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
        },
        author: {
            type: DataTypes.STRING,
        },
        isbn: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                len: [10, 13],
            },
        },
        description: {
            type: DataTypes.TEXT,
        },
        publish_year: {
            type: DataTypes.INTEGER,
        },

    },
    {
        sequelize,
        underscored: true,
        modelName: 'book',
    }
);

Book.sync();

export { Book };