import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

interface MemberModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  members: any[];
  renderMember: (member: any) => React.ReactNode;
}

const MemberModal: React.FC<MemberModalProps> = ({
  showModal,
  setShowModal,
  members,
  renderMember,
}) => {
  return (
    <Modal visible={showModal} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={{
                width: '85%',
                maxHeight: '70%',
                backgroundColor: '#222',
                borderRadius: 12,
                padding: 20,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 20,
                  marginBottom: 18,
                }}
              >
                Tất cả thành viên
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {members.map((m) => renderMember(m))}
              </ScrollView>

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{ marginTop: 20, alignSelf: 'flex-end' }}
              >
                <Text style={{ color: '#00aced', fontSize: 16 }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MemberModal;
