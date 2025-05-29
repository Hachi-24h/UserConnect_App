import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import color from '../../../../Custom/Color';

export default function IncomingCallModal({ visible, callerName, callerAvatar, onAccept, onDecline }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <View style={{
          backgroundColor: color.white,
          padding: 20,
          borderRadius: 10,
          alignItems: 'center',
          width: 280
        }}>
          {callerAvatar && (
            <Image
              source={{ uri: callerAvatar }}
              style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
            />
          )}
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            📞 Cuộc gọi đến từ
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            {callerName}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={onDecline} style={{ marginHorizontal: 10 }}>
              <Text style={{ color: 'red', fontSize: 16 }}>Từ chối</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAccept} style={{ marginHorizontal: 10 }}>
              <Text style={{ color: 'green', fontSize: 16 }}>Chấp nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
