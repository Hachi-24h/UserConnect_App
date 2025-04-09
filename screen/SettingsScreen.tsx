import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { ArrowLeft2, Logout, Login} from "iconsax-react-native";
import styles from "../Css/Settings";
import color from "../Custom/Color";

const SettingsScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color={color.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cài đặt</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Tài khoản và bảo mật</Text></TouchableOpacity>
                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Quyền riêng tư</Text></TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Dữ liệu trên máy</Text></TouchableOpacity>
                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Sao lưu và khôi phục</Text></TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Thông báo</Text></TouchableOpacity>
                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Tin nhắn</Text></TouchableOpacity>
                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Cuộc gọi</Text></TouchableOpacity>
                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Nhật ký</Text></TouchableOpacity>
                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Danh bạ</Text></TouchableOpacity>
                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Giao diện và ngôn ngữ</Text></TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Thông tin về Pulse</Text></TouchableOpacity>
                <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Liên hệ hỗ trợ</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.item,{flexDirection:'row'}]}>
                   
                    <Text style={[styles.itemText,{marginRight:"53%"}]}>Chuyển tài khoản</Text>
                    <Login size={25} color={color.white} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.item,{flexDirection:'row'}]}>
                   
                    <Text style={[styles.itemText,{marginRight:"70%"}]}>Đăng xuất</Text>
                    <Logout size={25} color={color.white} />
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

export default SettingsScreen;
