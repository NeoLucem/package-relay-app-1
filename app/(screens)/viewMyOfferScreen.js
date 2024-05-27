import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/GlobalProvider';
import { fetchPackageOffer, fetchUserData, cancelPackageReq } from '../lib/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';

const viewMyOfferScreen = () => {
  const { 
    isUser, 
    user,
    setUser,
    loading,
    setLoading
  } = useGlobalContext();


  
  const [packages, setPackages] = useState([]);
  
  const [refreshing, setRefreshing] = useState(false);

  const refetch = async () => {
    try {
        
      if(isUser){
        const a = await fetchUserData(isUser.uid);
        console.log(a);
        console.log(isUser.uid);
        setUser(a);
        const response = await fetchPackageOffer(user.id);
        const packagesJson = await AsyncStorage.getItem('packages');
        const packagesData = JSON.parse(packagesJson);
        setPackages(packagesData);
        console.log(response);
        console.log("Test display package" , packagesData);
        setPackages(packagesData);
        return a, response;
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    const load = async () => {
      try {
        
        if(isUser){
          setLoading(true);
          const a = await fetchUserData(isUser.uid);
          console.log(a);
          console.log(isUser.uid);
          setUser(a);
          const response = await fetchPackageOffer(user.id);
          const packagesJson = await AsyncStorage.getItem('packages');
          const packagesData = JSON.parse(packagesJson);
          setPackages(packagesData);
          console.log(response);
          console.log("Test display package" , packagesData);
          setPackages(packagesData);
          setLoading(false);
          return a, response;
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    load();
  }, []);

  return (
    <SafeAreaView className="h-full">
      <FlatList 
        data={packages}
        className="ml-2 mt-1"
        keyExtractor={(item) => item.image}
        renderItem={({ item })=>(
            <View className="rounded-xl justify-start  border-black border-2 gap-1 mt-3 ml-1 w-[96%]">
              <View className="ml-4 justify-start gap-1">
                <Image source={{uri: item.image}} className="w-[90%] h-[200px] rounded-xl" resizeMode='contain'/>
                <Text className="text-black">{item.package_desc}</Text>
                <Text className="text-black">From {item.from} To {item.destination}</Text>
                <Text className="text-black">Before {item.date? item.date : 'no date'}</Text>
              </View>
              <View className="flex-row gap-2 justify-start items-center mb-1">
                <TouchableOpacity className="p-4 rounded-xl border-2 mt-0 ml-0 border-black-100 min-h-[24px] w-[46%] bg-white flex justify-center items-center">
                  <Text className="text-black">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={display}
                  onPress={()=>{
                    cancelPackageReq(item.package_id);
                    refetch();
                  }}
                  className="p-4 rounded-xl border-2 mt-0 ml-0 border-black-100 min-h-[24px] w-[46%] bg-black flex justify-center items-center">
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
        ListEmptyComponent={()=>(
          <>
          <View className="text-center justify-center items-center">
            {loading? loading && <Text>Loading...</Text> : <Text>You have not made any requet yet</Text>}
          </View>
          </>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      
    </SafeAreaView>
  )
}

export default viewMyOfferScreen