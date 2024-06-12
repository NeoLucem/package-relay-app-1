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
// import { fetchMessagesForChat } from '../lib/firebaseConfig';
// import {  sendMessage } from '../lib/firebaseConfig';

  const DiscussionScreen = () => {
    const { isUser, user } = useGlobalContext();
    const [chats, setChats] = useState([]);
    const [chatIds, setChatIds] = useState([]);
    const navigation = useNavigation();
    const [chatUser] = useState({
      name: 'Robert Henry',
      profile_image: 'https://randomuser.me/api/portraits/men/0.jpg',
      last_seen: 'online',
    });
  
    const [currentUser] = useState({
      name: 'John Doe',
    });
  
    const [messages, setMessages] = useState([
      { sender: 'John Doe', message: 'Hey there!', time: '6:01 PM' },
      {
        sender: 'Robert Henry',
        message: 'Hello, how are you doing?',
        time: '6:02 PM',
      },
      {
        sender: 'John Doe',
        message: 'I am good, how about you?',
        time: '6:02 PM',
      },
      {
        sender: 'John Doe',
        message: `😊😇`,
        time: '6:02 PM',
      },
      {
        sender: 'Robert Henry',
        message: `Can't wait to meet you.`,
        time: '6:03 PM',
      },
      {
        sender: 'John Doe',
        message: `That's great, when are you coming?`,
        time: '6:03 PM',
      },
      {
        sender: 'Robert Henry',
        message: `This weekend.`,
        time: '6:03 PM',
      },
      {
        sender: 'Robert Henry',
        message: `Around 4 to 6 PM.`,
        time: '6:04 PM',
      },
      {
        sender: 'John Doe',
        message: `Great, don't forget to bring me some mangoes.`,
        time: '6:05 PM',
      },
      {
        sender: 'Robert Henry',
        message: `Sure!`,
        time: '6:05 PM',
      },
    ]);
  
    const [inputMessage, setInputMessage] = useState('');
    const [ newMessage, setNewMessage ] = useState('');
  
    function getTime(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
  
    function sendMessage() {
      if (inputMessage === '') {
        return setInputMessage('');
      }
      let t = getTime(new Date());
      setMessages([
        ...messages,
        {
          sender: currentUser.name,
          message: inputMessage,
          time: t,
        },
      ]);
      setInputMessage('');
    }


    //Function to handle the send message
    // const handleSendMessage = async () => {

    //   if (inputMessage === '') {
    //      return Alert.alert('Message cannot be empty!');
    //   }
       
    //   if (newMessage.trim()) {
    //     await sendMessage(discussionId, isUser.uid, isUser.name, newMessage);
    //     setNewMessage(''); // Clear the input field after sending the message
    //     const messagesData = await fetchMessagesForChat();
    //     setMessages(messagesData); // Update the messages state to reflect the new message
    //   }
    // };
  
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
          console.log('Chat Screen Loaded', chatIds);
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

    return (
      <SafeAreaView className="flex-1 h-full">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <FlatList
              keyExtractor={item => item.id}
              style={{ backgroundColor: '#f2f2ff' }}
              inverted={true}
              data={chats}
              // data={JSON.parse(JSON.stringify(messages)).reverse()}
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
                        {item.text}
                      </Text>
                      <Text
                        style={{
                          color: '#dfe4ea',
                          fontSize: 14,
                          alignSelf: 'flex-start',
                        }}
                      >
                        {new Date(item.timestamp.seconds * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
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
                      onSubmitEditing={() => {
                        sendMessage();
                      }}
                    />
                    <TouchableOpacity
                      style={styles.messageSendView}
                      onPress={() => {
                        sendMessage();
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
  
  export default DiscussionScreen