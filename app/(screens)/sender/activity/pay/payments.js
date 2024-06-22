import { StyleSheet, Image, View, Modal, Text, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import { fetchPaymentRequest } from '../../../../lib/firebaseConfig';
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
        const response = await fetchPaymentRequest(isUser.uid);
        const requestsJson = await AsyncStorage.getItem('paymentRequest');
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
          const response = await fetchPaymentRequest(isUser.uid);
          const requestsJson = await AsyncStorage.getItem('paymentRequests');
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
        keyExtractor={(item) => item.payment_req_id}
        renderItem={({ item })=>(
            <View className="rounded-xl justify-start  border-black border-2 gap-1 mt-3 ml-1 w-[96%]">
              <View className="ml-4 justify-start gap-1">
                <Text className="text-black font-pbold">{item.traveler_name} has sent a payment request</Text>
                <Text className="text-black">It is now time to pay the traveler !</Text>
                <Text className="text-black">Check the details of the transaction and proceed to payment.</Text>
              </View>
              <View className="gap-2 justify-center items-center mb-1">
                <TouchableOpacity
                  onPress={() => {
                    AsyncStorage.setItem('image_url_receiver', JSON.stringify(item.image_url));
                    router.push(
                      {
                        pathname: '(screens)/sender/activity/payments/[paymentReq]', 
                        params:{
                          requestId: item.payment_req_id,
                          trip_id: item.tripID,
                          package_id: item.packageID,
                          sender_id: item.senderId,
                          traveler_id: item.traveler_id,
                          budget: item.budget,
                          receiver_img_url: item.image_url,
                          receiver_name: item.receiverName,
                          receiver_number: item.receiverNumber,
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