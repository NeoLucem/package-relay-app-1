import { 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  KeyboardAvoidingView, 
  TouchableOpacity, 
  StatusBar, 
  ScrollView,
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard
 } from 'react-native';
import React from 'react';

const postRequestScreen = () => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="h-full">
        <ScrollView>
          <View className="flex-col items-start gap-4 justify-around ml-2 mt-4 mb-4">
            <View className="w-full">
              <Text>Package description</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='birthdate' 
                />
            </View>
            
            <View className="w-full">
              <Text>Category</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='birthdate' 
                />
            </View>

            <View className="w-full">
              <Text>Budget</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='birthdate' 
                />
            </View>

            <View className="w-full">
              <Text>Package image</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='birthdate' 
                />
            </View>

            <View className="w-full">
              <Text>Package destination</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='birthdate' 
                />
            </View>

            <View className="w-full">
              <Text>Pick up location</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='birthdate' 
                />
            </View>

            <View className="w-full">
              <Text>Receiver's name</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='birthdate' 
                />
            </View>

            <View className="w-full">
              <Text>Receiver's phone number</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='birthdate' 
                />
            </View>

            <TouchableOpacity className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center">
              <Text className="text-white">Post request</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
      </TouchableWithoutFeedback>
      <StatusBar hidden={false} barStyle="dark-content"/>
    </KeyboardAvoidingView>

  )
}

export default postRequestScreen