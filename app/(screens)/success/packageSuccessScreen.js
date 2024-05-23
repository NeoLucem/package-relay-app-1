import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const PackageSuccessScreen = () => {
    return (
        <SafeAreaView className="justify-center items-center h-full">
            <View className="justify-center items-center gap-4">
                <View className="gap-2">
                    <Text>Success! Your package has been delivered.</Text>
                    <Text>This is a success message.</Text> 
                </View>
                <TouchableOpacity
                    onPress={() => router.replace('../../(sender)/home')}
                    className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center"
                >
                    <Text className="text-white">Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PackageSuccessScreen;
