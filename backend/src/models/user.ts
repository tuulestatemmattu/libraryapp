import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../util/db';

interface UserAttributes {
  google_id: string;
  email: string;
  picture: string;
  name: string;
  admin: boolean;
}

type UserCreationAttributes = Optional<UserAttributes, 'admin'>;

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare google_id: string;
  declare email: string;
  declare picture: string;
  declare name: string;
  declare admin: boolean;
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
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user',
  },
);

export default User;
