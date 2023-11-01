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
import {getUserByEmail, userDocument} from '../user-config/user-service';
import {Debt} from "../interfaces/debt";

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

const joinAGroupWithCode = async (groupInvite: number, userEmail: string) => {
    try {
        const groupId = await getGroupId(groupInvite);

        if (groupId) {
            await addUserToGroup(groupId, userEmail);
            console.log('User added to group with code successfully');
        } else {
            console.log('Group not found');
        }
    } catch (error) {
        console.error('Error joining group:', error);
    }
}

// Create a group with a shared debt and distribute it
const createGroupWithSharedDebt = async (
    groupName: string,
    adminId: string,
    adminPix: string,
    sharedDebtAmount: number,
    divisionMethod: string,
    members: string[],
) => {
    try {
        // Step 1: Create the group
        const newGroupId = generateGroupId();
        const currentDate = new Date();
        const groupInvite = await generateUniqueGroupInvite();

        const groupData = {
            groupId: newGroupId,
            adminId,
            adminPix,
            debtAmount: sharedDebtAmount,
            debtDescription: "Shared Debt",
            debtFinalDate: currentDate,
            dateCreated: currentDate,
            name: groupName,
            members: [adminId, ...members], // Include admin in members
            groupIdInvite: groupInvite,
        };

        await firestoreSetDoc(groupDocument(newGroupId), groupData);

        // Step 2: Calculate debt distribution based on divisionMethod
        const debtDistribution = calculateDebtDistribution(
            adminId,
            members,
            sharedDebtAmount,
            divisionMethod
        );

        // Step 3: Add individual debts for each member, including the admin
        for (const memberId in debtDistribution) {
            const amount = debtDistribution[memberId];
            const description = "Shared Debt Distribution";
            const debtData = {
                groupId: newGroupId,
                debtorId: memberId,
                amount,
                description,
            };
            await addDebt(debtData);
        }

        // Add the admin's debt separately
        const adminDebtData = {
            groupId: newGroupId,
            debtorId: adminId,
            amount: sharedDebtAmount, // Admin's full share of the debt
            description: "Shared Debt Distribution",
        };
        await addDebt(adminDebtData);

        // Step 4: Update the user document with the group ID
        const userDocRef = userDocument(adminId);

        const userSnapshot = await firestoreGetDoc(userDocRef);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();

            if (userData && Array.isArray(userData.groups)) {
                userData.groups.push(newGroupId);

                await firestoreUpdateDoc(userDocRef, {groups: userData.groups});

                console.log('Admin added to the group and updated successfully');
            }
        }

        console.log("convite:",groupInvite);
        console.log("Group created with shared debt successfully");
        return newGroupId;
    } catch (error) {
        console.error("Error creating group with shared debt:", error);
        return null;
    }
};


// Function to add an individual debt to the 'debts' collection
const addDebt = async (debtData: Debt) => {
    try {
        const currentDate = new Date();

        const debtDocRef = debtDocument(debtData.groupId, debtData.debtorId);
        const debtDataWithPayment = {
            ...debtData,
            isPaid: false,
            datePaid: null,
            dateCreated: currentDate,
        };

        await firestoreSetDoc(debtDocRef, debtDataWithPayment);
    } catch (error) {
        console.error("Error adding individual debt:", error);
    }
};


