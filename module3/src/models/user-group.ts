import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import GroupModel from '../models/group';
import UserModel from '../models/user';

export default (sequelize: Sequelize) => {
    const user = UserModel(sequelize);
    const group = GroupModel(sequelize);
    const userGroupModel = {
        userId: {
            type: DataTypes.STRING,
            references: {
                model: user,
                key: 'id'
            }
        },
        groupId: {
            type: DataTypes.STRING,
            references: {
                model: group,
                key: 'id'
            }
        }
    };

    const userGroup = sequelize.define('user_group', userGroupModel, {
        createdAt: false,
        updatedAt: false
    });
    user.belongsToMany(group, { through: userGroup });
    group.belongsToMany(user, { through: userGroup });
    userGroup.sync().catch(err => console.error(err));

    return userGroup;
};

export interface UserGroup {
    groupId: string,
    userId: string
}

export type UserGroupInstance = Model<UserGroup, Optional<UserGroup, 'groupId'>>
