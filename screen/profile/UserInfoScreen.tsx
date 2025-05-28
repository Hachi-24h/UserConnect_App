import { ArrowLeft2 } from 'iconsax-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../Css/UserInfoScreen';
import color from '../../Custom/Color';
import { updateUserInfo } from '../../utils/user';

const { width, height } = Dimensions.get('window');

const formatDate = (dob: string): string => {
  if (!dob || dob === 'Chưa cập nhật') {
    return 'Chưa cập nhật';
  }
  const date = new Date(dob);
  if (isNaN(date.getTime())) {
    return 'Chưa cập nhật';
  }
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const UserInfoScreen = ({ navigation }: any) => {
  const userDetail = useSelector((state: any) => state.userDetail.info); // userDetail.info = { userId, avatar, backgroundAvatar, ... }
  const name_user = useSelector((state: any) => state.user); // user._id = userId
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState(userDetail?.avatar);
  const [backgroundAvatar, setBackgroundAvatar] = useState(
    userDetail?.backgroundAvatar,
  );
  const [firstname, setFirstname] = useState(userDetail?.firstname || '');
  const [lastname, setLastname] = useState(userDetail?.lastname || '');
  const [gender, setGender] = useState(userDetail?.gender || '');
  const [dob, setDob] = useState(userDetail?.DOB || '');
  const [phoneNumber] = useState(userDetail?.phoneNumber || 'Chưa cập nhật'); // không cho sửa
  const [email, setEmail] = useState(userDetail?.email || '');
  const [address, setAddress] = useState(userDetail?.address || '');
  const [bio, setBio] = useState(userDetail?.bio || '');

  const pickImage = async (setFunc: any, setPreview: any) => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const base64 = asset.base64;
      const base64String = `data:${asset.type};base64,${base64}`;
      setPreview(uri);
      setFunc(base64String);
    }
  };

  const handleSave = async () => {
    try {
      const userId = userDetail?.userId; // ✅ chính xác: gửi userId được backend dùng để tìm
      console.log('📤 Gửi userId:', userId);
      const data = {
        avatar,
        backgroundAvatar,
        firstname,
        lastname,
        gender,
        DOB: dob,
        phoneNumber,
        email,
        address,
        bio,
      };
      console.log('📤 Gửi dữ liệu:', data);

      const res = await updateUserInfo(userId, data);
      console.log('Lưu thành công:', res);

      // Thông báo khi lưu thành công
      Alert.alert(
        'Lưu thành công',
        'Thông tin đã được cập nhật, đăng nhập lại để có hiệu lực.',
      );

      // Load lại dữ liệu (có thể dispatch lại action nếu bạn sử dụng Redux)
      dispatch({
        type: 'UPDATE_USER_DETAIL',
        payload: {
          avatar,
          backgroundAvatar,
          firstname,
          lastname,
          gender,
          dob,
          phoneNumber,
          email,
          address,
          bio,
        },
      });

      setEditMode(false);
    } catch (error) {
      console.log('❌ Lỗi khi cập nhật:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={24} color={color.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <TouchableOpacity
          disabled={!editMode}
          onPress={() => pickImage(setBackgroundAvatar, setBackgroundAvatar)}>
          <Image source={{ uri: backgroundAvatar }} style={styles.coverImage} />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <TouchableOpacity
            disabled={!editMode}
            onPress={() => pickImage(setAvatar, setAvatar)}>
            <Image
              source={{
                uri:
                  avatar ||
                  'https://i.postimg.cc/6pXNwv51/backgrond-mac-dinh.jpg',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{`${firstname} ${lastname}`}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Họ</Text>
          <TextInput
            editable={editMode}
            value={firstname}
            onChangeText={setFirstname}
            style={styles.value}
            placeholder="Họ"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Tên</Text>
          <TextInput
            editable={editMode}
            value={lastname}
            onChangeText={setLastname}
            style={styles.value}
            placeholder="Tên"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Giới tính</Text>
          <TextInput
            editable={editMode}
            value={gender}
            onChangeText={setGender}
            style={styles.value}
            placeholder="Nam/Nữ/Khác"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Ngày sinh</Text>
          <TextInput
            editable={false} // Không cho phép sửa đổi
            value={editMode ? dob : formatDate(dob)} // Nếu editMode bật thì vẫn giữ ngày sinh dưới dạng text
            style={styles.value}
            placeholder="yyyy-mm-dd"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            editable={editMode}
            value={email}
            onChangeText={setEmail}
            style={styles.value}
            placeholder="email@example.com"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            editable={editMode}
            value={address}
            onChangeText={setAddress}
            style={styles.value}
            placeholder="Số nhà, đường, thành phố..."
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Giới thiệu</Text>
          <TextInput
            editable={editMode}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            style={[styles.value, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Một chút về bạn..."
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Điện thoại</Text>
          <Text style={styles.value}>{phoneNumber}</Text>
          <Text style={styles.note}>
            Số điện thoại chỉ hiển thị với người có lưu số bạn trong danh bạ máy
          </Text>
        </View>

        {editMode ? (
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setEditMode(true)}>
            <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default UserInfoScreen;
