import { 
    View, 
    Text, 
    TextInput, 
    ScrollView, 
    Button, 
    SafeAreaView, 
    KeyboardAvoidingView,
    Platform, 
    TouchableWithoutFeedback, 
    Keyboard,
    StatusBar
   } from 'react-native'
  import React, { useState} from 'react'
  
  const DiscussionScreen = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
  
    const sendMessage = () => {
      setMessages([...messages, input]);
      setInput('');
    };
    return (
      <SafeAreaView className="flex-1 h-full">
        <KeyboardAvoidingView clasName="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-between">
            <ScrollView className="flex-1 p-4">
              {messages.map((message, index) => (
                <View key={index} className="bg-gray-200 p-4 rounded-lg my-2">
                  <Text>{message}</Text>
                </View>
              ))}
            </ScrollView>
            <View className="flex-row p-4">
              <TextInput
                value={input}
                onChangeText={setInput}
                className="flex-1 bg-gray-200 rounded-lg p-4 mr-4"
                placeholder="Type a message"
              />
              <Button title="Send" onPress={sendMessage} />
            </View>
          </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <StatusBar hidden={false} barStyle="dark-content"/> 
      </SafeAreaView>
    )
  }
  
  export default DiscussionScreen