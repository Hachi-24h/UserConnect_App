import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ArrowLeft2, Call, Video, InfoCircle } from "iconsax-react-native";
import styles from "../../../../Css/chat";
import color from '../../../../Custom/Color';


export default function ChatHeader({ user, navigation }: any) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft2 size={28} color={color.orange} />
      </TouchableOpacity>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {user.firstname || user.username} {user.lastname || ''}
        </Text>
        <Text style={styles.statusText}>Recent Activity</Text>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity><Call size={26} color={color.orange} /></TouchableOpacity>
        <TouchableOpacity><Video size={26} color={color.orange} /></TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Rightbar', {
            conversationId: user.conversationId,
            isGroup: user.isGroup
          })}
        >
          <InfoCircle size={26} color={color.orange} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
