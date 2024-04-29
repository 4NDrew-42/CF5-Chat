import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Chat from './components/Chat'
import Start from './components/Start'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const App = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyD7JIj0kTyMv5PXIcisJgGpgklk4Uv6d2A',
    authDomain: 'chat-27c2c.firebaseapp.com',
    projectId: 'chat-27c2c',
    storageBucket: 'chat-27c2c.appspot.com',
    messagingSenderId: '606151645134',
    appId: '1:606151645134:web:99a4057b5507c093713d9f',
    measurementId: 'G-51R1LV7Q64',
  }

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" options={{ headerShown: false }}>
          {(props) => <Start {...props} db={db} />}
        </Stack.Screen>
        <Stack.Screen name="Chat" options={{ headerShown: false }}>
          {(props) => <Chat {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
