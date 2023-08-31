// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore";
import {initializeFirestore, CACHE_SIZE_UNLIMITED} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBcY1uy_109mbEI3NGUi7U-8DwAVjiPkWg",
    authDomain: "projetop1-13f5b.firebaseapp.com",
    projectId: "projetop1-13f5b",
    storageBucket: "projetop1-13f5b.appspot.com",
    messagingSenderId: "82680965633",
    appId: "1:82680965633:web:5e77698951264dcbba2e00",
    measurementId: "G-93HLJ2ET6L"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore();

export {app, db};