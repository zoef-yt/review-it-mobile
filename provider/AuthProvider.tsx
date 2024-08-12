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
}

export const USER_KEY: string | undefined = process.env.EXPO_PUBLIC_USER_TOKEN;

const AuthContext = createContext<AuthProviderProps>({
	authState: { accessToken: null, authenticated: null },
	isLoading: false,
	onLogin: async () => {},
	onLogout: async () => {},
	onRegister: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function SessionProvider({ children }: PropsWithChildren) {
	const [authState, setAuthState] = useState<AuthState>({
		accessToken: null,
		authenticated: null,
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

	const register = async (email: string, password: string) => {
		try {
			return await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/signup`, { email, password });
		} catch (error) {
			setAuthState({ accessToken: null, authenticated: false, error: { isError: true, msg: (error as any).response.data.message } });
		}
	};

	const login = async (email: string, password: string) => {
		setLoading(true);
		try {
			if (USER_KEY === undefined) {
				throw new Error('USER_KEY is not defined');
			}
			const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, { email, password });
			const { accessToken } = response?.data;
			setAuthState({ accessToken: accessToken, authenticated: true });
			axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
			await SecureStore.setItemAsync(USER_KEY, accessToken);
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

	const value: AuthProviderProps = { onRegister: register, onLogin: login, onLogout: logout, authState, isLoading: loading };
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
