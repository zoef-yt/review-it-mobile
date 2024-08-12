import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

import { SessionProvider } from '@/provider/AuthProvider';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

export default function Root() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}
	return (
		<SessionProvider>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<Slot />
			</ThemeProvider>
		</SessionProvider>
	);
}
