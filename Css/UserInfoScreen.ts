import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color"; // Assuming you have a color file as mentioned in your code



const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Light gray background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.white, // White text for the header title
    marginLeft: 20,
  },
  coverImage: {
    width: width,
    height: height * 0.25, // Background image height
    resizeMode: "cover",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -50, // Pull the avatar up to overlap the cover image
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular avatar
    borderWidth: 3,
    borderColor: color.white, // White border around the avatar
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: color.black, // Black text for the name
    marginTop: 10,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: color.white, // White background for the info section
    marginHorizontal: 0, // Remove horizontal margin to stretch full width
    marginTop: 15,
    borderRadius: 0, // Remove border radius for a flat edge
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666", // Gray color for labels
    marginTop: 15,
  },
  value: {
    fontSize: 16,
    color: color.black, // Black text for input values
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd", // Light gray border for inputs
  },
  note: {
    fontSize: 12,
    color: "#999", // Lighter gray for the note text
    marginTop: 5,
  },
  button: {
    backgroundColor: "#ddd", // Gray button background
    paddingVertical: 12,
    marginHorizontal: 0, // Remove horizontal margin to stretch full width
    marginTop: 20,
    borderRadius: 0, // Remove border radius for a flat edge
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: color.black, // Black text for the button
  },
});

export default styles;