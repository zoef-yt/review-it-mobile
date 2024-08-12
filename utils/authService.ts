import axios from 'axios';

interface AuthResponse {
	accessToken: string;
	email: string;
	id: string;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const registerUser = async (email: string, password: string): Promise<void> => {
	await axios.post(`${apiUrl}/auth/signup`, { email, password });
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
	const response = await axios.post<AuthResponse>(`${apiUrl}/auth/login`, { email, password });
	return response.data;
};