const setDebtAsPaid = async (groupId, debtorId) => {
    try {
        const debtDocRef = debtDocument(groupId, debtorId);
        const debtSnapshot = await firestoreGetDoc(debtDocRef);

        if (debtSnapshot.exists()) {
            await firestoreUpdateDoc(debtDocRef, {
                isPaid: !debtSnapshot.data().isPaid, // Set the debt as paid
                datePaid: new Date(), // Set the date when the debt was paid
            });

            console.log('Debt marked as paid successfully');
        } else {
            console.log('Debt not found');
        }
    } catch (error) {
        console.error('Error marking debt as paid:', error);
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
    return {};
};

const getGroups = async () => {
    const snapshot = await getDocs(groupsCollection);
    return snapshot.docs.map(doc => doc.data());
};

const getGroupInvites = async () => {
    const snapshot = await getDocs(groupsCollection);
    return snapshot.docs.map(doc => doc.data().groupIdInvite);
};

const getGroupId = async (code) => {
    const snapshot = await getDocs(groupsCollection);
    const matchingGroup = snapshot.docs.find(doc => doc.data().groupIdInvite == code);

    // Check if a matching group was found
    if (matchingGroup) {
        const result = matchingGroup.data().groupId;
        return result;
    } else {
        // Return something meaningful when no matching group is found
        return null; // or throw an error, depending on your use case
    }
};

const generateRandomNumber = () => {
    return Math.floor(1000 + Math.random() * 9000); // Gera um número aleatório de 1000 a 9999
};

const isNumberInGroupIds = async (number) => {
    const existingGroupIds = await getGroupInvites();
    return existingGroupIds.includes(number);
};

const generateUniqueGroupInvite = async () => {
    let randomNumber = await generateRandomNumber();

    while (await isNumberInGroupIds(randomNumber)) {
        randomNumber = await generateRandomNumber();
    }

    return randomNumber;
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
        // Fetch the group data
        const groupSnapshot = await firestoreGetDoc(groupDocument(groupId));

        if (groupSnapshot.exists()) {
            const groupData = groupSnapshot.data();
            const groupMembers = groupData.members || [];

            // Delete the group document
            await firestoreDeleteDoc(groupDocument(groupId));

            console.log('Group deleted successfully');

            // Now, remove the groupId from the 'groups' array of all group members
            for (const memberId of groupMembers) {
                const userDocRef = userDocument(memberId);
                const userSnapshot = await firestoreGetDoc(userDocRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();

                    if (userData && Array.isArray(userData.groups)) {
                        // Remove the groupId from the 'groups' array
                        userData.groups = userData.groups.filter((group) => group !== groupId);

                        // Update the user document with the modified 'groups' array
                        await firestoreUpdateDoc(userDocRef, {groups: userData.groups});
                    }
                }
            }

            console.log(`Removed the group (${groupId}) from the users' 'groups' arrays.`);
        } else {
            console.log('Group not found');
        }
    } catch (error) {
        console.error('Error deleting group:', error);
    }
};

