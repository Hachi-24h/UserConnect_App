import Contacts from 'react-native-contacts';
import { PermissionsAndroid, Platform } from 'react-native';

export const getAllContacts = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Cho phép truy cập danh bạ',
        message: 'Ứng dụng cần truy cập danh bạ để tìm You bè',
        buttonPositive: 'OK',
      }
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.warn('Không được cấp quyền danh bạ');
      return [];
    }
  }

  try {
    const contacts = await Contacts.getAll();
    // Trích xuất danh sách có số điện thoại
    const filteredContacts = contacts
      .filter((c) => c.phoneNumbers.length > 0)
      .map((c) => ({
        id: c.recordID,
        name: c.displayName,
        phone: c.phoneNumbers[0].number,
      }));
    return filteredContacts;
  } catch (err) {
    console.error('Lỗi khi lấy danh bạ:', err);
    return [];
  }
};
