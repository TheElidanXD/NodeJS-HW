import { Op } from 'sequelize';
import UserModel, { User } from '../models/user';
import { db } from './database';
import UserGroupModel from '../models/user-group';

export class UserService {
    private user = UserModel(db);
    private userGroup = UserGroupModel(db);

    getAllUsers = () => this.user.findAll(
        { where: { isdeleted: false } }
    );

    createUser = (newUser: User) => {
        return this.user.create(newUser as Omit<unknown, string>);
    };

    findUsersBySubstring = (substring: string, limit: number) => this.user.findAll({
        limit,
        order: [['login', 'ASC']],
        where: {
            login: {
                [Op.substring]: substring
            },
            isdeleted: false
        }
    });

    getUserById = (userId: string) => this.user.findOne({
        where: {
            id: userId,
            isdeleted: false
        }
    });

    getUserByLoginAndPassword = (login: string, password: string) => this.user.findOne({
        where: {
            login,
            password,
            isdeleted: false
        }
    });

    updateUser = (userId: string, newUser: User) => this.user.update(
        newUser,
        {
            where: {
                id: userId,
                isdeleted: false
            }
        }
    );

    deleteUser = (userId: string) => this.user.update(
        {
            isdeleted: true
        },
        {
            where: {
                id: userId
            }
        }
    );

    addNewUserToGroup = async (newUser: User, groupId: string) => {
        try {
            return await db.transaction(async t => {
                const user = await this.user.create(
                    newUser as Omit<unknown, string>,
                    { transaction: t }
                );
                await this.userGroup.create(
                    {
                        groupId,
                        userId: newUser.id
                    },
                    { transaction: t }
                );
                return user;
            });
        } catch (err) {
            console.error(err);
        }
    };
}
