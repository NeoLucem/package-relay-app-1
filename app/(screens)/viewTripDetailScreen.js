import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

const viewTripDetailScreen = () => {
  const fakeData = [
    {
      name: 'John Doe the traveler',
      date: '2022-01-01',
      from: "Accra",
      to: "Lagos",
      maxWeight: 10,
    },
  ]
  return (
    <SafeAreaView className="h-full">
      <FlatList 
        data={fakeData}
        className="ml-2 mt-1 h-full"
        keyExtractor={(item) => item.name}
        renderItem={({ item })=>(
            <View className="rounded-xl justify-start  border-black border-2 gap-1 mt-3 ml-1 w-[96%]">
              <View className="ml-4 justify-start gap-1">
                <Text className="text-black">{item.name}</Text>
                <Text className="text-black">{item.date}</Text>
                <Text className="text-black">From {item.from} To {item.to}</Text>
                <Text className="text-black">{item.maxWeight}</Text>
              </View>
              <View className="justify-center items-center ml-0 mb-2 w-full">
                <TouchableOpacity className="p-4 rounded-xl border-2 mt-0 ml-0 border-black-100 min-h-[24px] w-[84%] bg-white justify-center items-center">
                  <Text className="text-black">More</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
        ListEmptyComponent={()=>(
          <>
          <View>
            <Text>You have not made any requet yet</Text>
          </View>
          </>
        )}
      />
    </SafeAreaView>
  )
}

export default viewTripDetailScreen