import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useContext, createContext, type PropsWithChildren, useState, useEffect } from 'react';

interface AuthState {
	accessToken: string | null;
	authenticated: boolean | null;
	error?: {
		isError: boolean;
		msg: string | Array<string>;
	};
}

interface AuthProviderProps {
	authState: AuthState;
	onRegister: (email: string, password: string) => Promise<any>;
	onLogin: (email: string, password: string) => Promise<void>;
	onLogout: () => Promise<any>;
	isLoading: boolean;
	clearError: () => Promise<void>;
}

export const USER_KEY: string | undefined = process.env.EXPO_PUBLIC_USER_TOKEN;

const AuthContext = createContext<AuthProviderProps>({
	authState: { accessToken: null, authenticated: null, error: { isError: false, msg: '' } },
	isLoading: false,
	onLogin: async () => {},
	onLogout: async () => {},
	onRegister: async () => {},
	clearError: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function SessionProvider({ children }: PropsWithChildren) {
	const [authState, setAuthState] = useState<AuthState>({
		accessToken: null,
		authenticated: null,
		error: { isError: false, msg: '' },
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const checkToken = async () => {
			try {
				if (USER_KEY === undefined) {
					throw new Error('USER_KEY is not defined');
				}
				const savedToken = await SecureStore.getItemAsync(USER_KEY);
				if (savedToken) {
					setAuthState({ accessToken: savedToken, authenticated: true });
				} else {
					console.log('No token found');
				}
			} catch (error) {
				console.log("SecureStore couldn't be accessed!", error);
			}
		};
		checkToken();
	}, [authState.accessToken]);

	const authSetter = async (response: { data: { accessToken: string } }) => {
		if (USER_KEY === undefined) {
			throw new Error('USER_KEY is not defined');
		}
		const { accessToken } = response.data;
		axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
		setAuthState({ accessToken: accessToken, authenticated: true });
		await SecureStore.setItemAsync(USER_KEY, accessToken);
	};

	const register = async (email: string, password: string) => {
		setLoading(true);
		try {
			setAuthState({ accessToken: null, authenticated: false, error: { isError: false, msg: '' } });
			const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/signup`, { email, password });
			if (response.data) {
				authSetter(response);
			} else {
				setAuthState({ accessToken: null, authenticated: false, error: { isError: true, msg: 'something went wrong' } });
			}
		} catch (error) {
			setAuthState({ accessToken: null, authenticated: false, error: { isError: true, msg: (error as any).response.data.message } });
		} finally {
			setLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, { email, password });
			if (response.data) {
				authSetter(response);
			} else {
				setAuthState({ accessToken: null, authenticated: false, error: { isError: true, msg: 'something went wrong' } });
			}
		} catch (error) {
			setAuthState({ accessToken: null, authenticated: false, error: { isError: true, msg: (error as any).response.data.message } });
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			if (USER_KEY === undefined) {
				throw new Error('USER_KEY is not defined');
			}
			setAuthState({ accessToken: null, authenticated: false });
			axios.defaults.headers.common.Authorization = '';
			await SecureStore.deleteItemAsync(USER_KEY);
			setAuthState({ accessToken: null, authenticated: false });
		} catch (error) {
			setAuthState({ accessToken: null, authenticated: false, error: { isError: true, msg: (error as any).response.data.message } });
			console.log("SecureStore couldn't be accessed!", error);
		} finally {
			setLoading(false);
		}
	};

	const clearError = async () => {
		setAuthState({ ...authState, error: { isError: false, msg: '' } });
	};

	const value: AuthProviderProps = { onRegister: register, onLogin: login, onLogout: logout, authState, isLoading: loading, clearError };
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
