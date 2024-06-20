import { initializeApp } from '@firebase/app';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence, signOut } from "@firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, setDoc, doc, getDoc, updateDoc,  query, where, getDocs, deleteDoc, orderBy, addDoc, serverTimestamp, onSnapshot  } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "@firebase/storage";
// import {...} from "firebase/functions";
// import {...} from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Try } from 'expo-router/build/views/Try';


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

//Fetch single package infos or data
const fetchSinglePackage = async (id)=>{
  try {
    //Create a reference to the firestore package collection 
    const packageRef = collection(FIREBASE_DB_FIRESTORE, 'packages');
    // Create a query against the collection.
    const q = query(packageRef, where("package_id", "==", id));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    const packageData = [];
    querySnapshot.forEach((doc) => {
      packageData.push(doc.data());
    }); 
    AsyncStorage.setItem('singlePackage', JSON.stringify(packageData));
    return packageData;
  } catch (error) {
    throw new Error(error)
  }

}





/******************************************************************** 
 *  In this portion of code,
 *  only the function related to trip management will be produced 
 ********************************************************************/

//Function to create a new trip
const createNewTrip = async (tripData) =>{
  try {
    //Reference to the Firestore collection where trips are stored
    const tripsCollection = collection(FIREBASE_DB_FIRESTORE, 'trips');
    //Create a new document in the trips collection with the user's UID
    const response = await setDoc(doc(tripsCollection), tripData);
    console.log(response);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

//Function to fetch trips information
const fetchTripInfo = async ()=>{
  try {
    //Create a reference to the firestore trip collection 
    const tripRef = collection(FIREBASE_DB_FIRESTORE, 'trips');
    // Create a query against the collection.
    const q = query(tripRef, where("status", "==", "pending"));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    const tripData = [];
    querySnapshot.forEach((doc) => {
      tripData.push(doc.data());
    }); 
    AsyncStorage.setItem('trips', JSON.stringify(tripData));
    return tripData;
  } catch (error) {
    throw new Error(error)
  }
}

//Fetch trips for single traveler
const fetchTripInfoForTraveler = async (userId)=>{
  try {
    //Create a reference to the firestore trip collection 
    const tripRef = collection(FIREBASE_DB_FIRESTORE, 'trips');
    // Create a query against the collection.
    const q = query(tripRef, where("status", "==", "pending"), where("travelerId", "==", userId));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    const tripData = [];
    querySnapshot.forEach((doc) => {
      tripData.push(doc.data());
    }); 
    AsyncStorage.setItem('trips', JSON.stringify(tripData));
    return tripData;
  } catch (error) {
    throw new Error(error)
  }

}
//Search available traveler by date, from and to 
const searchAvailableTraveler = async (from, to)=>{
  try {
    //Create a reference to the firestore trip collection 
    const tripRef = collection(FIREBASE_DB_FIRESTORE, 'trips');
    // const newDate = new Date(date.toString())
    // Create a query against the collection.
    const q = query(tripRef, where("status", "==", "pending"), where("from", "==", from), where("to", "==", to), orderBy("date", "asc"));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    const tripData = [];
    querySnapshot.forEach((doc) => {
      tripData.push(doc.data());
    }); 
    AsyncStorage.setItem('tripsByQuery', JSON.stringify(tripData));
    // console.warn("Available traveler has been found ", tripData);
    return tripData;
  } catch (error) {
    throw new Error(error)
  }

}

//Function to update trip information
const updateTripInfo = async ()=>{}

//Function to delete a trip
const deleteTrip = async (trip_id)=>{
  try {
    //Create a reference to the firestore trip collection 
    const tripRef = collection(FIREBASE_DB_FIRESTORE, 'trips');
    // Create a query against the collection.
    const q = query(tripRef, where("tripId", "==", trip_id));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    let docId = ''
    querySnapshot.forEach((doc) => {
      console.log(typeof doc.data());
      console.log(doc.data().tripId);
      console.log(doc.id, '=>',doc.data());
      docId = doc.id;
    });
    console.log("Doc id ", docId);
    const response = await deleteDoc(doc(FIREBASE_DB_FIRESTORE, `trips/${docId}`));
    console.log("Trip has been deleted with success ", response);
  } catch (error) {
    console.warn(error)
    throw new Error(error)
  }
}



/******************************************************************** 
 *  In this portion of code,
 *  only the function related to request management will be produced 
 ********************************************************************/

//Function to fetch request
const fetchCarryRequest = async (userId)=>{
  try {
    //Create a reference to the firestore request collection 
    const requestRef = collection(FIREBASE_DB_FIRESTORE, 'requests');
    // Create a query against the collection.
    const q = query(requestRef, where("status", "==", "pending"), where("travelerId", "==", userId));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    const requestData = [];
    querySnapshot.forEach((doc) => {
      requestData.push(doc.data());
    }); 
    AsyncStorage.setItem('requests', JSON.stringify(requestData));
    return requestData;
  } catch (error) {
    throw new Error(error)
  }
} 

//Fetch carry request with pending status from the sender side 
const fetchCarryRequestFromSender = async (userId)=>{
  try {
    //Create a reference to the firestore request collection 
    const requestRef = collection(FIREBASE_DB_FIRESTORE, 'requests');
    // Create a query against the collection.
    const q = query(requestRef, where("status", "==", "pending"), where("userId", "==", userId));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    const requestData = [];
    querySnapshot.forEach((doc) => {
      requestData.push(doc.data());
    }); 
    AsyncStorage.setItem('requests', JSON.stringify(requestData));
    return requestData;
  } catch (error) {
    throw new Error(error)
  }
} 

//Fetch accepted request with the status accepted from the sender side
const fetchAcceptedCarryRequestFromSender = async (userId)=>{
  try {
    //Create a reference to the firestore request collection 
    const requestRef = collection(FIREBASE_DB_FIRESTORE, 'requests');
    // Create a query against the collection.
    const q = query(requestRef, where("status", "==", "accepted"), where("userId", "==", userId));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    const requestData = [];
    querySnapshot.forEach((doc) => {
      requestData.push(doc.data());
    }); 
    AsyncStorage.setItem('requests', JSON.stringify(requestData));
    return requestData;
  } catch (error) {
    throw new Error(error)
  }
} 

//Fetch accepted request with the status accepted from the traveler side
const fetchAcceptedCarryRequestFromTraveler = async (userId)=>{
  try {
    //Create a reference to the firestore request collection 
    const requestRef = collection(FIREBASE_DB_FIRESTORE, 'requests');
    // Create a query against the collection.
    const q = query(requestRef, where("status", "==", "accepted"), where("travelerId", "==", userId));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    const requestData = [];
    querySnapshot.forEach((doc) => {
      requestData.push(doc.data());
    }); 
    AsyncStorage.setItem('requests', JSON.stringify(requestData));
    return requestData;
  } catch (error) {
    throw new Error(error)
  }
} 

//Send carry request to a traveler 
const sendCarryRequest = async (requestData)=>{
  try {
    //Create a reference to the firestore package collection
    const requestCollection = collection(FIREBASE_DB_FIRESTORE, 'requests');
    console.log(requestCollection);
    //Create a new docment in the request collection with the senderId, the travelerId and the package id, the trip id
    const response = await setDoc(doc(requestCollection), requestData);
    console.log(response);
  } catch (error) {
    throw new Error(error);
  }
}

//Decline Carry request 
const declineCarryRequest = async (request_id) => {
  try {
    const querySnapshot = await getDocs(collection(FIREBASE_DB_FIRESTORE, "requests"));
    let docId = '';
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data().requestId);
      if(doc.data().requestId == request_id){
        console.log("Request found ", doc.id, request_id);
        docId = doc.id;
      }
    });
    //Update the request document from the firestore reference
    const requestDoc = doc(FIREBASE_DB_FIRESTORE, "requests/"+docId);
    await updateDoc(requestDoc, {status: 'declined'});
    console.log("Request has been declined with success ", request_id, docId)
  } catch (error) {
    throw new Error(error)
  }
}

