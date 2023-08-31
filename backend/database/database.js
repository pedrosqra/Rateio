import { db } from '../firebase/firebase';
import {
    collection,
    doc as firestoreDoc,
    setDoc as firestoreSetDoc,
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

// Check if a group ID already exists
const checkGroupIdExists = async (groupId) => {
    const groupSnapshot = await firestoreGetDoc(groupDocument(groupId));
    return groupSnapshot.exists();
};

const generateGroupId = () => {
    return firestoreDoc(groupsCollection).id;
};

export {
    createGroup,
    generateGroupId
};