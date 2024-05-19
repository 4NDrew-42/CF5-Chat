import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Text,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Avatar } from 'react-native-elements'
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
  Composer,
} from 'react-native-gifted-chat'
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { blendWithWhite } from './colorUtils'
import StatusIndicator from './StatusIndicator'
import CustomActions from './CustomActions'
import MapView from 'react-native-maps'

const Chat = ({ route, db, navigation, isConnected, storage }) => {
  const { uid, name, backgroundColor } = route.params
  const [messages, setMessages] = useState([])

  const lightenedColor = blendWithWhite(backgroundColor, 0.66)
  let unsubMessages = null

  useEffect(() => {
    navigation.setOptions({
      title: `Hello ${name}`,
      headerStyle: {
        backgroundColor: backgroundColor,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => <StatusIndicator isConnected={isConnected} />,
    })
  }, [navigation, name, backgroundColor, isConnected])

  useEffect(() => {
    if (isConnected === true) {
      if (unsubMessages) unsubMessages()
      unsubMessages = null

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = []
        docs.forEach((doc) => {
          newMessages.push({
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          })
        })
        cacheMessages(newMessages)
        setMessages(newMessages)
      })
    } else {
      loadCachedMessages()
    }

    return () => {
      if (unsubMessages) unsubMessages()
    }
  }, [isConnected])

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || []
    setMessages(JSON.parse(cachedMessages))
  }

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache))
    } catch (error) {
      console.log(error.message)
    }
  }

  const onSend = async (newMessages = []) => {
    try {
      const promises = newMessages.map((msg) =>
        addDoc(collection(db, 'messages'), {
          ...msg,
          createdAt: new Date(),
        })
      )
      await Promise.all(promises)
    } catch (error) {
      Alert.alert('Send Failed', 'Unable to send message, please try again.')
      console.error('Failed to send message: ', error)
    }
  }

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
          color: '#fff',
        },
        left: {
          color: '#fff',
        },
      }}
      timeTextStyle={{
        right: {
          color: '#fff',
        },
        left: {
          color: '#fff',
        },
      }}
      containerStyle={{}}
    />
  )

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return (
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: backgroundColor,
            borderTopColor: lightenedColor,
            padding: 12,
            marginTop: 10,
          }}
          primaryStyle={{ alignItems: 'center' }}
        />
      )
    } else {
      return null
    }
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

  const renderSend = (props) => (
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

  const renderCustomActions = (props) => (
    <CustomActions storage={storage} userID={uid} onSend={onSend} {...props} />
  )

  const renderCustomView = (props) => {
    const { currentMessage } = props
    if (currentMessage.location) {
      return (
        <View style={{ borderRadius: 20, overflow: 'hidden' }}>
          <MapView
            style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      )
    }
    return null
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
        renderAvatar={(props) => (
          <Avatar
            rounded
            title={props.currentMessage.user.name.charAt(0).toUpperCase()}
            overlayContainerStyle={{ backgroundColor: 'white' }}
            titleStyle={{ color: 'black', fontWeight: 'bold' }}
            size="small"
            containerStyle={{
              borderWidth: 2,
              borderColor: 'black',
              transform: [{ translateY: -32 }],
            }}
          />
        )}
        renderComposer={renderComposer}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
      />
      {Platform.OS === 'android' && (
        <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={70} />
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
    color: '#fff',
  },
})

export default Chat