//Accept Carry request
const acceptCarryRequest = async (request_id) => {
  try {
    const querySnapshot = await getDocs(collection(FIREBASE_DB_FIRESTORE, "requests"));
    let docId = '';
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data().requestId);
      if(doc.data().requestId == request_id){
        console.log("Request found ", doc.id, request_id);
        docId = doc.id;
      }
    });
    //Update the request document from the firestore reference
    const requestDoc = doc(FIREBASE_DB_FIRESTORE, "requests/"+docId);
    await updateDoc(requestDoc, {status: 'accepted'});
    console.log("Request has been declined with success ", request_id, docId)
  } catch (error) {
    throw new Error(error)
  }
}


/******************************************************************** 
 *  In this portion of code,
 *  only the function related to chat management will be produced 
 ********************************************************************/

//Get every chat
const getChats = async ()=>{
  try {
    //Create a reference to the firestore chat collection
    const chatRef = collection(FIREBASE_DB_FIRESTORE, 'chats');
    // Create a query against the collection.
    const q = query(chatRef);
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    const chatData = [];
    // const chatParticipants = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      chatData.push(doc.data());
      console.log(" 478 Chat data ", chatData);
      //Stringify the chat data and store it in the async storage
      const chatDataJson = JSON.stringify(chatData);
      console.log(" 481 Chat data json ", chatDataJson);
      AsyncStorage.setItem('chats', chatDataJson);
    });

    //Get the json data from the chat data collection 
    const chatRefJson = await AsyncStorage.getItem('chats');
    console.log('487 Chat data json from async storage ', chatRefJson);
    //Parse the json data
    const parsedData = JSON.parse(chatRefJson);
    console.log('490 Chat data json from async storage ', parsedData);
    parsedData.map((chat)=>{
      console.log(chat);
      console.log(chat.participants)
      chat.participants.map((participant)=>{
        console.log(participant)
        if(participant === 'bdEiwgz1owf6lP7aSNBckGmn2fQ2'){
          console.log("498 Chat participant found ", participant)
        }
      })
    })
    // const chatDataJson = JSON.parse(chatRefJson);

    // chatData.forEach((chat)=>{
    //   console.log("482 Singles Chat data ", chat);
    //   console.log("483 Singles Chat data ", chat.participants);
    //   chatParticipants= chat.participants;
    //   console.log("485 Chat participants ", chatParticipants);
    // });
    // chatParticipants.forEach((participant)=>{
    //   console.log("488 Single participant ", participant);
    // })
  } catch (error) {
    console.warn(error)
    throw new Error(error)
  }
}

