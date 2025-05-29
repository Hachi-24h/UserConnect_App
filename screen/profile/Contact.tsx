import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import axios from 'axios';
import Contacts from 'react-native-contacts';
import color from '../../Custom/Color';
import Footer from '../other/Footer';
import { UserAdd, Message } from 'iconsax-react-native';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

interface ContactItem {
  id: string;
  name: string;
  phone: string;
}

interface UserFromBackend {
  _id: string;
  userId?: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email?: string;
  avatar?: string;
  backgroundAvatar?: string;
}

type CombinedItem = {
  isRegistered: boolean;
} & (UserFromBackend | ContactItem);

type TabType = 'all' | 'registered' | 'notRegistered';

const ContactScreen = ({ navigation }: any) => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [users, setUsers] = useState<UserFromBackend[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<TabType>('all');
  const followings = useSelector((state: any) => state.followings.dsFollowing);
  
  useEffect(() => {
    const fetchContacts = async () => {
      let hasPermission = true;
      if (Platform.OS === 'android') {
        const currentStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        );
        if (!currentStatus) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: 'Allow contact access',
              message: 'This app needs access to your contacts to find friends.',
              buttonPositive: 'Allow',
              buttonNegative: 'Deny',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            hasPermission = false;
          }
        }
      }
      if (!hasPermission) {
        Alert.alert(
          'Permission required',
          'Please enable contact access in settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }
      try {
        const deviceContacts = await Contacts.getAll();
        const filtered = deviceContacts
          .filter(c => c.phoneNumbers.length > 0)
          .map(c => ({
            id: c.recordID,
            name: c.displayName,
            phone: c.phoneNumbers[0].number.replace(/\s+/g, ''),
          }));
        setContacts(filtered);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    if (contacts.length === 0) return;

    const fetchUsersByPhoneNumbers = async (phoneNumbers: string[]) => {
      try {
        const res = await axios.post(
          'https://pulse-gateway.up.railway.app/users/by-phone-numbers',
          { phoneNumbers },
        );
        if (res.status === 200) {
          setUsers(res.data);
        } else {
          console.log('Error fetching users:', res.status, res.statusText);
        }
      } catch (error) {
        console.error('API error fetching users:', error);
      }
    };

    const phoneNumbers = contacts.map(c => c.phone);
    fetchUsersByPhoneNumbers(phoneNumbers);
  }, [contacts]);

  // Merge contacts with backend users
  const combinedList: CombinedItem[] = [];

  users.forEach(user => combinedList.push({ ...user, isRegistered: true }));

  contacts.forEach(contact => {
    const contactPhoneNormalized = contact.phone
      .replace(/\s+/g, '')
      .replace(/^(\+84|0)/, '');
    const isRegistered = users.some(u => {
      const userPhoneNormalized = u.phoneNumber
        .replace(/\s+/g, '')
        .replace(/^(\+84|0)/, '');
      return userPhoneNormalized === contactPhoneNormalized;
    });
    if (!isRegistered) {
      combinedList.push({ ...contact, isRegistered: false });
    }
  });

  const searchLower = searchTerm.toLowerCase();

  const filteredList = combinedList.filter(item => {
    const matchesTab =
      selectedTab === 'all' ||
      (selectedTab === 'registered' && item.isRegistered) ||
      (selectedTab === 'notRegistered' && !item.isRegistered);

    if (!matchesTab) return false;

    if (item.isRegistered) {
      const fullName = `${(item as UserFromBackend).firstname} ${(item as UserFromBackend).lastname}`.toLowerCase();
      const phone = (item as UserFromBackend).phoneNumber;
      return fullName.includes(searchLower) || phone.includes(searchTerm);
    } else {
      const name = (item as ContactItem).name.toLowerCase();
      const phone = (item as ContactItem).phone;
      return name.includes(searchLower) || phone.includes(searchTerm);
    }
  });

  const renderUserItem = ({ item }: { item: CombinedItem }) => {
    const registered = item.isRegistered;
    const name = registered
      ? `${(item as UserFromBackend).firstname} ${(item as UserFromBackend).lastname}`
      : (item as ContactItem).name;
    const phone = registered
      ? (item as UserFromBackend).phoneNumber
      : (item as ContactItem).phone;
    const avatarUri = registered
      ? (item as UserFromBackend).avatar || 'https://i.postimg.cc/7Y7ypVD2/avatar-mac-dinh.jpg'
      : 'https://i.postimg.cc/7Y7ypVD2/avatar-mac-dinh.jpg';

    return (
      <TouchableOpacity
        onPress={() => {
          if (registered) {
            navigation.navigate('FriendProfile', {
              user: item, // Truyền dữ liệu user
            });
          }
        }}
        style={styles.contactItem}>
        <View style={styles.contactLeft}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <View style={{ marginLeft: width * 0.03 }}>
            <Text style={styles.contactName}>{name}</Text>
            <Text style={styles.contactPhone}>{phone}</Text>
          </View>
        </View>
        <View style={styles.contactActions}>
          {registered ? (
            (() => {
              const isFollowed =
                item.isRegistered &&
                followings.some((f: UserFromBackend) => f._id === (item as UserFromBackend).userId);
              if (isFollowed) {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      alert(`Message ${name}`);
                    }}>
                    <Message size={22} color={color.textSecondary} />
                  </TouchableOpacity>
                );
              }
              else {
                // Hiện cả Follow và Nhắn tin nếu chưa follow
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        alert(`Follow ${name}`);
                      }}>
                      <UserAdd size={22} color={color.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginLeft: width * 0.04 }}
                      onPress={() => {
                        alert(`Message ${name}`);
                      }}>
                      <Message size={22} color={color.textSecondary} />
                    </TouchableOpacity>
                  </>
                );
              }
            })()
          ) : (
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => {
                alert(`Invite ${name} (${phone})`);
              }}>
              <Text style={styles.inviteText}>Invite</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const TabButton = ({ title, value }: { title: string; value: TabType }) => {
    const active = selectedTab === value;
    return (
      <TouchableOpacity
        onPress={() => setSelectedTab(value)}
        style={[styles.tabButton, active && styles.tabButtonActive]}>
        <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={color.textSecondary}
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          keyboardType="default"
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.tabRow}>
        <TabButton title="All" value="all" />
        <TabButton title="Registered" value="registered" />
        <TabButton title="Not Registered" value="notRegistered" />
      </View>

      <FlatList
        data={filteredList}
        renderItem={renderUserItem}
        keyExtractor={item =>
          item.isRegistered
            ? (item as UserFromBackend)._id
            : (item as ContactItem).id
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No results found.</Text>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.015 }}
      />

      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.borderGray },
  searchBar: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  searchInput: {
    backgroundColor: color.card,
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
    color: color.textPrimary,
    fontSize: width * 0.04,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  tabButton: {
    paddingVertical: height * 0.012,
    flex: 1,
    alignItems: 'center',
  },
  tabButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: color.primary,
  },
  tabButtonText: {
    fontSize: width * 0.042,
    color: color.textSecondary,
  },
  tabButtonTextActive: {
    color: color.primary,
    fontWeight: 'bold',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  contactLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    marginRight: width * 0.04,
    backgroundColor: '#ccc',
  },
  contactName: {
    color: color.textPrimary,
    fontSize: width * 0.042,
  },
  contactPhone: {
    fontSize: 14,
    color: color.textSecondary,
    marginTop: 4,
  },
  contactActions: { flexDirection: 'row', alignItems: 'center' },
  inviteButton: {
    backgroundColor: color.primary,
    paddingVertical: height * 0.007,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.04,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: width * 0.038,
    fontStyle: 'italic',
    color: color.textSecondary,
    paddingVertical: height * 0.03,
  },
});

export default ContactScreen;
