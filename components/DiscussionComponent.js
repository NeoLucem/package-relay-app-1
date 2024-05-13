import { View, Text, Image } from 'react-native'
import React from 'react';



const DiscussionComponent = ({
        profile_pic_url, 
        userName, 
        lastMessage, 
        time
    }) => {
  return (
    <View
        className="flex-row justify-between items-center ml-[12px] w-[353px] h-[84px] mb-1">
        <View className="flex-row justify-center items-start gap-2">
            <Image source={profile_pic_url} className="w-16 h-16 rounded-full" style={{borderRadius: 100}} width={64} height={64} resizeMode='stretch'/>
            <View className="flex-col gap-1">
                <Text>{userName}</Text>
                <Text>{lastMessage}</Text>
            </View>
        </View>
        <View className="items-start">
            <Text>{time}</Text>
        </View>
    </View>
  )
}

export default DiscussionComponent;
