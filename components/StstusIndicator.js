import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const StatusIndicator = ({ isConnected }) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circle,
          { backgroundColor: isConnected ? 'parakeet' : 'red' },
        ]}
      />
      <Text style={styles.text}>{isConnected ? 'Online' : 'Offline'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
  },
})

export default StatusIndicator
