// import { Client, Account, ID } from 'react-native-appwrite';
import { Client, Account,  } from 'appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6645ec1a00058df5ed70');

const account = new Account(client);


export async function verifyNumber(userId, phoneNumber) {
    try {
            const response = await account.createPhoneToken(
                userId, // userId
                phoneNumber // phone
            );
            console.log(response.userId);
            AsyncStorage.setItem('userId', response.userId);
            return response.userId;
        
    } catch (error) {
        throw new Error(error);
    }
}

export async function checkOtp(userId, secret){
    console.log(`userId: ${userId}, secret: ${Number(secret)}`); // Log the inputs
    try {
            const response = await account.updatePhoneSession(
                userId, // userId
                secret // secret
            );
            console.log(response);

    } catch (error) {
        console.error(error.message);   
        throw new Error(error)
    }
}

// Sign Out Appwrite
export async function signOutAppWrite() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getCurrentUserAppwrite(){
    try {
        const user = await account.get(); // Get the current user
        if (user.role !== 'guest') { // Check the user's role
            console.log(user);
        } else {
            throw new Error('Guests do not have permission to perform this action');
        }
    } catch (error) {
        throw new Error(error);
    }
};