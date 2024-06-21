import { View, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native'
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
        onPress={() => router.push('(screens)/traveler/activity/viewTripDetails')}
        className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-white flex justify-center items-center">
        <Text>My trip</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => router.push('(screens)/traveler/activity/viewCarryRequest')}
        className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-white flex justify-center items-center">
        <Text>View carry requests</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => router.push('(screens)/traveler/activity/viewAcceptedRequest')}
        className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-white flex justify-center items-center">
        <Text>View accepted requests</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => router.push('(screens)/traveler/activity/delivering')}
        className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-white flex justify-center items-center">
        <Text>Delivering</Text>
      </TouchableOpacity>
    </View>
    <StatusBar hidden={false} barStyle="dark-content"/>
  </SafeAreaView>
  )
}

export default activity