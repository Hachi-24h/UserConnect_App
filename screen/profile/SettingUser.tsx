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
  const userDetail = useSelector((state: any) => state.userDetail.info);
  const firstname = userDetail?.firstname || '';
  const lastname = userDetail?.lastname || '';
  const fullName =
    firstname && lastname ? `${firstname} ${lastname}` : 'No name provided';

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
        {/* Personal Info */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {renderItem('User Info', () => navigation.navigate('UserInfo'))}
        {renderItem('Change Avatar')}
        {renderItem('Change Cover Image')}
        {renderItem('Update Bio')}
        {renderItem('My Wallet')}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        {renderItem('My QR Code')}
        {renderItem('Privacy')}
        {renderItem('Account & Security', () =>
          navigation.navigate('ChangePassword'),
        )}
        {renderItem('General Settings')}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Logout */}
        {renderItem('Log Out', handleLogout)}
      </ScrollView>
    </View>
  );
};

export default SettingUser;
