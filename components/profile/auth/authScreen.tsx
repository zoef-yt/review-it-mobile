import { BlurView } from 'expo-blur';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthForm } from './authForm';

export function AuthScreen() {
	return (
		<BlurView intensity={11} style={StyleSheet.absoluteFill}>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<AuthForm />
			</ScrollView>
		</BlurView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
