import { View, Text, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router'
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalContext } from "./context/GlobalProvider";
// import { signOutAppWrite } from './lib/appwriteConfig';
import { signUserOut, getCurrentUser, fetchUserData, updateUserType } from './lib/firebaseConfig';
import Loader from '../components/Loader';

const HomeScreen = () => {
    // const [isAuth, setIsAuth] = React.useState(false);
    const { 
      isAuth, 
      setIsAuth, 
      setIsUser, 
      isUser, 
      setUser, 
      user,
      loading,
      setLoading
    } = useGlobalContext();

  useEffect(() => {
    
    if(!isAuth){
        setTimeout(() => {
          setIsAuth(false);
          signUserOut();
          // signOutAppWrite();
          setIsUser(null);
          router.replace('(auth)/signin');
          setLoading(false);
        }, 0);
    }else{
      
      const load = async () => {
        try {
          if(isUser){
            setLoading(true);
            const user = await fetchUserData(isUser.uid);
            console.log(user);
            setUser(user);
            setLoading(false);
          }
        } catch (error) {
          throw new Error(error);
        }
      }
      load();
      
    }
  }, []);


    



    if(isAuth == true){
      
        return (
            <SafeAreaView className="flex-col justify-center items-center h-full">
            <View className="justify-center items-center  w-full h-[60%] p-0">
              <ImageBackground 
                source={require('../assets/images/send-img.jpg')}
                className="flex justify-center w-full h-full">
                <LinearGradient
                  // Transparent background
                  colors={['rgba(0,0,0,0.8)', 'transparent']}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: '100%',
                  }}
                />
                <View className='justify-center items-center'>
                  <View className="flex-col gap-4 justify-between items-center">
                    <Text className="text-2xl text-white text-center">Looking for traveler?</Text>
                    <TouchableOpacity 
                      className="p-4 rounded-xl border-2 border-secondary-100 min-h-[24px] w-[144px] bg-white flex justify-center items-center"
                      onPress={()=>{
                        if(user.type === 'sender'){
                          router.replace('./(sender)/home')
                        }else{
                          updateUserType(isUser.uid, 'sender');
                        router.replace('./(sender)/home')
                        }
                        }}
                      // onPress={setUserRoleToSender}
                      >
                      <Text>Sender</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View className="justify-center items-center  w-full h-[60%] p-0">
              <ImageBackground 
                source={require('../assets/images/travel-img.jpg')}
                className="flex justify-center w-full h-full">
                <LinearGradient
                  // Transparent background
                  colors={['rgba(0,0,0,0.8)', 'transparent']}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: '100%',
                  }}
                />
                <View className='justify-center items-center'>
                  <View className="flex-col gap-4 justify-between items-center">
                    <Text className="text-xl text-white text-center">
                      Make money by carrying packages
                    </Text>
                    <TouchableOpacity 
                      className="p-4 rounded-xl border-2 border-secondary-100 min-h-[24px] w-[144px] bg-white flex justify-center items-center"
                      onPress={()=>{
                        if(user.type === 'traveler'){
                          updateUserType(isUser.uid, 'traveler');
                          router.replace('./(traveler)/home')
                        }else{
                          updateUserType(isUser.uid, 'traveler');
                        router.replace('./(traveler)/home')
                        }
                        }}>
                      <Text>Traveler</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <Loader isLoading={loading} />
            <StatusBar hidden={true}/>
        </SafeAreaView>
          )
    }

    
  
}

export default HomeScreen