//Fetch messages for a single chat 
const fetchMessagesForChat = async (chatId) => {
  try {
    const messagesSnapshot =  collection(FIREBASE_DB_FIRESTORE, 'chats', chatId, 'messages');
    const querySnapshot = await getDocs(messagesSnapshot, orderBy('time', 'asc'));
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    console.log("Messages: ", messages);
    // AsyncStorage.setItem('messages', JSON.stringify(messages));
  } catch (error) {
    console.error("Error fetching messages: ", error);
    return [];
  }
};

//Function to fetch a single chat
const fetchSingleChat = async (chatId) => {
  try {
    const messagesRef =  collection(FIREBASE_DB_FIRESTORE, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('time', 'desc'));
    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    console.log("Messages: ", messages);
    AsyncStorage.setItem('messages', JSON.stringify(messages));
    return messages;
  } catch (error) {
    console.error("Error fetching chat data: ", error);
    throw new Error(error);
  }
};

//Function to send a message 
const sendMessage = async (chatId, user_id, messageText, username) => {
  try {
    //Create a reference to the firestore chats collection
    const messageRef = collection(FIREBASE_DB_FIRESTORE, 'chats', chatId, 'messages');

    //Create a message object
    const messageData = {
      userId: user_id,
      message: messageText,
      time: serverTimestamp()
    };
    
    // Add the message to the messages subcollection
    await addDoc(messageRef, messageData)

    // Update the lastMessage field in the chat document
    const chatRef = doc(FIREBASE_DB_FIRESTORE, 'chats', chatId);
    await updateDoc(chatRef, {
      lastMessage: {
        senderName: username,
        message: messageData.message,
        senderId: user_id,
        timestamp: serverTimestamp(),
      },
    });

    
  } catch (error) {
    console.warn(error);
    throw new Error(error);
  }
};

