import {
    addUserToGroup,
    createGroupWithSharedDebt,
    deleteUserFromGroup,
    getGroupById
} from './group-config/group-service';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    try {
        const adminUserId = 's7riXqLLHwZ8nHXGaVA2k9qTipa2';
        const user1Id = 'vjI119GuXahAq8C42JsD6OVHjAz1';
        const user2Id = 'ydfqLBcbvEzvllEu3JCU';
        const additionalUserId = 'o8AH7ASpWwIbZn9EKcAw';

        const groupName = 'Test Group';
        const adminId = adminUserId;
        const adminPix = 'pedrosqra@gmail.com';
        const sharedDebtAmount = 1000;
        const divisionMethod = 'equal';

        console.log('Creating the group...');
        const groupId = await createGroupWithSharedDebt(
            groupName,
            adminId,
            adminPix,
            sharedDebtAmount,
            divisionMethod,
            []
        );
        console.log('Group created successfully. Group ID:', groupId);
        await sleep(5000);

        const usersToAdd = [user1Id, user2Id];
        for (const userId of usersToAdd) {
            console.log(`Adding user ${userId} to the group...`);
            await addUserToGroup(groupId, userId, sharedDebtAmount, divisionMethod);
            console.log(`User ${userId} added to the group.`);
            await sleep(5000);
        }

        console.log(`Adding additional user ${additionalUserId} to the group...`);
        await addUserToGroup(groupId, additionalUserId, sharedDebtAmount, divisionMethod);
        console.log(`Additional user ${additionalUserId} added to the group.`);
        await sleep(5000);

        const userIdToDelete = user2Id;
        console.log(`Deleting user ${userIdToDelete} from the group...`);
        await deleteUserFromGroup(groupId, userIdToDelete);
        console.log(`User ${userIdToDelete} deleted from the group.`);
        await sleep(5000);

        const updatedGroup = await getGroupById(groupId);
    } catch (error) {
        console.error('Test error:', error);
    }
}

export {main};
