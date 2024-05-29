import { StyleSheet, Image, View, Modal, Text, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { 
  fetchCarryRequest, 
  fetchSinglePackage, 
  declineCarryRequest,
  acceptCarryRequest 
} from '../../../lib/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../../components/Loader';

const viewCarryRequest = () => {
  const { isUser, setUser, loading, setLoading } = useGlobalContext();
  const [ requests, setRequests ] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [packageInfo, setPackageInfo] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  //Refresh request data
  const refetch = async () => {
    try {
        setLoading(true);
        const response = await fetchCarryRequest(isUser.uid);
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
          const response = await fetchCarryRequest(isUser.uid);
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

  //Fetch package data to display it
  const getPackageInfo = async (id) => {
    try{
      console.log('test', id)
      const response = await fetchSinglePackage(id);
      const singlePackageJson = await AsyncStorage.getItem('singlePackage');
      const singlePackageData = JSON.parse(singlePackageJson);
      setPackageInfo(singlePackageData);
      console.log(response);
    }catch(error){
      throw new Error(error);
    }
  }

  //Decline request
  const declineRequest = async (id) => {
    try {
      setLoading(true);
      console.log('decline request', id)
      const response = await declineCarryRequest(id);
      console.log(response);
      setLoading(false);
    } catch (error) {
      throw new Error(error);
    }
  }
  //Accept request
  const acceptRequest = async (id) => {
    try {
      setLoading(true);
      console.log('accept request', id)
      const response = await acceptCarryRequest(id);
      console.log(response);
      setLoading(false);
    } catch (error) {
      throw new Error(error);
    }
  }


  return (
    <SafeAreaView className="h-full">
      <FlatList 
        data={requests}
        className="ml-2 mt-1 h-full"
        keyExtractor={(item) => item.requestId}
        renderItem={({ item })=>(
            <View className="rounded-xl justify-start  border-black border-2 gap-1 mt-3 ml-1 w-[96%]">
              <View className="ml-4 justify-start gap-1">
                <Text className="text-black">{item.status}</Text>
                <Text className="text-black">{item.travelerId}</Text>
                <Text className="text-black">{item.userId}</Text>
                <Text className="text-black">{item.packageId}</Text>
                <Text className="text-black">{item.tripId}</Text>
                <Text className="text-black">{item.requestId}</Text>
              </View>

              <View className="gap-2 justify-center items-center mb-1">
                <TouchableOpacity
                  onPress={() => {
                    getPackageInfo(item.packageId);
                    setModalVisible(true)
                    }
                  } 
                  style={{marginLeft: 0, marginTop: 0}}
                  className="p-4 mr-3 rounded-xl border-2  border-black-100 min-h-[24px] w-[96%] bg-white flex justify-center items-center">
                  <Text className="text-black">View Package</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log('accept request')
                    acceptRequest(item.requestId)
                    refetch();
                  }}
                  className="p-4 mr-3 rounded-xl border-2 border-black-100 min-h-[24px] w-[96%] bg-black flex justify-center items-center">
                  <Text className="text-white">Accept request</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log('cancel request')
                    declineRequest(item.requestId)
                    refetch();
                  }} 
                  className="p-4 mr-3 rounded-xl border-2 border-black-100 min-h-[24px] w-[96%] bg-gray-400 flex justify-center items-center">
                  <Text className="text-white">Cancel</Text>
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
      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Package details</Text>
            <FlatList 
              data={packageInfo}
              keyExtractor={(item) => item.image}
              renderItem={({ item })=>(
                <View className="ml-4 justify-start gap-1">
                  <Image source={{uri: item.image}} className="w-[90%] h-[200px] rounded-xl" resizeMode='contain'/>
                  <Text className="text-black">{item.package_desc}</Text>
                  <Text className="text-black">From {item.from} To {item.destination}</Text>
                  <Text className="text-black">Before {item.date? item.date : 'no date'}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>            
          </View>
        </View>
      </Modal>
    </View>
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

export default viewCarryRequest