import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const SearchTravelerComponent = ({ query, onSearch }) => {
  // Destructure the query props
  const { destination, from, to } = query;

  // Search states initialized with the props
  const [localDestination, setLocalDestination] = useState(destination || "");
  const [localFrom, setLocalFrom] = useState(from || "");
  const [localTo, setLocalTo] = useState(to || "");

  return (
    <View className="items-center justify-center bg-black-200 rounded-xl w-[96%] ml-1 mt-2">
      <View className="items-center justify-start w-full py-4">
        <View className="gap-1 justify-start w-[90%]">
          <Text className="text-white">Where is your package going?</Text>
          <View className="bg-white rounded-xl gap-1 py-1">
            <TextInput
              focusable={true}
              placeholder="Enter destination"
              className="bg-white p-2 w-[90%]"
              placeholderTextColor="#000"
              value={localDestination}
              onChangeText={setLocalDestination}
            />
          </View>
        </View>

        <View className="gap-1 justify-start w-[90%] mb-2">
          <Text className="text-white">Choose the dates</Text>
          <View className="bg-white rounded-xl gap-1 py-1">
            <TextInput
              placeholder="From"
              className="bg-white p-2 w-[90%]"
              placeholderTextColor="#000"
              value={localFrom}
              onChangeText={setLocalFrom}
            />
            <TextInput
              placeholder="To"
              className="bg-white p-2 w-[90%]"
              placeholderTextColor="#000"
              value={localTo}
              onChangeText={setLocalTo}
            />
          </View>
        </View>
        <TouchableOpacity style={{ marginLeft: 0, marginTop: 0 }}
          onPress={() => onSearch({ destination: localDestination, from: localFrom, to: localTo })}
          className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[96%] bg-white flex justify-center items-center">
          <Text className="text-black">Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchTravelerComponent;
