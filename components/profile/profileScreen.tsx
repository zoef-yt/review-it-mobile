import { useAuth } from '@/provider/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

interface User {
	email: string;
	_id: string;
	games: {
		likeGenres: {
			genreID: string;
			genreName: string;
			genreSlug: string;
		}[];
		playedGames: {
			gameID: string;
			gameName: string;
			gameImage: string;
			gameSlug: string;
		}[];
		currentGame: {
			gameID: string;
			gameName: string;
			gameImage: string;
			gameSlug: string;
		}[];
	};
	reviews: {
		_id: string;
		rating: number;
		comment: string;
		game: {
			_id: string;
			gameID: string;
			gameName: string;
			gameImage: string;
			gameSlug: string;
		};
	}[];
}

export function ProfileScreen() {
	const { onLogout, authState } = useAuth();
	const { authenticated } = authState;
	const [user, setUser] = useState<User | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		if (authState.accessToken) {
			getUser();
		}
	}, [authState]);

	if (!authenticated) return null;

	const logOutHandler = () => {
		Alert.alert('Log out', 'Are you sure you want to log out?', [
			{
				text: 'Cancel',
				style: 'destructive',
			},
			{
				text: 'Log out',
				onPress: () => onLogout(),
				style: 'default',
				isPreferred: true,
			},
		]);
	};

	async function getUser() {
		try {
			const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
				headers: {
					Authorization: `Bearer ${authState.accessToken}`,
				},
			});
			setUser(response.data);
		} catch (error) {
			setUser(null);
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile</Text>
				<Pressable onPress={logOutHandler}>
					<Ionicons size={28} style={[{ marginBottom: -3, color: '#3cc3e1' }]} name='log-out-outline' />
				</Pressable>
			</View>
			<Text>{user?.email}</Text>
			<Text>User Reviews:</Text>
			<FlatList
				data={user?.reviews}
				keyExtractor={(item) => item._id}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						tintColor='red'
						colors={['red', 'green', 'blue']}
						onRefresh={() => {
							setRefreshing(true);
							getUser();
							setRefreshing(false);
						}}
					/>
				}
				renderItem={({ item }) => (
					<View
						key={item._id}
						style={{
							borderWidth: 1,
							borderColor: 'black',
							margin: 5,
							borderRadius: 25,
						}}
					>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
							<Text>{item.comment}</Text>
							<Text>{item.rating}</Text>
						</View>
						<View style={{ overflow: 'hidden', height: 200, borderBottomRightRadius: 25, borderBottomLeftRadius: 25 }}>
							<Image
								source={{ uri: item.game.gameImage.trim() }}
								style={{ height: 200, resizeMode: 'stretch' }}
								onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
							/>
						</View>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 5,
	},
});
