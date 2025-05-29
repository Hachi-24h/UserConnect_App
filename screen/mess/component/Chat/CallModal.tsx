import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

export default function CallModal({
  visible,
  calleeName,
  onCancel
}: {
  visible: boolean;
  calleeName: string;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <View style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          alignItems: 'center',
          width: '80%'
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
            📞 Đang gọi tới {calleeName}
          </Text>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              backgroundColor: 'red',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Hủy cuộc gọi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
