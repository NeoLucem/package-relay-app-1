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
          <Stack.Screen name="(screens)/viewMyOfferScreen" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true}} />
          <Stack.Screen name="(screens)/viewSenderNotificationScreen" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true}} />
          <Stack.Screen name="(screens)/viewTripDetailScreen" options={{ headerShown: true, headerBackTitle: "Activity", headerBackTitleVisible: true}} />
          <Stack.Screen name="(screens)/editProfileScreen" options={{ headerShown: true, headerBackTitle: "Profile", headerBackTitleVisible: true}} />
          <Stack.Screen name="(screens)/checkTravelerScreen" options={{ headerShown: true, headerBackTitle: "Home", headerBackTitleVisible: true, headerTitle:"Check available traveler"}} />
          <Stack.Screen name="(screens)/postRequestScreen" options={{ headerShown: true, headerBackTitle: "Home", headerBackTitleVisible: true, headerTitle:"Create request"}} />
          <Stack.Screen name="(screens)/discussionScreen" options={{ headerShown: true, headerBackTitle: "Home", headerBackTitleVisible: true}} />
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
