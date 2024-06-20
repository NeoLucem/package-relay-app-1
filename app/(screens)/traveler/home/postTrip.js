import { 
    Button,
    View, 
    Text, 
    SafeAreaView, 
    TextInput, 
    KeyboardAvoidingView, 
    TouchableOpacity, 
    StatusBar, 
    ScrollView,
    Platform, 
    TouchableWithoutFeedback, 
    Keyboard,
    StyleSheet
   } from 'react-native';
  import React, { useState, useEffect }from 'react';
  // import * as ImagePicker from 'expo-image-picker';
  import RNPickerSelect from 'react-native-picker-select';
  import { router } from 'expo-router';
  import { createNewTrip} from '../../../lib/firebaseConfig';
import { useGlobalContext } from '../../../context/GlobalProvider';
import  Loader  from '../../../../components/Loader';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid'

const postTrip = () => {
    const { user, isUser, setUser,  loading, setLoading } = useGlobalContext();
    
    //Choose route (from)
    const [fromVal , setFromVal] = useState(null);
    const from = [ 
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
    const to = [ 
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

    //Choose transport type
    const [ transportType, setTransportType ] = useState(null);
    const transport = [
        {label: "Bus", value: "Bus", key: "Bus"},
        {label: "Car", value: "Car", key: "Car"},
        {label: "Truck", value: "Truck", key: "Truck"},
        {label: "Bicycle", value: "Bicycle", key: "Bicycle"},
        {label: "Motorcycle", value: "Motorcycle", key: "Motorcycle"},
        {label: "Airplane", value: "Airplane", key: "Airplane"},
        {label: "Boat", value: "Boat", key: "Boat"},
        {label: "Train", value: "Train", key: "Train"},
    ]

    //Date and time modal
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    const [ndate, setNDate] = useState("");
    const [ntime, setNTime] = useState("");

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const showTimePicker = () => {
      setTimePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    //Weight state
    const [weight, setWeight] = useState('');

    //Booking ref
    const [bookingRef, setBookingRef] = useState('');

    //compamy name
    const [companyName, setCompanyName] = useState('');
  
    const handleConfirm = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are 0-indexed in JavaScript
        const day = date.getDate();
        const newDate = `${day}-${month}-${year}`;
        setNDate(newDate);
        console.log(`A date has been picked: ${day}-${month}-${year}`);
        hideDatePicker();
    };
    const handleConfirmTime = (time) => {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const newTime = `${hours}:${minutes}`;
        setNTime(newTime);
        console.log(`A time has been picked: ${hours}:${minutes}`);
        hideTimePicker();
    };

    //Generate a hashed trip id based on the user id and the current date
    function generateUniqueTripId(userId) {
      // Get the current date and time in milliseconds
      const now = Date.now().toString(36); // Convert to base 36 for compact representation
    
      // Generate a random string of 6 characters
      const randomStr = Math.random().toString(36).slice(2, 6);
    
      // Ensure the userId is a part of the tripId and pad it if necessary
      const userIdPart = userId.slice(0, 4).padEnd(4, '0'); // Take first 4 characters of userId
    
      // Combine to form the tripId
      const tripId = `${now}${userIdPart}${randomStr}`.slice(0, 16); // Ensure it's 16 characters long
    
      return tripId;
    }


    //Post request
    const postTrip = async () =>{
      try{
        setLoading(true);
        const trip = {
            travelerId: user.id,
            tripId: uuid(),
            travelerName: `${user.firstName} ${user.lastName}`,
            status: 'pending',
            from: fromVal,
            to: toVal,
            transportType: transportType,
            date: ndate,
            time: ntime,
            weight: weight,
            booking_ref: bookingRef,
            company_name: companyName
        }
        console.log(trip);
        await createNewTrip(trip);
        setLoading(false);
        router.replace('../../../(screens)/success/tripSuccessScreen')
      }catch(error){
        throw new Error(error);
      }
    }

  return (
      <SafeAreaView className="h-full">
        <ScrollView className="h-[90%]">
        <TouchableWithoutFeedback >
          <KeyboardAvoidingView style={{flex: 1, width: '100%', marginLeft: 1}} behavior={Platform.OS === 'ios'? "padding": undefined} keyboardVerticalOffset={60}>
            <View className="flex-col items-start gap-4 justify-around ml-1 mt-2 mb-4">
              <View className="w-full">
                <Text>Routes</Text>
                  <View className="w-[90%]" style={{gap: 2}}>
                      <RNPickerSelect
                          style={pickerSelectStyles}
                          placeholder={{ label: "Select the package destination", value: null }}
                          placeholderTextColor="#000"
                          onValueChange={(fromVal) => setFromVal(fromVal)}
                          items={from}
                          key={from.key}
                      />
                      <RNPickerSelect
                          style={pickerSelectStyles}
                          placeholder={{ label: "Select the package destination", value: null }}
                          placeholderTextColor="#000"
                          onValueChange={(toVal) => setToVal(toVal)}
                          items={to}
                          key={to.key}
                      />
                  </View>
              </View>

              <View className="w-[90%]">
                <Text>Transport type</Text>
                <RNPickerSelect
                  style={pickerSelectStyles}
                  placeholder={{ label: "Select the package destination", value: null }}
                  placeholderTextColor="#000"
                  onValueChange={(transportType) => setTransportType(transportType)}
                  items={transport}
                  key={transport.key}
                />
              </View>

              <View className="w-full">
                  <Text>Trip details</Text>
                  <View className="w-[96%]" style={{gap: 2}}>
                      <TouchableOpacity 
                          onPress={showDatePicker}
                          className="p-4 rounded-lg text-left border-2 border-black-100 min-h-[12px] w-[93%] bg-white flex justify-start items-start"
                      >
                          <Text className="text-black text-left">{ndate? ndate : "Choose date"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                          onPress={showTimePicker}
                          className="p-4 rounded-lg text-left border-2 border-black-100 min-h-[12px] w-[93%] bg-white flex justify-start items-start"
                      >
                          <Text className="text-black text-left">{ntime? ntime : "Choose Time"}</Text>
                      </TouchableOpacity>
                      <TextInput 
                          keyboardType='numeric' 
                          className="bg-white w-[93%] h-12 border-solid rounded-lg border-black-100 border-2 pl-4" 
                          placeholder='Weight KG' 
                          placeholderTextColor="#000"
                          value={weight}
                          onChangeText={setWeight}
                      />
                      <DateTimePickerModal
                          isVisible={isDatePickerVisible}
                          mode="date"
                          onConfirm={handleConfirm}
                          onCancel={hideDatePicker}
                      />
                      <DateTimePickerModal
                          isVisible={isTimePickerVisible}
                          mode="time"
                          locale="en_GB" // Use "en_GB" here
                          date={new Date()}
                          onConfirm={handleConfirmTime}
                          onCancel={hideTimePicker}
                      />
                  </View>
              </View>

              <View className="w-full">
                  <Text>Trip details</Text>
                  <View className="w-[100%]" style={{gap: 2}}>
                      <TextInput 
                              keyboardType='default' 
                              className="bg-white w-[90%] h-12 border-solid rounded-lg border-black-100 border-2 pl-2" 
                              placeholder='Enter booking ref' 
                              placeholderTextColor="#000"
                              value={bookingRef}
                              onChangeText={setBookingRef}
                      />
                      <TextInput 
                              keyboardType='default' 
                              className="bg-white w-[90%] h-12 border-solid rounded-lg border-black-100 border-2 pl-2" 
                              placeholder='Company name' 
                              placeholderTextColor="#000"
                              value={companyName}
                              onChangeText={setCompanyName}
                      />
                  </View>
                  


              </View>

              <TouchableOpacity 
                onPress={postTrip}
                className="p-4 rounded-lg border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center">
                <Text className="text-white">Post request</Text>
              </TouchableOpacity>

            </View>
          </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </ScrollView>
        <Loader isLoading={loading} />
        <StatusBar hidden={false} barStyle="dark-content"/>
      </SafeAreaView>
  )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 2,
      borderColor: 'black',
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

export default postTrip