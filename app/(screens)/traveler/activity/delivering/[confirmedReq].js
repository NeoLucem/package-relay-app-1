import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { fetchUserData, getSinglePackage, fetchSingleTrip } from '../../../../lib/firebaseConfig';
import { useGlobalContext } from '../../../../context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../../../components/Loader';

const confirmedReq = () => {
    const { isUser, user, loading, setLoading } = useGlobalContext();
    const { requestId, trip_id, package_id, sender_id, traveler_id } = useLocalSearchParams();
    const [ packageInfo, setPackageInfo ] = useState({});
    const [ tripInfo, setTripInfo ] = useState({});
    const [ senderInfos, setSenderInfos ] = useState({});

    useEffect(() => {
        try {
            fetchUserData(sender_id).then((data) => {
                console.log(data);
                setSenderInfos(data);
            });
        } catch (error) {
            console.warn(error);
            throw new Error(error); 
        }

        const loadPackage = async (package_id) =>{
            try {
                const response = await getSinglePackage(package_id)
                const packageData = await AsyncStorage.getItem('singlePackage');
                const packageDataJson = JSON.parse(packageData);
                console.log(packageDataJson);
                setPackageInfo(packageDataJson);
                console.log("response",response)
            } catch (error) {
                console.warn(error);
                throw new Error(error);
            }
        }
        loadPackage(package_id);
        
        const loadTrip = async (trip_id) =>{
            try {
                const response = await fetchSingleTrip(trip_id)
                const tripData = await AsyncStorage.getItem('singleTrip');
                const tripDataJson = JSON.parse(tripData);
                console.log(tripDataJson);
                setTripInfo(tripDataJson);
                console.log("response",response)
            } catch (error) {
                console.warn(error);
                throw new Error(error);
            }
        };
        loadTrip(trip_id);
    }, []);
  return (
    <ScrollView className="h-full bg-white">
                <View className="p-3 bg-white rounded-lg">
                    <Text className="text-xl font-semibold">Traveler Information</Text>
                </View>

                <View className="p-2 bg-white rounded-lg gap-4 flex-row items-center">
                    {'https://firebasestorage.googleapis.com/v0/b/package-relay-app.appspot.com/o/package_images%2F1718549108707?alt=media&token=ef1e6827-1619-4808-bc50-aa64274889a1' && (
                        <Image
                            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/package-relay-app.appspot.com/o/package_images%2F1718549108707?alt=media&token=ef1e6827-1619-4808-bc50-aa64274889a1' }}
                            className="w-24 h-24 rounded-full ml-4"
                            style={{ width: 80, height: 80 }}
                        />
                    )}
                    <View className="flex-1">
                        <Text className="text-lg mb-1">{senderInfos.firstName} {senderInfos.lastName}</Text>
                        <Text className="text-lg mb-1">{senderInfos.phoneNumber}</Text>
                    </View>
                </View>

                <View className="p-4 bg-white rounded-lg mb-4">
                    <Text className="text-xl font-semibold mb-4">Trip Information</Text>
                    <Text>Booking Reference: {tripInfo.booking_ref}</Text>
                    <Text>Company Name: {tripInfo.company_name}</Text>
                    <Text>Date: {tripInfo.date}</Text>
                    <Text>From: {tripInfo.from}</Text>
                    <Text>To: {tripInfo.to}</Text>
                    <Text>Status: {tripInfo.status}</Text>
                    <Text>Time: {tripInfo.time}</Text>
                    <Text>Transport Type: {tripInfo.transportType}</Text>
                    <Text>Traveler Name: {tripInfo.travelerName}</Text>
                    <Text>Weight: {tripInfo.weight} kg</Text>
                </View>

                <View>
                    <Text>Request deo id: {requestId} {packageInfo.destination}</Text>
                    <Text>trip id: {trip_id}</Text>
                    <Text>package id: {package_id}</Text>
                    <Text>sender id: {sender_id}</Text>
                    <Text>traveler id: {traveler_id}</Text>
                    <Text>Traveler Name: {senderInfos.firstName}</Text>
                </View>


                <View className="p-4 bg-white rounded-lg mb-4">
                    <Text className="text-xl font-semibold mb-4">Package Information</Text>
                    <Text>Budget: {packageInfo.budget}</Text>
                    <Text>Category: {packageInfo.category}</Text>
                    <Text>From: {packageInfo.from}</Text>
                    <Text>Destination: {packageInfo.destination}</Text>
                    <Text>Receiver Name: {packageInfo.receiver_name}</Text>
                    <Text>Status: {packageInfo.status}</Text>
                    <Text>Description: {packageInfo.package_desc}</Text>
                    <Text>Weight: {packageInfo.weight} kg</Text>
                    {packageInfo.image && (
                        <Image
                            source={{ uri: packageInfo.image }}
                            className="w-full h-48 rounded-lg"
                        />
                    )}
                </View>

                <View className="gap-2 justify-center items-center mb-2">
                    <Text className="text-xl font-semibold text-center">Confirm delivery</Text>
                </View>
                <View className="gap-2 justify-center items-center mb-2">
                    <TouchableOpacity 
                        onPress={()=>{
                            console.log('accept request', requestId);
                            router.replace({
                                pathname: '(screens)/traveler/activity/message/[messageToTraveler]',
                                params: {
                                    senderId: sender_id,
                                    receiver_name: packageInfo.receiver_name,
                                    receiver_number: packageInfo.receiver_number,
                                    package_ID: package_id,
                                    trip_ID: trip_id,
                                    request_ID: requestId,
                                    sender_name: `${senderInfos.firstName} ${senderInfos.lastName}`,
                                    sender_budget: packageInfo.budget,
                                }
                            })
                        }
                        }
                        className="p-4  rounded-xl border-2 border-green-600  min-h-[24px] w-[90%] bg-green-600 flex justify-center items-center">
                        <Text className="text-white">Confirm delivery</Text>
                    </TouchableOpacity>
                </View>
                <Loader isLoading={loading} />
    </ScrollView>
  )
}

export default confirmedReq