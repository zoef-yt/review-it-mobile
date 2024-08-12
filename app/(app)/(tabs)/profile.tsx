import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { AuthScreen } from '@/components/profile/auth/authScreen';
import { ProfileScreen } from '@/components/profile/profileScreen';
import { useAuth } from '@/provider/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
	const { authState } = useAuth();

	return (
		<SafeAreaView style={styles.container}>
			<ProfileScreen />
			{!authState.authenticated ? <AuthScreen /> : null}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
