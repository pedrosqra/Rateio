import {initializeApp} from "firebase/app";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getReactNativePersistence, initializeAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBcY1uy_109mbEI3NGUi7U-8DwAVjiPkWg",
    authDomain: "projetop1-13f5b.firebaseapp.com",
    projectId: "projetop1-13f5b",
    storageBucket: "projetop1-13f5b.appspot.com",
    messagingSenderId: "82680965633",
    appId: "1:82680965633:web:5e77698951264dcbba2e00",
    measurementId: "G-93HLJ2ET6L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export {app, db, firebaseAuth};
