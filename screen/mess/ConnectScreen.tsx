import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ConnectScreen = ({ navigation }: any) => {
  const [myId, setMyId] = useState("");
  const [receiverId, setReceiverId] = useState("");

  const startChat = () => {
    if (!myId || !receiverId) return;

    // 👉 Tạo conversationId giả lập từ 2 userId để đồng nhất
    const sortedIds = [myId, receiverId].sort().join("-");
    const conversationId = `convo-${sortedIds}`;

    navigation.navigate("Chat", {
      senderId: myId,
      receiverId,
      conversationId,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔗 Kết nối để nhắn tin</Text>

      <Text style={styles.label}>Your ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập userId của You"
        value={myId}
        onChangeText={setMyId}
      />

      <Text style={styles.label}>Receiver ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập userId người nhận"
        value={receiverId}
        onChangeText={setReceiverId}
      />

      <TouchableOpacity style={styles.button} onPress={startChat}>
        <Text style={styles.buttonText}>Start Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConnectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    color: "white",
    marginBottom: 40,
    textAlign: "center",
  },
  label: {
    color: "#ccc",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#2979FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
