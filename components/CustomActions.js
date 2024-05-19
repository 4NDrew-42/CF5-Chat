import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native'
import { useActionSheet } from '@expo/react-native-action-sheet'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {
  const { showActionSheetWithOptions } = useActionSheet()

  // Function to get the user's current location
  const getLocation = async () => {
    try {
      // Request foreground location permissions from the user
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert("Permissions haven't been granted.")
        return
      }

      // Check if location services are enabled on the device
      const isLocationEnabled = await Location.hasServicesEnabledAsync()
      if (!isLocationEnabled) {
        Alert.alert(
          'Location services are not enabled. Please enable location services.'
        )
        return
      }

      // Attempt to get the current position of the device
      const location = await Location.getCurrentPositionAsync({})
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        })
      } else {
        Alert.alert('Error occurred while fetching location')
      }
    } catch (error) {
      Alert.alert(
        'Current location is unavailable. Make sure that location services are enabled.'
      )
      console.error('Error getting location: ', error)
    }
  }

  // Function to generate a unique reference for the image
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime()
    const imageName = uri.split('/').pop()
    return `${userID}-${timeStamp}-${imageName}`
  }

  // Function to upload the image to Firebase Storage and send the image URL
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI)
    const newUploadRef = ref(storage, uniqueRefString)
    const response = await fetch(imageURI)
    const blob = await response.blob()
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      onSend({ image: imageURL })
    })
  }

  // Function to pick an image from the library
  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync()
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri)
      }
    } else {
      Alert.alert('Permissions have not been granted')
    }
  }

  // Function to take a photo using the camera
  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync()
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync()
      if (!result.canceled) {
        let mediaLibraryPermissions =
          await MediaLibrary.requestPermissionsAsync()
        if (mediaLibraryPermissions?.granted)
          await MediaLibrary.saveToLibraryAsync(result.assets[0].uri)

        await uploadAndSendImage(result.assets[0].uri)
      }
    } else {
      Alert.alert('Permissions have not been granted')
    }
  }

  // Function to show the action sheet with options for the user to choose from
  const onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take a Picture',
      'Send Location',
      'Cancel',
    ]
    const cancelButtonIndex = options.length - 1
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            await pickImage()
            return
          case 1:
            await takePhoto()
            return
          case 2:
            await getLocation()
            return
          default:
        }
      }
    )
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="more options"
      accessibilityHint="lets you choose to send an image or your geolocation"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 15,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

export default CustomActions
