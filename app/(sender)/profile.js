import { View, Text, TouchableOpacity, Image, SafeAreaView, StatusBar  } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { useGlobalContext } from "../context/GlobalProvider";
// import { signUserOut, getCurrentUser } from '../lib/firebaseConfig';
import { signUserOut } from '../lib/firebaseConfig';
// import AsyncStorage from '@react-native-async-storage/async-storage';


const profile = () => {
  const { isAuth, setIsAuth } = useGlobalContext();

  //Logout
  const logout = async () => {
    if(isAuth){
      console.log('Logged out');
      setIsAuth(false);
      signUserOut();
      router.replace('/');      
    }
    setIsAuth(false)
    console.log('Logged out 2');
  };
  // const user = AsyncStorage.getItem('user');
  return (
    <SafeAreaView>
      <View className="justify-start ml-4">
        <Text className="text-xl">Profile</Text>
      </View>
      <View className="mt-4 ml-4">
        <View className="w-full justify-start items-center gap-3 flex-row">
          <Image source={require('../../assets/images/send-img.jpg')} className="w-16 h-16 rounded-full" width={64} height={64} style={{borderRadius: 100}} resizeMode='cover'/>
          <View className="gap-1">
            <Text>Name</Text>
            <Text>Email</Text>
            <Text className="underline text-green-600">You are a Sender</Text>
          </View>
        </View>
      </View>
      <View className="flex-col gap-3 ml-1 mt-4">
        <TouchableOpacity 
          onPress={()=>router.push('../(screens)/editProfileScreen')}
          className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-white flex justify-center items-center">
          <Text>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>router.replace('../../traveler/(tabs)/home')} className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-white flex justify-center items-center">
          <Text>Switch to traveler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={logout}
         className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center">
          <Text className="text-white">Log out</Text>
        </TouchableOpacity>
      </View>
      <StatusBar hidden={false} barStyle="dark-content"/>
    </SafeAreaView>
  )
}

export default profile