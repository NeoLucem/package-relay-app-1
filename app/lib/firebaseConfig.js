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
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// import { useGlobalContext } from '../context/GlobalProvider'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';

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
});
// const storeData = async (value) => {
//     try {
//         const jsonValue = JSON.stringify(value);
//         await AsyncStorage.setItem('my-key', jsonValue);
//       } catch (e) {
//         // saving error
//       }
// };

// storeData(FIREBASE_APP_AUTH);


//Create new user
const createNewUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(FIREBASE_APP_AUTH, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    return error;
  }
};

//Get current user
const getCurrentUser = async () => {
  try {
    onAuthStateChanged(FIREBASE_APP_AUTH, (user) => {
      if (user) {
        const uid = user.uid;
        console.log('display uid',uid, 'user', user)
        return user
      } else {
        console.log('No user is signed in');
      }
    });
  } catch (error) {
    return error;
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
            // console.log('User Json',userJson);
            // console.log('test de deo', user)
            router.replace('/');
            return user
        })
        .catch((error) => {
          console.log(error); 
          Alert.alert('Invalid email or password');  
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

//Fetch user
const fetchUser = async (user) => {
  onAuthStateChanged(FIREBASE_APP_AUTH, (user) => {
    if (user) {
        console.log('User is signed in', user);
        console.log('User is signed in', user.email);
      return  user;
    } else {
      return null;
    }
  });
};



export { FIREBASE_APP, FIREBASE_APP_AUTH, createNewUser, signInUser, fetchUser, signUserOut, getCurrentUser };