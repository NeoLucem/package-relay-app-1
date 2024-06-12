import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
  Dimensions,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
  import { Icon } from 'react-native-elements';
import {useNavigation} from '@react-navigation/native'
import { useGlobalContext } from '../context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

const discussion = () => {
    const { userName, chat_id } = useLocalSearchParams();
    const { isUser, user } = useGlobalContext();
    const [chats, setChats] = useState([]);
    const [chatIds, setChatIds] = useState([]);
    const navigation = useNavigation();
    const [chatUser] = useState({
      name: userName,
      profile_image: 'https://randomuser.me/api/portraits/men/0.jpg',
      last_seen: 'online',
    });
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
      navigation.setOptions({
        title: '',
        headerLeft: () => (
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={{ paddingRight: 10 }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon
                name='angle-left'
                type='font-awesome'
                size={30}
                color='#000'
              />
            </TouchableOpacity>
            <Image
              style={styles.userProfileImage}
              source={{ uri: chatUser.profile_image }}
            />
            <View
              style={{
                paddingLeft: 10,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#000', fontWeight: '700', fontSize: 18 }}>
                {chatUser.name}
              </Text>
              <Text style={{ color: '#000', fontWeight: '300' }}>
                {chatUser.last_seen}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={{ paddingRight: 10 }}
            onPress={() => {
              Alert.alert('Audio Call', 'Audio Call Button Pressed');
            }}
          >
            <Icon name='call' size={28} color='#fff' />
          </TouchableOpacity>
        ),
      });
      
      //Fetch messages
      const loadMessages = async () => {
        try {
          console.log('Chat Screen Loaded', chat_id);
          const response = await AsyncStorage.getItem('messages');
          const messagesJson = JSON.parse(response);
          console.log('Messages', messagesJson);
          setChats(messagesJson);
        } catch (error) {
          throw new Error(error);
        }
      };

      loadMessages();
    }, []);

    //Handle message sending
    const handleSendMessage = async () => {
      try {
        const message = {
          id: chats.length + 1,
          message: inputMessage,
          senderId: isUser.uid,
          time: new Date(),
        };
        console.log('Message', message);
        setInputMessage('');
      } catch (error) {
        throw new Error(error);
      }
    }
  return (
    <SafeAreaView className="flex-1 h-full">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <FlatList
              keyExtractor={item => item.id}
              style={{ backgroundColor: '#f2f2ff' }}
              inverted={true}
              data={chats}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback>
                  <View style={{ marginTop: 6 }}>
                    <View
                      style={{
                        maxWidth: Dimensions.get('screen').width * 0.8,
                        backgroundColor: '#3a6ee8',
                        alignSelf:
                          item.senderId === isUser.uid
                            ? 'flex-end'
                            : 'flex-start',
                        marginHorizontal: 10,
                        padding: 10,
                        borderRadius: 8,
                        borderBottomLeftRadius:
                          item.senderId === isUser.uid ? 8 : 0,
                        borderBottomRightRadius:
                          item.senderId === isUser.uid ? 0 : 8,
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 16,
                        }}
                      >
                        {item.message}
                      </Text>
                      <Text
                        style={{
                          color: '#dfe4ea',
                          fontSize: 14,
                          alignSelf: 'flex-start',
                        }}
                      >
                        {new Date(item.time.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios'? "padding": undefined} keyboardVerticalOffset={96}>
            <View style={{ paddingVertical: 8 }}>
                  <View style={styles.messageInputView}>
                    <TextInput
                      defaultValue={inputMessage}
                      style={styles.messageInput}
                      placeholder='Message'
                      placeholderTextColor={'#000'}
                      onChangeText={(text) => setInputMessage(text)}
                      enablesReturnKeyAutomatically={true}
                      autoCorrect={true}
                      multiline={true}
                      scrollEnabled={true}
                    />
                    <TouchableOpacity
                      style={styles.messageSendView}
                      onPress={() => {
                        handleSendMessage();
                      }}
                    >
                      <Icon name='send' type='material' />
                    </TouchableOpacity>
                  </View>
                
              
            </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
        <StatusBar hidden={false} barStyle="dark-content"/> 
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: { height: '100%', aspectRatio: 1, borderRadius: 100 },
  container: {
    flex: 1,
    backgroundColor: '#f2f2ff',
  },
  messageInputView: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  messageInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  messageSendView: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});
export default discussion