import { 
    View, 
    Text, 
    SafeAreaView, 
    TouchableOpacity, 
    StatusBar, 
    ScrollView,
    Platform, 
    KeyboardAvoidingView, 
    StyleSheet,
    Image,
    Alert
  } from 'react-native';
  import React, { useState } from 'react';
  import * as ImagePicker from 'expo-image-picker';
  import { router, useLocalSearchParams } from 'expo-router';
  import { sendPaymentRequest, uploadPackageImg, downloadImgUrl } from '../../../../lib/firebaseConfig';
  import { useGlobalContext } from '../../../../context/GlobalProvider';
  import 'react-native-get-random-values'
  import { v4 as uuid } from 'uuid';
import Loader from '../../../../../components/Loader';

  const paymentReq = () => {
    const { isUser, user, loading, setLoading } = useGlobalContext();
    const { receiver_name, receiver_number, package_ID, trip_ID, request_ID, sender_name, budget, sender_id } = useLocalSearchParams();
    const [image, setImage] = useState(null);
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    const uploadImage = async () => {
        try {
          // const filename = image.split('/').pop();
          // console.log('filename', filename)
          const response = await uploadPackageImg(image,  'image/jpeg');
          console.log("response", response)
          return response
        } catch (error) {
          throw  new Error(error);
        }
      }

    //Send payment request
    const sendPaymentReq = async () => {
        setLoading(true);
        let img = '';
        let downloaded_img_url = '';
        if(!image){
            Alert.alert('Please select an image');
            setLoading(false);
            return;
        }else{
            setLoading(true);
            const metadata = {};
            img = await uploadImage(metadata);
            downloaded_img_url = await downloadImgUrl(img);
        }

        const requestData = {
            payment_req_id: uuid(),
            receiverName: receiver_name,
            receiverNumber: receiver_number,
            packageID: package_ID,
            tripID: trip_ID,
            requestID: request_ID,
            budget: budget,
            image_url: await downloadImgUrl(img),
            traveler_id: isUser.uid,
            senderId: sender_id,
            status: 'pending',
            traveler_name: `${user.firstName} ${user.lastName}`,
        }

        try{
            setLoading(true);
            console.log('send payment request');
            const response = await sendPaymentRequest(requestData);
            console.log(response);
            setLoading(false);
            Alert.alert('Payment request sent', 'You have successfully sent a payment request');
            router.replace('(traveler)/home')
        }
        catch(error){
            console.warn(error);
            throw new Error(error);
        }
    };
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <KeyboardAvoidingView 
            style={{ flex: 1, padding: 16 }} 
            behavior={Platform.OS === 'ios' ? "padding" : undefined} 
            keyboardVerticalOffset={60}
          >
            <View style={{ marginVertical: 20 }}>
                <View className="flex-row justify-between" style={{ marginBottom: 8 }}>
                    <Text>Receiver Name</Text>
                    <Text>{receiver_name}</Text>
                </View>
                <View className="flex-row justify-between" style={{ marginBottom: 8 }}>
                    <Text>Receiver Number</Text>
                    <Text>{receiver_number}</Text>
                </View>
                <View className="flex-row justify-between" style={{ marginBottom: 8 }}>
                    <Text>Amount</Text>
                    <Text>{budget} GHS</Text>
                </View>
            </View>
  
            <View style={{ marginVertical: 20 }}>
              <Text style={{ marginBottom: 8 }}>Picture</Text>
              <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Text style={{ color: '#fff' }}>Select Image</Text>
              </TouchableOpacity>
              {image && <Image source={{ uri: image }} style={styles.image}  />}
            </View>
            
            <View className="gap-2 justify-center items-center mb-2">
            <TouchableOpacity
            className="p-4  rounded-xl border-2 border-green-600  min-h-[24px] w-[90%] bg-green-600 flex justify-center items-center"
                onPress={() => {
                    console.log('send payment request');
                    sendPaymentReq();
                }}
            >
                <Text className="text-center">Send payment request</Text>
            </TouchableOpacity>
        </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <Loader isLoading={loading} />
        <StatusBar hidden={false} barStyle="dark-content" />
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    input: {
      backgroundColor: 'white',
      height: 40,
      borderColor: '#000',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#000',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    image: {
      width: 100,
      height: 100,
      marginTop: 20,
    },
  });
  
  export default paymentReq;
  