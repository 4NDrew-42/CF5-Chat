import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

const StatusIndicator = ({ isConnected }) => {
  return (
    <View style={styles.container}>
      <View style={styles.glow}>
        <View
          style={[
            styles.circle,
            { backgroundColor: isConnected ? '#39FF14' : 'red' },
          ]}
        />
      </View>
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
  glow: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'green',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
  },
})

export default StatusIndicator
