import { ArrowLeft2 } from 'iconsax-react-native';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from '../../Css/SettingUser';
import color from '../../Custom/Color';

const { width, height } = Dimensions.get('window');

const SettingUser = ({ navigation }: any) => {
  // Get user data from Redux
  const userDetail = useSelector((state: any) => state.userDetail.info);

  // Get first and last name with fallbacks
  const firstname = userDetail?.firstname || '';
  const lastname = userDetail?.lastname || '';

  // Full name with fallback text
  const fullName =
    firstname && lastname ? `${firstname} ${lastname}` : 'Chưa cập nhật tên';

  const renderItem = (label: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={24} color={color.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{fullName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Thông tin cá nhân */}
        {renderItem('Thông tin', () => navigation.navigate('UserInfo'))}
        {renderItem('Đổi ảnh đại diện')}
        {renderItem('Đổi ảnh bìa')}
        {renderItem('Cập nhật giới thiệu bản thân')}
        {renderItem('Ví của tôi')}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Cài đặt */}
        <Text style={styles.sectionTitle}>Cài đặt</Text>
        {renderItem('Mã QR của tôi')}
        {renderItem('Quyền riêng tư')}
        {renderItem('Tài khoản và bảo mật', () =>
          navigation.navigate('ChangePassword'),
        )}
        {renderItem('Cài đặt chung')}

        {/* Đăng xuất */}
        <View style={styles.divider} />
        {renderItem('Đăng xuất', handleLogout)}
      </ScrollView>
    </View>
  );
};

export default SettingUser;
