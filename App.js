import { useEffect, useState } from 'react';
import { StatusBar, Platform } from "react-native";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigation from "./src/Navigations/AppNavigaton";
import Colors from "./src/Themes/Colors";
import Splash from "./src/Screens/Splash";

export default function App() {

  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    "SourceSans3-Bold": require("./src/Assets/fonts/SourceSans3-Bold.ttf"),
    "SourceSans3-Light": require("./src/Assets/fonts/SourceSans3-Light.ttf"),
    "SourceSans3-Medium": require("./src/Assets/fonts/SourceSans3-Medium.ttf"),
    "SourceSans3-SemiBold": require("./src/Assets/fonts/SourceSans3-SemiBold.ttf"),
    "SourceSans3-Regular": require("./src/Assets/fonts/SourceSans3-Regular.ttf"),
  });

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading || !fontsLoaded) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? Colors.black : "transparent"}
        translucent={Platform.OS === "android"} />
      <AppNavigation />
    </SafeAreaProvider>
  );
}
