import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector } from 'react-redux';
import color from '../../../../../Custom/Color';

interface Props {
  visible: boolean;
  onClose: () => void;
  members: any[];
  conversationId: string;
  socket: any;
}

export default function AddMemberModal({
  visible,
  onClose,
  members,
  conversationId,
  socket,
}: Props) {
  const dsFollowing = useSelector((state: any) => state.followings.dsFollowing);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const memberIds = members.map((m: any) => m.userId);

  const toggleSelect = (userId: string) => {
    if (memberIds.includes(userId)) return; // đã trong nhóm → không chọn
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAdd = () => {
    const selectedUsers = dsFollowing.filter((u: any) =>
      selectedIds.includes(u._id)
    ).map((u: any) => ({
      userId: u._id,
      name: `${u.firstname} ${u.lastname}`,
      avatar: u.avatar || '',
    }));

    if (selectedUsers.length > 0) {
      socket.emit('addMembersToGroup', {
        conversationId,
        newMembers: selectedUsers,
      });
    }

    setSelectedIds([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableWithoutFeedback onPress={() => { }}>
            <View style={{
              width: '85%',
              maxHeight: '70%',
              backgroundColor: '#222',
              borderRadius: 12,
              padding: 20,
            }}>
              <Text style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 20,
                marginBottom: 18,
              }}>
                Add Members
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {dsFollowing.map((user: any) => {
                  const isInGroup = memberIds.includes(user._id);
                  const isSelected = selectedIds.includes(user._id);

                  return (
                    <TouchableOpacity
                      key={user._id}
                      onPress={() => toggleSelect(user._id)}
                      disabled={isInGroup}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 12,
                        opacity: isInGroup ? 0.4 : 1,
                      }}
                    >
                      <Image
                        source={{ uri: user.avatar }}
                        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                      />
                      <Text style={{ color: '#fff', flex: 1 }}>
                        {user.firstname} {user.lastname}
                      </Text>
                      {!isInGroup && (
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: isSelected ? color.accentBlue : '#fff',
                            backgroundColor: isSelected ? color.accentBlue : 'transparent',
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 }}>
                <TouchableOpacity onPress={onClose} style={{ marginRight: 16 }}>
                  <Text style={{ color: '#bbb', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAdd}>
                  <Text style={{ color: color.accentBlue, fontSize: 16 }}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
