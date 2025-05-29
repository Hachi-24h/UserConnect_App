import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import color from '../../../../Custom/Color';


export default function IncomingCallModal({ visible, callerName, onAccept, onDecline }: any) {
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
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 18 }}>📞 Cuộc gọi đến từ {callerName}</Text>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
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
