import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    SafeAreaView, 
    StatusBar    
} from 'react-native';
import React,  { useEffect, useState } from 'react';
import {router} from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import { useGlobalContext } from "../context/GlobalProvider";
import { verifyNumber } from '../lib/appwriteConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignUp = () => {
    const { isAuth, setIsAuth } = useGlobalContext();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Afghanistan +93', value: '+93' },
        { label: 'Albania +355', value: '+355' },
        { label: 'Algeria +213', value: '+213' },
        { label: 'Andorra +376', value: '+376' },
        { label: 'Angola +244', value: '+244' },
        { label: 'Antigua and Barbuda +1-268', value: '+1-268' },
        { label: 'Argentina +54', value: '+54' },
        { label: 'Armenia +374', value: '+374' },
        { label: 'Australia +61', value: '+61' },
        { label: 'Austria +43', value: '+43' },
        { label: 'Azerbaijan +994', value: '+994' },
        { label: 'Bahamas +1-242', value: '+1-242' },
        { label: 'Bahrain +973', value: '+973' },
        { label: 'Bangladesh +880', value: '+880' },
        { label: 'Barbados +1-246', value: '+1-246' },
        { label: 'Belarus +375', value: '+375' },
        { label: 'Belgium +32', value: '+32' },
        { label: 'Belize +501', value: '+501' },
        { label: 'Benin +229', value: '+229' },
        { label: 'Bhutan +975', value: '+975' },
        { label: 'Bolivia +591', value: '+591' },
        { label: 'Bosnia and Herzegovina +387', value: '+387' },
        { label: 'Botswana +267', value: '+267' },
        { label: 'Brazil +55', value: '+55' },
        { label: 'Brunei +673', value: '+673' },
        { label: 'Bulgaria +359', value: '+359' },
        { label: 'Burkina Faso +226', value: '+226' },
        { label: 'Burundi +257', value: '+257' },
        { label: 'Cabo Verde +238', value: '+238' },
        { label: 'Cambodia +855', value: '+855' },
        { label: 'Cameroon +237', value: '+237' },
        { label: 'Canada +1', value: '+1' },
        { label: 'Central African Republic +236', value: '+236' },
        { label: 'Chad +235', value: '+235' },
        { label: 'Chile +56', value: '+56' },
        { label: 'China +86', value: '+86' },
        { label: 'Colombia +57', value: '+57' },
        { label: 'Comoros +269', value: '+269' },
        { label: 'Congo (Democratic Republic of the) +243', value: '+243' },
        { label: 'Congo (Republic of the) +242', value: '+242' },
        { label: 'Costa Rica +506', value: '+506' },
        { label: 'Croatia +385', value: '+385' },
        { label: 'Cuba +53', value: '+53' },
        { label: 'Cyprus +357', value: '+357' },
        { label: 'Czech Republic +420', value: '+420' },
        { label: 'Denmark +45', value: '+45' },
        { label: 'Djibouti +253', value: '+253' },
        { label: 'Dominica +1-767', value: '+1-767' },
        { label: 'Dominican Republic +1-809, +1-829, +1-849', value: '+1-809, +1-829, +1-849' },
        { label: 'East Timor +670', value: '+670' },
        { label: 'Ecuador +593', value: '+593' },
        { label: 'Egypt +20', value: '+20' },
        { label: 'El Salvador +503', value: '+503' },
        { label: 'Equatorial Guinea +240', value: '+240' },
        { label: 'Eritrea +291', value: '+291' },
        { label: 'Estonia +372', value: '+372' },
        { label: 'Eswatini +268', value: '+268' },
        { label: 'Ethiopia +251', value: '+251' },
        { label: 'Fiji +679', value: '+679' },
        { label: 'Finland +358', value: '+358' },
        { label: 'France +33', value: '+33' },
        { label: 'Gabon +241', value: '+241' },
        { label: 'Gambia +220', value: '+220' },
        { label: 'Georgia +995', value: '+995' },
        { label: 'Germany +49', value: '+49' },
        { label: 'Ghana +233', value: '+233' },
        { label: 'Greece +30', value: '+30' },
        { label: 'Grenada +1-473', value: '+1-473' },
        { label: 'Guatemala +502', value: '+502' },
        { label: 'Guinea +224', value: '+224' },
        { label: 'Guinea-Bissau +245', value: '+245' },
        { label: 'Guyana +592', value: '+592' },
        { label: 'Haiti +509', value: '+509' },
        { label: 'Honduras +504', value: '+504' },
        { label: 'Hungary +36', value: '+36' },
        { label: 'Iceland +354', value: '+354' },
        { label: 'India +91', value: '+91' },
        { label: 'Indonesia +62', value: '+62' },
        { label: 'Iran +98', value: '+98' },
        { label: 'Iraq +964', value: '+964' },
        { label: 'Ireland +353', value: '+353' },
        { label: 'Israel +972', value: '+972' },
        { label: 'Italy +39', value: '+39' },
        { label: 'Jamaica +1-876', value: '+1-876' },
        { label: 'Japan +81', value: '+81' },
        { label: 'Jordan +962', value: '+962' },
        { label: 'Kenya +254', value: '+254' },
        { label: 'Kiribati +686', value: '+686' },
        { label: 'Korea (North) +850', value: '+850' },
        { label: 'Korea (South) +82', value: '+82' },
        { label: 'Kosovo +383', value: '+383' },
        { label: 'Kuwait +965', value: '+965' },
        { label: 'Kyrgyzstan +996', value: '+996' },
        { label: 'Laos +856', value: '+856' },
        { label: 'Latvia +371', value: '+371' },
        { label: 'Lebanon +961', value: '+961' },
        { label: 'Lesotho +266', value: '+266' },
        { label: 'Liberia +231', value: '+231' },
        { label: 'Libya +218', value: '+218' },
        { label: 'Liechtenstein +423', value: '+423' },
        { label: 'Lithuania +370', value: '+370' },
        { label: 'Luxembourg +352', value: '+352' },
        { label: 'Madagascar +261', value: '+261' },
        { label: 'Malawi +265', value: '+265' },
        { label: 'Malaysia +60', value: '+60' },
        { label: 'Maldives +960', value: '+960' },
        { label: 'Mali +223', value: '+223' },
        { label: 'Malta +356', value: '+356' },
        { label: 'Marshall Islands +692', value: '+692' },
        { label: 'Mauritania +222', value: '+222' },
        { label: 'Mauritius +230', value: '+230' },
        { label: 'Mexico +52', value: '+52' },
        { label: 'Micronesia +691', value: '+691' },
        { label: 'Moldova +373', value: '+373' },
        { label: 'Monaco +377', value: '+377' },
        { label: 'Mongolia +976', value: '+976' },
        { label: 'Montenegro +382', value: '+382' },
        { label: 'Morocco +212', value: '+212' },
        { label: 'Mozambique +258', value: '+258' },
        { label: 'Myanmar +95', value: '+95' },
        { label: 'Namibia +264', value: '+264' },
        { label: 'Nauru +674', value: '+674' },
        { label: 'Nepal +977', value: '+977' },
        { label: 'Netherlands +31', value: '+31' },
        { label: 'New Zealand +64', value: '+64' },
        { label: 'Nicaragua +505', value: '+505' },
        { label: 'Niger +227', value: '+227' },
        { label: 'Nigeria +234', value: '+234' },
        { label: 'North Macedonia +389', value: '+389' },
        { label: 'Norway +47', value: '+47' },
        { label: 'Oman +968', value: '+968' },
        { label: 'Pakistan +92', value: '+92' },
        { label: 'Palau +680', value: '+680' },
        { label: 'Palestine +970', value: '+970' },
        { label: 'Panama +507', value: '+507' },
        { label: 'Papua New Guinea +675', value: '+675' },
        { label: 'Paraguay +595', value: '+595' },
        { label: 'Peru +51', value: '+51' },
        { label: 'Philippines +63', value: '+63' },
        { label: 'Poland +48', value: '+48' },
        { label: 'Portugal +351', value: '+351' },
        { label: 'Qatar +974', value: '+974' },
        { label: 'Romania +40', value: '+40' },
        { label: 'Russia +7', value: '+7' },
        { label: 'Rwanda +250', value: '+250' },
        { label: 'Saint Kitts and Nevis +1-869', value: '+1-869' },
        { label: 'Saint Lucia +1-758', value: '+1-758' },
        { label: 'Saint Vincent and the Grenadines +1-784', value: '+1-784' },
        { label: 'Samoa +685', value: '+685' },
        { label: 'San Marino +378', value: '+378' },
        { label: 'Sao Tome and Principe +239', value: '+239' },
        { label: 'Saudi Arabia +966', value: '+966' },
        { label: 'Senegal +221', value: '+221' },
        { label: 'Serbia +381', value: '+381' },
        { label: 'Seychelles +248', value: '+248' },
        { label: 'Sierra Leone +232', value: '+232' },
        { label: 'Singapore +65', value: '+65' },
        { label: 'Slovakia +421', value: '+421' },
        { label: 'Slovenia +386', value: '+386' },
        { label: 'Solomon Islands +677', value: '+677' },
        { label: 'Somalia +252', value: '+252' },
        { label: 'South Africa +27', value: '+27' },
        { label: 'South Sudan +211', value: '+211' },
        { label: 'Spain +34', value: '+34' },
        { label: 'Sri Lanka +94', value: '+94' },
        { label: 'Sudan +249', value: '+249' },
        { label: 'Suriname +597', value: '+597' },
        { label: 'Sweden +46', value: '+46' },
        { label: 'Switzerland +41', value: '+41' },
        { label: 'Syria +963', value: '+963' },
        { label: 'Taiwan +886', value: '+886' },
        { label: 'Tajikistan +992', value: '+992' },
        { label: 'Tanzania +255', value: '+255' },
        { label: 'Thailand +66', value: '+66' },
        { label: 'Togo +228', value: '+228' },
        { label: 'Tonga +676', value: '+676' },
        { label: 'Trinidad and Tobago +1-868', value: '+1-868' },
        { label: 'Tunisia +216', value: '+216' },
        { label: 'Turkey +90', value: '+90' },
        { label: 'Turkmenistan +993', value: '+993' },
        { label: 'Tuvalu +688', value: '+688' },
        { label: 'Uganda +256', value: '+256' },
        { label: 'Ukraine +380', value: '+380' },
        { label: 'United Arab Emirates +971', value: '+971' },
        { label: 'United Kingdom +44', value: '+44' },
        { label: 'United States of America +1', value: '+1' },
        { label: 'Uruguay +598', value: '+598' },
        { label: 'Uzbekistan +998', value: '+998' },
        { label: 'Vanuatu +678', value: '+678' },
        { label: 'Vatican City +379', value: '+379' },
        { label: 'Venezuela +58', value: '+58' },
        { label: 'Vietnam +84', value: '+84' },
        { label: 'Yemen +967', value: '+967' },
        { label: 'Zambia +260', value: '+260' },
        { label: 'Zimbabwe +263', value: '+263' }
      ]);

    useEffect(() => {

        if (isAuth) {
            router.replace('../(sender)/home')
        }
        setIsAuth(false);
    }, [])

    const handlePhoneCode = (value, phoneNumber) => {
        const codeNumber = value + phoneNumber;
        return codeNumber;
    }

    //Create unique userID
    function createUserId(phoneNumber) {
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
      
        // Ensure the phone number is a string
        const phoneString = String(phoneNumber);
        
        // Create a unique user ID
        const userId = `user${hashCode(phoneString)}`;
        AsyncStorage.setItem('userId', userId);
        return userId;
      }

    //Send the number for OTP verification 
    const submitNumber = async () => {
        console.log('submitting number')
        const number = handlePhoneCode(value, phoneNumber);
        console.log(number)
        await AsyncStorage.setItem('phone', number);
        const userId = createUserId(number);
        verifyNumber(userId, number);
        router.replace('./validateotp');
    }
    
    return (
        <SafeAreaView>
            <View className="flex-col justify-around gap-10">
                <View>
                <View className=" justify-center text-center mt-5">
                    <Text className="text-center font-pbold">Sign Up</Text>
                </View>
                <View className="flex-col justify-center gap-3 border-solid rounded-xl border-red-500 ml-1  mt-5">
                    <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            placeholder={'Ghana +233'}
                            className="w-[93%] border-solid rounded-xl border-black-100 border-2"
                    />
                    <TextInput 
                    onChangeText={setPhoneNumber}
                    value={phoneNumber}
                    className="bg-white w-[93%] h-12 border-solid rounded-xl border-black-100 border-2 pl-2"
                    placeholder='Phone number'
                    keyboardType='numeric'
                    textContentType='telephoneNumber' 
                    placeholderTextColor="#000"/>
                    <View>
                    <Text>We will call or text to confirm your number. Standard message and data rates apply</Text>
                    </View>
                    <TouchableOpacity 
                    className="p-4 rounded-xl border-2 border-black-100 min-h-[24px] w-[90%] bg-black flex justify-center items-center"
                    onPress={()=>submitNumber()}
                    // onPress={()=>router.replace('./validateotp')}
                    >
                    <Text className="text-white">Continue</Text>
                    </TouchableOpacity>
                </View>
                </View>
                <View className="flex-col justify-center text-center ml-1">
                <Text className="text-center">Do you have an account?</Text>
                <TouchableOpacity
                    className=" ml-4 p-4  min-h-[24px] w-[90%]  flex justify-center items-center"
                    onPress={()=>router.replace('./signin')}>
                    <Text className="text-black underline text-center">Sign in</Text>
                </TouchableOpacity>
                </View>
            </View>   
            <StatusBar hidden={false} barStyle="dark-content"/>  
        </SafeAreaView>
  )
}

export default SignUp