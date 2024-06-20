import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react';
import { router } from 'expo-router';
const activity = () => {
  return (
    <SafeAreaView>
        <View className="justify-start ml-4">
        <Text className="text-xl">Activity</Text>
        </View>
        <View className="flex-col justify-center gap-3 border-solid rounded-xl border-red-500 ml-1 mt-5">
        <TouchableOpacity 
          onPress={()=>router.push('../(screens)/viewMyOfferScreen')}
          className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-white flex justify-center items-center">
            <Text>My offer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={()=>router.push('../(screens)/viewTripDetailScreen')}
          className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-white flex justify-center items-center">
            <Text>View pending requests</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={()=>router.push('../(screens)/viewAcceptedRequests')}
          className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-white flex justify-center items-center">
            <Text>View accepted requests</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={()=>router.push('../(screens)/viewSenderNotificationScreen')}
          className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-white flex justify-center items-center">
            <Text>Notifications</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default activity