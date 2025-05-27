import React from 'react';
import { View, Text } from 'react-native';

export default function MediaSection({ conversationId }: any) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', marginBottom: 8 }}>Image/Video</Text>
      <Text style={{ color: '#aaa' }}>No media shared yet.</Text>
    </View>
  );
}