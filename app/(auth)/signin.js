import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import React, { useState }  from 'react'
import {router } from 'expo-router'
import { useGlobalContext } from "../context/GlobalProvider";
import { signInUser } from '../lib/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const { setIsAuth, setIsUser, isUser } = useGlobalContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const handleSignIn = async () => {
    setIsAuth(true);
    const user = await AsyncStorage.getItem('user');
    try {
       signInUser(email, password);
       setIsUser(user);
       console.log("May be", user, isUser);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <SafeAreaView>
    <View className="flex-col justify-around gap-10">
      <View>
        <View className=" justify-center text-center mt-5">
          <Text className="text-center font-pbold">Sign In</Text>
        </View>
        <View className="flex-col justify-center gap-3 border-solid rounded-xl border-red-500 ml-1  mt-5">
          <TextInput 
            placeholderTextColor="#000"
            keyboardType='email-address' 
            textContentType='emailAddress' 
            className="bg-white w-[93%] h-12 pl-2 border-solid rounded-xl border-black-100 border-2"
            placeholder='example@mail.com'
            value={email}
            onChangeText={setEmail}
          />
          <TextInput  
              placeholderTextColor="#000"
              textContentType='password' secureTextEntry={true}
              className="bg-white w-[93%] h-12 pl-2 border-solid rounded-xl border-black-100 border-2"
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
          />
          <View>
            <Text>We will call or text to confirm your number. Standard message and data rates apply</Text>
          </View>
          <TouchableOpacity 
            onPress={handleSignIn}
            className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center">
            <Text className="text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-col justify-center text-center ml-1">
        <Text className="text-center">You don't have an account yet?</Text>
        <TouchableOpacity 
          className=" ml-4 p-4  min-h-[24px] w-[90%]  flex justify-center items-center"
          onPress={() => router.replace('./signup')}>
          <Text className="text-black underline text-center">Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>   
    <StatusBar hidden={false} barStyle="dark-content"/>   
  </SafeAreaView>
  )
}

export default SignIn