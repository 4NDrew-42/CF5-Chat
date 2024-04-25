import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Font from "expo-font";

const Start = ({ navigation }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#090C08"); // Default color grey
  const backgroundImage = require("../assets/Background Image.png");

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null; // Or a loading spinner, etc.
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Title Section */}
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Chat App</Text>
        </View>
        <View style={styles.whiteBox}>
          <View style={styles.inputSection}>
            <Icon
              name="user-circle-o"
              size={36}
              color="#ccc"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Color Selection */}
          {!isKeyboardVisible && (
            <>
              <Text style={styles.chooseBackgroundColorText}>
                Choose Background Color:
              </Text>
              <View style={styles.colorOptionsContainer}>
                {["#090C08", "#474056", "#8A95A5", "#B9C6AE"].map(
                  (color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorOption,
                        {
                          backgroundColor: color,
                          borderWidth: selectedColor === color ? 2 : 0,
                          borderColor: "white",
                        },
                      ]}
                      onPress={() => setSelectedColor(color)}
                    />
                  ),
                )}
              </View>
            </>
          )}

          {/* Button Section */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: selectedColor }]} // Use selectedColor for button background
              onPress={() =>
                navigation.navigate("Chat", {
                  name,
                  backgroundColor: selectedColor,
                })
              }
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  whiteBox: {
    backgroundColor: "#FFF",
    width: "88%",
    height: "44%",
    alignSelf: "center",
    borderRadius: 3,
    padding: 20,
    marginBottom: "6%",
  },
  titleContainer: {
    position: "absolute",
    top: "10%",
    alignSelf: "center",
  },
  title: {
    fontSize: 45,
    fontFamily: "Poppins-Bold", // Applying Poppins-Bold
    color: "#FFFFFF",
  },
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#757083",
    borderRadius: 3,
    paddingHorizontal: 12,
    marginBottom: 50,
    height: 70,
  },
  inputIcon: {
    marginRight: 20,
    marginLeft: 5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular", // Applying Poppins-Regular
    color: "#757083", // Greyish color
    opacity: 0.5, // 50% opacity
  },
  buttonContainer: {
    marginTop: "auto",
  },
  button: {
    backgroundColor: "#757083",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
  buttonText: {
    fontFamily: "Poppins-Regular", // Applying Poppins-Regular
    color: "#fff",
    fontSize: 18,
  },
  chooseBackgroundColorText: {
    fontFamily: "Poppins-Regular", // Applying Poppins-Regular
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1,
  },
  colorOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default Start;
