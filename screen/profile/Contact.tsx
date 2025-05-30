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
import { RootState } from '../../store/types/redux';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFollowings } from '../../store/followingSlice';

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
  const currentUser  = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
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

  useFocusEffect(
    useCallback(() => {
      //@ts-ignore
      dispatch(fetchFollowings(currentUser._id)); // Cập nhật lại followings khi quay lại màn hình
    }, [currentUser._id])
  );
  useEffect(() => {
    if (contacts.length === 0) return;

    const fetchUsersByPhoneNumbers = async (phoneNumbers: string[]) => {
      try {
        const res = await axios.post(
          'https://pulse-gateway.up.railway.app/users/by-phone-numbers',
          {
            phoneNumbers,
            currentUserId: currentUser ._id
          }
        );
        if (res.status === 200) {
          setUsers(res.data);
        } else {
          console.log('Error fetching users:', res.status, res.statusText);
        }
      } catch (error) {
        console.error('API error fetching users:', error.response?.data || error);
      }
    };

    const phoneNumbers = contacts.map(c => c.phone);
    fetchUsersByPhoneNumbers(phoneNumbers);
  }, [contacts]);

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
        activeOpacity={0.8}
        onPress={() => {
          if (registered) {
            navigation.navigate('FriendProfile', {
              user: item,
            });
          }
        }}
        style={styles.contactItem}>

        <View style={styles.contactLeft}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <View style={styles.contactInfo}>
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
              } else {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        alert(`Follow ${name}`);
                      }}>
                      <UserAdd size={22} color={color.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.messageButton}
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
    alignItems: 'center',
    paddingTop: height * 0.015,
    paddingBottom: height * 0.005,
    backgroundColor: '#121212',
  },
  searchInput: {
    width: width * 0.9,
    backgroundColor: '#2c2c2c',
    borderRadius: width * 0.04,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
    color: '#fff',
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  
  tabRow: {
    width: width * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: height * 0.01,
    marginTop: height * 0.01,
    backgroundColor: '#1e1e1e',
    borderRadius: width * 0.04,
  },  
  
  tabButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.03,
  },
  
  tabButtonActive: {
    backgroundColor: '#2c2c2c',
  },
  
  tabButtonText: {
    fontSize: width * 0.04,
    color: '#aaa',
  },
  
  tabButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },

  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.008,
    padding: width * 0.04,
    borderRadius: width * 0.03,
    backgroundColor: '#1f1f1f',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  contactLeft: { flexDirection: 'row', alignItems: 'center' },
  
  contactInfo: {
    marginLeft: width * 0.03,
  },
  
  avatar: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: (width * 0.14) / 2,
    backgroundColor: '#aaa',
  },
  
  contactName: {
    color: color.textPrimary,
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  
  contactPhone: {
    fontSize: width * 0.038,
    color: color.textSecondary,
    marginTop: 4,
  },
  
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  
  messageButton: {
    marginLeft: width * 0.04,
  },
  
  inviteButton: {
    backgroundColor: '#00C853',
    paddingVertical: height * 0.007,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
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
