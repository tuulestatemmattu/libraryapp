import { Model, DataTypes, InferAttributes } from 'sequelize';
import { sequelize } from '../util/db';

class User extends Model<InferAttributes<User>> {
  declare google_id: string;
  declare email: string;
  declare picture: string;
  declare name: string;
}

User.init(
  {
    google_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user',
  },
);

export default User;
