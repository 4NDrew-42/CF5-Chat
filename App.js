import Chat from './components/Chat'
import Start from './components/Start'
import { app, auth } from './components/firebaseConfig'

// import React Navigation
import { React, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// import Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { useNetInfo } from '@react-native-community/netinfo'
import { LogBox, Alert } from 'react-native'
LogBox.ignoreLogs(['AsyncStorage has been extracted from'])

const Stack = createNativeStackNavigator()

const App = () => {
  // Define a new state that represents the network status
  const connectionStatus = useNetInfo()

  /*const firebaseConfig = {
    apiKey: 'AIzaSyD7JIj0kTyMv5PXIcisJgGpgklk4Uv6d2A',
    authDomain: 'chat-27c2c.firebaseapp.com',
    projectId: 'chat-27c2c',
    storageBucket: 'chat-27c2c.appspot.com',
    messagingSenderId: '606151645134',
    appId: '1:606151645134:web:99a4057b5507c093713d9f',
    measurementId: 'G-51R1LV7Q64',
  }*/
  // Initialize Firebase
  // const app = initializeApp(firebaseConfig)

  // Initialize Firestore
  const db = getFirestore(app)

  // Initialize Firebase Storage handler
  const storage = getStorage(app)

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection lost!')
      disableNetwork(db)
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db)
    }
  }, [connectionStatus.isConnected])

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" options={{ headerShown: false }}>
          {(props) => <Start app={app} {...props} db={db} />}
        </Stack.Screen>
        <Stack.Screen name="Chat" options={{ headerShown: true }}>
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