const deleteUserFromGroup = async (groupId: string, userId: string) => {
    try {
        // Calculate the new debt amount per member based on the updated group size and total debt
        const groupDocRef = groupDocument(groupId);
        const groupSnapshot = await firestoreGetDoc(groupDocRef);

        if (groupSnapshot.exists()) {
            const groupData = groupSnapshot.data();

            if (groupData && Array.isArray(groupData.members)) {
                // Check if the user is a member of the group
                if (groupData.members.includes(userId)) {
                    // Calculate the new debt amount per member based on the updated group size and total debt
                    const sharedDebtAmount = groupData.debtAmount;

                    const remainingMembers = groupData.members.filter((member) => member !== userId);
                    const newDebtAmountPerMember = sharedDebtAmount / remainingMembers.length;

                    // Update existing debts for the remaining members with the new amounts
                    for (const memberId of remainingMembers) {
                        const description = "Shared Debt Distribution";
                        const debtDocRef = debtDocument(groupId, memberId);

                        // Check if the debt document exists before updating or deleting it
                        const debtSnapshot = await firestoreGetDoc(debtDocRef);

                        if (debtSnapshot.exists()) {
                            // Update the debt amount for remaining members
                            await firestoreUpdateDoc(debtDocRef, {
                                amount: newDebtAmountPerMember,
                                description,
                            });
                        }
                    }

                    // Delete the user's debt within the group
                    const userDebtDocRef = debtDocument(groupId, userId);
                    await firestoreDeleteDoc(userDebtDocRef);

                    // Remove the user from the group's members array
                    groupData.members = remainingMembers;
                    // Update the group document with the modified members array
                    await firestoreUpdateDoc(groupDocRef, {members: groupData.members});

                    const userDocRef = userDocument(userId);
                    const userSnapshot = await firestoreGetDoc(userDocRef);

                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.data();

                        if (userData && Array.isArray(userData.groups)) {
                            userData.groups = userData.groups.filter((group) => group !== groupId);

                            // Update the user document with the modified groups array
                            await firestoreUpdateDoc(userDocRef, {groups: userData.groups});
                        }
                    }

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

const addUserToGroup = async (groupId, userEmail) => {
    console.log("tentando entrar:", groupId, userEmail)
    try {
        // Check if the user is already a member of the group
        const groupDocRef = groupDocument(groupId);
        const groupSnapshot = await firestoreGetDoc(groupDocRef);

        // Fetch the userId using userEmail
        const userId = await getUserByEmail(userEmail);

        if (!userId) {
            console.log('User not found by email:', userEmail);
            return;
        }

        if (groupSnapshot.exists()) {
            const groupData = groupSnapshot.data();

            if (groupData && Array.isArray(groupData.members)) {
                if (groupData.members.includes(userId)) {
                    console.log('User is already a member of the group');
                    return;
                }

                // Add the user to the group's members array
                groupData.members.push(userId);

                // Update the group document with the modified members array
                await firestoreUpdateDoc(groupDocRef, {members: groupData.members});

                // Create a debt for the user within the group
                const sharedDebtAmount = groupData.debtAmount;
                const newDebtAmountPerMember = sharedDebtAmount / groupData.members.length;
                const description = "Shared Debt Distribution";

                const debtData = {
                    groupId,
                    debtorId: userId,
                    amount: newDebtAmountPerMember,
                    description,
                };

                // Add the user's debt to the 'debts' collection
                await addDebt(debtData);

                // Update the user document with the group ID
                const userDocRef = userDocument(userId);

                const userSnapshot = await firestoreGetDoc(userDocRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();

                    if (userData && Array.isArray(userData.groups)) {
                        userData.groups.push(groupId);

                        // Update the user document with the modified groups array
                        await firestoreUpdateDoc(userDocRef, {groups: userData.groups});
                    }
                }

                // Calculate the updated debt for the admin
                const updatedDebtAmountPerMember = sharedDebtAmount / groupData.members.length;
                const adminDebtData = {
                    groupId,
                    debtorId: groupData.adminId,
                    amount: sharedDebtAmount - updatedDebtAmountPerMember,
                    description,
                };

                // Update the admin's debt in the 'debts' collection
                await addDebt(adminDebtData);

                console.log('User added to the group and updated successfully');
            }
        } else {
            console.log('Group not found');
        }
    } catch (error) {
        console.error('Error adding user to the group:', error);
    }
};

const updateDebtsInGroup = async (groupId, updatedDebtAmountPerMember) => {
    try {
        // Get the group members
        const groupDocRef = groupDocument(groupId);
        const groupSnapshot = await firestoreGetDoc(groupDocRef);

        if (groupSnapshot.exists()) {
            const groupData = groupSnapshot.data();

            if (groupData && Array.isArray(groupData.members)) {
                // Iterate through each member in the group
                for (const memberId of groupData.members) {
                    if (memberId !== groupData.adminId) {
                        const description = "Shared Debt Distribution";
                        const debtDocRef = debtDocument(groupId, memberId);

                        // Check if the debt document exists before updating it
                        const debtSnapshot = await firestoreGetDoc(debtDocRef);

                        if (debtSnapshot.exists()) {
                            // Update the debt amount for each member (except the admin)
                            await firestoreUpdateDoc(debtDocRef, {
                                amount: updatedDebtAmountPerMember,
                                description,
                            });
                        }
                    }
                }
                console.log('Debts updated for all members in the group successfully');
            }
        } else {
            console.log('Group not found');
        }
    } catch (error) {
        console.error('Error updating debts in the group:', error);
    }
};

// Function to get debts for a specific user
const getDebtsForUser = async (userId) => {
    const snapshot = await getDocs(debtsCollection);
    const allDebts = snapshot.docs.map((doc) => doc.data());
    return allDebts.filter((debt) => debt.debtorId === userId);
};

const getPaidDebtsForUser = async (userId) => {
    const snapshot = await getDocs(debtsCollection);
    const allDebts = snapshot.docs.map((doc) => doc.data());
    return allDebts.filter((debt) => debt.debtorId === userId && debt.isPaid == true);
};

const getGroupDebts = async (groupId) => {
    try {
        const groupDocRef = groupDocument(groupId);
        const groupSnapshot = await firestoreGetDoc(groupDocRef);

        if (groupSnapshot.exists()) {
            const groupData = groupSnapshot.data();
            const groupDebts = [];

            if (groupData && Array.isArray(groupData.members)) {
                // Iterate through each member in the group and fetch their debts
                for (const memberId of groupData.members) {
                    const debtDocRef = debtDocument(groupId, memberId);
                    const debtSnapshot = await firestoreGetDoc(debtDocRef);

                    if (debtSnapshot.exists()) {
                        groupDebts.push(debtSnapshot.data());
                    }
                }

                return groupDebts;
            } else {
                console.log('Group has no members');
                return [];
            }
        } else {
            console.log('Group not found');
            return [];
        }
    } catch (error) {
        console.error('Error getting group debts:', error);
        return [];
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
    getDebtsForUser,
    getPaidDebtsForUser,
    setDebtAsPaid,
    getGroupDebts,
    joinAGroupWithCode,
    getGroupId,
};
