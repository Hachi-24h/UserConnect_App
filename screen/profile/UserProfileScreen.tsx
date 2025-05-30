import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft2 } from 'iconsax-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { followUser, fetchFollowings, unfollowUser } from '../../store/followingSlice';
import { AppDispatch, RootState } from '../../store/types/redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { getPrivateConversationWithUser } from '../../store/chatSlice';
// import { AppDispatch, RootState } from '../../store/store';

const { width } = Dimensions.get('window');

export default function FriendProfile() {
  const route = useRoute();
  const { user }: any = route.params;

  const id_user_login = useSelector((state: RootState) => state.user._id);

  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const conv = conversations?.[0]?.members || [];
  const iduserFollow = user?.userId;
  const followings = useSelector((state: RootState) => state.followings.dsFollowing);
  const [isFollowed, setIsFollowed] = useState(followings.some((f: { _id: any; }) => f._id === iduserFollow))
  const conversation222 = useSelector((state) =>
    getPrivateConversationWithUser(state, iduserFollow)
  );
  const conversationId = conversation222?._id || '';
  const dispatch = useDispatch<AppDispatch>();

  const fullName = `${user.firstname} ${user.lastname}`;
  const avatar = user.avatar || 'https://i.postimg.cc/7Y7ypVD2/avatar-mac-dinh.jpg';
  const background = user.backgroundAvatar || 'https://i.imgur.com/xu7M3Yq.jpeg';
  const initials = `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.toUpperCase();
  const loading = useSelector((state: RootState) => state.followings.loading);

  type NavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
  const navigation = useNavigation<NavigationProp>();
  type RootStackParamList = {
    Chat: {
      user: {
        isGroup: boolean;
        avatar: string;
        conversationId: string;
        firstname: string;
        lastname: string;
        username: string;
        userChatId: string;
      };
    };
  };
  useEffect(() => {
    dispatch(fetchFollowings(id_user_login) as any);
  }, [id_user_login]);

  const handleFollowToggle = () => {
    const followingId = iduserFollow;
    const followerId = id_user_login;
    if (!user || !id_user_login || !followingId || !followerId) return;

    const payload = { followerId, followingId };

    if (isFollowed) {
      Alert.alert(
        'Unfollow Confirmation',
        `Are you sure you want to unfollow ${fullName}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Unfollow',
            onPress: () => {
              dispatch(unfollowUser(payload))
                .unwrap()
                .then(() => {
                  Alert.alert('Success', 'Unfollowed successfully.');
                  setIsFollowed(false);
                })
                .catch((err: { response: { status: number } }) => {
                  console.error('❌ Unfollow failed:', err);
                  if (err.response?.status === 404) {
                    Alert.alert('Notice', 'You have already unfollowed this user.');
                  } else {
                    Alert.alert('Error', 'Unable to unfollow this user.');
                  }
                });
            },
            style: 'destructive',
          },
        ]
      );
    } else {
      dispatch(followUser(payload))
        .unwrap()
        .then(() => {
          Alert.alert('Success', 'Followed successfully.');
          setIsFollowed(true);
        })
        .catch((err: { response: { status: number } }) => {
          console.error('❌ Follow failed:', err);
          if (err.response?.status === 409) {
            Alert.alert('Notice', 'You are already following this user.');
          } else {
            Alert.alert('Error', 'Unable to follow this user.');
          }
        });
    }
  };

  return (
    <View style={styles.container}>
      {/* Cover */}
      <View style={styles.header}>
        <Image source={{ uri: background }} style={styles.coverImage} />
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft2 size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          {user.avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
        </View>

        {/* Name */}
        <Text style={styles.name}>{fullName}</Text>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('Chat', {
                user: {
                  isGroup: false, // true nếu là nhóm
                  avatar: user.avatar,
                  conversationId: conversationId,
                  firstname: user.firstname,
                  lastname: user.lastname,
                  username: user.username,
                  userChatId: conversationId,
                }
              });
            }}
          >
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.5 }]}
            onPress={handleFollowToggle}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {isFollowed ? 'Unfollow' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: width,
    height: 200,
    backgroundColor: '#121212',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerIcons: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  body: {
    backgroundColor: '#121212',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    paddingTop: 10,
  },
  avatarWrapper: {
    marginTop: -40,
    marginBottom: 10,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },
  avatarText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
    marginHorizontal: 6,
    backgroundColor: '#1e1e1e',
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
  },
});
