import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { v4 as uuid } from 'uuid';

export const availableGroupPermission = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];

const group = {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: uuid()
    },
    name: DataTypes.STRING,
    permissions: DataTypes.ARRAY(DataTypes.STRING)
};

export default (sequelize: Sequelize) => sequelize.define('group', group, {
    createdAt: false,
    updatedAt: false
});

export interface Group {
    id: string,
    name: string,
    permissions: string[],
}

export type GroupInstance = Model<Group, Optional<Group, 'id'>>
