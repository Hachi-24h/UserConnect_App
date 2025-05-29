import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Send } from "iconsax-react-native";
import styles from "../../../../Css/chat";
import color from '../../../../Custom/Color';


export default function MessageInput({ inputText, setInputText, handleSend }: any) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Send a message..."
        placeholderTextColor={color.textSecondary}
        value={inputText}
        onChangeText={setInputText}
      />
      <TouchableOpacity onPress={handleSend}>
        <Send size={24} color={color.accentBlue} />
      </TouchableOpacity>
    </View>
  );
}