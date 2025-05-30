import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Home, Book, Add, Notification, Profile, Personalcard } from "iconsax-react-native"; // Import các icon từ thư viện
import styles from "../../Css/footer"; // Import CSS
import color from "../../Custom/Color";
import { NavigationProp, useNavigationState } from "@react-navigation/native"; // Để xác định kiểu của navigation
import { showNotification } from "../../Custom/notification";

// Khai báo kiểu cho props của Footer component
interface FooterProps {
  navigation: NavigationProp<any>; // Đây là kiểu của navigation
}

const Footer: React.FC<FooterProps> = ({ navigation }: any) => {
  const [selectedIcon, setSelectedIcon] = useState<string>("MessHome"); // Lưu trữ icon được chọn
  const currentRouteName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });
  // Hàm xử lý khi người dùng nhấn vào icon
  const handleIconPress = (iconName: string) => {
    setSelectedIcon(iconName);
    if (iconName === "notifications" || iconName === "New") {
      showNotification("This feature is under development. Please check back later", "warning");
      currentRouteName === iconName;
    }
    else {
      navigation.navigate(iconName);
    }
  };
  
  console.log("Current route name:", currentRouteName);

  return (
    <View style={styles.footerContainer}>
      {/* Home Icon */}
      <TouchableOpacity
        style={styles.iconWrapper}
        onPress={() => handleIconPress("MessHome")}
      >
        <Home
          size={currentRouteName === "MessHome" ? 28 : 22}
          color={currentRouteName === "MessHome" ? color.accentBlue : color.textSecondary}
        />
        <Text
          style={[
            styles.label,
            currentRouteName === "MessHome" && styles.selectedLabel,
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
          size={currentRouteName === "Contact" ? 28 : 22}
          color={currentRouteName === "Contact" ? color.accentBlue : color.textSecondary}
        />
        <Text
          style={[
            styles.label,
            currentRouteName === "Contact" && styles.selectedLabel,
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
          size={currentRouteName === "notifications" ? 28 : 22}
          color={currentRouteName === "notifications" ? color.accentBlue : color.textSecondary}
        />
        <Text
          style={[
            styles.label,
            currentRouteName === "notifications" && styles.selectedLabel,
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
          size={currentRouteName === "New" ? 28 : 22}
          color={currentRouteName === "New" ? color.accentBlue : color.textSecondary}
        />
        <Text
          style={[
            styles.label,
            currentRouteName === "New" && styles.selectedLabel,
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
          size={currentRouteName === "InfoUser" ? 28 : 22}
          color={currentRouteName === "InfoUser" ? color.accentBlue : color.textSecondary}
        />
        <Text
          style={[
            styles.label,
            currentRouteName === "InfoUser" && styles.selectedLabel,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
