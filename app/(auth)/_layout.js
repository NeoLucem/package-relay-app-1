import { Stack } from "expo-router"

const AuthLaout = () => {
  return (
        <Stack>
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="signin" options={{ headerShown: false }} />
            <Stack.Screen name="validateotp" options={{ headerShown: false }} />
            <Stack.Screen name="finishsetup" options={{ headerShown: false }} />
        </Stack>

    
  )
}

export default AuthLaout