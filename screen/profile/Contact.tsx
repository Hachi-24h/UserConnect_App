import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
} from "react-native";

import Contacts from "react-native-contacts";
import { Video, Call, Profile2User } from "iconsax-react-native";
import styles from "../../Css/Contact";
import color from "../../Custom/Color";
import Footer from "../other/Footer";

interface ContactItem {
  id: string;
  name: string;
  phone: string;
}

const ContactScreen = ({ navigation }: any) => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      let hasPermission = true;

      if (Platform.OS === "android") {
        const currentStatus = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );

        if (!currentStatus) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: "Cho phép truy cập danh bạ",
              message: "Ứng dụng cần truy cập danh bạ để tìm bạn bè.",
              buttonPositive: "Đồng ý",
              buttonNegative: "Không",
            }
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            hasPermission = false;
          }
        }
      }

      if (!hasPermission) {
        Alert.alert(
          "Yêu cầu quyền truy cập",
          "Bạn cần bật quyền truy cập danh bạ trong cài đặt để sử dụng chức năng này.",
          [
            {
              text: "Huỷ",
              style: "cancel",
            },
            {
              text: "Mở cài đặt",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      try {
        const deviceContacts = await Contacts.getAll();
        const filtered = deviceContacts
          .filter((c) => c.phoneNumbers.length > 0)
          .map((c) => ({
            id: c.recordID,
            name: c.displayName,
            phone: c.phoneNumbers[0].number,
          }));
        setContacts(filtered);
      } catch (err) {
        console.error("Lỗi lấy danh bạ:", err);
      }
    };

    fetchContacts();
  }, []);


  const renderItem = ({ item }: { item: ContactItem }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactLeft}>
        <Image
          source={{ uri: "https://i.postimg.cc/7Y7ypVD2/avatar-mac-dinh.jpg" }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity>
          <Call size={22} color={color.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 12 }}>
          <Video size={22} color={color.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor={color.textSecondary}
          style={styles.searchInput}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <Text style={styles.tabActive}>Bạn bè</Text>
        <Text style={styles.tab}>Nhóm</Text>
        <Text style={styles.tab}>OA</Text>
      </View>

      {/* Các mục đặc biệt */}
      <View style={styles.specialItems}>
        <TouchableOpacity
          style={[styles.specialItem, { flexDirection: "row" }]}
        >
          <Profile2User size={22} color={color.textSecondary} />
          <Text style={styles.specialItem}>Danh bạ máy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.specialItem, { flexDirection: "row" }]}
        >
          <Call size={22} color={color.textSecondary} />
          <Text style={styles.specialItem}>Lời mời kết bạn</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách bạn bè */}
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <Footer navigation={navigation} />
    </View>
  );
};

export default ContactScreen;
