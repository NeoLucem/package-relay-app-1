import { View, Text, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { fetchUserData, fetchTripInfoForTraveler, deleteTrip } from '../../../lib/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../../components/Loader';

const viewTripDetails = () => {
  const { isUser, user, setUser, loading, setLoading } = useGlobalContext();
  const [trips, setTrips] = useState([]);  
  const [refreshing, setRefreshing] = useState(false);

  //Refresh the flatlist data
  const refetch = async () => {
    try {
        
      if(isUser){
        const a = await fetchUserData(isUser.uid);
        console.log(a);
        console.log(isUser.uid);
        setUser(a);
        const response = await fetchTripInfoForTraveler(user.id);
        const tripsJson = await AsyncStorage.getItem('trips');
        const tripsData = JSON.parse(tripsJson);
        setTrips(tripsData);
        console.log(response);
        console.log("Test display trip" , tripsData);
        setTrips(tripsData);
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
          const response = await fetchTripInfoForTraveler(user.id);
          const tripsJson = await AsyncStorage.getItem('trips');
          const tripsData = JSON.parse(tripsJson);
          setTrips(tripsData);
          console.log(response);
          console.log("Test display trip" , tripsData);
          setTrips(tripsData);
          setLoading(false);
          return a, response;
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    load();
  }, []);

  //Delete a trip 
  const deleteTripReq = async (id) => {
    try{
      setLoading(true);
      const response = await deleteTrip(id);
      console.log(response);
      await refetch();
      setLoading(false);
    }catch(error){
      throw new Error(error);
    }
  }

  return (
    <SafeAreaView className="h-full">
      <FlatList 
        data={trips}
        className="ml-2 mt-1"
        keyExtractor={(item) => item.tripId}
        renderItem={({ item })=>(
            <View className="rounded-xl justify-start  border-black border-2 gap-1 mt-3 ml-1 w-[96%]">
              <View className="ml-4 justify-start gap-1">
                <Text className="text-black">From {item.from} To {item.to}</Text>
                <Text className="text-black">{item.date}</Text>
                <Text className="text-black">{item.weight} KG</Text>
                <Text className="text-black">Status: {item.status}</Text>
              </View>
              <View className="gap-2 justify-center items-center mb-1">
                <TouchableOpacity style={{marginLeft: 0, marginTop: 0}}
                  className="p-4 mr-3 rounded-xl border-2  border-black-100 min-h-[24px] w-[96%] bg-white flex justify-center items-center">
                  <Text className="text-black">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={()=> {
                    deleteTripReq(item.tripId);
                  }}
                  className="p-4 mr-3 rounded-xl border-2 border-black-100 min-h-[24px] w-[96%] bg-black flex justify-center items-center">
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
        ListEmptyComponent={()=>(
          <>
          <View className="text-center justify-center items-center">
            {/* {loading? loading && <Text>Loading...</Text> : <Text>You have not made any requet yet</Text>} */}
            <Text>{loading? "Loading ...": "You have not made any requet yet"}</Text>
          </View>
          </>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <Loader isLoading={loading} />
    </SafeAreaView>
  )
}

export default viewTripDetails