import { useEffect, useState } from 'react'
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'

const Chat = ({ route, db }) => {
  const { uid, name, backgroundColor } = route.params
  const [messages, setMessages] = useState([])

  const onSend = (newMessages = []) => {
    addDoc(collection(db, 'messages'), {
      ...newMessages[0],
      createdAt: new Date(), // Ensure correct date format for Firestore
    })
  }

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const firestoreMessages = querySnapshot.docs.map((doc) => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: new Date(doc.data().createdAt.seconds * 1000),
        user: doc.data().user,
      }))
      setMessages(firestoreMessages)
    })

    return () => unsubscribe() // Cleanup on unmount
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
      />
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
})

export default Chat
