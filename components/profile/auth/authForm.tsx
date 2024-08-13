import React from 'react';
import { View, TextInput, Button, Alert, Text, ActivityIndicator, StyleSheet, Pressable } from 'react-native';

import { useAuth } from '@/provider/AuthProvider';
import { formReducer, initialState } from './authFormReducer';
import { ErrorComponent } from './errorMessgae';

export function AuthForm() {
	const [formState, dispatch] = React.useReducer(formReducer, initialState);
	const [isLogin, setIsLogin] = React.useState(false);
	const { email, password, confirmPassword } = formState;
	const { authState, onLogin, onRegister, isLoading, clearError } = useAuth();
	const { error } = authState;

	const toggleAuthMode = React.useCallback(() => {
		setIsLogin((prev) => !prev);
	}, []);

	const handleLogin = React.useCallback(async () => {
		if (isLogin) {
			await onLogin(email, password);
		} else {
			if (password !== confirmPassword) {
				Alert.alert('Error', 'Passwords do not match');
				return;
			}
			await onRegister(email, password);
		}
	}, [isLogin, email, password, confirmPassword]);

	const handleChange = React.useCallback(
		(field: string, value: string) => {
			dispatch({ type: `SET_${field.toUpperCase()}`, payload: value });
			if (error?.isError) {
				clearError();
			}
		},
		[dispatch, error, clearError],
	);

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
			<TextInput style={styles.textInput} onChangeText={(value) => handleChange('email', value)} value={email} placeholder='Email' />
			<TextInput
				style={styles.textInput}
				onChangeText={(value) => handleChange('password', value)}
				value={password}
				placeholder='Password'
				secureTextEntry
			/>
			{!isLogin && (
				<TextInput
					style={styles.textInput}
					onChangeText={(value) => handleChange('confirmPassword', value)}
					value={confirmPassword}
					placeholder='Confirm Password'
					secureTextEntry
				/>
			)}
			<Button
				title={isLogin ? 'Login' : 'Sign Up'}
				onPress={handleLogin}
				disabled={!email || !password || (!isLogin && password !== confirmPassword) || isLoading}
			/>

			{error?.isError ? <ErrorComponent error={error} /> : null}
			<View style={styles.line} />
			<Pressable onPress={toggleAuthMode}>
				<Text style={styles.link}>{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}</Text>
			</Pressable>
		</View>
	);
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
});
