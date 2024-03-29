import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { v4 as uuid } from 'uuid';

const user = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: uuid()
    },
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    age: DataTypes.INTEGER,
    isdeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
};

export default (sequelize: Sequelize) => sequelize.define('user', user, {
    createdAt: false,
    updatedAt: false
});

export interface User {
    id: string,
    login: string,
    password: string,
    age?: number,
    isdeleted?: boolean
}

export type UserInstance = Model<User, Optional<User, 'id'>>;
