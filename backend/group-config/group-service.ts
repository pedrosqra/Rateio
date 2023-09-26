import {db} from '../firebase/firebase';
import {
    collection,
    deleteDoc as firestoreDeleteDoc,
    doc as firestoreDoc,
    getDoc as firestoreGetDoc,
    getDocs,
    setDoc as firestoreSetDoc,
    updateDoc as firestoreUpdateDoc
} from 'firebase/firestore';
import {Group} from "../interfaces/groups";

// Collections references
const groupsCollection = collection(db, 'groups');
const debtsCollection = collection(db, 'debts');

// Helper functions
function groupDocument(groupId: string) {
    return firestoreDoc(groupsCollection, groupId);
}

function debtDocument(groupId: string, userId: string) {
    return firestoreDoc(debtsCollection, `${groupId}_${userId}`);
}

const generateGroupId = () => {
    return firestoreDoc(groupsCollection).id;
};

const checkGroupIdExists = async (groupId: string) => {
    const groupSnapshot = await firestoreGetDoc(groupDocument(groupId));
    return groupSnapshot.exists();
};

// Create a group with a shared debt and distribute it
const createGroupWithSharedDebt = async (
    groupName: string,
    adminId: string,
    adminPix: string,
    sharedDebtAmount: number,
    divisionMethod: string,
    members: string[]
) => {
    try {
        // Step 1: Create the group
        const newGroupId = generateGroupId();
        const groupData = {
            groupId: newGroupId,
            adminId,
            adminPix,
            debtAmount: sharedDebtAmount, // Initialize debtAmount with sharedDebtAmount
            debtDescription: "Shared Debt",
            debtFinalDate: new Date(), // Set the date as needed, for now, it's today always
            name: groupName,
            members: [adminId, ...members], // Include admin and additional members
        };

        await firestoreSetDoc(groupDocument(newGroupId), groupData);

        // Step 2: Calculate debt distribution based on divisionMethod
        const debtDistribution = calculateDebtDistribution(
            adminId,
            members,
            sharedDebtAmount,
            divisionMethod
        );

        // Step 3: Add individual debts for each member
        for (const memberId in debtDistribution) {
            const amount = debtDistribution[memberId];
            const description = "Shared Debt Distribution";
            const debtData = {
                groupId: newGroupId,
                debtorId: memberId,
                amount,
                description,
            };
            // Add individual debts to the 'debts' collection
            await addDebt(debtData);
        }

        console.log("Group created with shared debt successfully");
        return newGroupId;
    } catch (error) {
        console.error("Error creating group with shared debt:", error);
        return null;
    }
};

// Function to add an individual debt to the 'debts' collection
const addDebt = async (debtData: any) => {
    try {
        const debtDocRef = debtDocument(debtData.groupId, debtData.debtorId);
        await firestoreSetDoc(debtDocRef, debtData);
    } catch (error) {
        console.error("Error adding individual debt:", error);
    }
};

const calculateDebtDistribution = (adminId: string, members: string[], sharedDebtAmount: number, divisionMethod: string) => {
    if (divisionMethod === "equal") {
        const numberOfMembers = members.length;
        const perMemberDebt = numberOfMembers > 0 ? sharedDebtAmount / numberOfMembers : sharedDebtAmount;
        const distribution: Record<string, number> = {};
        members.forEach((memberId) => {
            distribution[memberId] = perMemberDebt;
        });
        distribution[adminId] = perMemberDebt;
        return distribution;
    }
    // Add more division methods as needed, we will have to discuss how this will work later in future meetings
    // Default to equal division if the method is not recognized
    return {};
};

const getGroups = async () => {
    const snapshot = await getDocs(groupsCollection);
    return snapshot.docs.map(doc => doc.data());
};

// Function to get a specific group by ID
const getGroupById = async (groupId: string) => {
    try {
        const groupSnapshot = await firestoreGetDoc(groupDocument(groupId));
        if (groupSnapshot.exists()) {
            return groupSnapshot.data();
        } else {
            console.log('Group not found');
            return null;
        }
    } catch (error) {
        console.error('Error getting group by ID:', error);
        return null;
    }
};

