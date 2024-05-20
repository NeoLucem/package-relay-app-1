import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard 
} from 'react-native';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { checkOtp } from '../lib/appwriteConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ValidateOtp = () => {
    const [secret, setSecret] = useState(''); //Store the secret code sent to the user
    //Submit otp code for checking
    const handleSubmitOtp = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                console.error('userId is not defined');
                return;
            }else{
                console.log("The user id is here ",userId);
                await checkOtp(userId, secret);
                router.replace('./finishsetup')
            }
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView>
                <View className="justify-center mt-5">
                    <Text className="text-center font-pbold">Verification</Text>
                </View>
                <View className="flex-col justify-around gap-2 ml-1 mt-2">
                    <View className="flex-col justify-around gap-2 mb-2"><View className="w-[93%] mb-4">
                        <Text className="font-pextrabold">We just send you an SMS</Text>
                    </View>
                    <TextInput 
                        placeholderTextColor="#000" 
                        keyboardType='numeric' 
                        textContentType='oneTimeCode' 
                        className="bg-white w-[93%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2 mb-10" 
                        placeholder='Verification code'
                        onChangeText={setSecret}
                        value={secret}
                    />
                    <View className="w-[93%] justify-center">
                        <TouchableOpacity>
                            <Text className="underline text-center">Didn't receive a code?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                    
                <View className="flex-col justify-around gap-2 mt-5">
                    <TouchableOpacity 
                        onPress={handleSubmitOtp}
                        // onPress={() => router.replace('./finishsetup')} 
                        className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center">
                        <Text className="text-white">Verify</Text>
                    </TouchableOpacity>
                </View>
                </View>
                <StatusBar hidden={false} barStyle="dark-content" />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ValidateOtp