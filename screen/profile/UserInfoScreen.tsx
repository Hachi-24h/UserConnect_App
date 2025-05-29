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

const { width, height } = Dimensions.get('window');

// Cloudinary configuration
const CLOUDINARY_URL =
  'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
const UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; // Set to 'unsigned' if using unsigned uploads

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
  // Add loading state for image uploads
  const [isUploading, setIsUploading] = useState(false);

  // Add state for date picker
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dob ? new Date(dob) : new Date(),
  );

  // Upload image to Cloudinary
  const uploadToCloudinary = async imageUri => {
    const formData = new FormData();

    // Get filename from URI
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri: imageUri,
      type: `image/${fileType}`,
      name: `upload.${fileType}`,
    });

    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên. Vui lòng thử lại.');
      throw error;
    }
  };

  const pickImage = async (setFunc, type) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;

        // Show loading indicator
        setIsUploading(true);

        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(uri);

        // Update state with Cloudinary URL
        setFunc(cloudinaryUrl);

        // Hide loading indicator
        setIsUploading(false);
      }
    } catch (error) {
      setIsUploading(false);
      console.error('Error picking image:', error);
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

  const handleDateConfirm = date => {
    setDatePickerOpen(false);
    // Format to YYYY-MM-DD for backend
    const formattedDate = date.toISOString().split('T')[0];
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
          {isUploading && (
            <ActivityIndicator
              size="large"
              color={color.white}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginLeft: -20,
                marginTop: -20,
              }}
            />
          )}
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <TouchableOpacity
            disabled={!editMode || isUploading}
            onPress={() => pickImage(setAvatar, 'avatar')}>
            <Image
              source={{
                uri:
                  avatar ||
                  'https://i.postimg.cc/6pXNwv51/backgrond-mac-dinh.jpg',
              }}
              style={styles.avatar}
            />
            {isUploading && (
              <ActivityIndicator
                size="small"
                color={color.white}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: -10,
                  marginTop: -10,
                }}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.name}>{`${firstname} ${lastname}`}</Text>
        </View>

        <View style={styles.infoSection}>
          {/* First Name (Họ) on its own line */}
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

          {/* Last Name (Tên) on its own line */}
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

          {/* Rest of fields remain unchanged */}
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

          {/* Date of Birth with Date Picker */}
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

          {/* Date Picker Modal */}
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

          {/* Email */}
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

          {/* Address */}
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

          {/* Bio - special case for multiline */}
          <View style={[styles.fieldRow, { alignItems: 'flex-start' }]}>
            <Text style={[styles.label, { width: '30%', marginTop: 10 }]}>
              Giới thiệu
            </Text>
            <TextInput
              editable={editMode}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              style={[
                styles.value,
                { flex: 1, height: 100, textAlignVertical: 'top' },
              ]}
              placeholder="Một chút về bạn..."
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          {/* Phone Number */}
          <View style={styles.fieldRow}>
            <Text style={[styles.label, { width: '30%' }]}>Điện thoại</Text>
            <Text style={[styles.value, { flex: 1 }]}>{phoneNumber}</Text>
          </View>
          <Text style={styles.note}>
            Số điện thoại chỉ hiển thị với người có lưu số bạn trong danh bạ máy
          </Text>
        </View>

        {editMode ? (
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
            onPress={handleSave}>
            <Text style={[styles.buttonText, { fontSize: width * 0.035 }]}>
              Lưu thay đổi
            </Text>
          </TouchableOpacity>
        ) : (
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
            onPress={() => setEditMode(true)}>
            <Text style={[styles.buttonText, { fontSize: width * 0.035 }]}>
              Chỉnh sửa thông tin
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default UserInfoScreen;
