import { StyleSheet, Image, View, Modal, Text, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import { fetchConfirmedCarryRequestFromTraveler } from '../../../../lib/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../../../components/Loader';
import { router } from 'expo-router';

const payments = () => {
    const { isUser, loading, setLoading } = useGlobalContext();
    const [ requests, setRequests ] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

//Refresh request data
  const refetch = async () => {
    try {
        setLoading(true);
        const response = await fetchConfirmedCarryRequestFromTraveler(isUser.uid);
        const requestsJson = await AsyncStorage.getItem('requests');
        const requestsData = JSON.parse(requestsJson);
        setRequests(requestsData);
        console.log("Test display trip" , requestsData);
        setRequests(requestsData);
        setLoading(false);
        return response;
    } catch (error) {
        throw new Error(error);
    }
  };

  //Refresh request data
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    console.log(isUser.uid);
    const load = async () => {
      try {
          setLoading(true);
          const response = await fetchConfirmedCarryRequestFromTraveler(isUser.uid);
          const requestsJson = await AsyncStorage.getItem('requests');
          const requestsData = JSON.parse(requestsJson);
          setRequests(requestsData);
          console.log("Test display trip" , requestsData);
          setRequests(requestsData);
          setLoading(false);
          return response;
      } catch (error) {
        throw new Error(error);
      }
    }
    load();
  }, []);
  return (
    <SafeAreaView className="h-full">
      <FlatList 
        data={requests}
        className="ml-2 mt-1 h-full"
        keyExtractor={(item) => item.requestId}
        renderItem={({ item })=>(
            <View className="rounded-xl justify-start  border-black border-2 gap-1 mt-3 ml-1 w-[96%]">
              <View className="ml-4 justify-start gap-1">
                <Text className="text-black font-pbold">You have accepted {item.senderName}'s request</Text>
              </View>
              <View className="gap-2 justify-center items-center mb-1">
                <TouchableOpacity
                  onPress={() => {
                    router.push(
                      {
                        pathname: '(screens)/traveler/activity/delivering/[confirmedReq]', 
                        params:{
                          requestId: item.requestId,
                          trip_id: item.tripId,
                          package_id: item.packageId,
                          sender_id: item.userId,
                          traveler_id: item.travelerId,
                        }
                      }
                    )
                    }
                  } 
                  style={{marginLeft: 0, marginTop: 0}}
                  className="p-4 mr-3 rounded-xl border-2  border-black-100 min-h-[24px] w-[96%] bg-white flex justify-center items-center">
                  <Text className="text-black">View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
        ListEmptyComponent={()=>(
          <>
          <View>
            <Text>{loading? "Loading ...":"You have not made any requet yet"}</Text>
          </View>
          </>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    <Loader isLoading={loading} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      width: '96%',
      height: '80%',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });
export default payments