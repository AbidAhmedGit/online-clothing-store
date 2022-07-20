// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'

import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCL-XJhNBpxt_d4WTk65hpg2EkmjS8Xenc",
    authDomain: "online-clothing-store-a2960.firebaseapp.com",
    projectId: "online-clothing-store-a2960",
    storageBucket: "online-clothing-store-a2960.appspot.com",
    messagingSenderId: "714911128272",
    appId: "1:714911128272:web:797ab965234c162b85dcd5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: "select_account"
})

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
    const userDocRef = doc(db, 'users', userAuth.uid);


    console.log(userDocRef);

    const userSnapshot = await getDoc(userDocRef);
    console.log(userSnapshot);
    console.log(userSnapshot.exists());

    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {displayName, email, createdAt})
        }catch(error) {
            console.log('error creating the user', error.message);
        }
    }

    return userDocRef;
}