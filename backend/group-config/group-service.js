import { db } from '../firebase/firebase';
import {
    collection,
    query,
    where,
    getDocs,
    doc as firestoreDoc,
    setDoc as firestoreSetDoc,
    updateDoc as firestoreUpdateDoc,
    deleteDoc as firestoreDeleteDoc,
    getDoc as firestoreGetDoc
} from 'firebase/firestore';
// Groups collection reference
const groupsCollection = collection(db, 'groups');

// Group document reference
function groupDocument(groupId) {
    return firestoreDoc(groupsCollection, groupId);
}

// CRUD operations for groups
const createGroup = async (groupData) => {
    try {
        const groupIdExists = await checkGroupIdExists(groupData.groupId);

        if (groupIdExists) {
            console.error('Group with duplicate groupId already exists');
            return;
        }

        await firestoreSetDoc(groupDocument(groupData.groupId), groupData);
        console.log('Group created successfully');
    } catch (error) {
        console.error('Error creating group:', error);
    }
};

const updateGroup = async (groupId, updatedFields) => {
    try {
        await firestoreUpdateDoc(groupDocument(groupId), updatedFields); // Corrected
        console.log("Group updated successfully");
    } catch (error) {
        console.error('Error updating group:', error);
    }
};


const deleteGroup = async (groupId) => {
    try {
        await firestoreDeleteDoc(groupDocument(groupId));
        console.log('Group deleted successfully');
    } catch (error) {
        console.error('Error deleting group:', error);
    }
};

const readGroup = async (groupId) => {
    try {
        const groupSnapshot = await firestoreGetDoc(groupDocument(groupId));
        if (groupSnapshot.exists()) {
            return groupSnapshot.data();
        } else {
            console.log('Group not found');
            return null;
        }
    } catch (error) {
        console.error('Error reading group:', error);
        return null;
    }
};

// Check if a group ID already exists
const checkGroupIdExists = async (groupId) => {
    const groupSnapshot = await firestoreGetDoc(groupDocument(groupId));
    return groupSnapshot.exists();
};

const generateGroupId = () => {
    return firestoreDoc(groupsCollection).id;
};

const getGroups = async () => {
    const snapshot = await getDocs(groupsCollection);
    return snapshot.docs.map(doc => doc.data());
}

export {
    createGroup,
    updateGroup,
    deleteGroup,
    readGroup,
    generateGroupId,
    getGroups
};