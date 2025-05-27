import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import styles from '../../../../Css/mess/CreateGroupModal';
import color from '../../../../Custom/Color';
import { useSelector } from 'react-redux';
import RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker';
import { showNotification } from '../../../../Custom/notification';

export default function CreateGroupModal({ visible, onClose, currentUser, socket }: any) {
  const followings = useSelector((state: any) => state.followings.dsFollowing);
  const [groupName, setGroupName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const selectAvatar = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
    if (result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri || null);
    }
  };

  const createGroup = async () => {
    if (!avatarUri) {
      showNotification("Please select a group avatar.", "warning");
      return;
    }

    if (!groupName.trim()) {
      showNotification("Please enter a group name.", "warning");
      return;
    }

    if (selected.length === 0) {
      showNotification("Please select at least one member.", "warning");
      return;
    }

    setLoading(true);

    let avatarBase64 = '';
    try {
      const base64Data = await RNFS.readFile(avatarUri, 'base64');
      const ext = avatarUri.split('.').pop() || 'jpg';
      avatarBase64 = `data:image/${ext};base64,${base64Data}`;

      const members = [
        {
          userId: currentUser._id,
          name: `${currentUser.firstname || ''} ${currentUser.lastname || ''}`.trim() || 'You',
          avatar: currentUser.avatar || '',
        },
        ...followings
          .filter((u: any) => selected.includes(u._id))
          .map((u: any) => ({
            userId: u._id,
            name: `${u.firstname} ${u.lastname}`,
            avatar: u.avatar || '',
          })),
      ];

      socket.emit('createGroupConversation', {
        groupName,
        members,
        adminId: currentUser._id,
        ...(avatarBase64 && { avatar: avatarBase64 }),
      });

      showNotification("Group created successfully.", "success");

      setGroupName('');
      setSelected([]);
      setAvatarUri(null);
      onClose();
    } catch (error) {
      console.error('❌ Error creating group:', error);
      showNotification("Failed to create group. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <TouchableOpacity onPress={selectAvatar} style={{ alignItems: 'center', marginBottom: 10 }}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={{ width: 80, height: 80, borderRadius: 40 }} />
              ) : (
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 30, color: '#fff' }}>+</Text>
                </View>
              )}
              <Text style={{ color: color.accentBlue, marginTop: 5 }}>Select group avatar</Text>
            </TouchableOpacity>

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
              <TextInput
                placeholder="Enter group name"
                placeholderTextColor="#666"
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
              />
            </KeyboardAvoidingView>

            <Text style={styles.subtitle}>Select members</Text>
            <FlatList
              data={followings}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 280 }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleSelect(item._id)} style={styles.friendItem}>
                  <Image
                    source={{ uri: item.avatar || 'https://placehold.co/100x100' }}
                    style={styles.avatar}
                  />
                  <Text style={styles.name}>
                    {item.firstname} {item.lastname}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 'auto',
                      color: selected.includes(item._id) ? color.accentBlue : '#aaa',
                    }}
                  >
                    {selected.includes(item._id) ? '✓' : 'Select'}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.createBtn} onPress={createGroup} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.createText}>Create Group</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
