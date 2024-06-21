import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import GlobalProvider from "./context/GlobalProvider";

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <GlobalProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(screens)/sender/activity/payments/[paymentReq]" options={{ headerShown: false, headerBackTitle: "Activity", headerBackTitleVisible: false, headerTitle: 'Details'}}/>
          <Stack.Screen name="(screens)/traveler/activity/message/[messageToTraveler]" options={{ headerShown: false, headerBackTitle: "Activity", headerBackTitleVisible: false, headerTitle: 'Details'}}/>
          <Stack.Screen name="(screens)/traveler/activity/paymentRequest/[paymentReq]" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Details'}}/>
          <Stack.Screen name="(screens)/traveler/activity/delivering/[confirmedReq]" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Details'}}/>
          <Stack.Screen name="(screens)/traveler/activity/acceptedRequest/[acceptedReq]" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Details'}}/>
          <Stack.Screen name="(screens)/traveler/activity/pendingRequest/[pendingReq]" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Details'}}/>
          <Stack.Screen name="(screens)/pendingRequest/[pendingReq]" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Details'}}/>
          <Stack.Screen name="(screens)/traveler/activity/viewTripDetails" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'My trips'}}/>
          <Stack.Screen name="(screens)/traveler/activity/viewCarryRequest" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Pending carry Request'}}/>
          <Stack.Screen name="(screens)/traveler/activity/viewAcceptedRequest" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Accepted requests'}}/>
          <Stack.Screen name="(screens)/traveler/activity/delivering" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Accepted requests'}}/>
          <Stack.Screen name="(screens)/traveler/home/checkAvailPackage" options={{ headerShown: true}}/>
          <Stack.Screen name="(screens)/traveler/home/postTrip" options={{ headerShown: true, headerBackTitleVisible: false, headerTitle:"Post a new trip"}}/>
          <Stack.Screen name="(screens)/success/packageSuccessScreen" options={{ headerShown: false}} />
          <Stack.Screen name="(screens)/success/tripSuccessScreen" options={{ headerShown: false}} />
          <Stack.Screen name="(screens)/viewMyOfferScreen" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'My offers'}} />
          <Stack.Screen name="(screens)/viewSenderNotificationScreen" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true}} />
          <Stack.Screen name="(screens)/editProfileScreen" options={{ headerShown: true, headerBackTitle: "Profile", headerBackTitleVisible: true}} />
          <Stack.Screen name="(screens)/viewTripDetailScreen" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Pending requests'}} />
          <Stack.Screen name="(screens)/viewAcceptedRequests" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Accepted requests'}} />
          <Stack.Screen name="(screens)/checkTravelerScreen" options={{ headerShown: true, headerBackTitle: "Home", headerBackTitleVisible: true, headerTitle:"Check available traveler"}} />
          <Stack.Screen name="(screens)/postRequestScreen" options={{ headerShown: true, headerBackTitle: "Home", headerBackTitleVisible: true, headerTitle:"Create request"}} />
          <Stack.Screen name="(screens)/sender/activity/pay/payments" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true, headerTitle: 'Payment Requests'}} />
          <Stack.Screen name="(screens)/discussionScreen" options={{ headerShown: true, headerBackTitle: "Home", headerBackTitleVisible: true}} />
          <Stack.Screen name="(screens)/[discussionScreen]" options={{ headerShown: true, headerBackTitle: "Home", headerBackTitleVisible: true}} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(traveler)" options={{ headerShown: false }} />
          <Stack.Screen name="(sender)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GlobalProvider>
      
    </ThemeProvider>
  );
}
