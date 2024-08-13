import { StyleSheet, Text, View } from 'react-native';

export function ErrorComponent({ error }: { error?: { isError: boolean; msg: Array<string> | string } }) {
	if (!error) return null;
	return <View>{Array.isArray(error.msg) ? <Text style={styles.error}>{error.msg[0]}</Text> : <Text style={styles.error}>{error.msg}</Text>}</View>;
}

const styles = StyleSheet.create({
	error: {
		color: 'red',
		fontSize: 16,
	},
});
