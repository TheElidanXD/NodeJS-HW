import { Sequelize, Op } from 'sequelize';
import UserModel, { User } from '../models/user';
import * as dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL);
sequelize.authenticate().then(() => {
    console.log('Connected');
}).catch(err => {
    console.error('Connection error:', err);
});

export class UserService {
    private user = UserModel(sequelize);

    getAllUsers = () => this.user.findAll(
        { where: { isdeleted: false } }
    );

    createUser = (newUser: Omit<unknown, string>) => this.user.create(newUser);

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
}
// export default () => {
//     const user = UserModel(sequelize);
//     return {
//         getAllUsers: () => user.findAll(
//             { where: { isdeleted: false } }
//         ),
//         createUser: (newUser: User) => user.create(newUser),
//         findUsersBySubstring: (substring: string, limit: number) => user.findAll({
//             limit,
//             order: [['login', 'ASC']],
//             where: {
//                 login: {
//                     [Op.substring]: substring
//                 },
//                 isdeleted: false
//             }
//         }),
//         getUserById: (userId: string) => user.findOne({
//             where: {
//                 id: userId,
//                 isdeleted: false
//             }
//         }),
//         updateUser: (userId: string, newUser: User) => user.update(
//             newUser,
//             {
//                 where: {
//                     id: userId,
//                     isdeleted: false
//                 }
//             }
//         ),
//         deleteUser: (userId: string) => user.update(
//             {
//                 isdeleted: true
//             },
//             {
//                 where: {
//                     id: userId
//                 }
//             }
//         )
//     };
// };
