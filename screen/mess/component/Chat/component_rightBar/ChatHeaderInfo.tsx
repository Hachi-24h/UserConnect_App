import React from 'react';
import { View, Text, Image } from 'react-native';

export default function ChatHeaderInfo({ avatar, name, isGroup, memberCount }: {
  avatar: string;
  name: string;
  isGroup: boolean;
  memberCount?: number;
}) {
  return (
    <View style={{ alignItems: 'center', marginBottom: 24 }}>
      <Image source={{ uri: avatar }} style={{ width: 90, height: 90, borderRadius: 45 }} />
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{name}</Text>
      {isGroup && (
        <Text style={{ color: '#aaa' }}>Group · {memberCount} members</Text>
      )}
    </View>
  );
}
