import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const tripSuccessScreen = () => {
  return (
    <SafeAreaView className="justify-center items-center h-full">
        <View className="justify-center items-center gap-4">
            <View className="gap-2">
                <Text>Success! Your trip has been posted.</Text>
            </View>
            <TouchableOpacity
                onPress={() => router.replace('(traveler)/home')}
                className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center"
            >
                <Text className="text-white">Continue</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default tripSuccessScreen