import {db, firebaseAuth} from '../firebase/firebase';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {
    collection,
    deleteDoc as firestoreDeleteDoc,
    doc as firestoreDoc,
    getDoc as firestoreGetDoc,
    getDocs,
    query,
    setDoc as firestoreSetDoc,
    where
} from 'firebase/firestore';
import { User } from '../interfaces/user'

const usersCollection = collection(db, 'users');

function userDocument(userId) {
    return firestoreDoc(usersCollection, userId);
}

const deleteUser = async (userId) => {
    try {
        await firestoreDeleteDoc(userDocument(userId));
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

const readUser = async (userId) => {
    try {
        const userSnapshot = await firestoreGetDoc(userDocument(userId));
        if (userSnapshot.exists()) {
            return userSnapshot.data();
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error reading user:', error);
        return null;
    }
};

const updateUser = async (userId: string, newEmail?: string, newName?: string, newPix?: string) => {
    try {
        const userIdExists = await checkUserIdExists(user.userId);

        if (!userIdExists) {
            console.error('User does not exists');
            return;
        }

        if (typeof newEmail !== 'undefined') {
            await firestoreUpdateDoc(userDocument(userId), {email: newEmail});
        }
        if (typeof newName !== 'undefined') {
            await firestoreUpdateDoc(userDocument(userId), {name: newName});
        }
        if (typeof newPix !== 'undefined') {
            await firestoreUpdateDoc(userDocument(userId), {pix: newPix});
        }
        console.log('User updated successfully');

    } catch (error) {
        console.error('Error updating user:', error);
    }
};

const checkUserIdExists = async (userId) => {
    const userSnapshot = await firestoreGetDoc(userDocument(userId));
    return userSnapshot.exists();
};

const checkPixExists = async (pix) => {
    try {
        const usersRef = collection(db, 'users');
        const emailQuery = query(usersRef, where('pix', '==', pix));
        const querySnapshot = await getDocs(emailQuery);

        return !querySnapshot.empty;
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
};

const checkEmailExists = async (email) => {
    try {
        const usersRef = collection(db, 'users');
        const emailQuery = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(emailQuery);

        return !querySnapshot.empty;
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
};

const generateUserId = () => {
    return firestoreDoc(usersCollection).id;
};

const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        return userCredential.user;
    } catch (error) {
        console.log(error);
        return error;
    }
};

const signOut = async () => {
    try {
        await firebaseAuth.signOut();
        return true; // Sign-out was successful
    } catch (error) {
        console.error('Error signing out:', error);
        return false; // Sign-out failed
    }
}

const signup = async (email, password, name, pix) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;

        const userDocumentData = {
            userId: user.uid,
            groups: [],
            email: email,
            name: name,
            pix: pix,
        };

        await firestoreSetDoc(userDocument(user.uid), userDocumentData);

        return userDocumentData;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const getUsers = async () => {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => doc.data());
}

const getUserData = async (userId) => {
    try {
        const userSnapshot = await firestoreGetDoc(userDocument(userId));
        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const groupIds = userData.groups || [];
            const userDebts = userData.debts || [];
            return {
                userDetails: userData,
                groupIds,
                userDebts,
            };
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error reading user data:', error);
        return null;
    }
};

const getUserByEmail = async (userEmail) => {
    try {
        // Assuming you have a way to query users by email in your database
        const usersRef = collection(db, 'users');
        const emailQuery = query(usersRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(emailQuery);

        if (!querySnapshot.empty) {
            // Assuming there's only one user with a given email
            const userDoc = querySnapshot.docs[0];
            return userDoc.id; // Return the userId
        } else {
            console.log('User not found by email:', userEmail);
            return null;
        }
    } catch (error) {
        console.error('Error getting user by email:', error);
        return null;
    }
};

export {
    deleteUser,
    readUser,
    generateUserId,
    login,
    signup,
    getUsers,
    userDocument,
    getUserData,
    getUserByEmail,
    signOut,
};
