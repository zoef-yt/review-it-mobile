import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, ActivityIndicator, Animated, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '@/provider/AuthProvider';

export function AuthForm() {
	const [email, setEmail] = useState('zoef@test1222.com');
	const [password, setPassword] = useState('Securepassword');
	const [confirmPassword, setConfirmPassword] = useState('Securepassword');
	const [isLogin, setIsLogin] = useState(true);
	// const [user, setUser] = useState(null);
	const { authState, onLogin, onRegister, isLoading } = useAuth();
	const { error } = authState;

	// const getUser = async () => {
	// 	try {
	// 		const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
	// 			headers: {
	// 				Authorization: `Bearer ${authState.accessToken}`,
	// 			},
	// 		});
	// 		setUser(response.data);
	// 	} catch (error) {
	// 		setUser(null);
	// 	}
	// };

	// useEffect(() => {
	// 	if (authState.accessToken) {
	// 		getUser();
	// 	}
	// }, [authState]);

	const handleLogin = async () => {
		if (isLogin) {
			try {
				await onLogin(email, password);
			} catch (error) {
				console.log("SecureStore couldn't be accessed!", error);
			}
		} else {
			if (password !== confirmPassword) {
				Alert.alert('Error', 'Passwords do not match');
				return;
			}
			try {
				await onRegister(email, password);
			} catch (error) {
				console.log("SecureStore couldn't be accessed!", error);
			}
		}
	};

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size='large' color='#0000ff' />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
			<TextInput style={styles.textInput} onChangeText={setEmail} value={email} placeholder='Email' />
			<TextInput style={styles.textInput} onChangeText={setPassword} value={password} placeholder='Password' secureTextEntry />
			{!isLogin && (
				<TextInput
					style={styles.textInput}
					onChangeText={setConfirmPassword}
					value={confirmPassword}
					placeholder='Confirm Password'
					secureTextEntry
				/>
			)}
			<Button title={isLogin ? 'Login' : 'Sign Up'} onPress={handleLogin} />

			<ErrorComponent error={error} />
			<View style={styles.line} />
			<Pressable onPress={() => setIsLogin((prev) => !prev)}>
				<Text style={styles.link}>{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}</Text>
			</Pressable>
		</View>
	);
}

function ErrorComponent({ error }: { error?: { isError: boolean; msg: Array<string> | string } }) {
	console.log(error);
	if (!error) {
		return null;
	}
	if (error.msg instanceof Array) {
		return <Text style={styles.error}>{error.msg[0]}</Text>;
	}
	return <Text style={styles.error}>{error.msg}</Text>;
}

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		width: '90%',
		borderRadius: 20,
		backgroundColor: '#fff2f28c',
		padding: 30,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: 'grey',
		borderWidth: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	link: {
		fontSize: 16,
		color: 'blue',
	},
	line: {
		width: '90%',
		height: 1,
		backgroundColor: '#8c8888',
		marginVertical: 10,
	},
	textInput: {
		width: '90%',
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		marginVertical: 10,
		backgroundColor: '#fff',
		padding: 10,
		borderRadius: 10,
	},
	error: {
		color: 'red',
		fontSize: 16,
	},
});
