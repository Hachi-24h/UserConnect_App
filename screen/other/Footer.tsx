import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Home, Book, Add, Notification, Profile,Personalcard } from "iconsax-react-native"; // Import các icon từ thư viện
import styles from "../../Css/footer"; // Import CSS
import color from "../../Custom/Color";
import { NavigationProp } from "@react-navigation/native"; // Để xác định kiểu của navigation

// Khai báo kiểu cho props của Footer component
interface FooterProps {
  navigation: NavigationProp<any>; // Đây là kiểu của navigation
}

const Footer: React.FC<FooterProps> = ({ navigation }:any) => {
  const [selectedIcon, setSelectedIcon] = useState<string>("MessHome"); // Lưu trữ icon được chọn

  // Hàm xử lý khi người dùng nhấn vào icon
  const handleIconPress = (iconName: string) => {
    setSelectedIcon(iconName);
    // Nếu You muốn điều hướng, You có thể mở lại đoạn code dưới đây:
    navigation.navigate(iconName); 
  };

  return (
    <View style={styles.footerContainer}>
      {/* Home Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("MessHome")}
      >
        <Home
          size={selectedIcon === "MessHome" ? 28 : 22}
          color={selectedIcon === "MessHome" ? color.accentBlue : color.textSecondary}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "MessHome" && styles.selectedLabel,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Search Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("Contact")}
      >
        <Book
          size={selectedIcon === "Contact" ? 28 : 22}
          color={selectedIcon === "Contact" ? color.accentBlue : color.textSecondary}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "Contact" && styles.selectedLabel,
          ]}
        >
          People
        </Text>
      </TouchableOpacity>



      {/* Notification Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("notifications")}
      >
        <Notification
          size={selectedIcon === "notifications" ? 28 : 22}
          color={selectedIcon === "notifications" ? color.accentBlue : color.textSecondary}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "notifications" && styles.selectedLabel,
          ]}
        >
          Notify
        </Text>
      </TouchableOpacity>
      {/* Notification Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("New")}
      >
        <Personalcard
          size={selectedIcon === "New" ? 28 : 22}
          color={selectedIcon === "New" ? color.accentBlue : color.textSecondary}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "New" && styles.selectedLabel,
          ]}
        >
          New
        </Text>
      </TouchableOpacity>

      {/* Profile Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("InfoUser")}
      >
        <Profile
          size={selectedIcon === "InfoUser" ? 28 : 22}
          color={selectedIcon === "InfoUser" ? color.accentBlue : color.textSecondary}
        />
        <Text
          style={[
            styles.label,
            selectedIcon === "InfoUser" && styles.selectedLabel,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
