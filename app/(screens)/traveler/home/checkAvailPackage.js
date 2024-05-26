import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

const checkAvailPackage = () => {

  const fakeData = [
    {
      name: 'John Oh',
      date: '2022-01-01',
      from: "Accra",
      to: "Lagos",
      maxWeight: 10,
    },
    {
      name: 'John My',
      date: '2022-01-01',
      from: "Abidjan",
      to: "Lagos",
      maxWeight: 10,
    },
    {
      name: 'John Holly',
      date: '2022-01-01',
      from: "Brazzaville",
      to: "Lagos",
      maxWeight: 10,
    },
    {
      name: 'John God',
      date: '2022-01-01',
      from: "Abuja",
      to: "Lagos",
      maxWeight: 10,
    },
  ]
  return (
    <SafeAreaView className="h-full">
      <FlatList 
        data={fakeData}
        className="ml-2 mt-1"
        keyExtractor={(item) => item.name}
        renderItem={({ item })=>(
            <View className="rounded-xl justify-start  border-black border-2 gap-1 mt-3 ml-1 w-[96%]">
              <View className="ml-4 justify-start gap-1">
                <Text className="text-black">{item.name}</Text>
                <Text className="text-black">{item.date}</Text>
                <Text className="text-black">From {item.from} To {item.to}</Text>
                <Text className="text-black">{item.maxWeight}</Text>
              </View>
              <View className="flex-row gap-2 justify-start items-center mb-1">
                <TouchableOpacity className="p-4 rounded-xl border-2 mt-0 ml-0 border-black-100 min-h-[24px] w-[46%] bg-white flex justify-center items-center">
                  <Text className="text-black">Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-4 rounded-xl border-2 mt-0 ml-0 border-black-100 min-h-[24px] w-[46%] bg-black flex justify-center items-center">
                  <Text className="text-white">Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
        ListHeaderComponent={()=>(
          <>
            <View className="items-center justify-center bg-black-200 rounded-xl w-[90%] ml-4 mt-2">
              <View className="items-center justify-start w-full py-4">
                <View className="gap-1 justify-start w-[90%]">
                  <Text className="text-white">Where is your package going?</Text>
                  <View className="bg-white rounded-xl gap-1 py-1">
                    <TextInput
                      placeholder="Enter destination"
                      className="bg-white p-2 w-[90%]"
                      placeholderTextColor="#000"
                    />
                  </View>
                </View>

                <View className="gap-1 justify-start w-[90%]">
                  <Text className="text-white">Choose the dates</Text>
                  <View className="bg-white rounded-xl gap-1 py-1">
                    <TextInput
                      placeholder="From"
                      className="bg-white p-2 w-[90%]"
                      placeholderTextColor="#000"
                    />
                    <TextInput
                      placeholder="To"
                      className="bg-white p-2 w-[90%]"
                      placeholderTextColor="#000"
                    />
                  </View>
                </View>
              </View>
          </View>
          </>
          
        )}
        ListEmptyComponent={()=>(
          <>
          <View>
            <Text>Empty</Text>
          </View>
          </>
        )}
      />
    </SafeAreaView>
  )
}

export default checkAvailPackage