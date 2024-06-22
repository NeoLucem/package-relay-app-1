import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {PayWithFlutterwave} from 'flutterwave-react-native';
import {FlutterwaveInit} from 'flutterwave-react-native';

const confimationScreen = () => {
  /* An example function to handle the redirect callback */
  const redirectParams = {
    status: 'successful' | 'cancelled',
    transaction_id: "",
    tx_ref: "",
  };

  /* An example function called when transaction is completed successfully or canceled */
  const handleOnRedirect = (redirectParams) => {
    console.log(redirectParams);
  };

  /* An example function to generate a random transaction reference */
  const generateTransactionRef = (number) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < number; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };

  

  const { 
    senderId,
    receiver_name,
    receiver_number,
    package_ID,
    trip_ID,
    request_ID,
    sender_name,
    sender_budget,
   } = useLocalSearchParams();

    console.log(senderId,
    receiver_name,
    receiver_number,
    package_ID,
    trip_ID,
    request_ID,
    sender_name,
    sender_budget,);

  return (
    <SafeAreaView className="h-full justify-center items-center">
      <View>
        <View className="">
            <Text className="text-center">Confirmation the payment</Text>
        </View>
        <View className="mt-8">
            <Text className="text-center">Amount: {sender_budget} GHS</Text>
        </View>
        <View className="mt-8 mb-20">
            <Text className="text-center">Make payment</Text>
        </View>
        <View className="gap-2 justify-center items-center mb-2">
            <TouchableOpacity
            className="p-4  rounded-xl border-2 border-green-600  min-h-[24px] w-[90%] bg-green-600 flex justify-center items-center"
                onPress={() => {
                    console.log('payment made');
                }}
            >
                <Text className="text-center">Pay !</Text>
            </TouchableOpacity>
        </View>
        <PayWithFlutterwave
          onRedirect={handleOnRedirect}
          options={{
            tx_ref: generateTransactionRef(10),
            authorization: 'FLWPUBK_TEST-9d6bf188b8fbf4f53aa6934ac88ebe34-X',
            customer: {
              email: 'customer-email@example.com'
            },
            amount: 1,
            currency: 'GHS',
            payment_options: 'card',
            redirect_url: 'https://neolucem.github.io'
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default confimationScreen