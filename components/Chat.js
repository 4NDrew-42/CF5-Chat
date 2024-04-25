import { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params

  useEffect(() => {
    navigation.setOptions({
      title: `Hello ${name}`, // Set the title in the navigation bar
      headerStyle: {
        backgroundColor: backgroundColor, // Set the background color of the navbar
      },
      headerTintColor: '#fff', // Adjust text color in the navbar for better visibility
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })
  }, [navigation, name, backgroundColor]) // Ensure useEffect is triggered when any of these values change

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <Text style={styles.text}>Welcome to the chat room!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#fff', // Ensuring text is visible depending on the background color
  },
})

export default Chat
