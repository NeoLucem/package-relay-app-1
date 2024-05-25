import { initializeApp } from '@firebase/app';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence, signOut } from "@firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc,  query, where, getDocs, deleteDoc  } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "@firebase/storage";
// import {...} from "firebase/functions";
// import {...} from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';


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

// Initialize Cloud Firestore and get a reference to the service
const FIREBASE_DB_FIRESTORE = getFirestore(FIREBASE_APP);

//Initialize Cloud storage
const FIREBASE_STORAGE = getStorage(FIREBASE_APP, 'gs://package-relay-app.appspot.com')




/******************************************************************** 
 *  In this portion of code,
 *  only the function related to user management will be produced 
 ********************************************************************/
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

// Function to update the user type in Firestore
const updateUserType = async (uid, userType) => {
  try {
    const userDoc = await getDoc(doc(FIREBASE_DB_FIRESTORE, 'users', uid));
    await updateDoc(userDoc.ref, { type: userType });
    console.log(`User type updated to ${userType}`);
  } catch (error) {
    console.error("Error updating user type: ", error);
    throw new Error(error);
  }
};


/******************************************************************** 
 *  In this portion of code,
 *  only the function related to package management will be produced 
 ********************************************************************/

//Function to create a new package, so the package request
const createNewPackage = async (packageData) => {
  try {
    const packageCollection =  collection(FIREBASE_DB_FIRESTORE, 'packages');
    console.log(packageCollection);
    //Create a new document in the package collection with the user's UID 
    const response = await setDoc(doc(packageCollection), packageData);
    console.log(response);
  } catch (error) {
    throw new Error(error);
  }
};

//Upload package images
const uploadPackageImg = async (file_url) =>{
  try {
    const res = await fetch(file_url);
    const blob = await res.blob();
      //Create a storage reference
      // const packageImageRef = ref(FIREBASE_STORAGE, `package_images/${file_url}`)
      const packageImageRef = ref(FIREBASE_STORAGE, "package_images/" + new Date().getTime());
      //Upload file
      const response = await uploadBytes(packageImageRef, blob);
      console.log("File uploaded here is the response ", response)
      return response.ref.name;  
  } catch (error) {
    throw new Error(error)
  }
}

//Download package image via url
const downloadImgUrl = async (image_uri) =>{
  try {
    const response = await getDownloadURL(ref(FIREBASE_STORAGE, `package_images/${image_uri}`));
    console.log("Image url has been downloaded with success ", response)
    return response;
  } catch (error) {
    throw new Error(error)
  }
}

//Cancel package request, this function will delete the package document from the firestore reference
const cancelPackageReq = async (id)=>{
  try {
    //Create a reference to the firestore package collection 
    const packageRef = collection(FIREBASE_DB_FIRESTORE, 'packages');
    // Create a query against the collection.
    const q = query(packageRef, where("status", "==", "pending"), where("package_id", "==", id));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    let docId = ''
    querySnapshot.forEach((doc) => {
      console.log(doc.data().package_id);
      if(doc.data().package_id == id){
        docId = doc.id;
        console.log("Package request found ", doc.id, id);
      }
    });
    const response = await deleteDoc(doc(FIREBASE_DB_FIRESTORE, "packages/"+docId));
    console.log("Package request has been deleted with success ", response);
  } catch (error) {
    throw new Error(error)
  }
}

//Update package information (price)
const updatePackageInfo = async ()=>{}

//Fetch the package offer from the firestore package collection
const fetchPackageOffer = async (id)=>{
  try {
    //Create a reference to the firestore package collection 
    const packageRef = collection(FIREBASE_DB_FIRESTORE, 'packages');
    // Create a query against the collection.
    const q = query(packageRef, where("status", "==", "pending"), where("senderId", "==", id));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    const packageData = [];
    querySnapshot.forEach((doc) => {
      packageData.push(doc.data());
    }); 
    AsyncStorage.setItem('packages', JSON.stringify(packageData));
    return packageData;
  } catch (error) {
    throw new Error(error)
  }
}









/******************************************************************** 
 *  Export of the public services
 ********************************************************************/
export { 
  FIREBASE_APP, 
  FIREBASE_APP_AUTH,
  FIREBASE_DB_FIRESTORE, 
  FIREBASE_STORAGE,
  createNewUser, 
  signInUser, 
  signUserOut, 
  getCurrentUser,
  signInUserAfterOtp,
  fetchUserData,
  updateUserType,
  createNewPackage,
  uploadPackageImg,
  downloadImgUrl,
  cancelPackageReq,
  updatePackageInfo,
  fetchPackageOffer  
};