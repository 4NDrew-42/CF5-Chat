# ChatApp

ChatApp is a versatile React Native chat application designed for mobile devices. It enables users to send messages, share images, and even their location, making it an essential tool for staying connected. The app supports both online and offline functionalities, ensuring users can communicate without interruption.

## Features

- **Chat Interface**: Allows users to enter chat rooms to start conversations.
- **Image Sharing**: Share images directly from your device’s library or camera.
- **Location Sharing**: Send your current location within chat messages.
- **Offline Access**: Read messages even when offline.
- **Accessibility**: Compatible with screen readers and other accessibility tools.

## Technical Requirements

- **React Native**: Ensures cross-platform compatibility for Android and iOS.
- **Expo**: Utilized for development and testing.
- **Google Firestore**: Stores chat messages persistently online.
- **Firebase Authentication**: Manages user authentication anonymously.
- **Firebase Cloud Storage**: Stores images shared in chats.
- **Gifted Chat Library**: Manages the chat UI.

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **Expo CLI**: Install via npm with `npm install -g expo-cli`
- **Android Studio**: [Download Android Studio](https://developer.android.com/studio)
- **Xcode** (for iOS development): [Download Xcode](https://developer.apple.com/xcode/)

Clone the repository and install the required packages:

```bash
git clone {link forthcoming}
cd MeetApp
npm install
```

### Setting up Firebase

1. **Create a Firebase project**:

   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Enable Firestore**:

   - In the Firebase Console, navigate to Firestore Database and create a new database.

3. **Enable Firebase Authentication**:

   - Go to the Authentication section and enable Anonymous authentication.

4. **Enable Cloud Storage**:
   - Navigate to Storage and create a new storage bucket.

### Firebase Configuration

Create a file named `firebaseConfig.js` in the root of your project and add your Firebase configuration:

```javascript
// firebaseConfig.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id',
  measurementId: 'your-measurement-id',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage }
```

Replace the placeholder values with your actual Firebase project credentials.

Ensure your development environment includes React Native and Expo CLI. Refer to the React Native documentation for detailed setup instructions.

Usage
To run the app on your device:

```bash
npx expo start
```

This command starts the development server and opens a web page with QR codes to open the app on your iOS or Android device using the Expo Go app.

## Running the App

Scan the QR code with your device using the Expo Go app or run on an iOS or Android simulator.

## Contributing

Interested in contributing? Follow these steps:

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

## Contact

Project Link: [Meet App](https://github.com/yourusername/MeetApp)

For further questions, please contact me at [dev email forthcoming](mailto:your.email@example.com).
