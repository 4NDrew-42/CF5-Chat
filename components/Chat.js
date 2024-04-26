import { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params
  const [messages, setMessages] = useState([])

  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    )
  }

  // Customizing the chat bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: '#fff',
          },
        }}
      />
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
      {
        _id: 2,
        text: 'You have entered the chat room',
        createdAt: new Date(),
        system: true,
      },
    ])
  }, [])

  // Chat component
  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      {/*  Platform-specific KeyboardAvoidingView */}
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === 'ios' && (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} />
      )}
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