// Function to update a group's fields
const updateGroup = async (groupId: string, updatedFields: Group) => {
    try {
        await firestoreUpdateDoc(groupDocument(groupId), updatedFields);
        console.log("Group updated successfully");
    } catch (error) {
        console.error('Error updating group:', error);
    }
};

// Function to delete a group by ID
const deleteGroup = async (groupId: string) => {
    try {
        await firestoreDeleteDoc(groupDocument(groupId));
        console.log('Group deleted successfully');
    } catch (error) {
        console.error('Error deleting group:', error);
    }
};

const deleteUserFromGroup = async (groupId: string, userId: string) => {
    try {
        // Remove the user from the group's members array
        const groupDocRef = groupDocument(groupId);
        const groupSnapshot = await firestoreGetDoc(groupDocRef);

        if (groupSnapshot.exists()) {
            const groupData = groupSnapshot.data();

            if (groupData && Array.isArray(groupData.members)) {
                // Check if the user is a member of the group
                if (groupData.members.includes(userId)) {
                    groupData.members = groupData.members.filter((member) => member !== userId);
                    // Update the group document with the modified members array
                    await firestoreUpdateDoc(groupDocRef, {members: groupData.members});

                    // Calculate the new debt amount per member based on the updated group size and total debt
                    const sharedDebtAmount = groupData.debtAmount; // Use the group's shared debt
                    const divisionMethod = groupData.divisionMethod; // Use the group's division method

                    const remainingMembers = groupData.members;
                    const newDebtAmountPerMember = sharedDebtAmount / remainingMembers.length;

                    // Update existing debts for the remaining members with the new amounts
                    for (const memberId of remainingMembers) {
                        const description = "Shared Debt Distribution";
                        const debtDocRef = debtDocument(groupId, memberId);
                        await firestoreUpdateDoc(debtDocRef, {
                            amount: newDebtAmountPerMember,
                            description,
                        });
                    }

                    // Delete the user's debts within the group
                    const userDebtDocRef = debtDocument(groupId, userId);
                    await firestoreDeleteDoc(userDebtDocRef);

                    console.log('User deleted from group successfully, and debts recalculated.');
                } else {
                    console.log('User is not a member of the group');
                }
            }
        } else {
            console.log('Group not found');
        }
    } catch (error) {
        console.error('Error deleting user from group:', error);
    }
};

// Function to add a user to a group and recalculate debts
const addUserToGroup = async (
    groupId: string,
    userId: string,
    sharedDebtAmount: number,
    divisionMethod: string
) => {
    try {
        // Add the user to the group's members array
        const groupDocRef = groupDocument(groupId);
        const groupSnapshot = await firestoreGetDoc(groupDocRef);

        if (groupSnapshot.exists()) {
            const groupData = groupSnapshot.data();
            if (groupData && Array.isArray(groupData.members) && !groupData.members.includes(userId)) {
                groupData.members.push(userId);
                // Update the group document with the modified members array
                await firestoreUpdateDoc(groupDocRef, {members: groupData.members});
                console.log(sharedDebtAmount)
                // Calculate debt distribution based on divisionMethod
                const debtDistribution = calculateDebtDistribution(
                    userId,
                    groupData.members,
                    sharedDebtAmount,
                    divisionMethod
                );

                // Update existing debts for the group's members with the new amounts
                for (const memberId in debtDistribution) {
                    const amount = debtDistribution[memberId];
                    const description = "Shared Debt Distribution";
                    const debtDocRef = debtDocument(groupId, memberId);

                    // Check if the debt document exists before updating it
                    const debtSnapshot = await firestoreGetDoc(debtDocRef);
                    if (debtSnapshot.exists()) {
                        await firestoreUpdateDoc(debtDocRef, {amount, description});
                    } else {
                        // Create the debt document if it doesn't exist
                        await firestoreSetDoc(debtDocRef, {amount, description});
                    }
                }

                console.log('User added to the group, and debts recalculated successfully');
            } else {
                console.log('User is already a member of the group');
            }
        } else {
            console.log('Group not found');
        }
    } catch (error) {
        console.error('Error adding user to the group and recalculating debts:', error);
    }
};


export {
    createGroupWithSharedDebt,
    checkGroupIdExists,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    deleteUserFromGroup,
    addUserToGroup,
};