//Fetch the chats from the chats collection by using the logged in user id
const fetchAllChats = async (userId, userName) => {
  try {
    //Create a reference to the firestore chat collection
    const chatsRef = collection(FIREBASE_DB_FIRESTORE, 'chats');
    // Create a query against the collection.
    const q = query(chatsRef, where("participants", "array-contains", { 'userId': userId, 'userName': userName, 'status': 'online' }));
    //Get the documents from the query
    const querySnapshot = await getDocs(q);
    console.log("Query snapshot ", querySnapshot);
    const chatData = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      chatData.push({ id: doc.id, ...doc.data() });
    }); 
    AsyncStorage.setItem('chats', JSON.stringify(chatData));
    return chatData;
  } catch (error) {
    console.warn(error)
    throw new Error(error)
    
  }
}

//Create a new chat for a demand after sending the request and the request status is pendning
const createNewChat = async (user_id, traveler_id, traveler_name, sender_name ) =>{
  try {
    //Create a reference to the firestore chat collection
    const chatCollectionRef = collection(FIREBASE_DB_FIRESTORE, 'chats');

    const participantIdsComposite = [user_id, traveler_id].sort().join('_');

    //Check if there is a chat with the same participants
    // const q = query(chatCollectionRef, 
    //   where("participants", "array-contains", { 'userId': user_id, 'userName': sender_name, 'status': 'online' }), 
    //   where("participants", "array-contains", { 'userId': traveler_id, 'userName': traveler_name, 'status': 'online'})
    // );
    const q = query(chatCollectionRef, 
      where("participantIdsComposite", "==", participantIdsComposite)
    );

    const querySnapshot = await getDocs(q);

    if(querySnapshot.size > 0){
      console.log('Chat already exists');
      return null;
    }
      
    if(querySnapshot.size <= 0){
      console.log('Chat does not exist');
      //Create a new document in the chat collection with the user's UID
      try {
        await addDoc(chatCollectionRef, {
          lastMessage: {
            senderName: sender_name,
            message: 'Hello, how are you?',
            senderId: user_id,
            timestamp: serverTimestamp(),
            },
            participants: [
              { userId: user_id, userName: sender_name, status: 'online' },
              { userId: traveler_id, userName: traveler_name, status: 'online' }
            ],
            participantIdsComposite: participantIdsComposite,
        });
      } catch (error) {
        console.warn(error)
        throw new Error(error);
      }
    }
  } catch (error) {
    console.warn(error)
    throw new Error(error);
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
  fetchPackageOffer,

  //Trips related exports
  createNewTrip,
  fetchTripInfo,
  fetchTripInfoForTraveler,
  searchAvailableTraveler,
  deleteTrip,

  sendCarryRequest,
  fetchCarryRequest,
  fetchCarryRequestFromSender,
  fetchAcceptedCarryRequestFromTraveler,
  fetchAcceptedCarryRequestFromSender,
  fetchSinglePackage,
  declineCarryRequest,
  acceptCarryRequest,
  getChats,
  fetchMessagesForChat,
  sendMessage,
  
  //test new implementation
  fetchAllChats,
  fetchSingleChat,
  createNewChat
};