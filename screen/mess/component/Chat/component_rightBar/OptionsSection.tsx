import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';

export default function OptionsSection({
  isGroup,
  conversationId,
  currentUserId,
  adminId,
}: {
  isGroup: boolean;
  conversationId: string;
  currentUserId: string;
  adminId: string;
}) {
  const [hidden, setHidden] = useState(false);

  const handleLeaveGroup = () => {
    console.log('Leaving group:', conversationId);
  };

  const handleDisbandGroup = () => {
    console.log('Disbanding group:', conversationId);
  };

  const isAdmin = currentUserId === adminId;

  return (
    <View style={{ marginBottom: 32 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>
        Options
      </Text>

      {/* Hide chat */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Hide this conversation</Text>
        <Switch value={hidden} onValueChange={() => setHidden(!hidden)} />
      </View>

      {/* Report */}
      <TouchableOpacity style={{ paddingVertical: 12 }}>
        <Text style={{ color: '#f39c12', fontSize: 16 }}>Report</Text>
      </TouchableOpacity>

      {/* Delete */}
      <TouchableOpacity style={{ paddingVertical: 12 }}>
        <Text style={{ color: 'red', fontSize: 16 }}>Delete conversation</Text>
      </TouchableOpacity>

      {/* Leave group */}
      {isGroup && (
        <TouchableOpacity style={{ paddingVertical: 12 }} onPress={handleLeaveGroup}>
          <Text style={{ color: '#e74c3c', fontSize: 16 }}>Leave group</Text>
        </TouchableOpacity>
      )}

      {/* Disband group – only for admin */}
      {isGroup && isAdmin && (
        <TouchableOpacity style={{ paddingVertical: 12 }} onPress={handleDisbandGroup}>
          <Text style={{ color: '#ff4444', fontSize: 16, fontWeight: 'bold' }}>
            Disband group
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
