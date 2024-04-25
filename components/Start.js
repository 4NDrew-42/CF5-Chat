import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Start = ({ navigation }) => {
	const [name, setName] = useState('');
	const backgroundImage = require('../assets/UCLAchat.png');

	return (
		<ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
			<View style={styles.contentContainer}>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>UCLA Arts</Text>
					<Text style={styles.subtitle}>Alumni Chat</Text>
				</View>
				<View style={styles.whiteBox}>
					<View style={styles.inputSection}>
						<Icon name="user-circle-o" size={36} color="#ccc" style={styles.inputIcon} />
						<TextInput style={styles.textInput} value={name} onChangeText={setName} placeholder="Your Name" placeholderTextColor="#aaa" />
					</View>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat', { name })}>
							<Text style={styles.buttonText}>Start Chatting</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	backgroundImage: {
		flex: 1,
	},
	contentContainer: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	whiteBox: {
		backgroundColor: '#FFF',
		width: '88%',
		height: '44%',
		alignSelf: 'center',
		borderRadius: 3,
		padding: 20,
		marginBottom: '6%',
	},
	titleContainer: {
		position: 'absolute',
		top: '10%',
		alignSelf: 'center',
	},
	title: {
		fontSize: 45,
		fontWeight: 600,
		color: '#FFFFFF',
	},
	subtitle: {
		fontSize: 30,
		fontWeight: 'bold',
		marginTop: 8,
	},
	inputSection: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 1,
		paddingHorizontal: 12,
		marginBottom: 20,
	},
	inputIcon: {
		marginRight: 20,
		marginLeft: 5,
	},
	textInput: {
		flex: 1,
		height: 70,
		fontSize: 18,
	},
	buttonContainer: {
		marginTop: 'auto',
	},
	button: {
		backgroundColor: '#4e4e4e',
		height: 70,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
	},
	// ... any other styles you need
});

export default Start;
