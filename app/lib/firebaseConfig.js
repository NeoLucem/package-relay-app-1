import { initializeApp } from '@firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signInWithEmailAndPassword,
    initializeAuth,
    getReactNativePersistence,
    signOut 
 } from "@firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import { getAuth, initializeAuth, getReactNativePersistence  } from "@firebase/auth";
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Optionally import the services that you want to use
// import {...} from "firebase/database";
import { getFirestore, collection, setDoc, doc, getDoc} from "@firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// import { useGlobalContext } from '../context/GlobalProvider'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from 'react-native';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAv__f16J7SPbBnUUhE-Q3MlNpQ9K1PwTY",  
    authDomain: "package-relay-app.firebaseapp.com",  
    projectId: "package-relay-app",  
    storageBucket: "package-relay-app.appspot.com",  
    messagingSenderId: "190886236209",  
    appId: "1:190886236209:web:8b16e3fb667eca40a14510",  
    measurementId: "G-S1R15F0B7Z"  
  };
  
// initialize Firebase App
const FIREBASE_APP = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
const FIREBASE_APP_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});// Initialize Cloud Firestore and get a reference to the service
const FIREBASE_DB_FIRESTORE = getFirestore(FIREBASE_APP);




// Function to create a user document in Firestore
const createUserDocument = async (uid, userData) =>{
  try {
    // Reference to the Firestore collection where user documents are stored
    const usersCollection = collection(FIREBASE_DB_FIRESTORE, 'users');
    // Create a new document in the users collection with the user's UID
    const response = await setDoc(doc(usersCollection, uid), userData);
    console.log(response);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

//Create new user
const createNewUser = async (email, password, fname, lname, birthDate, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(FIREBASE_APP_AUTH, email, password);
    // User signed up successfully
    const user = userCredential.user;

    // Create a user document with additional data in Firestore
    const userData = {
      phoneNumber: phone,
      firstName: fname,
      lastName: lname,
      birthDate: birthDate,
      email: email,
      id: user.uid,
      type: null,
      photoURL: null 
    };

    // Call the function to create the user document
    return createUserDocument(user.uid, userData);
  } catch (error) {
    throw new Error(error);
  }
};

//Get current user
const getCurrentUser = async () => {
  try {
    onAuthStateChanged(FIREBASE_APP_AUTH, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(`here is your uid ${uid}`)
      } else {
        console.log('No user is signed in');
      }
    });
    return uid;
  } catch (error) {
    return error;
  }
};

//Sign in new user after otp
const signInUserAfterOtp = async (email, password) => {
  try {
    await signInWithEmailAndPassword(FIREBASE_APP_AUTH, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      const userJson = JSON.stringify(user);
      AsyncStorage.setItem('user', userJson);
      return userJson;
    })
    .catch((error) => {
      console.log(error);
      // Alert.alert('Invalid email or password');
    });
  } catch (error) {
    console.log(error);
  }
};

//Sign in user
const signInUser = async (email, password) => {
  try {
        await signInWithEmailAndPassword(FIREBASE_APP_AUTH, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const userJson = JSON.stringify(user);
            AsyncStorage.setItem('user', userJson);
            AsyncStorage.setItem('wrongCredentials', 'false')
            return userJson
        })
        .catch((error) => {
          console.log(error); 
          // Alert.alert('Invalid email or password');  
          AsyncStorage.setItem('wrongCredentials', 'true')
        });
  } catch (error) {
    console.log(error); 
  }
};

//Sign out user 
const signUserOut = async () => {
  try {
    await signOut(FIREBASE_APP_AUTH);
  } catch (error) {
    console.log(error);
  }
};

// Function to fetch user data from Firestore
const fetchUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(FIREBASE_DB_FIRESTORE, 'users', uid));
    if (userDoc.exists()) {
      console.log('Document data:', userDoc.data());
      const userData = JSON.stringify(userDoc.data());
      AsyncStorage.setItem('user', userData);
      console.log(userData);
      return userDoc.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw new Error(error);
  }
};




export { 
  FIREBASE_APP, 
  FIREBASE_APP_AUTH,
  FIREBASE_DB_FIRESTORE, 
  createNewUser, 
  signInUser, 
  signUserOut, 
  getCurrentUser,
  signInUserAfterOtp,
  fetchUserData  
};