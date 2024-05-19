// Import React Navigation
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Create a Stack Navigator
const Stack = createNativeStackNavigator()

// Import Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Import React
import React, { useEffect } from 'react'
import { LogBox, Alert } from 'react-native'
import { useNetInfo } from '@react-native-community/netinfo'
LogBox.ignoreLogs(['AsyncStorage has been extracted from'])

// Import Components
import Chat from './components/Chat'
import Start from './components/Start'

const App = () => {
  const connectionStatus = useNetInfo()

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost!')
      disableNetwork(db)
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db)
    }
  }, [connectionStatus.isConnected])

  const firebaseConfig = {
    apiKey: 'AIzaSyD7JIj0kTyMv5PXIcisJgGpgklk4Uv6d2A',
    authDomain: 'chat-27c2c.firebaseapp.com',
    projectId: 'chat-27c2c',
    storageBucket: 'chat-27c2c.appspot.com',
    messagingSenderId: '606151645134',
    appId: '1:606151645134:web:99a4057b5507c093713d9f',
    measurementId: 'G-51R1LV7Q64',
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig)

  // Initialize Firestore
  const db = getFirestore(app)

  // Initialize Firebase Storage
  const storage = getStorage(app)

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
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
