import { View, Text, TouchableOpacity, FlatList, SafeAreaView, RefreshControl  } from 'react-native'
import React, {useState, useEffect, useLayoutEffect } from 'react';
import { router } from 'expo-router'
import DiscussionComponent from '../../components/DiscussionComponent';
import { fetchMessagesForChat, fetchAllChats } from '../lib/firebaseConfig';
import { useGlobalContext } from '../context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';

const chat = () => {
  const { isUser, user, loading, setLoading } = useGlobalContext();
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Get the chats from the chat collection in firebase
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchAllChats(isUser.uid, `${user.firstName} ${user.lastName}`);
        const chatList = await AsyncStorage.getItem('chats');
        const chatListData = JSON.parse(chatList);
        console.log(chatListData);
        setChats(chatListData);
        setLoading(false);
        return response;
      } catch (error) {
        throw new Error(error)
      }
    }

    load();
  }, [])

  useLayoutEffect(() => {
    // Get the chats from the chat collection in firebase
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchAllChats(isUser.uid, user.firstName);
        console.log(response)
        console.log('test'+ user.firstName)
        const chatList = await AsyncStorage.getItem('chats');
        const chatListData = JSON.parse(chatList);
        console.log(chatListData);
        setChats(chatListData);
        setLoading(false);
        return response;
      } catch (error) {
        throw new Error(error)
      }
    }

    load();
  }, [])

  //Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await fetchAllChats(user.id, `${user.firstName} ${user.lastName}`);
    const chatList = await AsyncStorage.getItem('chats');
    const chatListData = JSON.parse(chatList);
    console.log(chatListData);
    setChats(chatListData);
    setLoading(false);
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="h-full">
      <View className="justify-start ml-4">
        <Text className="text-xl">Chat</Text>
      </View>
      
      <FlatList
        className="h-full"
        data={chats}
        renderItem={({item}) => {
          const otherParticipant = item.participants.find(participant => participant.userId !== isUser.uid);
          const senderName = item.lastMessage.senderId === isUser.uid ? user.firstName : otherParticipant.userName;
          const messageTime = new Date(item.lastMessage.timestamp.seconds * 1000).toLocaleString();
          return (
          <TouchableOpacity 
            onPress={()=>{
              fetchMessagesForChat(item.id)
              router.push({pathname: '../(screens)/[discussionScreen]', params:{userName: otherParticipant.userName, chat_id: item.id}})
              }
            }
          >
            <DiscussionComponent 
              userName={otherParticipant.userName || 'No Name'}
              lastMessage={item.lastMessage.message}
              time={messageTime}
              discussionId={item.id}
            // profile_pic_url={item.profile_pic_url}
          /> 
          </TouchableOpacity> 
        )}}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <Loader isLoading={loading} />
    </SafeAreaView>
  )
}

export default chat