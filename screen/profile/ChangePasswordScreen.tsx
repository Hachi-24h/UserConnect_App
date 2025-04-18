import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { ArrowLeft2 } from "iconsax-react-native";
import styles from "../../Css/ChangePassword";
import color from "../../Custom/Color";
import { useSelector } from "react-redux";
import { showNotification } from "../../Custom/notification";
import { resetPasswordWithPhone } from "../../utils/auth"; // <- Import hàm API

const { width, height } = Dimensions.get("window");

const ChangePasswordScreen = ({ navigation }: any) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const user = useSelector((state: any) => state.user);
  const userDetail = useSelector((state: any) => state.userDetail);
  const phoneNumber = userDetail?.phoneNumber || "Chưa có số điện thoại";

  const handleChangePassword = async () => {
    try {
      // ✅ 1. Kiểm tra mật khẩu hiện tại có đúng không

      // ✅ 2. Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
      if (newPassword === user?.password) {
        showNotification("Mật khẩu mới không được trùng với mật khẩu cũ", "error");
        return;
      }

      // ✅ 3. Kiểm tra xác nhận mật khẩu
      if (newPassword !== confirmPassword) {
        showNotification("Mật khẩu nhập lại không đúng", "error");
        return;
      }

      // ✅ 4. Gọi API đổi mật khẩu
      await resetPasswordWithPhone(phoneNumber, newPassword);

      Alert.alert("Thành công", "Đổi mật khẩu thành công!");
      navigation.goBack();
    } catch (error: any) {
      console.log("❌ Error changing password:", error);
      showNotification("Đổi mật khẩu thất bại", "error");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={24} color={color.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Số điện thoại hiển thị */}
        <Text style={styles.label}>Số điện thoại đã đăng ký</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={phoneNumber}
          editable={false}
        />

        <Text style={styles.label}>Mật khẩu mới</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Cập nhật mật khẩu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ChangePasswordScreen;
