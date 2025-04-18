import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import styles from "../../Css/InfoUser";
import { ArrowLeft2, More, Eye } from "iconsax-react-native";
import color from "../../Custom/Color";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const InfoUser = ({ navigation }: any) => {
  const userDetail = useSelector((state: any) => state.userDetail);  // Getting user details from Redux
  const avatar = userDetail?.avatar || "https://i.postimg.cc/6pXNwv51/backgrond-mac-dinh.jpg";  // Default avatar if not available
  const backgroundAvatar = userDetail?.backgroundAvatar || "https://picsum.photos/200/300";  // Default background if not available
  const firstname = userDetail?.firstname || "Phan";  // Default first name
  const lastname = userDetail?.lastname || "Thanh Nam";  // Default last name
  const bio = userDetail?.bio || "Tuyết";  // Default bio

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Ảnh bìa và icon */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: backgroundAvatar }}
            style={styles.coverPhoto}
          />
          <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
            <ArrowLeft2 size={24} color={color.white} />
          </TouchableOpacity>
          <View style={styles.topRightIcons}>
            <TouchableOpacity>
              <Eye size={22} color={color.white} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: width * 0.03 }} onPress={() => navigation.navigate("SettingUser")}>
              <More size={22} color={color.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Avatar tròn */}
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
        
        {/* Thông tin người dùng */}
        <Text style={styles.name}>{`${firstname} ${lastname}`}</Text>
        <Text style={styles.subText}>{bio}</Text>

        {/* Other sections, e.g., action buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionRow}
        >
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require("../../Icon/idear.png")} style={styles.actionIcon} />
            <Text style={styles.actionText}>Cài zStyle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Image source={require("../../Icon/image.png")} style={styles.actionIcon} />
            <Text style={styles.actionText}>Ảnh của tôi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Image source={require("../../Icon/post.png")} style={styles.actionIcon} />
            <Text style={styles.actionText}>Kho khoảnh khắc</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Gợi ý Nhật ký */}
        <View style={styles.card}>
          <Image
            source={require("../../Picture/wellcome.png")}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>
            Hôm nay {lastname} có gì vui?
          </Text>
          <Text style={styles.cardText}>
            Đây là Nhật ký của bạn - Hãy làm đầy Nhật ký với những dấu ấn cuộc đời và kỷ niệm đáng nhớ nhé!
          </Text>
          <TouchableOpacity style={styles.postButton}>
            <Text style={styles.postButtonText}>Đăng lên Nhật ký</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default InfoUser;
