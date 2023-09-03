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
    updateDoc as firestoreUpdateDoc,
    where
} from 'firebase/firestore';

// Users collection reference
const usersCollection = collection(db, 'users');

// User document reference
function userDocument(userId) {
    return firestoreDoc(usersCollection, userId);
}

// CRUD operations for users
const createUser = async (userData) => {
    try {
        const userIdExists = await checkUserIdExists(userData.userId);
        const pixExists = await checkPixExists(userData.pix);
        const emailExists = await checkEmailExists(userData.email);

        if (userIdExists || pixExists || emailExists) {
            console.error('User with duplicate values already exists');
            return;
        }

        await firestoreSetDoc(userDocument(userData.userId), userData);
        console.log('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

const updateUser = async (userId, updatedFields) => {
    try {
        await firestoreUpdateDoc(userDocument(userId), updatedFields);
        console.log('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

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

// Check if a user ID already exists
const checkUserIdExists = async (userId) => {
    const userSnapshot = await firestoreGetDoc(userDocument(userId));
    return userSnapshot.exists();
};

// Check if a pix value already exists
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

// Check if an email value already exists
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

// Login and Sign-up functions
const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;

        const userData = await readUser(user.uid);

        if (userData) {
        }

        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
};


const signup = async (email, password, userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        const user = userCredential.user;

        const userDocumentData = {
            userId: user.uid,
            email: user.email,
            ...userData
        };

        await firestoreSetDoc(userDocument(user.uid), userDocumentData);

        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
};


export {
    createUser,
    updateUser,
    deleteUser,
    readUser,
    generateUserId,
    login, signup
};