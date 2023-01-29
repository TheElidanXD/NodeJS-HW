import { db } from './database';
import UserGroupModel from '../models/user-group';

export class UserGroupService {
    private userGroup = UserGroupModel(db);

    getAllUserGroups = () => this.userGroup.findAll();

    createUserGroup = (newUserGroup: Omit<unknown, string>) => this.userGroup.create(newUserGroup);
}
