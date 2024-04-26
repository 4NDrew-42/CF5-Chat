import { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'

const Chat = ({ route, navigation }) => {
  const { name } = route.params
  const [messages, setMessages] = useState([])
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    )
  }

  // Effect for updating the navigation bar title and background color
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

  // Effect for setting up initial messages in the chat
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  useEffect(() => {
    navigation.setOptions({ title: name })
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
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
