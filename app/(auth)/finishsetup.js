import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGlobalContext } from "../context/GlobalProvider";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewUser, signInUserAfterOtp } from '../lib/firebaseConfig';
import { signOutAppWrite } from '../lib/appwriteConfig';
import { router } from 'expo-router';


const FinishSetUp = () => {
    const [date, setDate] = useState(new Date());
    const [birthdate, setBirthdate] = useState('');
    const { setIsAuth, setIsUser } = useGlobalContext();
    const [ firstName, setFirstName ] = useState('');
    const [ lastName, setlastName, ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState();

    // useEffect(() => {
    //     const savePhoneNumber = async () => {
    //         // const phoneNumber = '+233501855039';
    //         try {
    //             // await AsyncStorage.setItem('phone', phoneNumber);
    //             console.log('Phone number saved');
    //             // Get phone number from async storage
    //             const phone = await AsyncStorage.getItem('phone');
    //             console.log(`Here is the phone number from async storage ${phone}`);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };
    //     savePhoneNumber();
    // }, []);

    const handleDateChange = (e, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setBirthdate(`${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`);
        console.log(birthdate);

        // if (!isAuth) {
        //     console.log('User is authenticated');
        //     setIsAuth;
        //     console.log(isAuth);
        // }else{
        //     console.log('User is not authenticated');
        // }
        return birthdate;
    };

    //Handle submission
    const handleSubmit = async () => {
        console.log('User details submitted');
        try {
            //Get the phone number from the async storage
            const phone = await AsyncStorage.getItem('phone');
            //Wrap user's data in a single object
            const userdata = {firstName, lastName, email, birthdate, phone}
            //Test log out user data
            console.log(userdata);
            //Call firebase function
            await createNewUser(email, password, firstName, lastName, birthdate, phone);
            //Sign in new user
            await signInUserAfterOtp(email, password);
            //Delete the appwrite session
            await signOutAppWrite();
            //Set user as authenticated
            setIsAuth(true);
            //Get user from async storage
            const user = await AsyncStorage.getItem('user');
            //Update user context
            setIsUser(JSON.parse(user));
            //Redirect user to the home page
            router.replace('/');
        } catch (error) {
            console.error(error);
        }
    }
  return (
    <SafeAreaView>
        <ScrollView>
        <View className="justify-center mt-5">
            <Text className="text-center font-pbold">Finish signing up</Text>
        </View>
        <View className="flex-col justify-around gap-2 ml-1 mt-2">
            <View className="flex-col justify-around gap-2 mb-2">
                <TextInput 
                    className="bg-white w-[93%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                    placeholder='First Name' 
                    placeholderTextColor="#000"
                    keyboardType='default'
                    textContentType='name'
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput 
                    className="bg-white w-[93%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                    placeholder='Last Name' 
                    placeholderTextColor="#000"
                    keyboardType='default'
                    textContentType='familyName'
                    value={lastName}
                    onChangeText={setlastName}
                />
                <View className="w-[93%] mb-4">
                    <Text>Make sure it matches the name on your government ID</Text>
                </View>
                <View className="w-[93%]">
                    <Text className="font-psemibold">Birthday</Text>
                </View>
                <View className="w-[93%] h-12">
                    <DateTimePicker 
                        mode="date" 
                        value={date} 
                        onChange={handleDateChange}
                        display='default' 
                        dateFormat="dayofweek day month"
                        style={{position: 'absolute', left: 0, borderWidth: 2, borderRadius: 10, borderColor: 'black',marginLeft: 0}}
                    />
                </View>
                <View className="w-[93%]">
                    <Text>To sign up, you need to be at least 18. Your birthday won't be shared with other people who use the platform.</Text>
                </View>
            </View>
            <View className="flex-col justify-around gap-2 ">
                <TextInput 
                    keyboardType='email-address' 
                    textContentType='emailAddress' 
                    className="bg-white w-[93%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" 
                    placeholder='example@mail.com' 
                    placeholderTextColor="#000"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput 
                    textContentType='password' 
                    secureTextEntry={true} 
                    className="bg-white w-[93%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2 mb-8" 
                    placeholder='Password' 
                    placeholderTextColor="#000"
                    value={password}
                    onChangeText={setPassword}
                    
                />
                <View>
                    <Text>By selecting agree and continue, I agree to Gowith’s
                    Terms of services, Payment Terms of Services, and acknowledge the Privacy Policy.</Text>
                </View>
            </View>
            <View className="flex-col justify-around gap-2 ">
                <TouchableOpacity 
                    className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center"
                    onPress={handleSubmit}
                >
                    <Text className="text-white">Agree & Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default FinishSetUp