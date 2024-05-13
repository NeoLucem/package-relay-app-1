import { View, Text, SafeAreaView, FlatList } from 'react-native';
import React from 'react';
// import { SearchTravelerComponent } from '../../components/SearchTravelerComponent';

const checkTravelerScreen = () => {

  const fakeData = {
    name: 'John Doe',
    date: '2022-01-01',
    maxWeight: 10,
  }

  return (
    <SafeAreaView>
      <FlatList 
        data={[fakeData]}
        keyExtractor={(item) => item.name}
        renderItem={({ item })=>(
            <View>
              <Text className="text-black">deo {item.name}</Text>
              <Text className="text-black">deo {item.date}</Text>
              <Text className="text-black">deo {item.maxWeight}</Text>
              {/* <SearchTravelerComponent /> */}
            </View>
          )
        }
        ListHeaderComponent={()=>(
          <>
          <View>
            <Text>Hello</Text>
            
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

export default checkTravelerScreen