import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import {
  ArrowLeft2,
  Setting2,
  Cloud,
  Lock,
  ShieldSecurity,
} from "iconsax-react-native";
import color from "../Custom/Color";
import { Video, Call ,Profile2User,Edit2 ,CloudDrizzle,CloudAdd,ScanBarcode} from "iconsax-react-native";
import Footer from "./Footer";

const { width, height } = Dimensions.get("window");

const SettingInforScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={24} color={color.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <TouchableOpacity>
          <Setting2 size={24} color={color.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.profileCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>Phan Thanh Nam</Text>
            <Text style={styles.subText}>Xem trang cá nhân</Text>
          </View>
        </TouchableOpacity>

        {/* List Options */}
        <SettingItem icon={<Cloud size={22} color={color.accentBlue} />} text="zCloud" />
        <SettingItem icon={<Edit2 size={22} color={color.accentBlue} />} text="zStyle - Nổi bật trên Zalo" />
        <SettingItem icon={<CloudAdd size={22} color={color.accentBlue} />} text="Cloud của tôi" />
        <SettingItem icon={<CloudDrizzle size={22} color={color.accentBlue} />} text="Dữ liệu trên máy" />
        <SettingItem icon={<ScanBarcode size={22} color={color.accentBlue} />} text="Ví QR" />
        <SettingItem icon={<ShieldSecurity size={22} color={color.accentBlue} />} text="Tài khoản và bảo mật" />
        <SettingItem icon={<Lock size={22} color={color.accentBlue} />} text="Quyền riêng tư" />
      </ScrollView>

      <Footer navigation={navigation} />
    </View>
  );
};

const SettingItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <TouchableOpacity style={styles.settingItem}>
    <View style={styles.iconWrap}>{icon}</View>
    <Text style={styles.settingText}>{text}</Text>
  </TouchableOpacity>
);

export default SettingInforScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
  },
  header: {
    backgroundColor: color.darkgray,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
  },
  headerTitle: {
    fontSize: width * 0.05,
    color: color.white,
    fontWeight: "bold",
  },
  content: {
    paddingVertical: height * 0.02,
    paddingBottom: height * 0.1, // thêm khoảng trống để tránh bị che bởi footer
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.04,
    backgroundColor: color.cardBackground,
    gap: width * 0.04,
  },
  avatar: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
  },
  name: {
    fontSize: width * 0.045,
    color: color.textPrimary,
    fontWeight: "600",
  },
  subText: {
    color: color.textSecondary,
    fontSize: width * 0.035,
  },
  bannerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.04,
    backgroundColor: color.cardBackground,
    gap: width * 0.04,
    borderTopWidth: 1,
    borderColor: color.borderGray,
  },
  bannerIcon: {
    width: width * 0.08,
    height: width * 0.08,
    resizeMode: "contain",
  },
  bannerTitle: {
    fontSize: width * 0.042,
    color: color.textPrimary,
    fontWeight: "600",
  },
  newBadge: {
    color: color.accentGreen,
    fontSize: width * 0.032,
    fontWeight: "bold",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.018,
    backgroundColor: color.cardBackground,
    borderTopWidth: 1,
    borderColor: color.borderGray,
  },
  iconWrap: {
    width: width * 0.08,
    alignItems: "center",
  },
  settingText: {
    color: color.textPrimary,
    fontSize: width * 0.042,
  },
});