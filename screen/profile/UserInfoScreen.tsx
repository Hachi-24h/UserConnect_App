import { ArrowLeft2, Calendar } from 'iconsax-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../Css/UserInfoScreen';
import color from '../../Custom/Color';
import { updateUserInfo } from '../../utils/user';
import { setUserDetail } from '../../store/userDetailSlice';
import Footer from '../other/Footer';

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
  const userDetail = useSelector((state: any) => state.userDetail.info);
  const name_user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState(userDetail?.avatar);
  const [backgroundAvatar, setBackgroundAvatar] = useState(userDetail?.backgroundAvatar);
  const [firstname, setFirstname] = useState(userDetail?.firstname || '');
  const [lastname, setLastname] = useState(userDetail?.lastname || '');
  const [gender, setGender] = useState(userDetail?.gender || '');
  const [dob, setDob] = useState(userDetail?.DOB || '');
  const [phoneNumber] = useState(userDetail?.phoneNumber || 'Chưa cập nhật');
  const [email, setEmail] = useState(userDetail?.email || '');
  const [address, setAddress] = useState(userDetail?.address || '');
  const [bio, setBio] = useState(userDetail?.bio || '');
  const [isUploading, setIsUploading] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dob ? new Date(dob) : new Date());

  const pickImage = async (setFunc: (value: string) => void, type: string) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64 && asset.type) {
          const base64Image = `data:${asset.type};base64,${asset.base64}`;
          setFunc(base64Image);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const handleSave = async () => {
    try {
      const userId = userDetail?.userId;
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

      const res = await updateUserInfo(userId, data);
      Alert.alert('Lưu thành công', 'Thông tin đã được cập nhật!');

      // dispatch({
      //   type: 'UPDATE_USER_DETAIL',
      //   payload: {
      //     avatar,
      //     backgroundAvatar,
      //     firstname,
      //     lastname,
      //     gender,
      //     dob,
      //     phoneNumber,
      //     email,
      //     address,
      //     bio,
      //   },
      // });
      dispatch(setUserDetail({
        ...userDetail,
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
      }));
      setEditMode(false);
    } catch (error) {
      console.log('❌ Lỗi khi cập nhật:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  const handleDateConfirm = (date: React.SetStateAction<Date>) => {
    setDatePickerOpen(false);
    const formattedDate = date.toString().split('T')[0];
    setDob(formattedDate);
    setSelectedDate(date);
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
          disabled={!editMode || isUploading}
          onPress={() => pickImage(setBackgroundAvatar, 'background')}>
          <Image source={{ uri: backgroundAvatar }} style={styles.coverImage} />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <TouchableOpacity
            disabled={!editMode || isUploading}
            onPress={() => pickImage(setAvatar, 'avatar')}>
            <Image
              source={{
                uri: avatar || 'https://i.postimg.cc/6pXNwv51/backgrond-mac-dinh.jpg',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={styles.name}>{`${firstname} ${lastname}`}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.fieldRow}>
            <Text style={[styles.label, { width: '30%' }]}>Họ</Text>
            <TextInput
              editable={editMode}
              value={firstname}
              onChangeText={setFirstname}
              style={[styles.value, { flex: 1 }]}
              placeholder="Họ"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.label, { width: '30%' }]}>Tên</Text>
            <TextInput
              editable={editMode}
              value={lastname}
              onChangeText={setLastname}
              style={[styles.value, { flex: 1 }]}
              placeholder="Tên"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.label, { width: '30%' }]}>Giới tính</Text>
            <TextInput
              editable={editMode}
              value={gender}
              onChangeText={setGender}
              style={[styles.value, { flex: 1 }]}
              placeholder="Nam/Nữ/Khác"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.label, { width: '30%' }]}>Ngày sinh</Text>
            {editMode ? (
              <TouchableOpacity
                style={[
                  styles.value,
                  {
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                ]}
                onPress={() => setDatePickerOpen(true)}>
                <Text style={{ color: color.white }}>{formatDate(dob)}</Text>
                <Calendar size={18} color={color.white} />
              </TouchableOpacity>
            ) : (
              <Text style={[styles.value, { flex: 1 }]}>{formatDate(dob)}</Text>
            )}
          </View>

          <DatePicker
            modal
            open={datePickerOpen}
            date={selectedDate}
            mode="date"
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            onConfirm={handleDateConfirm}
            onCancel={() => setDatePickerOpen(false)}
            title="Chọn ngày sinh"
            confirmText="Xác nhận"
            cancelText="Hủy"
          />

          <View style={styles.fieldRow}>
            <Text style={[styles.label, { width: '30%' }]}>Email</Text>
            <TextInput
              editable={editMode}
              value={email}
              onChangeText={setEmail}
              style={[styles.value, { flex: 1 }]}
              placeholder="email@example.com"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.label, { width: '30%' }]}>Địa chỉ</Text>
            <TextInput
              editable={editMode}
              value={address}
              onChangeText={setAddress}
              style={[styles.value, { flex: 1 }]}
              placeholder="Số nhà, đường..."
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <View style={[styles.fieldRow, { alignItems: 'flex-start' }]}>
            <Text style={[styles.label, { width: '30%', marginTop: 10 }]}>Giới thiệu</Text>
            <TextInput
              editable={editMode}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              style={[styles.value, { flex: 1, height: 100, textAlignVertical: 'top' }]}
              placeholder="Một chút về bạn..."
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.label, { width: '30%' }]}>Điện thoại</Text>
            <Text style={[styles.value, { flex: 1 }]}>{phoneNumber}</Text>
          </View>

          <Text style={styles.note}>
            Số điện thoại chỉ hiển thị với người có lưu số bạn trong danh bạ máy
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              borderWidth: 1.5,
              borderColor: color.white,
              borderRadius: width * 0.02,
              width: '60%',
              alignSelf: 'center',
              paddingVertical: height * 0.012,
            },
          ]}
          onPress={editMode ? handleSave : () => setEditMode(true)}>
          <Text style={[styles.buttonText, { fontSize: width * 0.035 }]}>
            {editMode ? 'Lưu thay đổi' : 'Chỉnh sửa thông tin'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

export default UserInfoScreen;
