import { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native'
import { Avatar } from 'react-native-elements'
import {
  Bubble,
  GiftedChat,
  Composer,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat'
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { blendWithWhite } from './colorUtils'

import AsyncStorage from '@react-native-async-storage/async-storage'

const Chat = ({ route, db, navigation, isConnected, storage }) => {
  const { uid, name, backgroundColor } = route.params
  const [messages, setMessages] = useState([])

  const lightenedColor = blendWithWhite(backgroundColor, 0.66)

  let unsubMessages
  // useEffect hook to set messages options
  // Create a query to get the "messages" collection from the Firestore database
  useEffect(() => {
    navigation.setOptions({ title: name })

    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages()
      unsubMessages = null

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))

      // Subscribe to changes in the "messages" collection using onSnapshot.
      // This function will be called whenever there are changes in the collection.
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = []
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          })
        })
        cacheMessages(newMessages)
        setMessages(newMessages)
      })
    } else loadCachedMessages()

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages()
    }
  }, [isConnected]) // isConnected used as a dependency value and will allow the component to call the callback of useEffect whenewer the isConnected prop's value changes.

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache))
    } catch (error) {
      console.log(error.message)
    }
  }
  // Call this function if the isConnected prop turns out to be false in useEffect()
  const loadCachedMessages = async () => {
    // The empty array is for cachedMessages in case AsyncStorage() fails when the messages item hasn’t been set yet in AsyncStorage.
    const cachedMessages = (await AsyncStorage.getItem('messages')) || []
    setMessages(JSON.parse(cachedMessages))
  }

  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0])
  }

  // Customizing the avatar
  const renderAvatar = (props) => (
    <Avatar
      rounded
      title={props.currentMessage.user.name.charAt(0).toUpperCase()}
      overlayContainerStyle={{ backgroundColor: 'white' }} // Background color of the avatar
      titleStyle={{ color: 'black', fontWeight: 'bold' }} // Text color and font weight
      size="small"
      containerStyle={{
        borderWidth: 2,
        borderColor: 'black',
        transform: [{ translateY: -32 }], // Adjust position if needed
      }}
    />
  )

  // Customizing the chat bubble
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: backgroundColor,
          transform: [{ translateY: -27 }],
        },
        left: {
          backgroundColor: '#0E7AFE',
          transform: [{ translateY: -27 }],
        },
      }}
      textStyle={{
        right: {
          color: '#fff', // Text color for messages sent by the user
        },
        left: {
          color: '#fff', // Text color for messages received
        },
      }}
      timeTextStyle={{
        right: {
          color: '#fff', // Time text color for messages sent by the user
        },
        left: {
          color: '#fff', // Time text color for messages received
        },
      }}
      containerStyle={{}}
    />
  )

  // Customizing the input toolbar
  const renderInputToolbar = (props) => {
    if (isConnected)
      return (
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: backgroundColor, // Background color of the input toolbar
            borderTopColor: lightenedColor, // Color of the top border of the input toolbar
            padding: 12, // Padding around the input toolbar
            marginTop: 10, // Spacing above the input toolbar
          }}
          primaryStyle={{ alignItems: 'center' }}
        />
      )
  }

  // Customizing the send button
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View
          style={{
            marginRight: 3,
            marginBottom: -15,
            backgroundColor: '#0E7AFE',
            padding: 0,
            height: 40,
            width: 60,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ translateY: -11 }],
          }}
        >
          <Text style={{ fontSize: 16, color: '#fff' }}>Send</Text>
        </View>
      </Send>
    )
  }

  // Customizing the composer input area
  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={{
          color: '#222', // Text color inside the input area
          backgroundColor: '#FFF', // Background color of the input area
          borderRadius: 3, // Rounded corners for the input area
          paddingLeft: 15, // Padding inside the input area
        }}
      />
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: lightenedColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        renderComposer={renderComposer}
        renderAvatar={renderAvatar}
      />
      {/* Platform-specific KeyboardAvoidingView with offset */}
      {Platform.OS === 'android' && (
        <KeyboardAvoidingView
          behavior="height"
          keyboardVerticalOffset={70}
          style
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    color: '#fff', // Ensuring text is visible depending on the background color
  },
})

export default Chat
