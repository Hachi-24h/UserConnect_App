import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import socket from '../../../../../socket/socket';

interface Props {
  isGroup: boolean;
  conversationId: string;
  currentUserId: string;
  adminId: string;
  navigation?: any; // Thêm navigation nếu cần
}

export default function OptionsSection({
  isGroup,
  conversationId,
  currentUserId,
  adminId,
  navigation, // Thêm navigation nếu cần
}: Props) {
  const [hidden, setHidden] = useState(false);
  if (!isGroup) return null; // ✅ Đặt sau tất cả hook
  const isAdmin = currentUserId === adminId;

  const handleLeaveGroup = () => {
    if (!conversationId) return;
    console.log('Leaving group:', conversationId);
    // emit rời nhóm nếu cần sau này
  };

  const handleDisbandGroup = () => {
  if (!conversationId) return;
  navigation.navigate("MessHome"); // Chuyển hướng về MessHome
  socket.emit("disbandGroup", { conversationId });
};

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

      {/* Disband group (admin only) */}
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
