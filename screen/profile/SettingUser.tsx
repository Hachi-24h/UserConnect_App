import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ArrowLeft2 } from "iconsax-react-native";
import color from "../../Custom/Color";
import styles from "../../Css/SettingUser";

const { width, height } = Dimensions.get("window");

const SettingUser = ({ navigation }: any) => {
  const renderItem = (label: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    
    navigation.reset({
      index: 0, 
      routes: [{ name: "SignIn" }], 
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={24} color={color.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phan Thanh Nam</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Thông tin cá nhân */}
        {renderItem("Thông tin", () => navigation.navigate("UserInfo"))}
        {renderItem("Đổi ảnh đại diện")}
        {renderItem("Đổi ảnh bìa")}
        {renderItem("Cập nhật giới thiệu bản thân")}
        {renderItem("Ví của tôi")}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Cài đặt */}
        <Text style={styles.sectionTitle}>Cài đặt</Text>
        {renderItem("Mã QR của tôi")}
        {renderItem("Quyền riêng tư")}
        {renderItem("Tài khoản và bảo mật", () => navigation.navigate("ChangePassword"))}
        {renderItem("Cài đặt chung")}

        {/* Đăng xuất */}
        <View style={styles.divider} />
        {renderItem("Đăng xuất", handleLogout)}  
      </ScrollView>
    </View>
  );
};

export default SettingUser;
