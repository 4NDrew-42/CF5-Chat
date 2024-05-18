// Import React and necessary hooks
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Avatar } from 'react-native-elements'
// Import Gifted Chat components
import {
  Bubble,
  GiftedChat,
  Composer,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat'

// Import Firestore functions
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'

import MapView from 'react-native-maps'

// Import Custom Components
import { blendWithWhite } from './colorUtils'
import StatusIndicator from './StstusIndicator'
import CustomActions from './CustomActions'

const Chat = ({ route, db, navigation, isConnected }) => {
  const { uid, name, backgroundColor } = route.params
  const [messages, setMessages] = useState([])

  const lightenedColor = blendWithWhite(backgroundColor, 0.66)

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
      headerRight: () => <StatusIndicator isConnected={isConnected} />, // Add the status indicator to the navbar
    })
  }, [navigation, name, backgroundColor, isConnected]) // Ensure useEffect is triggered when any of these values change

  // Fetch messages from Firestore and cache them
  const fetchMessagesFromFirestore = async () => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const firestoreMessages = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: new Date(doc.data().createdAt.seconds * 1000),
        user: doc.data().user,
      }))
      setMessages(firestoreMessages)
      await AsyncStorage.setItem(
        'cachedMessages',
        JSON.stringify(firestoreMessages)
      )
    })

    return () => unsubscribe()
  }

  // Load messages from AsyncStorage
  const loadMessagesFromCache = async () => {
    const cachedMessages = await AsyncStorage.getItem('cachedMessages')
    if (cachedMessages) {
      setMessages(JSON.parse(cachedMessages))
    }
  }

  // Effect to fetch or load messages based on connection status
  useEffect(() => {
    if (isConnected) {
      fetchMessagesFromFirestore()
    } else {
      loadMessagesFromCache()
    }
  }, [isConnected])

  // Function to send a new message
  const onSend = async (newMessages = []) => {
    try {
      const promises = newMessages.map((msg) =>
        addDoc(collection(db, 'messages'), {
          ...msg,
          createdAt: new Date(), // Firestore expects Date objects
        })
      )
      await Promise.all(promises)
    } catch (error) {
      // Handle any errors that occur during the Firestore operation
      Alert.alert('Send Failed', 'Unable to send message, please try again.')
      console.error('Failed to send message: ', error)
    }
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
    else return null
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

  const renderActions = (props) => {
    return <CustomActions {...props} />
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

   const renderCustomActions = (props) => {
     return (
       <CustomActions
         storage={storage}
         userID={uid}
         onSend={onSend}
         {...props}
       />
     )
   }
  
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
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
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
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
