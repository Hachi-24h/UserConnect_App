import React from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import styles from "../../Css/MessHome";
import { SearchNormal1, Add , ScanBarcode} from "iconsax-react-native";
import color from "../../Custom/Color";
import Footer from "../other/Footer";

const mockData = [
  {
    id: "1",
    username: "NOW_TH_KTTKPM_T7_1_3",
    lastMessage: "Ha Thi Kim Thoa: @All Có 1 bạn để quên thẻ...",
    time: "15/03",
    avatar: "https://picsum.photos/50",
  },
  {
    id: "2",
    username: "Minh Thuận",
    lastMessage: "Bạn: [Hình ảnh]",
    time: "27 phút",
    avatar: "https://picsum.photos/50",
  },
  {
    id: "3",
    username: "Bigdata-420300232901",
    lastMessage: "Ngô Hữu Dũng: Các metrics đo lường và...",
    time: "21 giờ",
    avatar: "https://picsum.photos/50",
  },
  {
    id: "4",
    username: "Nhóm học",
    lastMessage: "Phan Thanh Nam: curl -X GET http...",
    time: "21 phút",
    avatar: "https://picsum.photos/50",
  },
];

const MessHome = ({navigation}:any) => {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("Chat")}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.username} numberOfLines={1}>
            {item.username}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    
      <View style={styles.searchHeader}>
        <SearchNormal1 size={20} color={color.white} />
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor={color.gray}
          style={styles.searchInput}
        />
        <ScanBarcode size={20} color={color.white} />
        <Add size={20} color={color.white} style={{ marginLeft: 10 }} />
      </View>

      {/* Danh sách tin nhắn */}
      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <Footer  navigation={navigation} />
      {/* Footer */}
    </View>
  );
};

export default MessHome;
