import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';

const confimationScreen = () => {
  const { 
    senderId,
    receiver_name,
    receiver_number,
    package_ID,
    trip_ID,
    request_ID,
    sender_name,
    sender_budget,
   } = useLocalSearchParams();

    console.log(senderId,
    receiver_name,
    receiver_number,
    package_ID,
    trip_ID,
    request_ID,
    sender_name,
    sender_budget,);
  return (
    <SafeAreaView className="h-full justify-center items-center">
      <View>
        <View className="">
            <Text className="text-center">Confirmation the payment</Text>
        </View>
        <View className="mt-8">
            <Text className="text-center">Amount: {sender_budget} GHS</Text>
        </View>
        <View className="mt-8 mb-20">
            <Text className="text-center">Make payment</Text>
        </View>
        <View className="gap-2 justify-center items-center mb-2">
            <TouchableOpacity
            className="p-4  rounded-xl border-2 border-green-600  min-h-[24px] w-[90%] bg-green-600 flex justify-center items-center"
                onPress={() => {
                    console.log('payment made');
                }}
            >
                <Text className="text-center">Pay !</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default confimationScreen