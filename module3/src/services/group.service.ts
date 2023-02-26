import GroupModel, { Group } from '../models/group';
import { db } from './database';

export class GroupService {
    private group = GroupModel(db);

    getAllGroups = () => this.group.findAll();

    createGroup = (newGroup: Omit<unknown, string>) => {
        return this.group.create(newGroup);
    };

    getGroupById = (groupId: string) => this.group.findOne({
        where: {
            id: groupId
        }
    });

    updateGroup = (groupId: string, newGroup: Group) => this.group.update(
        newGroup,
        {
            where: {
                id: groupId
            }
        }
    );

    deleteGroup = (groupId: string) => this.group.destroy({
        where: {
            id: groupId
        }
    });
}
