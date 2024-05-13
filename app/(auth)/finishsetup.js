import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import React, {useState} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGlobalContext } from "../context/GlobalProvider";

const FinishSetUp = () => {
    const [date, setDate] = useState(new Date());
    const [birthdate, setBirthdate] = useState('');
    const { isAuth } = useGlobalContext();
    const { setIsAuth } = useGlobalContext();

    const handleDateChange = (e: any, selectedDate: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setBirthdate(`${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`);
        console.log(birthdate);

        if (!isAuth) {
            console.log('User is authenticated');
            setIsAuth;
            console.log(isAuth);
        }else{
            console.log('User is not authenticated');
        }
    };
  return (
    <SafeAreaView>
        <ScrollView>
        <View className="justify-center mt-5">
            <Text className="text-center font-pbold">Finish signing up</Text>
        </View>
        <View className="flex-col justify-around gap-2 ml-1 mt-2">
            <View className="flex-col justify-around gap-2 mb-2">
                <TextInput className="bg-white w-[93%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" placeholder='First Name' placeholderTextColor="#000"/>
                <TextInput className="bg-white w-[93%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" placeholder='Last Name' placeholderTextColor="#000"/>
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
                <TextInput keyboardType='email-address' textContentType='emailAddress' className="bg-white w-[93%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2" placeholder='example@mail.com' placeholderTextColor="#000"/>
                <TextInput textContentType='password' secureTextEntry={true} className="bg-white w-[93%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2 mb-8" placeholder='Password' placeholderTextColor="#000"/>
                <View>
                    <Text>By selecting agree and continue, I agree to Gowith’s
                    Terms of services, Payment Terms of Services, and acknowledge the Privacy Policy.</Text>
                </View>
            </View>
            <View className="flex-col justify-around gap-2 ">
                <TouchableOpacity className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center">
                    <Text className="text-white">Agree & Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default FinishSetUp