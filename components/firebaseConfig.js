import { initializeApp, getApp, getApps } from 'firebase/app'
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: 'AIzaSyD7JIj0kTyMv5PXIcisJgGpgklk4Uv6d2A',
  authDomain: 'chat-27c2c.firebaseapp.com',
  projectId: 'chat-27c2c',
  storageBucket: 'chat-27c2c.appspot.com',
  messagingSenderId: '606151645134',
  appId: '1:606151645134:web:99a4057b5507c093713d9f',
  measurementId: 'G-51R1LV7Q64',
}

// Initialize Firebase App
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp() // if already initialized, use that one
}

let auth
try {
  auth = getAuth(app)
} catch {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
}

export { app, auth }
