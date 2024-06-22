import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';

const messageToTraveler = () => {
    const { receiver_name, receiver_number, package_ID, trip_ID, request_ID, sender_name, sender_budget, senderId, traveler_name } = useLocalSearchParams();
    console.log(receiver_name, receiver_number, package_ID, trip_ID, request_ID, senderId, sender_name, traveler_name);
  return (
    <SafeAreaView className="h-full">
        <View className="mt-8">
            <Text className="text-center">Confirmation of delivery</Text>
        </View>
        <View className="mt-8">
            <Text className="text-center">Please ensure to take a picture of the receiver and the package</Text>
            <Text className="text-center">Receiver's name: {receiver_name}</Text>
            <Text className="text-center">Receiver's numbe: {receiver_number}</Text>
        </View>
        <View className="mt-8">
            <Text className="text-center">Send a payment request to {sender_name}</Text>
        </View>
        <View className="gap-2 justify-center items-center mb-2">
            <TouchableOpacity
            className="p-4  rounded-xl border-2 border-green-600  min-h-[24px] w-[90%] bg-green-600 flex justify-center items-center"
                onPress={() => {
                    console.log('send payment request');
                    router.replace({
                        pathname: '(screens)/traveler/activity/paymentRequest/[paymentReq]',
                        params: {
                            receiver_name: receiver_name,
                            receiver_number: receiver_number,
                            package_ID: package_ID,
                            trip_ID: trip_ID,
                            request_ID: request_ID,
                            sendername: sender_name,
                            budget: sender_budget,
                            sender_id: senderId,
                            travelerName: traveler_name,
                        }
                    })
                }}
            >
                <Text className="text-center">Send payment request</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default messageToTraveler