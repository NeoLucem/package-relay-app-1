import { View, Text, TouchableOpacity, FlatList, SafeAreaView  } from 'react-native'
import React from 'react';
import {router } from 'expo-router'
import DiscussionComponent from '../../components/DiscussionComponent';

const chat = () => {
  return (
    <SafeAreaView>
      <View className="justify-start ml-4">
        <Text className="text-xl">Chat</Text>
      </View>
      
      <FlatList
        data={[
          {
            userName: 'Deo Obomby',
            lastMessage: 'First Item again',
            time: '01:35',
            profile_pic_url: require('../../assets/images/send-img.jpg'),
          },
        ]}
        renderItem={({item}) => (
          <TouchableOpacity onPress={()=>router.push('../(screens)/discussionScreen')}>
            <DiscussionComponent 
            userName={item.userName}
            lastMessage={item.lastMessage}
            time={item.time}
            profile_pic_url={item.profile_pic_url}
          /> 
          </TouchableOpacity> 
        )}
        keyExtractor={item => item.userName}
      />
    </SafeAreaView>
  )
}

export default chat