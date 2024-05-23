import { 
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
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { uploadPackageImg, downloadImgUrl, createNewPackage, fetchUserData } from '../lib/firebaseConfig';
import { useGlobalContext } from '../context/GlobalProvider';
import  Loader  from '../../components/Loader';
import { router } from 'expo-router';





const postRequestScreen = () => {
  const { user, isUser, setUser,  loading, setLoading } = useGlobalContext();
  useEffect(() => {
    const load = async () => {
      try {
        if(isUser){
          const user = await fetchUserData(isUser.uid);
          console.log(user);
          setUser(user);
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    load();
  }, []);

  const [image, setImage] = useState("");

  //Category of items to be sent
  const [categoryVal, setCaategoryVal] = useState(null)
  const category = [
    { label: 'Document', value: 'Document', key: 'Document' },
    { label: 'Electronic', value: 'Electronic', key: 'Electronic' },
    { label: 'Food', value: 'Food', key: 'Food' },
  ]

  //Package description state
  const [packageDescription, setPackageDescription] = useState('')

  //Budget of package
  const [budget, setBudget] = useState('')

  //Receiver's name
  const [receiverName, setReceiverName] = useState('')

  //Receiver's phone number
  const [receiverPhone, setReceiverPhone] = useState('')

  //Destination of package
  const [destinationValue, setDestinationValue] = useState(null)
  const destination = [
    { label: 'Accra', value: 'Accra', key: 'Accra' },
    { label: 'Kumasi', value: 'Kumasi', key: 'Kumasi' },
    { label: 'Brazzaville', value: 'Brazzaville', key: 'Brazzaville' },
    { label: 'Lome', value: 'Lome', key: 'Lome' },
    { label: 'Cotonou', value: 'Cotonou', key: 'Cotonou' },
    { label: 'Abidjan', value: 'Abidjan', key: 'Abidjan' },
  ]

  //Package pick up location
  const [pickUpLocationVal, setPickUpLocationVal] = useState(null);
  const pickUpLocation = [
    { label: 'Accra', value: 'Accra', key: 'Accra' },
    { label: 'Kumasi', value: 'Kumasi', key: 'Kumasi' },
    { label: 'Brazzaville', value: 'Brazzaville', key: 'Brazzaville' },
    { label: 'Lome', value: 'Lome', key: 'Lome' },
    { label: 'Cotonou', value: 'Cotonou', key: 'Cotonou' },
    { label: 'Abidjan', value: 'Abidjan', key: 'Abidjan' },
  ]


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets[0].uri);
    setImage(result.assets[0].uri);

    return result.assets[0].uri;
  };

  const uploadImage = async (metadata) => {
    try {
      const filename = image.split('/').pop();
      console.log('filename', filename)
      const response = await uploadPackageImg(filename, metadata);
      console.log("response", response)
      return response
    } catch (error) {
      throw  new Error(error);
    }
  }

  // Simple hash function to generate a unique ID based on the phone number
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 10) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }



  //Post package request
  const postRequest = async () => {
    const packageObjId = hashCode(user.id);
    setLoading(true);
    try {
      console.log('Posting package request');
      const metadata = {};
      const img= await uploadImage(metadata);
      console.log('img', img)
      const downloadUrl = await downloadImgUrl(img);
      console.log('downloadUrl', downloadUrl);
      const packageData = { 
        senderId: user.id, 
        travelerId: '', 
        package_id: packageObjId, 
        package_desc: packageDescription, 
        budget: budget, 
        receiver_name: receiverName, 
        receiver_name: receiverPhone, 
        category: categoryVal, 
        destination: destinationValue, 
        from: pickUpLocationVal, 
        image: downloadUrl,
        status: ''
      }
      console.log("package data to be submited", packageData)
      
      //Create a new package in the firestore, this will create a new package carry request
      await createNewPackage(packageData);
      // console.log('package', packageObj, user.id)
      console.log('package', user.id)
      console.log('package', user.id, 'package infos submited', )
      setLoading(false);
      router.replace('./success/packageSuccessScreen');

    } catch (error) {
      throw new Error(error)
    }
  }
  return (

      <SafeAreaView className="h-full">
        <ScrollView className="h-full">
        <TouchableWithoutFeedback >
            <KeyboardAvoidingView style={{flex: 1, width: '100%', marginLeft: 1}} behavior={Platform.OS === 'ios'? "padding": undefined} keyboardVerticalOffset={60}>
          <View className="flex-col items-start gap-4 justify-around ml-1 mt-2 mb-4">
            <View className="w-full">
              <Text>Package description</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='name'
                  value={packageDescription}
                  onChangeText={setPackageDescription} 
                />
            </View>

            
            <View className="w-[90%]">
              <Text>Category</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{ label: "Select you favourite language", value: null }}
                placeholderTextColor="#000"
                onValueChange={(categoryVal) => setCaategoryVal(categoryVal)}
                items={category}
                key={category.key}
              />
            </View>

            <View className="w-full">
              <Text>Budget</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  keyboardType='numeric'
                  value={budget}
                  onChangeText={setBudget}
                />
            </View>

            <View className="w-[80%]">
              <Text>Package image</Text>
                <View className="flex-row w-full gap-1 items-center justify-start">
                  <TouchableOpacity onPress={pickImage} className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[30%] bg-black flex justify-center items-center">
                    <Text className="text-white">Select image 1</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={pickImage1} className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[30%] bg-black flex justify-center items-center">
                    <Text className="text-white">Select image 2</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={pickImage2} className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[30%] bg-black flex justify-center items-center">
                    <Text className="text-white">Select image 3</Text>
                  </TouchableOpacity> */}
                </View>
                
            </View>

            <View className="w-[90%]">
              <Text>Package destination</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{ label: "Select the package destination", value: null }}
                placeholderTextColor="#000"
                onValueChange={(destinationValue) => setDestinationValue(destinationValue)}
                items={destination}
                key={destination.key}
              />
            </View>

            <View className="w-[90%]">
              <Text>Pick up location</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{ label: "Select the package destination", value: null }}
                placeholderTextColor="#000"
                onValueChange={(pickUpLocationVal) => setPickUpLocationVal(pickUpLocationVal)}
                items={pickUpLocation}
                key={pickUpLocation.key}
              />
            </View>

            <View className="w-full">
              <Text>Receiver's name</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='name' 
                  value={receiverName}
                  onChangeText={setReceiverName}
                />
            </View>

            <View className="w-full">
              <Text>Receiver's phone number</Text>
                <TextInput 
                  className="bg-white w-[90%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                  placeholder="Enter package description"
                  placeholderTextColor="#000" 
                  textContentType='telephoneNumber' 
                  keyboardType='numeric'
                  value={receiverPhone}
                  onChangeText={setReceiverPhone}
                />
            </View>

 
            <TouchableOpacity 
              onPress={postRequest}
              className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center">
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

export default postRequestScreen