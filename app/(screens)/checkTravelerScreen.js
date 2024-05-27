import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
// import { SearchTravelerComponent } from '../../components/SearchTravelerComponent';
import { fetchTripInfo, fetchUserData, searchAvailableTraveler, sendCarryRequest, fetchPackageOffer } from '../lib/firebaseConfig';
import { useGlobalContext } from '../context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import Loader from '../../components/Loader';

const checkTravelerScreen = () => {
  const { isUser, user, setUser, loading, setLoading } = useGlobalContext();
  const [trips, setTrips] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false); 

  //Fetch user data when the component is mounted
  useEffect(() => {
    const load = async () => {
      try {
        
        if(isUser){
          setLoading(true);
          const a = await fetchUserData(isUser.uid);
          console.log(a);
          console.log(isUser.uid);
          setUser(a);
          const response = await fetchTripInfo();
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

  //Choose route (from)
  const [fromVal , setFromVal] = useState(null);
  const from1 = [ 
      {label: "Accra", value: "Accra", key: "Accra"}, 
      {label: "Kumasi", value: "Kumasi", key: "Kumasi"},
      {label: "Takoradi", value: "Takoradi", key: "Takoradi"},
      {label: "Brazzaville", value: "Brazzaville", key: "Brazzaville"},
      {label: "Abidjan", value: "Abidjan", key: "Abidjan"},
      {label: "Libreville", value: "Libreville", key: "Libreville"},
      {label: "Lome", value: "Lome", key: "Lome"},
      {label: "Cotonou", value: "Cotonou", key: "Cotonou"},
      {label: "Niamey", value: "Niamey", key: "Niamey"},

  ]

  //Choose route (to)
  const [toVal , setToVal] = useState(null);
  const to1 = [ 
      {label: "Accra", value: "Accra", key: "Accra"}, 
      {label: "Kumasi", value: "Kumasi", key: "Kumasi"},
      {label: "Takoradi", value: "Takoradi", key: "Takoradi"},
      {label: "Brazzaville", value: "Brazzaville", key: "Brazzaville"},
      {label: "Abidjan", value: "Abidjan", key: "Abidjan"},
      {label: "Libreville", value: "Libreville", key: "Libreville"},
      {label: "Lome", value: "Lome", key: "Lome"},
      {label: "Cotonou", value: "Cotonou", key: "Cotonou"},
      {label: "Niamey", value: "Niamey", key: "Niamey"},

  ]

  //Send request 
  const searchTrip = async () => {
    try {
      setLoading(true)
      const searchData = {
        // date: ndate,
        To: toVal,
        From: fromVal
      }
      console.log(searchData);
      const response = await searchAvailableTraveler(fromVal, toVal);
      const tripsJson = await AsyncStorage.getItem('tripsByQuery');
      const tripsData = JSON.parse(tripsJson);
      setTrips(tripsData);
      setLoading(false);
      console.log(response);
    } catch (error) {
      throw new Error(error);
    }
  }

  //Send carry request to a traveler
  const sendRequest = async (tripId, travelerId, packageID) => {
    try {
      if(isUser){
        console.log(isUser.uid);
        console.log("Send carry request", `Trip id: ${tripId}`, `User id: ${isUser.uid}`, `Traveler id: ${travelerId}`);
        const request = {
          tripId: tripId,
          userId: isUser.uid,
          travelerId: travelerId,
          status: "pending",
          packageId: packageID,
        }
        const response = await sendCarryRequest(request);
        console.log(response);
      }
    } catch (error) {
      throw new Error(error);
    }
    
  }

  // const fakeData = [
  //   {
  //     package: 'John Doe the traveler',
  //     date: '2022-01-01',
  //     from: "Accra",
  //     to: "Lagos",
  //   },
  //   {
  //     package: 'John  the traveler',
  //     date: '2022-01-01',
  //     from: "Accra",
  //     to: "Lagos",
  //   },
  //   {
  //     package: 'John ',
  //     date: '2022-01-01',
  //     from: "Accra",
  //     to: "Lagos",
  //   },
  //   {
  //     package: 'John traveler',
  //     date: '2022-01-01',
  //     from: "Accra",
  //     to: "Lagos",
  //   },
  //   {
  //     package: 'the traveler',
  //     date: '2022-01-01',
  //     from: "Accra",
  //     to: "Lagos",
  //   },
  // ]



  //Fetch offer from the package collection to display in the modal
  
  const [packages, setPackages] = useState([]);
  const getPackageFromOffer = async () => {
    try {
      if(isUser){
        const response = await fetchPackageOffer(isUser.uid);
        console.log(response);
        const packagesJson = await AsyncStorage.getItem('packages');
        const packagesData = JSON.parse(packagesJson);
        setPackages(packagesData);
        return response;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  //Push the package id to the carry request
  const pushPackageId = async (trip, traveler) => {
    try {
      getPackageFromOffer();
      AsyncStorage.setItem('tripId', JSON.stringify(trip));
      AsyncStorage.setItem('travelerId', JSON.stringify(traveler));
      setModalVisible(true);
    } catch (error) {
      throw new Error(error);
    }
  }

  const send = async (id) => {
    try {
      console.log('send', id);
      const tripIdJson = await AsyncStorage.getItem('tripId');
      const travelerIdJson = await AsyncStorage.getItem('travelerId');
      const tripIdVal = JSON.parse(tripIdJson);
      const travelerIdVal = JSON.parse(travelerIdJson);
      console.log(`Trip id: ${tripIdVal}`, `Traveler id: ${travelerIdVal}`, `Package id: ${id}`);
      await sendRequest(tripIdVal, travelerIdVal, id);
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <SafeAreaView className="h-full">
       <View className="items-center justify-center bg-black-200 rounded-xl w-[96%] ml-1 mt-2">
        <View className="items-center justify-start w-full py-4">
          <View className="gap-1 justify-start w-[90%]">
            <Text className="text-white">Where is your package going?</Text>
            {/* <View className="bg-white rounded-xl gap-1 py-1">
              <TextInput
                placeholder="Enter destination"
                className="bg-white p-2 w-[90%]"
                placeholderTextColor="#000"
                value={date}
                onChangeText={setDate}
              />
              <TouchableOpacity 
                  onPress={showDatePicker}
                  className="p-4 rounded-lg text-left min-h-[12px] w-[93%] bg-white flex justify-start items-start"
              >
                  <Text className="text-black text-left">{ndate? ndate : "Choose date"}</Text>
              </TouchableOpacity> 
              <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
              /> 
            </View> */}
          </View>
          <View className="gap-1 justify-start w-[90%] mb-2">
            {/* <Text className="text-white">Choose the dates</Text> */}
            <View  style={{ backgroundColor: 'white', gap: 1, paddingVertical: 1, borderRadius: 4}}>
              <RNPickerSelect
                          style={pickerSelectStyles}
                          placeholder={{ label: "From", value: null }}
                          placeholderTextColor="#000"
                          onValueChange={(fromVal) => setFromVal(fromVal)}
                          items={from1}
                          key={from1.key}
                      />
                      <RNPickerSelect
                          style={pickerSelectStyles}
                          placeholder={{ label: "To", value: null }}
                          placeholderTextColor="#000"
                          onValueChange={(toVal) => setToVal(toVal)}
                          items={to1}
                          key={to1.key}
                      />
            </View>
          </View>
          <TouchableOpacity style={{marginLeft: 0, marginTop: 0}}
            onPress={searchTrip}
            className="p-4 rounded-xl border-2  border-black-100 min-h-[24px] w-[96%] bg-white flex justify-center items-center">
            <Text className="text-black">Search</Text>
          </TouchableOpacity>
        </View>
        
      </View> 
      <FlatList 
        keyboardDismissMode='none'
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
            <Text className="text-black">traveler: {item.travelerName}</Text>
          </View>
          <View className="gap-2 justify-center items-center mb-1">
            <TouchableOpacity 
              onPress={()=>pushPackageId(item.tripId, item.travelerId)}
              style={{marginLeft: 0, marginTop: 0}}
              className="p-4 mr-3 rounded-xl border-2  border-black-100 min-h-[24px] w-[96%] bg-white flex justify-center items-center">
              <Text className="text-black">Send Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                sendRequest(item.tripId, item.travelerId);
              }}
              className="p-4 mr-3 rounded-xl border-2 border-black-100 min-h-[24px] w-[96%] bg-black flex justify-center items-center">
              <Text className="text-white">Send request</Text>
            </TouchableOpacity>
          </View>
        </View>
          )
        }
        ListEmptyComponent={()=>(
          <>
          <View>
            <Text>{loading? "Loading ...":"No available trips"}</Text>
          </View>
          </>
        )}
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
            <Text style={styles.modalText}>Select the package to send the request</Text>
            <FlatList
              data={packages}
              keyExtractor={(item) => item.image}
              renderItem={({ item })=>(
                <View className="justify-center items-center w-full mb-2">
                  <View className="flex-row items-center justify-between w-full gap-2">
                    <View className="justify-start text-left">
                      <Text>{item.package_desc}</Text>
                      <Text className="text-black">From {item.from}</Text>
                      <Text className="text-black">To {item.destination}</Text>
                      <Text className="text-black">Before {item.date? item.date : 'no date'}</Text>
                    </View>                  
                    <TouchableOpacity 
                      onPress={()=>{
                          console.log('clicked', item.package_id)
                          send(item.package_id)
                        }
                      }
                      className="p-4 rounded-xl border-2 border-black-100 min-h-[20px] w-[40%] bg-black flex justify-center items-center"
                    >
                      <Text className="text-white">More</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
              )}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
      <Loader isLoading={loading} />
    </SafeAreaView>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

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

export default checkTravelerScreen